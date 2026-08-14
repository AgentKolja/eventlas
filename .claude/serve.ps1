# Minimaler statischer Dev-Server für Eventlas (kein Node/Python nötig).
# Startet über .claude/launch.json — serviert den Projektordner auf http://localhost:8123/
#
# Der Port lässt sich überschreiben (.\serve.ps1 -Port 8124), damit man einen zweiten
# Server danebenstellen kann, ohne den laufenden abzuschießen.
param([int]$Port = 8123)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$prefix = "http://localhost:$Port/"
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

# Diese Dateien werden auf Änderungen beobachtet — index.html und die Daten daneben.
$beobachtet = @('index.html', 'pins.json', 'orte.json', 'venues.json', 'sw.js', 'manifest.json')
# Bewusst per Hand statt mit Measure-Object: Das gibt einen Double zurück, und der stellt
# 18-stellige Ticks als "6.39E+17" dar — Änderungen fielen dann unter den Tisch.
function Get-Stand {
  $max = 0L
  foreach ($n in $beobachtet) {
    $p = Join-Path $root $n
    if (Test-Path $p -PathType Leaf) {
      $t = (Get-Item $p).LastWriteTimeUtc.Ticks
      if ($t -gt $max) { $max = $t }
    }
  }
  return $max
}

# Livesynchronisation: Der Server hängt dieses Schnipsel an jede HTML-Antwort. Es fragt
# zweimal pro Sekunde nach dem Stand der Projektdateien und lädt die Seite neu, sobald sich
# etwas geändert hat. Bewusst NICHT in index.html: So kann es gar nicht erst in die
# Auslieferung geraten — bauen.sh kopiert die Datei direkt, nicht über diesen Server.
$liveSkript = @'
<script>
(function(){
  var stand = null;
  setInterval(function(){
    fetch('/__stand', {cache: 'no-store'})
      .then(function(r){ return r.text(); })
      .then(function(t){
        if(stand === null){ stand = t; return; }
        if(t !== stand){ location.reload(); }
      })
      .catch(function(){});
  }, 700);
})();
</script>
'@

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)

    # Dev-Helfer: POST /__save?name=og.png mit Base64-Body legt eine Datei im Projekt ab.
    # Nur localhost, nur diese Endungen, kein Ausbrechen aus dem Projektordner.
    # Dient dem Erzeugen von og.png/Icons und dem Einpflegen recherchierter Daten (orte.json).
    if ($req.HttpMethod -eq 'POST' -and $path -eq '/__save') {
      $name = $req.QueryString['name']
      if ($name -notmatch '^[a-z0-9._/-]+\.(png|ico|woff2|jpg|webp|json)$' -or $name -match '\.\.') {
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

    # Dev-Helfer: /__stand liefert den jüngsten Änderungszeitpunkt der beobachteten Dateien.
    if ($path -eq '/__stand') {
      $out = [Text.Encoding]::UTF8.GetBytes([string](Get-Stand))
      $res.ContentType = 'text/plain; charset=utf-8'
      $res.Headers.Add('Cache-Control', 'no-store')
      $res.ContentLength64 = $out.Length
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
    if ($ext -eq '.html') {
      $bytes = [Text.Encoding]::UTF8.GetBytes([System.IO.File]::ReadAllText($full, [Text.Encoding]::UTF8) + $liveSkript)
    } else {
      $bytes = [System.IO.File]::ReadAllBytes($full)
    }
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.Close()
  } catch {
    try { $ctx.Response.Close() } catch {}
  }
}
