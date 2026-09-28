@echo off
chcp 65001 > nul
echo ===================================================
echo   HUST SMART STUDENT PORTAL - BUILD ANDROID APK
echo ===================================================
echo.

echo [1/3] Đang biên dịch mã nguồn Web (Vite React)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Biên dịch Web thất bại!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Đang đồng bộ tài nguyên sang Android Native (Capacitor)...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Đồng bộ Capacitor thất bại!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Đang kiểm tra môi trường Android SDK ^& Java JDK...
where javac >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [THÔNG BÁO] Máy tính của bạn chưa cài sẵn Java JDK hoặc Android Studio.
    echo 👉 Bạn có 2 cách cực kỳ nhanh để lấy file APK:
    echo   1. (Khuyên dùng - Miễn phí không tốn RAM): Đẩy code lên GitHub repository của bạn.
    echo      GitHub Actions sẽ tự động biên dịch và tạo link tải file app-debug.apk trong mục Actions!
    echo   2. Mở thư mục 'android' bằng Android Studio và bấm Build > Build APKs.
    echo.
    pause
    exit /b 0
)

echo [3/3] Đang build file APK cục bộ qua Gradle...
cd android
call gradlew.bat assembleDebug
cd ..

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo ===================================================
    echo  🎉 THÀNH CÔNG! File APK đã được tạo tại:
    echo  android\app\build\outputs\apk\debug\app-debug.apk
    echo ===================================================
) else (
    echo.
    echo [!] Build cục bộ gặp sự cố. Bạn có thể mở thư mục 'android' trong Android Studio để xem chi tiết hoặc dùng GitHub Actions CI/CD.
)

pause
