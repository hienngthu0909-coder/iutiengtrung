# 🍑 IuTiengTrung – Học tiếng Trung HSK5–6

Trang web tự học tiếng Trung: từ vựng, bài khoá, luyện nói, luyện nghe, học qua phim (tự tạo phụ đề từ giọng nói, shadowing).

## Đưa lên Vercel (miễn phí, có link dạng `ten-ban.vercel.app`)

### Cách 1 – Qua GitHub (không cần cài gì)
1. Tạo tài khoản ở https://github.com và https://vercel.com (đăng nhập Vercel bằng GitHub cho tiện).
2. Trên GitHub bấm **New repository** → đặt tên, ví dụ `iutiengtrung` → **Create repository**.
3. Bấm **uploading an existing file** → kéo **toàn bộ nội dung** thư mục này (các thư mục `asr`, `api`, `lib` và các file `index.html`, `vercel.json`, `README.md`) vào → **Commit changes**.
4. Vào https://vercel.com/new → chọn repo `iutiengtrung` → **Deploy**. Không cần chỉnh gì thêm.
5. Vài chục giây sau bạn có link `iutiengtrung.vercel.app`. Đổi tên đẹp hơn trong **Settings → Domains**.

### Cách 2 – Dùng lệnh (nếu máy đã cài Node.js)
```
cd iutiengtrung
npx vercel --prod
```

## Bật tính năng AI (giải thích câu, chấm bài, dịch, soát phụ đề…)
Ngoài claude.ai, trang cần khoá Claude API của riêng bạn:
1. Tạo khoá ở https://console.anthropic.com (API tính phí theo lượt dùng, tách riêng với gói Claude Pro).
2. Trong Vercel: **Project → Settings → Environment Variables**, thêm:
   - `ANTHROPIC_API_KEY` = khoá vừa tạo
   - `APP_PASSWORD` = mật khẩu bạn tự đặt (để người lạ có link cũng không dùng được AI của bạn)
3. Vào **Deployments → … → Redeploy**. Lần đầu dùng AI, trang sẽ hỏi mật khẩu một lần.

Không cài khoá thì mọi phần khác vẫn chạy: từ vựng, flashcard, chấm phát âm, nghe-chép, xem phim, tạo phụ đề tự động, shadowing.

## Lưu ý
- Dữ liệu (từ vựng, phụ đề, video) lưu trong trình duyệt của từng máy. Muốn chuyển sang máy khác: **Trang chủ → Cài đặt & sao lưu → Copy bản sao lưu**, rồi dán vào máy kia bằng **Khôi phục**.
- Micro dùng nhận dạng giọng nói của trình duyệt: tốt nhất trên Chrome (máy tính, Android) và Safari (iPhone/iPad).
- Bộ tạo phụ đề (~100 MB) chỉ tải lần đầu, sau đó trình duyệt nhớ.
