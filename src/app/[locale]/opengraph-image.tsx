import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eka Maylinda Nely — Agriculture Graduate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fffdf7",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative blocks */}
        <div style={{ position: "absolute", top: 40, left: 40, width: 120, height: 120, background: "#7bed9f", borderRadius: 20, border: "4px solid #1a1a1a", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 100, height: 100, background: "#ffde59", borderRadius: 20, border: "4px solid #1a1a1a", display: "flex" }} />
        <div style={{ position: "absolute", top: 60, right: 120, width: 80, height: 80, background: "#ff6b9d", borderRadius: 16, border: "4px solid #1a1a1a", display: "flex" }} />

        {/* Main card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 80px",
            background: "white",
            borderRadius: 24,
            border: "4px solid #1a1a1a",
            boxShadow: "8px 8px 0px 0px #1a1a1a",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              background: "#7bed9f",
              padding: "8px 20px",
              borderRadius: 12,
              border: "3px solid #1a1a1a",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#16a34a", display: "flex" }} />
            <span style={{ fontWeight: 700, fontSize: 18 }}>Open to work</span>
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 900, margin: 0, color: "#1a1a1a" }}>
            Eka Maylinda Nely
          </h1>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a99", margin: "8px 0 0" }}>
            S.P. — Agriculture Graduate
          </p>
          <p style={{ fontSize: 18, color: "#1a1a1a80", marginTop: 16 }}>
            🌿 Sustainability · Community Engagement · Research
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
