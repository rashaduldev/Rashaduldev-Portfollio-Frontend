import { ImageResponse } from "next/og";

export const alt = "Md Rashadul Islam — Full Stack and MERN Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #07111f 0%, #0d2538 52%, #0c4a43 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "1040px" }}>
        <div style={{ color: "#5eead4", display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Portfolio · Bangladesh</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 28 }}>Md Rashadul Islam</div>
        <div style={{ color: "#d7f9f3", display: "flex", fontSize: 42, fontWeight: 600, marginTop: 24 }}>Full Stack &amp; MERN Developer</div>
        <div style={{ color: "#b7c8d6", display: "flex", fontSize: 26, marginTop: 42 }}>Next.js · TypeScript · React · Node.js · MongoDB</div>
      </div>
    </div>,
    size,
  );
}
