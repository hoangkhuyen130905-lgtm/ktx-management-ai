# Nhật ký hỏi – đáp

## Hệ thống quản lý ký túc xá KTX ICTU

Tài liệu tổng hợp các yêu cầu và phản hồi liên quan đến quá trình xây dựng, chạy thử và hoàn thiện hệ thống quản lý ký túc xá.

> Ghi chú: Nội dung dưới đây là bản tổng hợp từ lịch sử phiên làm việc hiện có, không phải log tự động đầy đủ từ mọi phiên. Các thông tin đăng nhập demo chỉ dùng cho môi trường thử nghiệm.

---

## 1. Chạy hệ thống lần đầu

### Người dùng hỏi

> Bạn hãy chạy hệ thống, tôi muốn biết kết quả.

### Phản hồi

- Frontend chạy bằng Vite.
- Backend AI chạy tại cổng `8787`.
- Endpoint `GET /health` trả trạng thái hoạt động.
- `npm run build` thành công.
- `npm run lint` không có lỗi, còn cảnh báo Fast Refresh.
- Do máy chạy Vite trên IPv6, URL có thể là `http://[::1]:5173/`.

---

## 2. Thêm đăng nhập và phân quyền

### Người dùng yêu cầu

> Thêm phần đăng nhập để vào giao diện chính, có phân chia quyền cho tài khoản sinh viên và quản trị.

### Phản hồi và kết quả

Đã thêm:

- Màn hình đăng nhập.
- Tài khoản `admin` và `student`.
- Phân quyền route bằng `RequireAuth`, `RequireRole`, `PublicOnly`.
- Navigation riêng cho admin và sinh viên.
- Nút đăng xuất.
- Cổng sinh viên tại `/student`.
- Session demo lưu trong `localStorage` với key `ktx-session`.

Tài khoản demo:

| Vai trò | Tên đăng nhập | Mật khẩu |
| --- | --- | --- |
| Quản trị viên | `admin` | `admin123` |
| Sinh viên | `student` | `student123` |

Lưu ý: Đây là authentication phía client phục vụ demo, chưa phải cơ chế bảo mật production.

---

## 3. Sửa lỗi sau khi thêm đăng nhập

### Người dùng yêu cầu

> Sửa phần đang lỗi và làm tiếp nhiệm vụ.

### Phản hồi và kết quả

Đã sửa các lỗi:

- Thiếu file route guard.
- `navigate` nhận giá trị `undefined`.
- Lỗi TypeScript liên quan thuộc tính `badge` trong navigation.
- Cấu trúc nested route giữa `AuthProvider`, `BrowserRouter`, `AppShell` và các route con.

Sau khi sửa:

- Build frontend thành công.
- Route `/login` trả HTTP 200.
- Route `/student` được bảo vệ cho sinh viên.
- Route quản trị bị chặn đối với tài khoản sinh viên.

---

## 4. Đổi tên hệ thống

### Người dùng yêu cầu

> Đổi tên KTX Campus thành KTX ICTU.

### Phản hồi và kết quả

Đã đổi tên trong:

- Màn hình đăng nhập.
- Sidebar.
- Page header.
- AI system prompt.
- Presentation HTML.

Build sau thay đổi thành công.

---

## 5. Cải thiện giao diện đăng nhập

### Người dùng yêu cầu

> Làm giao diện đăng nhập xịn xò hơn.

### Phản hồi và kết quả

Đã thiết kế lại giao diện đăng nhập:

- Layout split-screen.
- Panel thương hiệu màu navy/teal.
- Nền grid và hiệu ứng vòng tròn.
- Danh sách tính năng.
- Trạng thái hệ thống trực tuyến.
- Thẻ chọn nhanh tài khoản.
- Icon bảo mật.
- Responsive cho desktop, tablet và mobile.

Logic đăng nhập được giữ nguyên.

---

## 6. Cho AI hoạt động với admin và sinh viên

### Người dùng yêu cầu

> Cho trợ lý AI hoạt động ở cả admin và sinh viên.

### Phản hồi và kết quả

Đã dùng chung component `AiChatPanel` cho:

- Dashboard admin.
- Cổng sinh viên `/student`.

AI hỗ trợ tra cứu:

- Phòng trống.
- Sức chứa.
- Giường còn trống.
- Tòa nhà.

AI chỉ đọc dữ liệu, không tự thay đổi dữ liệu hệ thống.

---

## 7. Thêm nội quy ký túc xá cho AI

### Người dùng yêu cầu

> Thêm phần nội quy ký túc xá cho AI để người dùng hỏi khi không biết.

### Phản hồi và kết quả

Đã thêm nguồn nội quy server-only tại:

- `server/dormitory-rules.ts`

