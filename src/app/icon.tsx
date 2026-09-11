import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#211d18",
          color: "#f7f2e8",
          fontSize: 18,
          fontFamily: "Georgia, serif",
          letterSpacing: -0.5,
        }}
      >
        Z
      </div>
    ),
    { ...size },
  );
}
