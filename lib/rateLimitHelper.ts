// Helper script to add rate limiting to all API routes
// This file documents the pattern to apply to each route

/*
PATTERN TO APPLY TO EACH API ROUTE:

1. Add import at the top:
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';

2. Add rate limit check at start of POST function:
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }
  
  // ... rest of the function

3. Add headers to successful response (before return):
  const response = fileResponse(...);
  
  // Add rate limit headers
  const rateLimitHeaders = createRateLimitHeaders(
    rateLimit.limit,
    rateLimit.remaining,
    rateLimit.reset
  );
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
*/

// List of all API routes to update:
const apiRoutes = [
    'add-background',
    'audio-converter',
    'background-remover',
    'compress-pdf',
    'image-compressor',
    'image-to-webp',
    'images-to-pdf',
    'jpg-to-png',
    'merge-pdf',
    'ocr-image',
    'pdf-to-png',
    'pdf-to-ppt',
    'pdf-to-text',
    'pdf-to-word', // Already done
    'png-to-jpg',
    'ppt-to-pdf',
    'split-pdf',
    'unzip-files',
    'video-compressor',
    'video-converter',
    'word-to-pdf',
    'zip-files',
];

export default apiRoutes;