Đã thêm tool AI:

- `get_dormitory_rules`

AI có thể trả lời các nhóm nội quy:

- Giờ yên tĩnh.
- Vệ sinh và khu vực chung.
- An toàn và phòng cháy.
- Khách thăm.
- Bảo vệ tài sản.
- Báo sự cố và hỗ trợ.

Đã cập nhật:

- Anthropic tool loop.
- Gateway tool loop.
- System prompt.
- Chat panel.
- Hiển thị nguồn trả lời.

Ví dụ câu hỏi:

> Nội quy ký túc xá gồm những gì?

Kết quả API kiểm tra: HTTP 200.

---

## 8. Làm gọn câu trả lời nội quy AI

### Người dùng yêu cầu

> Xóa phần “bản tham khảo/demo”, `effectiveDate: null`, “chưa thay thế nội quy chính thức” trong câu trả lời AI.

### Phản hồi và kết quả

Đã xóa các cụm này khỏi nội dung hiển thị:

- `bản tham khảo/demo`.
- `effectiveDate: null`.
- `chưa thay thế nội quy chính thức`.
- Version/status nội quy trong phần hiển thị.

Nguồn hiển thị còn:

- `Nguồn: Nội quy KTX ICTU`

---

## 9. Thay logo hệ thống

### Người dùng yêu cầu

> Thay logo chữ K bằng logo Đại học Công nghệ Thông tin và Truyền thông Thái Nguyên.

### Phản hồi và kết quả

Đã tải logo chính thức ICTU từ website trường và lưu tại:

- `public/ictu-logo.png`

Đã thay logo chữ K tại:

- Màn hình đăng nhập.
- Sidebar.

---

## 10. Thay và khôi phục ảnh nền đăng nhập

### Người dùng yêu cầu

> Thay ảnh nền đăng nhập bằng ảnh từ bài VnExpress.

### Phản hồi và kết quả

Đã tải ảnh campus ICTU về:

- `public/ictu-campus.jpg`

Ảnh được dùng trong panel bên trái màn hình đăng nhập, phủ gradient navy/teal để dễ đọc chữ.

Sau đó người dùng yêu cầu quay lại nền cũ.

### Kết quả khôi phục

- Đã xóa ảnh khỏi `.app-shell`.
- Khôi phục nền CSS cũ của trang sau đăng nhập.
- Ảnh `ictu-campus.jpg` vẫn tồn tại trong `public/`, nhưng không còn được dùng làm nền trang sau đăng nhập.

---

## 11. Thay ảnh nền trang chủ sau đăng nhập

### Người dùng yêu cầu

> Thay ảnh nền trang chủ sau khi đăng nhập bằng ảnh từ bài VietnamNet.

### Phản hồi và kết quả

Đã tải ảnh về:

- `public/ictu-home.jpg`

Ảnh từng được áp dụng cho `.app-shell`.

Sau đó người dùng yêu cầu quay lại ảnh/nền cũ.

### Kết quả

- Đã xóa ảnh khỏi `.app-shell`.
- Trang sau đăng nhập dùng lại nền CSS ban đầu.

---

## 12. Kích hoạt phần Báo cáo admin

### Người dùng báo lỗi

> Phần báo cáo của admin chưa hoạt động.

### Phản hồi và kết quả

Nguyên nhân:

- Sidebar chỉ dùng anchor `#reports`.
- Chưa có route `/reports`.
- Chưa có trang báo cáo.
- Nút `Xem báo cáo` chưa điều hướng.

Đã thêm:

- Trang `ReportsPage`.
- Route `/reports` chỉ dành cho admin.
- Menu Báo cáo hoạt động.
- Nút `Xem báo cáo` hoạt động.
- Bộ lọc tháng.
- Bộ lọc tòa nhà.
- KPI tỷ lệ lấp đầy, giường trống, tổng phải thu, công nợ.
- Công suất từng tòa.
- Trạng thái đơn đăng ký.
- Trạng thái hợp đồng.
- Trạng thái bảo trì.
- Bảng hóa đơn quá hạn.

Số liệu demo:

- Tổng giường: `62`.
- Đang sử dụng: `31`.
- Còn trống: `31`.
- Tỷ lệ lấp đầy: `50%`.
- Đã thu: `850.000đ`.
- Công nợ quá hạn: `1.500.000đ`.

---

## 13. Sửa các mục trong cổng sinh viên

### Người dùng báo lỗi

> Đăng ký ở chưa hoạt động; hợp đồng và hóa đơn chưa thấy trong tài khoản sinh viên.

### Phản hồi và kết quả

Nguyên nhân:

