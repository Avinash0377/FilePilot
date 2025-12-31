export interface ToolContentSection {
    title: string;
    description: string;
    items?: string[];
}

export interface ToolContentData {
    howTo: {
        title: string;
        steps: {
            title: string;
            description: string;
        }[];
    };
    features: {
        title: string;
        items: {
            title: string;
            description: string;
            icon?: string;
        }[];
    };
    faq: {
        title: string;
        items: {
            question: string;
            answer: string;
        }[];
    };
}

export const toolContent: Record<string, ToolContentData> = {
    'pdf-to-word': {
        howTo: {
            title: 'How to Convert PDF to Word',
            steps: [
                { title: 'Upload PDF', description: 'Drag and drop your PDF file into the upload box or click to select from your device.' },
                { title: 'Conversion Process', description: 'Our tool automatically extracts text, formatting, and images from your PDF.' },
                { title: 'Download Word Doc', description: 'Once converted, click the download button to save your editable Word document (.docx).' }
            ]
        },
        features: {
            title: 'Why Choose Our PDF to Word Converter?',
            items: [
                { title: 'Accurate Formatting', description: 'Retains original fonts, images, and layout as closely as possible.' },
                { title: '100% Secure', description: 'Files are processed locally in your browser or on secure servers and deleted automatically.' },
                { title: 'Fast & Free', description: 'Convert documents in seconds without any hidden costs or watermarks.' }
            ]
        },
        faq: {
            title: 'Common Questions',
            items: [
                { question: 'Is it free to convert PDF to Word?', answer: 'Yes, our PDF to Word converter is 100% free to use with no daily limits.' },
                { question: 'Will my document formatting be lost?', answer: 'We use advanced OCR and parsing technology to preserve your original layout, fonts, and images.' },
                { question: 'Can I convert scanned PDFs?', answer: 'Yes, our tool supports scanned PDF documents seamlessly.' }
            ]
        }
    },
    'word-to-pdf': {
        howTo: {
            title: 'How to Convert Word to PDF',
            steps: [
                { title: 'Select Word File', description: 'Upload your .doc or .docx file to the converter.' },
                { title: 'Automatic Conversion', description: 'The tool instantly converts your document to PDF format.' },
                { title: 'Save PDF', description: 'Download your high-quality PDF file ready for sharing.' }
            ]
        },
        features: {
            title: 'Professional Word to PDF Conversion',
            items: [
                { title: 'Universal Compatibility', description: 'create PDFs that look perfect on any device or screen.' },
                { title: 'Maintain Layout', description: 'Your text, images, and formatting will look exactly as they did in Word.' },
                { title: 'Private & Secure', description: 'We respect your privacy. Files are not stored permanently on our servers.' }
            ]
        },
        faq: {
            title: 'Frequently Asked Questions',
            items: [
                { question: 'Do I need Microsoft Word installed?', answer: 'No, you don\'t need any software installed. Our online tool handles everything.' },
                { question: 'Can I convert multiple files?', answer: 'Currently we process one file at a time to ensure maximum quality.' },
                { question: 'Is the quality preserved?', answer: 'Yes, the resulting PDF is professional quality suitable for printing and sharing.' }
            ]
        }
    },
    'merge-pdf': {
        howTo: {
            title: 'How to Merge PDF Files',
            steps: [
                { title: 'Upload PDFs', description: 'Select multiple PDF files you want to combine.' },
                { title: 'Arrange Order', description: 'The files will be merged in the order you uploaded them.' },
                { title: 'Merge & Download', description: 'Click merge to create a single PDF file containing all your documents.' }
            ]
        },
        features: {
            title: 'Best PDF Merger Tool',
            items: [
                { title: 'Combine Multiple Files', description: 'Merge invoices, reports, or articles into one easy-to-manage file.' },
                { title: 'Fast Processing', description: 'Our optimized engine merges specific pages or whole files in seconds.' },
                { title: 'No Watermarks', description: 'The final merged PDF is clean and professional without branding.' }
            ]
        },
        faq: {
            title: 'Common Questions',
            items: [
                { question: 'How many files can I merge?', answer: 'You can merge multiple files at once. There is a generous size limit for free users.' },
                { question: 'Does it lower the quality?', answer: 'No, merging simply joins the pages together without degradation.' },
                { question: 'Can I reorder files?', answer: 'Currently files are merged in upload order, but we are working on a drag-and-drop reorder feature.' }
            ]
        }
    },
    'split-pdf': {
        howTo: {
            title: 'How to Split a PDF',
            steps: [
                { title: 'Upload File', description: 'Choose the PDF file you want to split.' },
                { title: 'Process', description: 'Our tool separates every page into an individual PDF file.' },
                { title: 'Download', description: 'Download all pages as a ZIP file or select specific pages.' }
            ]
        },
        features: {
            title: 'Efficient PDF Splitting',
            items: [
                { title: 'Extract Pages', description: 'Turn a large document into manageable individual pages.' },
                { title: 'Secure Handling', description: 'Your sensitive documents are processed securely and never shared.' },
                { title: 'Instant Results', description: 'No waiting time. Splitting happens almost immediately.' }
            ]
        },
        faq: {
            title: 'Questions about Split PDF',
            items: [
                { question: 'Can I select specific pages?', answer: 'Currently the tool splits all pages into separate files.' },
                { question: 'Is there a file size limit?', answer: 'We support files up to 100MB for free splitting.' },
                { question: 'Is it free?', answer: 'Yes, this tool is completely free with no hidden charges.' }
            ]
        }
    },
    'compress-pdf': {
        howTo: {
            title: 'How to Compress PDF',
            steps: [
                { title: 'Select PDF', description: 'Upload the large PDF file you want to compress.' },
                { title: 'Optimize', description: 'Our smart algorithm reduces file size while maintaining quality.' },
                { title: 'Download', description: 'Get your smaller, optimized PDF file instantly.' }
            ]
        },
        features: {
            title: 'Smart PDF Compression',
            items: [
                { title: 'Reduce Size, Not Quality', description: 'Significantly reduce file size with minimal visual loss.' },
                { title: 'Email Friendly', description: 'Make large PDFs small enough to send via email attachments.' },
                { title: 'Browser Based', description: 'No software installation required. Works on Mac, Windows, and Linux.' }
            ]
        },
        faq: {
            title: 'Compression FAQ',
            items: [
                { question: 'How much will it compress?', answer: 'Compression rates vary but often reduce size by 30-80%.' },
                { question: 'Does it affect text clarity?', answer: 'Text remains sharp vector data; only images are optimized.' },
                { question: 'Is it safe?', answer: 'Yes, your files are encrypted during transfer and deleted afterwards.' }
            ]
        }
    },
    'images-to-pdf': {
        howTo: {
            title: 'How to Convert Images to PDF',
            steps: [
                { title: 'Upload Images', description: 'Select JPG or PNG images from your device.' },
                { title: 'Convert', description: 'The tool combines them into a single PDF document.' },
                { title: 'Download', description: 'Save your new photo album or document scan as a PDF.' }
            ]
        },
        features: {
            title: 'Easy Image to PDF Converter',
            items: [
                { title: 'Combine Photos', description: 'Great for creating portfolios or photo albums.' },
                { title: 'Supports JPG & PNG', description: 'Works with the most common image formats.' },
                { title: 'High Quality', description: 'Images are embedded in the PDF at high resolution.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Can I reorder images?', answer: 'Images are currently added in upload order.' },
                { question: 'Is the PDF searchable?', answer: 'No, this creates an image-based PDF. Use our OCR tool for searchable text.' },
                { question: 'Is it free?', answer: 'Yes, completely free and unlimited.' }
            ]
        }
    },
    'pdf-to-png': {
        howTo: {
            title: 'How to Convert PDF to PNG',
            steps: [
                { title: 'Upload PDF', description: 'Choose your PDF file.' },
                { title: 'Conversion', description: 'Every page of the PDF is converted into a high-quality PNG image.' },
                { title: 'Download', description: 'Download individual images or a ZIP of all pages.' }
            ]
        },
        features: {
            title: 'High-Quality PDF to Image',
            items: [
                { title: 'Extract Pages', description: 'Turn document pages into easy-to-share image files.' },
                { title: 'Lossless Quality', description: 'PNG format ensures sharp text and graphics.' },
                { title: 'Transparent Support', description: 'Preserves transparency if present in the PDF structure.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Why PNG instead of JPG?', answer: 'PNG offers higher quality for text and line art, making it better for documents.' },
                { question: 'Can I convert just one page?', answer: 'The tool converts all pages, but you can choose which ones to download.' },
                { question: 'Is it fast?', answer: 'Yes, most files convert in seconds.' }
            ]
        }
    },
    'ppt-to-pdf': {
        howTo: {
            title: 'How to Convert PPT to PDF',
            steps: [
                { title: 'Upload Presentation', description: 'Select your PowerPoint (.ppt, .pptx) file.' },
                { title: 'Convert', description: 'We convert slides to PDF pages keeping layout intact.' },
                { title: 'Download', description: 'Get your presentation as a universal PDF document.' }
            ]
        },
        features: {
            title: 'Reliable PPT to PDF',
            items: [
                { title: 'Lock Formatting', description: 'Prevent fonts and layout from shifting when sharing presentations.' },
                { title: 'Universal Viewing', description: 'PDFs can be viewed on any device without PowerPoint.' },
                { title: 'Print Ready', description: 'Create a perfect handout version of your slides.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Does it support animations?', answer: 'No, PDF is a static format. Animations will be flattened.' },
                { question: 'Will my notes be included?', answer: 'Currently only the slide content is converted.' },
                { question: 'Is it secure?', answer: 'Yes, fully secure and private.' }
            ]
        }
    },
    'pdf-to-ppt': {
        howTo: {
            title: 'How to Convert PDF to PPT',
            steps: [
                { title: 'Upload PDF', description: 'Select the PDF document you want to present.' },
                { title: 'Convert', description: 'Each page becomes a slide in the PowerPoint presentation.' },
                { title: 'Download', description: 'Download the editable .pptx file.' }
            ]
        },
        features: {
            title: 'Convert PDF to Slides',
            items: [
                { title: 'Editable Slides', description: 'We attempt to make text and images editable in PowerPoint.' },
                { title: 'Save Time', description: 'No need to retype data from PDF to slides manually.' },
                { title: 'Accurate Layout', description: 'Preserves the structure of the original document.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Is the text editable?', answer: 'Yes, we use OCR to try and make text editable.' },
                { question: 'What version of PowerPoint?', answer: 'The output is compatible with all modern PowerPoint versions (.pptx).' },
                { question: 'Is it free?', answer: 'Yes, 100% free tool.' }
            ]
        }
    },
    'jpg-to-png': {
        howTo: {
            title: 'How to Convert JPG to PNG',
            steps: [
                { title: 'Upload JPG', description: 'Select your JPG image file.' },
                { title: 'Convert', description: 'The tool converts the format instantly.' },
                { title: 'Download', description: 'Save your file as a PNG image.' }
            ]
        },
        features: {
            title: 'Simple JPG to PNG',
            items: [
                { title: 'Lossless Compression', description: 'PNG allows for higher quality saving without artifacts.' },
                { title: 'Preparation for Web', description: 'Great for converting photos for web design use.' },
                { title: 'Fast & Easy', description: 'One click conversion.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Why convert to PNG?', answer: 'PNG supports transparency and prevents compression artifacts.' },
                { question: 'Is quality lost?', answer: 'No, PNG is a lossless format.' },
                { question: 'Can I do bulk conversion?', answer: 'Yes, you can upload multiple files.' }
            ]
        }
    },
    'png-to-jpg': {
        howTo: {
            title: 'How to Convert PNG to JPG',
            steps: [
                { title: 'Upload PNG', description: 'Choose your PNG image.' },
                { title: 'Convert', description: 'We convert it to the widely supported JPG format.' },
                { title: 'Download', description: 'Download your smaller, compatible JPG file.' }
            ]
        },
        features: {
            title: 'Efficient PNG to JPG',
            items: [
                { title: 'Reduce File Size', description: 'JPGs are typically much smaller than PNGs.' },
                { title: 'Maximum Compatibility', description: 'JPG opens on every device and platform.' },
                { title: 'Adjust Quality', description: 'Optimized for a balance of quality and size.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'What happens to transparency?', answer: 'JPG does not support transparency. It will be replaced with white.' },
                { question: 'Is it good for photos?', answer: 'Yes, JPG is the standard for photographs.' },
                { question: 'Is it free?', answer: 'Yes, completely free.' }
            ]
        }
    },
    'image-compressor': {
        howTo: {
            title: 'How to Compress Images',
            steps: [
                { title: 'Select Images', description: 'Upload JPG, PNG, or WebP images.' },
                { title: 'Auto Compress', description: 'We automatically find the best quality/size balance.' },
                { title: 'Download', description: 'Get your optimized images.' }
            ]
        },
        features: {
            title: 'Smart Image Compression',
            items: [
                { title: 'Faster Websites', description: 'Smaller images mean faster page loads.' },
                { title: 'Save Storage', description: 'Free up space on your device or server.' },
                { title: 'Bulk Processing', description: 'Compress multiple images at once.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'How much space is saved?', answer: 'Often 50-80% reduction without visible quality loss.' },
                { question: 'Are my photos safe?', answer: 'Yes, processed locally or securely and deleted.' },
                { question: 'Does it change dimensions?', answer: 'No, only file size is reduced.' }
            ]
        }
    },
    'image-to-webp': {
        howTo: {
            title: 'How to Convert to WebP',
            steps: [
                { title: 'Upload Image', description: 'Select JPG or PNG files.' },
                { title: 'Convert', description: 'Transform into the modern WebP format.' },
                { title: 'Download', description: 'Save your highly optimized WebP images.' }
            ]
        },
        features: {
            title: 'Modern WebP Conversion',
            items: [
                { title: 'Next-Gen Format', description: 'WebP offers superior compression and quality.' },
                { title: 'Web Optimization', description: 'Essential for modern, fast-loading websites.' },
                { title: 'Supports Transparency', description: 'Maintains transparency like PNG but smaller.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'What is WebP?', answer: 'A modern image format by Google for the web.' },
                { question: 'Do all browsers support it?', answer: 'Yes, all modern browsers support WebP.' },
                { question: 'Is it smaller than JPG?', answer: 'Yes, usually 25-34% smaller.' }
            ]
        }
    },
    'background-remover': {
        howTo: {
            title: 'How to Remove Backgrounds',
            steps: [
                { title: 'Upload Photo', description: 'Choose an image with a clear subject.' },
                { title: 'AI Processing', description: 'Our AI automatically detects and removes the background.' },
                { title: 'Download', description: 'Download your PNG with transparent background.' }
            ]
        },
        features: {
            title: 'AI Background Removal',
            items: [
                { title: 'Instant Cutouts', description: 'create product photos or stickers in seconds.' },
                { title: 'High Precision', description: 'Handles hair and complex edges impressively well.' },
                { title: '100% Automatic', description: 'No manual selection needed.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Is it free?', answer: 'Yes, completely free for all users.' },
                { question: 'Does it work on people?', answer: 'Yes, it works great for portraits and products.' },
                { question: 'What acts as background?', answer: 'The result is a transparent PNG.' }
            ]
        }
    },
    'add-background': {
        howTo: {
            title: 'How to Add Backgrounds',
            steps: [
                { title: 'Upload Image', description: 'Upload a transparent PNG.' },
                { title: 'Pick Color', description: 'Select a solid color or custom hex code.' },
                { title: 'Download', description: 'Get your new image with the added background.' }
            ]
        },
        features: {
            title: 'Simple Background Tool',
            items: [
                { title: 'Solid Colors', description: 'Add professional white or colored backdrops.' },
                { title: 'Fix Transparency', description: 'Convert transparent images to solid ones.' },
                { title: 'Easy to Use', description: 'Simple interface for quick edits.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Can I use an image background?', answer: 'Currently we support solid colors.' },
                { question: 'Does it change quality?', answer: 'No, the foreground image quality is preserved.' },
                { question: 'Is it free?', answer: 'Yes.' }
            ]
        }
    },
    'ocr-image': {
        howTo: {
            title: 'How to Extract Text from Image (OCR)',
            steps: [
                { title: 'Upload Image', description: 'Select a photo or scan containing text.' },
                { title: 'Scan', description: 'Our OCR engine analyzes the image for characters.' },
                { title: 'Copy Text', description: 'Copy the extracted text or download as a file.' }
            ]
        },
        features: {
            title: 'Free Online OCR',
            items: [
                { title: 'Digitize Documents', description: 'Turn scans into editable text.' },
                { title: 'Multi-Language', description: 'Works with English and many other languages.' },
                { title: 'Fast & Accurate', description: 'Advanced recognition technology.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Can it read handwriting?', answer: 'It works best with printed text but can read neat handwriting.' },
                { question: 'Is data saved?', answer: 'No, your images are processed securely and deleted.' },
                { question: 'Is it free?', answer: 'Yes, unlimited free scans.' }
            ]
        }
    },
    'pdf-to-text': {
        howTo: {
            title: 'How to Convert PDF to Text',
            steps: [
                { title: 'Upload PDF', description: 'Choose your PDF file.' },
                { title: 'Extract', description: 'The tool pulls all distinct text from the document.' },
                { title: 'Download', description: 'Get a .txt file containing the raw content.' }
            ]
        },
        features: {
            title: 'Plain Text Extraction',
            items: [
                { title: 'Clean Data', description: 'Get just the text without formatting clutter.' },
                { title: 'Analyzing Content', description: 'Great for feeding PDF content into other tools.' },
                { title: 'Fast Processing', description: 'Extracts 100+ pages in seconds.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Does it keep formatting?', answer: 'No, this tool extracts plain text only.' },
                { question: 'Does it work with scanned PDFs?', answer: 'Yes, it uses OCR if needed.' },
                { question: 'Is it free?', answer: 'Yes.' }
            ]
        }
    },
    'zip-files': {
        howTo: {
            title: 'How to Create a ZIP File',
            steps: [
                { title: 'Select Files', description: 'Upload multiple files you want to bundle.' },
                { title: 'Compress', description: 'The tool packages them into a ZIP archive.' },
                { title: 'Download', description: 'Download your single, compressed ZIP file.' }
            ]
        },
        features: {
            title: 'Easy File Archiving',
            items: [
                { title: 'Send Multiple Files', description: 'Easier to email one ZIP than 20 attachments.' },
                { title: 'Save Space', description: 'Compression reduces total file size.' },
                { title: 'Universal Format', description: 'ZIP works on every operating system.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Is there a size limit?', answer: 'Free users can zip up to 100MB.' },
                { question: 'Can I zip folders?', answer: 'Currently you select individual files to zip.' },
                { question: 'Is it secure?', answer: 'Yes, files are handled securely.' }
            ]
        }
    },
    'unzip-files': {
        howTo: {
            title: 'How to Unzip Files',
            steps: [
                { title: 'Upload ZIP', description: 'Select the .zip archive to extract.' },
                { title: 'Extract', description: 'We unpack the contents for you.' },
                { title: 'Download', description: 'Download individual files from the archive.' }
            ]
        },
        features: {
            title: 'Online Unzipper',
            items: [
                { title: 'No Software Needed', description: 'Unzip files on public computers or phones.' },
                { title: 'Preview Contents', description: 'See what is inside before downloading.' },
                { title: 'Secure Extraction', description: 'Private and secure processing.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Can I unzip password protected files?', answer: 'Not currently supported for security reasons.' },
                { question: 'Does it work on mobile?', answer: 'Yes, works perfectly on iPhone and Android browsers.' },
                { question: 'Is it free?', answer: 'Yes.' }
            ]
        }
    },
    'video-converter': {
        howTo: {
            title: 'How to Convert Video',
            steps: [
                { title: 'Upload Video', description: 'Select MP4 or WebM video.' },
                { title: 'Choose Format', description: 'Select the output format.' },
                { title: 'Download', description: 'Wait for processing and download your new video.' }
            ]
        },
        features: {
            title: 'Free Video Converter',
            items: [
                { title: 'Format Switching', description: 'Easily switch between MP4 and WebM.' },
                { title: 'Maintain Quality', description: 'High quality encoding.' },
                { title: 'Browser Based', description: 'No heavy video software to install.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Is there a limit?', answer: 'Files up to 100MB are supported.' },
                { question: 'Is it fast?', answer: 'Video conversion depends on file size and your connection.' },
                { question: 'Is it free?', answer: 'Yes.' }
            ]
        }
    },
    'video-compressor': {
        howTo: {
            title: 'How to Compress Video',
            steps: [
                { title: 'Upload Video', description: 'Choose a large video file.' },
                { title: 'Compress', description: 'Review settings and compress.' },
                { title: 'Download', description: 'Get a smaller video file for sharing.' }
            ]
        },
        features: {
            title: 'Reduce Video Size',
            items: [
                { title: 'Share Easier', description: 'Make videos fit in emails or messages.' },
                { title: 'Save Bandwidth', description: 'Faster loading on websites.' },
                { title: 'Simple', description: 'No complex bitrate settings needed.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'How much smaller?', answer: 'Can reduce size significantly depending on original quality.' },
                { question: 'Is quality affected?', answer: 'Lossy compression is used, but visuals remain good.' },
                { question: 'Is it free?', answer: 'Yes.' }
            ]
        }
    },
    'qr-code-generator': {
        howTo: {
            title: 'How to Generate QR Code',
            steps: [
                { title: 'Enter Content', description: 'Type URL, text, or email.' },
                { title: 'Customize', description: 'Choose colors and style.' },
                { title: 'Download', description: 'Get your QR code as PNG or SVG.' }
            ]
        },
        features: {
            title: 'Custom QR Code Maker',
            items: [
                { title: 'Styled Codes', description: 'Not just black and white. Add colors and brand style.' },
                { title: 'High Res', description: 'Download vector SVG for print quality.' },
                { title: 'Instant Preview', description: 'See your code change as you type.' }
            ]
        },
        faq: {
            title: 'FAQ',
            items: [
                { question: 'Do the codes expire?', answer: 'No, static QR codes work forever.' },
                { question: 'Is it free for commercial use?', answer: 'Yes, you can use them anywhere.' },
                { question: 'Can I track scans?', answer: 'No, these are direct static codes with no tracking.' }
            ]
        }
    }
};
