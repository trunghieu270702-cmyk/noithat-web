@echo off
cd /d "%~dp0"
chcp 65001 > nul

echo ======================================================
echo   HIEUDZVL FB TOOLS PRO - DAY UPDATE LEN GIT
echo ======================================================
echo.

set /p version="1. Nhap ma phien ban moi (Vi du: 1.0.8): "
set /p msg="2. Nhap noi dung cap nhat (Vi du: Sua loi database): "
echo.

:: TU DONG THEM CHU 'v' NEU NGUOI DUNG QUEN
if /I not "%version:~0,1%"=="v" set version=v%version%

echo [1/3] Dang day code len nhanh main...
git add .
git commit -m "%msg%"
git push origin main

echo.
echo [2/3] Dang xu ly the (Tag) %version%...
git push origin :refs/tags/%version% >nul 2>&1
git tag -f %version%

echo.
echo [3/3] Dang kich hoat Robot build tu dong tren GitHub...
git push origin %version%

if %errorlevel% neq 0 (
    echo.
    echo [LOI] Co loi xay ra khi day phien ban len GitHub.
) else (
    echo.
    echo ======================================================
    echo   DA DAY CODE THANH CONG VOI PHIEN BAN: %version%
    echo   Hay vao tab Actions tren GitHub de xem Robot Build nhe.
    echo ======================================================
)
pause