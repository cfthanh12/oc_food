@echo off
chcp 65001 > nul
echo ====================================================
echo   ĐANG KHỞI ĐỘNG CỬA HÀNG ỐC XANH (OC-SHOP)...
echo ====================================================
cd /d "%~dp0"

start http://localhost:3000/index.html
node server.js
pause

