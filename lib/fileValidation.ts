// File Content Validation using Magic Numbers (File Signatures)
// This validates actual file content, not just extensions

/**
 * Magic number signatures for common file types
 */
const FILE_SIGNATURES = {
    // PDF
    pdf: [
        { bytes: [0x25, 0x50, 0x44, 0x46], offset: 0 }, // %PDF
    ],

    // Images
    png: [
        { bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0 },
    ],
    jpeg: [
        { bytes: [0xFF, 0xD8, 0xFF], offset: 0 },
    ],
    webp: [
        { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
        { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }, // WEBP
    ],
    gif: [
        { bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 }, // GIF8
    ],

    // Office files (ZIP-based)
    zip: [
        { bytes: [0x50, 0x4B, 0x03, 0x04], offset: 0 }, // PK..
        { bytes: [0x50, 0x4B, 0x05, 0x06], offset: 0 }, // PK.. (empty archive)
    ],

    // Audio
    mp3: [
        { bytes: [0xFF, 0xFB], offset: 0 }, // MPEG-1 Layer 3
        { bytes: [0xFF, 0xF3], offset: 0 }, // MPEG-1 Layer 3
        { bytes: [0xFF, 0xF2], offset: 0 }, // MPEG-1 Layer 3
        { bytes: [0x49, 0x44, 0x33], offset: 0 }, // ID3
    ],
    wav: [
        { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
        { bytes: [0x57, 0x41, 0x56, 0x45], offset: 8 }, // WAVE
    ],

    // Video
    mp4: [
        { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp
    ],
    webm: [
        { bytes: [0x1A, 0x45, 0xDF, 0xA3], offset: 0 },
    ],
    avi: [
        { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
        { bytes: [0x41, 0x56, 0x49, 0x20], offset: 8 }, // AVI
    ],
} as const;

/**
 * Read first N bytes from a file
 */
async function readFileBytes(file: File, numBytes: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const blob = file.slice(0, numBytes);

        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(new Uint8Array(reader.result));
            } else {
                reject(new Error('Failed to read file as ArrayBuffer'));
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(blob);
    });
}

/**
 * Check if bytes match a signature at a specific offset
 */
function matchesSignature(
    fileBytes: Uint8Array,
    signature: { bytes: readonly number[]; offset: number }
): boolean {
    const { bytes, offset } = signature;

    if (fileBytes.length < offset + bytes.length) {
        return false;
    }

    for (let i = 0; i < bytes.length; i++) {
        if (fileBytes[offset + i] !== bytes[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Validate file content against expected type
 */
export async function validateFileContent(
    file: File,
    expectedType: string
): Promise<boolean> {
    try {
        // Normalize type (remove dot if present)
        const type = expectedType.toLowerCase().replace('.', '');

        // Office files (DOCX, PPTX, XLSX) are ZIP files
        // We validate them as ZIP since they all have the same signature
        let signatureType = type;
        if (['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(type)) {
            signatureType = 'zip';
        }

        // JPG and JPEG are the same
        if (type === 'jpg') {
            signatureType = 'jpeg';
        }

        const signatures = FILE_SIGNATURES[signatureType as keyof typeof FILE_SIGNATURES];

        if (!signatures) {
            // No signature defined for this type, skip validation
            console.warn(`No magic number signature defined for type: ${type}`);
            return true;
        }

        // Read enough bytes to check all signatures
        const maxBytesNeeded = Math.max(
            ...signatures.map(sig => sig.offset + sig.bytes.length)
        );

        const fileBytes = await readFileBytes(file, maxBytesNeeded);

        // Check if any signature matches
        for (const signature of signatures) {
            if (matchesSignature(fileBytes, signature)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('File content validation error:', error);
        // On error, allow the file (fail open for better UX)
        return true;
    }
}

/**
 * Get human-readable file type from magic numbers
 */
export async function detectFileType(file: File): Promise<string | null> {
    try {
        const fileBytes = await readFileBytes(file, 12);

        for (const [type, signatures] of Object.entries(FILE_SIGNATURES)) {
            for (const signature of signatures) {
                if (matchesSignature(fileBytes, signature)) {
                    return type;
                }
            }
        }

        return null;
    } catch (error) {
        console.error('File type detection error:', error);
        return null;
    }
}
