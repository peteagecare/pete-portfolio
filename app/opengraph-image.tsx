import { ImageResponse } from "next/og";

export const alt =
  "Pete Jenkins — Social Content Creative · Video · Photo · Motion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF8F5",
          color: "#1F1F1F",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8A857C",
          }}
        >
          Pete Jenkins · Nottingham UK
        </div>
        <div
          style={{
            fontSize: 110,
            lineHeight: 1,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: -2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Photographer</span>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>
            + filmmaker
          </span>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>
            + web developer
          </span>
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#4A4742",
            fontStyle: "italic",
          }}
        >
          Stills, motion and the web — for brands that want to feel real.
        </div>
      </div>
    ),
    size
  );
}
