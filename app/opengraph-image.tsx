import { ImageResponse } from "next/og";

export const alt = "QuoteVia online quotation software for small businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f8fafc",
          color: "#0f172a",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #dbe3ef",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: "64px",
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
            <div
              style={{
                alignItems: "center",
                background: "#3157c8",
                borderRadius: "16px",
                color: "#ffffff",
                display: "flex",
                fontSize: "34px",
                fontWeight: 800,
                height: "64px",
                justifyContent: "center",
                width: "64px",
              }}
            >
              Q
            </div>
            <span style={{ fontSize: "36px", fontWeight: 700 }}>QuoteVia</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div
              style={{
                fontSize: "68px",
                fontWeight: 750,
                letterSpacing: "-3px",
                lineHeight: 1.05,
                maxWidth: "940px",
              }}
            >
              Create professional quotes online in minutes.
            </div>
            <div style={{ color: "#475569", fontSize: "28px" }}>
              Send, track, and get customer decisions online.
            </div>
          </div>
          <div style={{ color: "#3157c8", fontSize: "24px", fontWeight: 650 }}>
            quotevia.co.za
          </div>
        </div>
      </div>
    ),
    size,
  );
}
