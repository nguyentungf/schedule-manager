# 🎓 HUST Smart Student Dashboard (Bách Khoa Hà Nội)
> **Bảng Theo Dõi Deadline, Thời Khóa Biểu & Tối Ưu Lộ Trình Học Tập Sinh Viên Bách Khoa**  
> *Sản phẩm đạt chuẩn Production-ready, Offline-first, Zero-backend, tối ưu cho GitHub Pages & Render.*

---

## 🌟 Tính Năng Nổi Bật Vừa Cập Nhật

1. 🗓️ **Thời Khóa Biểu Thông Minh (TKB)**:
   - Ma trận lịch tuần 12 tiết chuẩn HUST (Ca sáng: Tiết 1-6 từ 06:45, Ca chiều: Tiết 7-12 từ 12:30).
   - Hiển thị chi tiết: Mã lớp, Mã HP, Tên HP, Phòng học, Tiết, Giờ, Tuần học (1-18, chẵn/lẻ).
   - **Tự động phát hiện TRÙNG LỊCH HỌC** và cảnh báo tức thời.
   - Bộ lọc theo tuần cụ thể (Tuần 1 đến 18) hoặc xem toàn kỳ.
   - Hỗ trợ nhập TKB tự động từ SIS chỉ bằng 1 thao tác copy-paste!

2. ⚙️ **Trung Tâm Cài Đặt Hệ Thống (Settings Modal)**:
   - **Tài khoản**: Chỉnh sửa Họ tên, MSSV, Khóa học (K65-K69), Lớp QL, Ngành học, Kỳ học, Mục tiêu CPA.
   - **Quy đổi Thang điểm 4 - 10**: Tùy chỉnh linh hoạt ngưỡng điểm tối thiểu thang 10 cho từng điểm chữ (A, B+, B, C+, C, D+, D) và điểm liệt cuối kỳ ($D_{ck\_min}$).
   - **Giao diện & Cảnh báo**: Chọn chủ đề (Deep Slate, OLED Black, HUST Crimson), bật/tắt pháo hoa Confetti, tùy chỉnh ngưỡng giờ khẩn cấp.

3. 🏛️ **Tích Hợp Sẵn CTĐT 9 Ngành Hot Nhất Bách Khoa**:
   - **IT1**: Khoa học Máy tính (Trường CNTT&TT)
   - **IT2**: Kỹ thuật Phần mềm (Trường CNTT&TT)
   - **EE1**: Kỹ thuật Điện (Trường Điện - Điện tử)
   - **EE2**: Kỹ thuật Điều khiển & Tự động hóa (Trường Điện - Điện tử)
   - **ET1**: Kỹ thuật Điện tử - Viễn thông (Trường Điện - Điện tử)
   - **ET2**: Kỹ thuật Y sinh (Trường Điện - Điện tử)
   - **ET-E4**: CTTT Hệ thống Nhúng Thông minh & IoT (Elitech)
   - **ET-E5**: Truyền thông số & Thiết kế Đa phương tiện
   - **ET-E16**: Kỹ thuật Vi điện tử & Thiết kế Vi mạch Bán dẫn (Elitech)

4. ⚡ **Bộ Cào Điểm & TKB Chống Chặn Quyền 100%**:
   - **Ultra Bookmarklet**: Tự động inject hộp thoại nổi trực tiếp trên trang SIS HUST để copy/tải JSON.
   - **F12 Console Script**: Chạy trực tiếp trên Console của trình duyệt, không bao giờ bị lỗi phân quyền clipboard.
   - **Smart Regex Parser**: Nhận diện thông minh cả bảng điểm và thời khóa biểu dán từ SIS.

---

## 🚀 Hướng Dẫn Chạy & Deploy

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy dev server
npm run dev

# 3. Build production (tạo thư mục dist)
npm run build
```

- **Deploy GitHub Pages**: Push mã nguồn lên repo GitHub $\rightarrow$ Settings $\rightarrow$ Pages.
- **Deploy Render**: Tạo Static Site $\rightarrow$ Build: `npm run build` $\rightarrow$ Publish: `dist`.

---

## 📱 Biên Dịch File Cài Đặt Android APK

Ứng dụng đã được tích hợp sẵn **Capacitor Mobile Native Framework** và **GitHub Actions CI/CD Pipeline**.

### 🌟 Cách 1: Tải APK Tự Động Từ GitHub Actions (Khuyên dùng - Không cần cài Android Studio)
1. Đẩy mã nguồn dự án lên GitHub repository của bạn (`git push origin main`).
2. Truy cập tab **Actions** trên GitHub repo.
3. Chọn workflow **Build Android APK (HUST Portal)** vừa chạy.
4. Kéo xuống mục **Artifacts** và tải về tệp **`HUST-Portal-Android-APK`** (bên trong chứa file `app-debug.apk` sẵn sàng cài lên điện thoại).
*(Nếu bạn tạo Git Release/Tag ví dụ `v1.0.0`, GitHub Actions sẽ tự động đính kèm file APK trực tiếp vào trang Releases).*

### 💻 Cách 2: Biên Dịch Cục Bộ Bằng Android Studio
1. Chạy lệnh: `npm run build`
2. Đồng bộ sang Android: `npx cap sync android`
3. Mở thư mục `android/` bằng **Android Studio**.
4. Vào menu **Build** $\rightarrow$ **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**.
5. Hoặc nhấp đúp chạy tệp `build-apk-local.bat` trên Windows.