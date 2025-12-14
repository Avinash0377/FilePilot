$ErrorActionPreference = "Stop"
$ServerIP = "134.209.147.41"

Write-Host "Starting Domain Configuration..." -ForegroundColor Cyan

# 1. Fix Line Endings (Locally)
Write-Host "Fixing line endings..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\setup_domain.sh") {
    $content = [IO.File]::ReadAllText("$PSScriptRoot\setup_domain.sh")
    $content = $content.Replace("`r`n", "`n")
    [IO.File]::WriteAllText("$PSScriptRoot\setup_domain.sh", $content)
} else {
    Write-Error "setup_domain.sh not found!"
}

# 2. Upload
Write-Host "Uploading configuration script..." -ForegroundColor Yellow
scp setup_domain.sh "root@${ServerIP}:~/"

# 3. Execute
Write-Host "Running setup on server..." -ForegroundColor Yellow
ssh "root@${ServerIP}" "bash ~/setup_domain.sh"

Write-Host "Done! HTTPS should be active." -ForegroundColor Green
