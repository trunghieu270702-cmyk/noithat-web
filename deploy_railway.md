# Hướng dẫn Chuẩn cấu hình Dự án Monorepo lên Railway

Dự án của bạn bao gồm 2 phần độc lập nằm trong cùng một kho lưu trữ (Repository) Github:
- **Backend**: NestJS + Prisma
- **Frontend**: NextJS

Để hệ thống hoạt động hoàn hảo, bảo mật và không bao giờ gặp lỗi CORS hay 502, đây là quy trình cấu hình **Chuẩn nhất (Best Practice)** từ đầu đến cuối trên Railway.

---

## Bước 1: Tạo Database (PostgreSQL)

Thay vì dùng Database ở nơi khác, bạn nên dùng luôn Database của Railway để tối ưu tốc độ mạng nội bộ.

1. Tại màn hình Project trên Railway, bấm **New** -> **Database** -> **Add PostgreSQL**.
2. Đợi vài giây để Railway khởi tạo xong. Database này sẽ tự động sinh ra một biến có tên là `DATABASE_URL`.

---

## Bước 2: Triển khai Backend (NestJS)

1. Bấm **New** -> **GitHub Repo** -> Chọn Repo của dự án (`trunghieu270702-cmyk/noithat-web`).
2. Mở khung cài đặt của Service vừa tạo (Cột bên phải), vào mục **Settings**:
   - Tìm mục **Root Directory** và gõ vào: `/backend`. (Bước này **CỰC KỲ QUAN TRỌNG**, báo cho Railway biết code Backend nằm ở thư mục nào).
   - Tìm mục **Networking** -> Bấm **Generate Domain** để lấy đường dẫn API (Ví dụ: `https://backend-production...up.railway.app`).
3. Chuyển sang tab **Variables** và thêm các biến môi trường sau:
   - `DATABASE_URL`: Gõ chữ `${{` và chọn `Postgres.DATABASE_URL` từ menu thả xuống (Cách này giúp BE kết nối thẳng vào DB qua mạng nội bộ siêu tốc, không cần đi vòng ra internet).
   - `JWT_SECRET`: Điền một chuỗi bí mật bất kỳ (Ví dụ: `my_super_secret_jwt_key_2026`).
   - `FRONTEND_URL`: Tạm thời để trống hoặc điền Domain của Frontend nếu bạn đã biết.

> [!TIP]
> Do chúng ta đã tối ưu file `package.json` và `tsconfig.build.json` lúc nãy, Railway sẽ tự động nhận diện Build Command và Start Command cực chuẩn mà bạn không cần phải cấu hình tay lệnh Build nữa!

---

## Bước 3: Triển khai Frontend (NextJS)

1. Tiếp tục bấm **New** -> **GitHub Repo** -> Chọn lại Repo của dự án.
2. Mở phần cài đặt của Service thứ hai này, vào mục **Settings**:
   - Tìm mục **Root Directory** và gõ vào: `/frontend`.
   - Tìm mục **Networking** -> Bấm **Generate Domain** để tạo link truy cập cho website (Ví dụ: `https://frontend-production...up.railway.app`).
3. Chuyển sang tab **Variables** và thêm biến sau:
   - `NEXT_PUBLIC_API_URL`: Dán link Domain của Backend vừa tạo ở bước 2 kèm theo `/api/v1`. 
     *(Ví dụ: `https://backend-production-e6aa.up.railway.app/api/v1`)*
https://backend-production-e6aa.up.railway.app/api/v1
---

## Bước 4: Cập nhật chéo (Cross-Config)

Bước cuối cùng để giải quyết triệt để lỗi **CORS**:

1. Quay lại service **Backend**.
2. Vào tab **Variables**, tìm biến `FRONTEND_URL` (nếu chưa có thì tạo mới).
3. Dán link Domain của **Frontend** vào đây *(Ví dụ: `https://frontend-production-280f.up.railway.app`)*. Bỏ dấu gạch chéo `/` ở cuối link nếu có.
4. Chờ Railway tự động Deploy lại Backend.

---

## Tổng kết sơ đồ Biến Môi Trường (Environment Variables)

### ⚙️ Backend Variables
| Tên Biến | Giá trị tham khảo | Tác dụng |
| :--- | :--- | :--- |
| `DATABASE_URL` | `${{ Postgres.DATABASE_URL }}` | Kết nối DB nội bộ |
| `JWT_SECRET` | `chuoi_mat_khau_bat_ky` | Mã hóa Token đăng nhập |
| `FRONTEND_URL` | `https://frontend-của-bạn.up.railway.app` | Cho phép FE vượt qua CORS |

### 🎨 Frontend Variables
| Tên Biến | Giá trị tham khảo | Tác dụng |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL`| `https://backend-của-bạn.up.railway.app/api/v1` | Báo cho FE biết gọi API tới đâu |

> [!IMPORTANT]  
> Nếu bạn thay đổi biến môi trường, Railway sẽ tự động kích hoạt quá trình Build lại. Hãy chờ quá trình này báo màu xanh (Success) thì các thay đổi mới có hiệu lực.