- Link menu dùng hash nhưng Card không có anchor ID.
- Sinh viên `res-001` có hợp đồng và hóa đơn, nhưng chưa có đơn đăng ký riêng.

Đã sửa:

- Thêm anchor `applications`.
- Thêm anchor `contract`.
- Thêm anchor `payments`.
- Hiển thị chi tiết hợp đồng của sinh viên.
- Hiển thị danh sách hóa đơn của sinh viên.
- Thêm nút `Nộp đơn`.
- Thêm form đăng ký ở.
- Tạo đơn với trạng thái `Chờ duyệt`.
- Tự lấy mã sinh viên, họ tên và giới tính từ tài khoản đăng nhập.

Dữ liệu kiểm tra:

- Hợp đồng: `HD-2026-001`.
- Hóa đơn: `INV-0826-001`.
- Đơn mẫu tạo mới: `DK-2026-005`, trạng thái `pending`.

---

## 14. Chạy và kiểm tra hệ thống

### Người dùng yêu cầu

> Chạy lại hệ thống, tôi muốn biết kết quả.

### Phản hồi và kết quả

Frontend:

```text
http://localhost:5173/login
```

Backend:

```text
http://127.0.0.1:8787
```

Các route trả HTTP 200:

- `/login`.
- `/student`.
- `/reports`.

Backend health:

```json
{"status":"ok","service":"dormitory-ai"}
```

AI nội quy trả HTTP 200 và source:

```text
Nội quy KTX ICTU
```

Kiểm tra mã nguồn:

- `npm run build`: thành công.
- `npm run build:server`: thành công.
- `npm run lint`: không có lỗi.
- Lint còn một số cảnh báo cũ về Fast Refresh và exhaustive dependencies.

---

## 15. Chia sẻ hệ thống cho người khác

### Người dùng hỏi

> Vì sao share link `http://localhost:5173/` cho người khác lại không xem được?

### Phản hồi

`localhost` luôn trỏ tới chính máy của người mở link. Người khác mở link sẽ tìm hệ thống trên máy của họ.

Nếu cùng mạng Wi-Fi/LAN:

```bash
npm run dev -- --host 0.0.0.0
ipconfig getifaddr en0
```

Sau đó gửi link dạng:

```text
http://IP-MAY-BAN:5173/
```

Ví dụ:

```text
http://192.168.1.25:5173/
```

Nếu chia sẻ qua Internet, cần deploy lên hosting hoặc dùng tunnel.

---

## 16. Chuyển báo cáo Word sang Markdown

### Người dùng yêu cầu

> Chuyển file Word sang Markdown, giữ tiêu đề, mục lục, bảng, danh sách, trích dẫn và nội dung tiếng Việt.

### Phản hồi và kết quả

Đã chuyển các file Word trong thư mục tài liệu sang Markdown:

- `Nhom-15-He-thong-quan-ly-ky-tuc-xa.md`.
- `Nhom-15-He-thong-quan-ly-ky-tuc-xa-2.md`.

Đã xử lý:

- Heading cấp `#`, `##`, `###`.
- Mục lục.
- Danh sách.
- Bảng Word thành bảng Markdown.
- Ảnh nhúng thành link Markdown.
- Nội dung tiếng Việt.

Đã tạo gói ZIP gồm Markdown và ảnh:

- `Nhom-15-He-thong-quan-ly-ky-tuc-xa.zip`.
- `Nhom-15-He-thong-quan-ly-ky-tuc-xa-2.zip`.

---

## 17. Công nghệ giao diện được sử dụng

### Người dùng hỏi

> Trong hệ thống quản lý ký túc xá đang dùng gì để thiết kế giao diện?

### Phản hồi

Hệ thống dùng:

- React.
- TypeScript.
- Vite.
- CSS thuần.
- CSS Variables/design tokens.
- Lucide React.
- React Router.
- TanStack React Table.
- Zod.
- Anthropic SDK cho trợ lý AI.

Stylesheet chính:

- `src/styles/index.css`.

Component dùng chung:

- `src/components/`.

Các màn hình chức năng:

- `src/features/`.

Không dùng Tailwind trực tiếp cho giao diện hiện tại.

---

## Tổng kết

Hệ thống hiện có:

- Đăng nhập.
- Phân quyền admin/student.
- Dashboard quản trị.
- Quản lý sinh viên.
- Quản lý phòng.
- Đăng ký ở.
- Hợp đồng.
- Hóa đơn và thanh toán.
- Sự cố và bảo trì.
- Báo cáo admin.
- Cổng sinh viên.
- Trợ lý AI cho admin và sinh viên.
- Tra cứu nội quy KTX.
- Logo ICTU.
- Giao diện responsive.

Các tài khoản demo:

```text
admin / admin123
student / student123
```
