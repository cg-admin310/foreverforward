import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A1A",
          borderRadius: "50%",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 37 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5,14 L15,4 L15,10 L25,0 L25,28 L15,18 L15,24 Z" fill="#C9A84C" />
          <path d="M12,14 L22,4 L22,10 L32,0 L32,28 L22,18 L22,24 Z" fill="#5A7247" opacity="0.85" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
