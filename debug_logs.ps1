$ServerIP = "134.209.147.41"
$User = "root"

Write-Host "Fetching Docker Logs..."
ssh "$User@$ServerIP" "docker logs filepilot --tail 50"
