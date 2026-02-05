# Simple static file server for PowerShell (no Python/Node required)
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\serve-lan.ps1 -Port 8000
#
# Then open:
#   http://localhost:8000
#   http://<your-lan-ip>:8000   (e.g. http://192.168.1.59:8000)
#
# Stop with Ctrl+C.

param(
  [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-ContentType([string]$path) {
  switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".css"  { return "text/css; charset=utf-8" }
    ".js"   { return "application/javascript; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    ".png"  { return "image/png" }
    ".jpg"  { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".gif"  { return "image/gif" }
    ".webp" { return "image/webp" }
    ".svg"  { return "image/svg+xml; charset=utf-8" }
    ".ico"  { return "image/x-icon" }
    ".mp4"  { return "video/mp4" }
    default { return "application/octet-stream" }
  }
}

function Safe-CombinePath([string]$baseDir, [string]$relativeUrlPath) {
  # strip query/hash (shouldn't be present here, but be safe)
  $rel = $relativeUrlPath.Split("?")[0].Split("#")[0]
  $rel = $rel.TrimStart("/")
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }

  # decode %xx
  $rel = [Uri]::UnescapeDataString($rel)

  # Windows path normalization
  $candidate = Join-Path $baseDir ($rel -replace "/", "\")
  $full = [IO.Path]::GetFullPath($candidate)
  $baseFull = [IO.Path]::GetFullPath($baseDir)

  if (-not $full.StartsWith($baseFull, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Blocked path traversal"
  }
  return $full
}

$prefix = "http://+:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

Write-Host "Serving: $root" -ForegroundColor Green
Write-Host "Listening on: http://localhost:$Port" -ForegroundColor Yellow
Write-Host "LAN access:  http://192.168.1.59:$Port (if firewall allows)" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop." -ForegroundColor Cyan

try {
  $listener.Start()
} catch {
  Write-Host "Failed to start listener. Try a different port (e.g. -Port 8080)." -ForegroundColor Red
  throw
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
      $req = $ctx.Request
      $res = $ctx.Response

      $path = Safe-CombinePath $root $req.Url.AbsolutePath
      if (Test-Path $path -PathType Container) {
        $path = Join-Path $path "index.html"
      }

      if (-not (Test-Path $path -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $res.ContentType = "text/plain; charset=utf-8"
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
        continue
      }

      $res.StatusCode = 200
      $res.ContentType = Get-ContentType $path

      $bytes = [IO.File]::ReadAllBytes($path)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
    } catch {
      try {
        $ctx.Response.StatusCode = 500
        $bytes = [Text.Encoding]::UTF8.GetBytes("500 Internal Server Error")
        $ctx.Response.ContentType = "text/plain; charset=utf-8"
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $ctx.Response.Close()
      } catch { }
    }
  }
} finally {
  try { $listener.Stop() } catch { }
  try { $listener.Close() } catch { }
}

