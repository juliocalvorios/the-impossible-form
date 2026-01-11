import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#c0c0c0',
          border: '2px solid #000',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            height: 8,
            background: '#000080',
          }}
        />
        <div
          style={{
            fontSize: 20,
            marginTop: 8,
          }}
        >
          🤪
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
