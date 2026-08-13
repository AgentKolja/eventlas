@echo off
REM Kopiert die aktuellen Live-Dateien in den Upload-Ordner fuer Netlify-Drop.
REM Doppelklicken, dann den geoeffneten Ordner auf app.netlify.com/drop ziehen.
cd /d "%~dp0"
if not exist "Upload" mkdir "Upload"
copy /Y "index.html" "Upload\index.html" >nul
copy /Y "pins.json"  "Upload\pins.json"  >nul
if exist "manifest.json" copy /Y "manifest.json" "Upload\manifest.json" >nul
if exist "sw.js"         copy /Y "sw.js"         "Upload\sw.js"         >nul
if exist "og.png"        copy /Y "og.png"        "Upload\og.png"        >nul
if exist "icon-192.png"  copy /Y "icon-192.png"  "Upload\icon-192.png"  >nul
if exist "icon-512.png"  copy /Y "icon-512.png"  "Upload\icon-512.png"  >nul
if exist "schriften" (
  if not exist "Upload\schriften" mkdir "Upload\schriften"
  copy /Y "schriften\*.woff2" "Upload\schriften\" >nul
)
if exist "bilder" (
  if not exist "Upload\bilder" mkdir "Upload\bilder"
  copy /Y "bilder\*.jpg" "Upload\bilder\" >nul
)
echo.
echo   Upload-Ordner ist bereit. Ziehe ihn jetzt auf app.netlify.com/drop
echo   (Die Originale bleiben im Projektordner - nichts wird verschoben.)
echo.
start "" "%~dp0Upload"
timeout /t 4 >nul
