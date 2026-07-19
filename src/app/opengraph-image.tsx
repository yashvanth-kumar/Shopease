import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ShopEase — Shop Electronics, Fashion, Home & More Online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #153c31 0%, #1f7358 50%, #2e8f6d 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 90,
              height: 90,
              borderRadius: 20,
              background: "white",
              color: "#1f7358",
              fontSize: 56,
              fontWeight: 700,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            S
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 76, fontWeight: 700 }}>
            ShopEase
          </div>
        </div>
        <div style={{ display: "flex", color: "#d9f0e7", fontSize: 32, marginTop: 24 }}>
          Everything you need, delivered fast.
        </div>
      </div>
    ),
    { ...size }
  );
}
