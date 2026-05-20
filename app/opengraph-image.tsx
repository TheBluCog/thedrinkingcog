import { ImageResponse } from 'next/og';

export const alt = 'The Drinking Cog';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #155e75 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial, sans-serif',
          height: '100%',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <div style={{ color: '#67e8f9', fontSize: 42, letterSpacing: 8, textTransform: 'uppercase' }}>
          TheBluCog Lab
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, marginTop: 32 }}>The Drinking Cog</div>
        <div style={{ color: '#cbd5e1', fontSize: 36, marginTop: 24 }}>
          Tiny bird. Big cog energy.
        </div>
      </div>
    ),
    size
  );
}
