cat <<EOF > /tmp/dl.js
const fs = require('fs');
const https = require('https');
const file = fs.createWriteStream('/tmp/test.pdf');
https.get('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', function(response) {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete');
  });
});
EOF
node /tmp/dl.js
sleep 5
echo "Starting conversion..."
python3 /app/scripts/convert_pdf_to_word.py /tmp/test.pdf /tmp/test.docx
echo "Conversion finished with exit code $?"
ls -l /tmp/test.docx
