function EmptyChart({ message }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#0f172a",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        color: "#64748b",
        display: "flex",
        fontSize: "12px",
        height: "180px",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

export default EmptyChart;
