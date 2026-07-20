import React from "react";

// Helper to format date explicitly as "Day Month Year" (e.g. "12 October 2025")
export const formatPdfDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return dateStr;

    const dayNum = date.getDate();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = months[date.getMonth()];
    const fullYear = date.getFullYear();

    return `${dayNum} ${monthName} ${fullYear}`;
  } catch {
    return dateStr;
  }
};

// 1. Sleek legal disclaimer notice block
interface PdfDisclaimerProps {
  className?: string;
  style?: React.CSSProperties;
}

export const PdfDisclaimer: React.FC<PdfDisclaimerProps> = ({ className = "", style }) => {
  return (
    <div
      className={`border border-slate-200 bg-slate-50 text-slate-600 text-[10px] leading-relaxed p-3 rounded-lg font-medium select-none ${className}`}
      style={{
        border: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
        color: "#475569",
        borderRadius: "8px",
        ...style,
      }}
    >
      DISCLAIMER: This is a generic template for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before using this document.
    </div>
  );
};

// 2. Executive layout header containing logo and wordmark title
interface PdfHeaderProps {
  title: string;
  subtitle?: string;
  businessName?: string;
  businessAddress?: string;
  logo?: string | null;
  style?: React.CSSProperties;
}

export const PdfHeader: React.FC<PdfHeaderProps> = ({
  title,
  subtitle,
  businessName,
  businessAddress,
  logo,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "24px",
        ...style,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt="Business Logo"
            style={{
              maxHeight: "44px",
              maxWidth: "150px",
              objectFit: "contain",
              alignSelf: "flex-start",
              marginBottom: "8px",
            }}
          />
        )}
        <h4 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0", color: "#0f172a" }}>
          {businessName || "Your Business Name"}
        </h4>
        {businessAddress && (
          <p style={{ fontSize: "11px", color: "#475569", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
            {businessAddress}
          </p>
        )}
      </div>

      <div style={{ textAlign: "right" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0", color: "#0f172a", lineHeight: "1" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", margin: "6px 0 0 0" }}>
            {subtitle}
          </p>
        )}
        <div style={{ height: "4px", backgroundColor: "#2563eb", width: "40px", marginTop: "12px", marginLeft: "auto" }} />
      </div>
    </div>
  );
};

// 3. Metadata 3-column block layout
interface MetadataItem {
  label: string;
  value: string;
}

interface PdfMetadataBlockProps {
  items: MetadataItem[];
  style?: React.CSSProperties;
}

export const PdfMetadataBlock: React.FC<PdfMetadataBlockProps> = ({ items, style }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: "16px",
        padding: "16px",
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        borderRadius: "8px",
        ...style,
      }}
    >
      {items.map((item, idx) => (
        <div key={idx}>
          <span style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            {item.label}
          </span>
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a", display: "block", marginTop: "4px" }}>
            {item.value || "—"}
          </span>
        </div>
      ))}
    </div>
  );
};

// 4. Highlighted key financial figures or totals box
interface PdfHighlightBlockProps {
  label: string;
  value: string;
  style?: React.CSSProperties;
}

export const PdfHighlightBlock: React.FC<PdfHighlightBlockProps> = ({ label, value, style }) => {
  return (
    <div
      style={{
        borderTop: "2px solid #0f172a",
        borderBottom: "2px solid #0f172a",
        backgroundColor: "#f1f5f9",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...style,
      }}
    >
      <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a" }}>
        {label}
      </span>
      <span style={{ fontSize: "18px", fontWeight: "900", fontFamily: "monospace", color: "#0f172a" }}>
        {value}
      </span>
    </div>
  );
};
