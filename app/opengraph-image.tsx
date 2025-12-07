import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'FilePilot - Free File Converter';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Glow Effects */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        filter: 'blur(100px)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        left: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        filter: 'blur(100px)',
                        borderRadius: '50%',
                    }}
                />

                {/* Content Card */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '40px',
                        padding: '60px 80px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {/* Logo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                        {/* Simple SVG Logo approximation for OG Image */}
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginRight: '20px' }}
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 900,
                                background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            FilePilot
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            color: '#94a3b8',
                            textAlign: 'center',
                            maxWidth: '600px',
                            lineHeight: 1.4,
                        }}
                    >
                        Free, Secure & Private File Conversion
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            marginTop: '40px',
                            gap: '20px',
                        }}
                    >
                        {['PDF', 'Images', 'Video', 'Audio'].map((item) => (
                            <div
                                key={item}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '20px',
                                    color: '#e2e8f0',
                                    fontSize: 18,
                                    fontWeight: 600,
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
