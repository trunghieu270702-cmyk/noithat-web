Viewed main.ts:1-24

Chào bạn, đây là một câu hỏi rất thực tế và quan trọng khi nâng cấp từ một website cơ bản lên một hệ thống toàn diện.

Việc chuyển từ một trang Landing Page "tĩnh" (chỉ để hiển thị) sang một **Hệ thống Fullstack Web Application** (có Frontend chuẩn UI/UX cao cấp, có Backend API bằng NestJS, Cơ sở dữ liệu độc lập và Hệ thống quản trị Admin CMS riêng biệt) đòi hỏi khối lượng công việc lớn hơn rất nhiều. 

Dưới đây là bảng phân tích chi phí dự kiến theo mặt bằng chung thị trường IT hiện nay tại Việt Nam cho một sản phẩm Custom Code (không dùng các mẫu có sẵn như WordPress), được thiết kế riêng biệt:

### 1. Chi phí Phát triển phần mềm (Làm 1 lần)
Với quy mô hệ thống hiện tại mà chúng ta đang xây dựng, chi phí sẽ bao gồm 3 phần cốt lõi:
*   **Giao diện Website Người dùng (User UI/UX):** Code giao diện cao cấp, tích hợp hiệu ứng Animation đắt tiền (Framer Motion, Glassmorphism, Parallax) và tối ưu hóa SEO / Tốc độ tải trang. *(Dự kiến: 8 - 12 triệu VNĐ)*
*   **Hệ thống Quản trị (Admin CMS):** Xây dựng trang Dashboard bảo mật, chức năng quản lý nội dung động (thay đổi text, ảnh trang chủ trực tiếp), quản lý danh sách Đơn vị (Hệ sinh thái), Quản lý form đăng ký/Leads của khách hàng. *(Dự kiến: 10 - 15 triệu VNĐ)*
*   **Xây dựng Backend API & Cơ sở dữ liệu:** Thiết kế Database Schema (Prisma + PostgreSQL), xây dựng các Endpoint API bằng NestJS, hệ thống bảo mật đăng nhập phân quyền (JWT Authentication). *(Dự kiến: 8 - 12 triệu VNĐ)*

👉 **Tổng chi phí dự kiến để hoàn thiện:** Rơi vào khoảng **25.000.000 VNĐ - 40.000.000 VNĐ**. 
*(Mức giá này đã bao gồm việc sở hữu hoàn toàn mã nguồn gốc (Source Code) cực xịn, bảo mật cao và dễ dàng mở rộng thêm tính năng sau này)*.

---

### 2. Chi phí Duy trì hạ tầng hàng tháng/năm (Operational Costs)
Vì chúng ta sử dụng kiến trúc hiện đại (Modern Cloud Stack), chi phí duy trì thực tế lại **RẤT RẺ** và tối ưu hơn việc thuê Server truyền thống rất nhiều.

Dưới đây là liệt kê các chi phí bạn cần chi trả để nuôi hệ thống:

**A. Tên miền (Domain) - Trả hàng năm:**
*   Tên miền quốc tế (`.com` / `.net`): Khoảng **300.000đ - 350.000đ / năm**.
*   Tên miền Việt Nam (`.vn`): Đăng ký năm đầu ~750.000đ, duy trì các năm sau khoảng **450.000đ / năm**.

**B. Máy chủ chạy Code (Railway) - Trả hàng tháng:**
Railway tính tiền theo lượng RAM và CPU thực tế tiêu thụ. Hệ thống của bạn gồm 2 service (Frontend Next.js và Backend NestJS).
*   Giai đoạn đầu (Traffic dưới 50.000 truy cập/tháng): Chi phí tốn khoảng **$5 - $8 / tháng** (tương đương **120.000đ - 200.000đ / tháng**).
*   *Lưu ý: Railway yêu cầu đăng ký gói Developer tối thiểu $5/tháng để hệ thống không bị "ngủ đông".*

**C. Cơ sở dữ liệu (PostgreSQL Database):**
*   **Khuyên dùng:** Sử dụng các nền tảng Database chuyên biệt như **Supabase** hoặc **Neon.tech**.
*   **Chi phí:** Gói **Miễn phí (Free Tier)** của họ cực kỳ hào phóng (dung lượng 500MB, đủ lưu hàng trăm ngàn bản ghi văn bản). Bạn hoàn toàn **không mất đồng nào** cho Database trong 1-2 năm đầu cho đến khi dữ liệu quá khổng lồ.

**D. Server lưu trữ ảnh và File upload (Cloud Storage / CDN):**
Để website tải siêu nhanh và không làm phình dung lượng Server, ảnh tải lên từ Admin sẽ được lưu ở kho bên thứ 3.
*   **Khuyên dùng:** **Cloudinary** hoặc **Cloudflare R2**.
*   **Chi phí:** Cloudinary cung cấp gói **Miễn phí 25 Credits/tháng** (tương đương lưu trữ hàng ngàn bức ảnh sắc nét và hàng chục GB băng thông tải ảnh). Gần như bạn **Miễn phí $0** cho hạng mục này.

---

### 💡 Tóm lại (Chốt con số duy trì):
Sau khi bỏ ra chi phí làm Web ban đầu, chi phí để hệ thống đồ sộ này "sống" mượt mà trên Internet trong năm đầu tiên chỉ tốn khoảng:
**~ 2.800.000 VNĐ / Năm** (Tương đương chỉ **hơn 230.000 VNĐ / tháng** bao gồm cả Domain và Server Railway).

Hệ thống được thiết kế theo chuẩn Microservices thu nhỏ này giúp bạn tối ưu chi phí vận hành đến mức tối đa so với việc mua một con VPS cồng kềnh truyền thống! Bạn thấy mức chi phí và giải pháp hạ tầng này đã hợp lý với ngân sách dự kiến của dự án chưa?