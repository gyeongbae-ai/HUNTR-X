@echo off
chcp 65001 > nul
setlocal

set "ROOT=%~dp0"
set "PORT=5177"
set "NODE_EXE=C:\Users\gyeon\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if not exist "%NODE_EXE%" (
  set "NODE_EXE=node"
)

cd /d "%ROOT%"
echo.
echo GradQuest local server starting...
echo Project: %ROOT%
echo Preferred URL: http://127.0.0.1:%PORT%/dashboard.html
echo.
echo If this window stays open, the site is running.
echo Close this window only when you want to stop the local server.
echo.

"%NODE_EXE%" local-server.mjs %PORT%

echo.
echo Server stopped. Press any key to close.
pause > nul
