## 🌐 Demo

- **Web Demo:** https://ktx-management-ai.vercel.app/
- **Backend API:** https://ktx-management-ai.onrender.com
- **GitHub:** https://github.com/hoangkhuyen130905-lgtm/ktx-management-ai

### 🤖 AI Demo

Hệ thống tích hợp trợ lý AI hỗ trợ:
- Tìm kiếm phòng còn chỗ.
- Tra cứu tình trạng phòng.
- Tóm tắt thông tin ký túc xá.
- Trả lời các câu hỏi vận hành bằng tiếng Việt.
- Sử dụng dữ liệu phòng hiện tại thông qua AI Tool.

> AI Backend được triển khai trên Render và Frontend được triển khai trên Vercel.
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

## 🏗️ AI Architecture

Mô tả luồng xử lý AI trong hệ thống:

```
User
  → React UI (src/components/dashboard/ai-chat-panel.tsx)
  → AI Backend (server/index.ts)
  → System Prompt (server/prompts.ts)
  → LLM (Anthropic Claude / OpenRouter free models)
  → Tool Calling (get_room_availability, get_dormitory_rules)
  → System Data (server/rooms-repository.ts, server/dormitory-rules.ts)
  → AI Response
  → User
```

**Giải thích luồng:**

- **AI được tích hợp vào nghiệp vụ KTX**: Trợ lý AI tích hợp trực tiếp trong Dashboard admin và Cổng sinh viên, hỗ trợ tra cứu thông tin phòng, nội quy, giờ yên tĩnh.

- **get_room_availability**: Tool tra cứu dữ liệu phòng thực tế từ `server/rooms-repository.ts`, hỗ trợ lọc theo tòa nhà, giới tính, trạng thái, sức chứa, chỉ phòng trống.

- **get_dormitory_rules**: Tool tra cứu nội quy KTX ICTU từ `server/dormitory-rules.ts`, hỗ trợ tìm kiếm theo chủ đề (giờ yên tĩnh, vệ sinh, an toàn, khách thăm, tài sản, sự cố).

- **AI không có quyền thực hiện thao tác ghi dữ liệu**: System prompt cấm AI tự phân phòng, duyệt đơn, sửa hợp đồng/hóa đơn, xóa dữ liệu. AI chỉ đọc dữ liệu và trả lời tham khảo.

## 🧪 Prompt Engineering

Quá trình tối ưu hóa prompt được ghi chi tiết tại: [docs/prompt-experiments.md](docs/prompt-experiments.md)

Bao gồm 4 vòng thử nghiệm: Prompt cơ bản → Bắt buộc dùng tool → Guardrail an toàn → Phiên bản hoàn thiện (force direct SDK).

---

## 🧪 Testing

Test cases được ghi chi tiết tại: [docs/test-cases.md](docs/test-cases.md)

Bao gồm 27 test case nhóm:
- Login (4 test case)
- Chức năng quản lý (5 test case)
- AI (10 test case)
- Error/Edge cases (8 test case)

---

## 🔍 AI Code Review

Quá trình review code AI được ghi tại: [docs/ai-code-review.md](docs/ai-code-review.md)

Bao gồm review 12 tiêu chí: API key security, input validation, prompt injection, data access control, tool calling, read-only/write operations, response validation, retry logic, request size limits, error handling, sensitive data protection, code quality.

---

## ⚠️ Error Handling

Hệ thống xử lý các trường hợp lỗi sau:

| Loại lỗi | Xử lý |
|----------|-------|
| **Validation** | Zod schema validation cho request schema (max 20 messages, 4000 ký tự/message) |
| **Request size limit** | 32KB max body size (server/index.ts) |
| **Retry** | Retry 3 lần với exponential backoff concept (server/ai.ts) |
| **Malformed response** | Try-catch JSON parse, validate GatewayResponse schema |
| **API/Model error** | Catch error, trả về status 503 (thiếu API key) hoặc 400, log warning |

---

## 🔒 Security

- **API key**: Nằm trong environment variable (`ANTHROPIC_API_KEY`), không hardcode trong source code
- **Không commit .env**: File `.env` đã được thêm vào `.gitignore`
- **File mẫu**: `.env.example` chỉ chứa biến mẫu, không chứa API key thật
- **Không expose frontend**: API key chỉ dùng ở backend server, không expose ra client
- **CORS**: Cấu hình CORS cho phép localhost development
- **Rate limiting**: Cần bổ sung (TODO)

> ⚠️ **Không đưa API key thật vào README, commit history, hay bất kỳ file nào được push lên repository.**

---

## 🚀 Chạy hệ thống

```bash
# Cài đặt dependencies
npm install

# Chạy development (frontend + backend)
npm run dev:all

# Hoặc chạy riêng:
npm run dev          # Frontend Vite tại http://localhost:5173
npm run dev:server   # Backend AI tại http://127.0.0.1:8787
```

### Demo URLs
- **Web Demo**: https://ktx-management-ai.vercel.app/
- **Backend API**: https://ktx-management-ai.onrender.com
- **GitHub**: https://github.com/hoangkhuyen130905-lgtm/ktx-management-ai

