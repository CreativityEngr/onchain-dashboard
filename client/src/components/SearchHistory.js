import { shortAddress } from "../utils/formatters";

function SearchHistory({ history, onClear, onSelect }) {
  if (!history.length) return null;

  return (
    <div style={{ marginTop: "14px" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Recent Searches
        </span>
        <button
          className="clear-history-button"
          onClick={onClear}
          style={{
            background: "transparent",
            border: "1px solid #374151",
            borderRadius: "999px",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "11px",
            padding: "6px 10px",
          }}
        >
          Clear history
        </button>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <button
            key={`${item.chain}-${item.address}`}
            onClick={() => onSelect(item.address, item.chain)}
            style={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "999px",
              color: "#cbd5e1",
              cursor: "pointer",
              fontSize: "12px",
              padding: "8px 11px",
            }}
            title={`${item.chain.toUpperCase()} ${item.address}`}
          >
            {item.chain.toUpperCase()} {shortAddress(item.address)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;
