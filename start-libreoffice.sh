#!/bin/bash
# Start LibreOffice in listener mode (daemon) for faster conversions
# This keeps LibreOffice running in the background, avoiding startup overhead

echo "Starting LibreOffice listener daemon..."

# Kill any existing instances
pkill -9 soffice || true

# Start LibreOffice in headless listener mode
# This runs as a background service and accepts conversion requests via socket
libreoffice --headless --accept="socket,host=127.0.0.1,port=2002;urp;" --nofirststartwizard &

echo "LibreOffice daemon started on port 2002"
