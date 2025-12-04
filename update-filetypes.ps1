# Batch update all tool pages with fileType prop
# This script adds fileType="TYPE" to all FileUpload components

$updates = @{
    "pdf-to-png" = "PDF"
    "pdf-to-ppt" = "PDF"
    "pdf-to-text" = "PDF"
    "compress-pdf" = "PDF"
    "split-pdf" = "PDF"
    "merge-pdf" = "PDF"
    "image-compressor" = "Image"
    "png-to-jpg" = "Image"
    "jpg-to-png" = "Image"
    "image-to-webp" = "Image"
    "background-remover" = "Image"
    "add-background" = "Image"
    "word-to-pdf" = "Word"
    "ppt-to-pdf" = "PPT"
    "video-converter" = "Video"
    "video-compressor" = "Video"
    "audio-converter" = "Audio"
    "zip-files" = "file"
    "unzip-files" = "ZIP"
    "images-to-pdf" = "Image"
    "ocr-image" = "Image"
}

foreach ($tool in $updates.Keys) {
    $file = "app\tools\$tool\page.tsx"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Find FileUpload component and add fileType if not present
        if ($content -match 'fileType=') {
            Write-Host "Skipping $tool - already has fileType"
        } else {
            # Add fileType prop before closing />
            $content = $content -replace '(onFilesSelected=\{[^}]+\})\s*\n\s*/>', "`$1`n          fileType=`"$($updates[$tool])`"`n        />"
            Set-Content $file -Value $content -NoNewline
            Write-Host "Updated $tool with fileType=`"$($updates[$tool])`""
        }
    }
}

Write-Host "`nDone! Updated all tool pages with fileType prop."
