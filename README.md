# Hệ thống quản lý ký túc xá

Ứng dụng React + TypeScript + Vite. AI backend dùng Anthropic SDK, chỉ đọc dữ liệu phòng và nội quy KTX ICTU tham khảo.

## Chạy hệ thống

Cần có `ANTHROPIC_API_KEY` trong process chạy backend:

```bash
export ANTHROPIC_API_KEY='your-api-key'
npm run dev:all
```

Mở giao diện tại [http://localhost:5173/](http://localhost:5173/).

- `npm run dev`: chỉ chạy frontend Vite.
- `npm run dev:server`: chỉ chạy AI backend tại `http://127.0.0.1:8787`.
- `npm run dev:all`: chạy frontend và AI backend cùng lúc.
- `GET /health`: kiểm tra backend.
- `POST /api/ai/chat`: gửi câu hỏi AI qua Vite proxy; hỗ trợ tra cứu phòng và nội quy KTX.

Nguồn nội quy nằm server-only tại `server/dormitory-rules.ts`, bản hiện tại có trạng thái `demo`, version `demo-2026.08`, chưa có ngày hiệu lực. Nội dung chỉ tham khảo; cần thay bằng văn bản được nhà trường phê duyệt trước khi dùng production.

`.env.example` chỉ là file mẫu. Project chưa tự nạp `.env`; hãy export biến môi trường trước khi chạy backend. Có thể đặt `AI_MODEL` theo model provider đang dùng; nếu bỏ trống, backend dùng `ANTHROPIC_DEFAULT_OPUS_MODEL` nếu biến này có sẵn, rồi mới fallback về `claude-opus-5`. Khi `ANTHROPIC_BASE_URL` trỏ tới gateway không phải `api.anthropic.com`, backend dùng endpoint tương thích OpenAI `/chat/completions` và tự chuyển đổi tool call; cách này tránh lỗi SDK Anthropic `HTTP 200` nhưng body rỗng hoặc sai schema.

## Kiểm tra

```bash
npm run lint
npm run build
npm run build:server
curl -i http://127.0.0.1:8787/health
```
