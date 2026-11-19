// Worker nhận dạng giọng nói (Whisper base, chạy cục bộ)
const BASE = new URL('./', self.location.href).href;
let pipe = null, man = null, loading = null;
const post = (type, data) => self.postMessage(Object.assign({ type }, data));
async function blobOf(name, label) {
  const m = man[name]; const bufs = []; let got = 0;
  for (const p of m.parts) {
    const r = await fetch(BASE + p); if (!r.ok) throw new Error('Không tải được ' + p);
    const b = await r.arrayBuffer(); bufs.push(b); got += b.byteLength;
    post('msg', { msg: label + ' ' + Math.round(got / m.size * 100) + '%' });
  }
  return new Blob(bufs);
}
function load() {
  if (pipe) return Promise.resolve(pipe);
  if (loading) return loading;
  loading = (async () => {
    post('msg', { msg: 'Đang tải bộ nhận dạng giọng nói (~110 MB, chỉ lần đầu)…' });
    man = await (await fetch(BASE + 'manifest.json')).json();
    const T = await import(BASE + 'transformers.min.js');
    const env = T.env;
    env.allowLocalModels = false; env.allowRemoteModels = true; env.useBrowserCache = false;
    env.remoteHost = BASE; env.remotePathTemplate = '{model}/';
    env.useCustomCache = true;
    env.customCache = {
      async match(key) {
        const k = String((key && key.url) || key);
        const f = Object.keys(man).find(n => n.endsWith('.onnx') && k.endsWith('/' + n.split('/').pop()));
        if (!f) return undefined;
        const blob = await blobOf(f, 'Đang tải mô hình ' + (f.includes('encoder') ? '(1/2)' : '(2/2)') + '…');
        return new Response(blob, { headers: { 'content-length': String(blob.size), 'content-type': 'application/octet-stream' } });
      },
      async put() {}
    };
    const w = env.backends.onnx.wasm; w.wasmPaths = BASE; w.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1; w.proxy = false;
    try { const wb = await blobOf('ort-wasm-simd-threaded.jsep.wasm', 'Đang tải bộ chạy AI…'); w.wasmBinary = await wb.arrayBuffer(); } catch (e) {}
    post('msg', { msg: 'Đang khởi động mô hình…' });
    pipe = await T.pipeline('automatic-speech-recognition', 'whisper-base', { dtype: 'q8', device: 'wasm' });
    return pipe;
  })();
  loading.catch(() => { loading = null; });
  return loading;
}
self.onmessage = async e => {
  const { id, cmd, audio } = e.data;
  try {
    if (cmd === 'load') { await load(); post('ok', { id }); return; }
    if (cmd === 'run') {
      await load();
      const out = await pipe(audio, { language: 'zh', task: 'transcribe', return_timestamps: true, no_repeat_ngram_size: 6 });
      post('ok', { id, out: { text: out.text, chunks: (out.chunks || []).map(c => ({ timestamp: c.timestamp, text: c.text })) } });
    }
  } catch (err) { post('err', { id, msg: String((err && err.message) || err) }); }
};
