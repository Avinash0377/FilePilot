$ErrorActionPreference = "Stop"

$DROPLET_IP = "134.209.147.41"
$USER = "root"
$REMOTE_DIR = "/root/FilePilotApp"
$LOCAL_ZIP = "project.zip"
$RemoteScriptPath = "remote_deploy.sh"

Write-Host "Starting Deployment (Verbose)..." -ForegroundColor Cyan

# 1. Cleanup & Validation
if (Test-Path $LOCAL_ZIP) { Remove-Item $LOCAL_ZIP -Force }
$CriticalFiles = @("Dockerfile", "package.json", "package-lock.json", ".env.local")
foreach ($file in $CriticalFiles) {
    if (-not (Test-Path $file)) { Write-Error "Missing: $file"; exit 1 }
}

# 2. Zip
Write-Host "Zipping..."
$Exclude = @("node_modules", ".git", ".next", "project.zip", "*.log")
Get-ChildItem -Path . -Exclude $Exclude | Compress-Archive -DestinationPath $LOCAL_ZIP -Force

# 3. Create Remote Script - VERBOSE mode
$sb = new-object System.Text.StringBuilder
$null = $sb.AppendLine("#!/bin/bash")
$null = $sb.AppendLine("set -x") # Print every command
$null = $sb.AppendLine("echo '___ Starting Remote Deployment ___'")
$null = $sb.AppendLine("rm -rf $REMOTE_DIR")
$null = $sb.AppendLine("mkdir -p $REMOTE_DIR")
$null = $sb.AppendLine("echo 'Unzipping...'")
# Remove -o flag if it causes issues, but keep it for overwrite. Add || true to ignore unzip warnings if they are treated as errors
$null = $sb.AppendLine("unzip -o ~/project.zip -d $REMOTE_DIR || echo 'Unzip finished with warning'")
$null = $sb.AppendLine("cd $REMOTE_DIR")
$null = $sb.AppendLine("echo 'Contents of directory:'")
$null = $sb.AppendLine("ls -la")
$null = $sb.AppendLine("echo 'Verifying Dockerfile content:'")
$null = $sb.AppendLine("head -n 12 Dockerfile")
$null = $sb.AppendLine("echo 'Stopping old container...'")
$null = $sb.AppendLine("docker stop filepilot || true")
$null = $sb.AppendLine("docker rm filepilot || true")
$null = $sb.AppendLine("echo 'Building Image...'")
$null = $sb.AppendLine("docker build -t filepilot:optimized .")
$null = $sb.AppendLine("echo 'Starting Container...'")
$null = $sb.AppendLine("docker run -d --name filepilot -p 3000:3000 --restart unless-stopped filepilot:optimized")
$null = $sb.AppendLine("docker ps | grep filepilot")
$null = $sb.AppendLine("echo 'SUCCESS!'")

[IO.File]::WriteAllText("$PWD\$RemoteScriptPath", $sb.ToString().Replace("`r`n", "`n"))

# 4. Upload & Execute
Write-Host "Uploading..."
scp $LOCAL_ZIP $RemoteScriptPath "${USER}@${DROPLET_IP}:~/"
Write-Host "Executing..."
ssh "${USER}@${DROPLET_IP}" "bash ~/remote_deploy.sh"

# Cleanup
Remove-Item $RemoteScriptPath -Force
Write-Host "Done!" -ForegroundColor Green
