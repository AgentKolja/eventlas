# Minimaler statischer Dev-Server für Eventlas (kein Node/Python nötig).
# Startet über .claude/launch.json — serviert den Projektordner auf http://localhost:8123/
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$prefix = 'http://localhost:8123/'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Eventlas Dev-Server: $prefix (Wurzel: $root)"

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.mjs'  = 'text/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.md'   = 'text/plain; charset=utf-8'
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)

    # Dev-Helfer: POST /__save?name=og.png mit Base64-Body legt eine Bilddatei im Projekt ab.
    # Nur localhost, nur PNG/ICO, nur flache Dateinamen — dient dem Erzeugen von og.png/Icons.
    if ($req.HttpMethod -eq 'POST' -and $path -eq '/__save') {
      $name = $req.QueryString['name']
      if ($name -notmatch '^[a-z0-9._/-]+\.(png|ico|woff2)$' -or $name -match '\.\.') {
        $res.StatusCode = 400
        $res.Close(); continue
      }
      $reader = New-Object System.IO.StreamReader($req.InputStream, [Text.Encoding]::UTF8)
      $b64 = $reader.ReadToEnd()
      $reader.Close()
      $b64 = $b64 -replace '^data:[a-z/+-]+;base64,', ''
      try {
        $ziel = Join-Path $root $name
        $ordner = Split-Path $ziel -Parent
        if (-not (Test-Path $ordner)) { New-Item -ItemType Directory -Force $ordner | Out-Null }
        [System.IO.File]::WriteAllBytes($ziel, [Convert]::FromBase64String($b64))
        $out = [Text.Encoding]::UTF8.GetBytes("OK $name")
        $res.StatusCode = 200
      } catch {
        $out = [Text.Encoding]::UTF8.GetBytes("FEHLER: $($_.Exception.Message)")
        $res.StatusCode = 500
      }
      $res.Headers.Add('Access-Control-Allow-Origin', '*')
      $res.OutputStream.Write($out, 0, $out.Length)
      $res.Close(); continue
    }

    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')
    $full = [System.IO.Path]::GetFullPath($file)
    if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $full -PathType Leaf)) {
      $res.StatusCode = 404
      $buf = [Text.Encoding]::UTF8.GetBytes('404')
      $res.OutputStream.Write($buf, 0, $buf.Length)
      $res.Close()
      continue
    }
    $ext = [System.IO.Path]::GetExtension($full).ToLower()
    $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
    $res.Headers.Add('Cache-Control', 'no-store')
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.Close()
  } catch {
    try { $ctx.Response.Close() } catch {}
  }
}
