@echo off
cd /d "%~dp0"
git add -A
git commit -m "Update %date% %time%"
git push origin main
pause
