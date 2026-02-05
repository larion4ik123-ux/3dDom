# Архив для Netlify. Запуск: PowerShell в этой папке -> .\Собрать_для_Netlify.ps1
$projectRoot = $PSScriptRoot
$zipName = "DOM3D-netlify-deploy.zip"
$zipPath = Join-Path $projectRoot $zipName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
$tempDir = Join-Path $env:TEMP "dom3d-deploy"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null
$htmlFiles = @("index.html", "technology.html", "advantages.html", "readiness-levels.html", "custom-project.html", "projects.html")
foreach ($f in $htmlFiles) { Copy-Item (Join-Path $projectRoot $f) -Destination $tempDir -Force }
Copy-Item (Join-Path $projectRoot "css") -Destination (Join-Path $tempDir "css") -Recurse -Force
Copy-Item (Join-Path $projectRoot "images") -Destination (Join-Path $tempDir "images") -Recurse -Force
Copy-Item (Join-Path $projectRoot "js") -Destination (Join-Path $tempDir "js") -Recurse -Force
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
Remove-Item $tempDir -Recurse -Force
Write-Host "OK. Zip: $zipPath"
