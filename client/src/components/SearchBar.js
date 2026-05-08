import { CHAINS } from "../constants/dashboard";

function SearchBar({
  address,
  chain,
  loading,
  onAddressChange,
  onChainChange,
  onSubmit,
}) {
  return (
    <div className="search-row" style={{ marginTop: "20px" }}>
      <select
        className="chain-select"
        value={chain}
        onChange={(e) => onChainChange(e.target.value)}
        style={{
          padding: "10px",
          marginRight: "10px",
          borderRadius: "8px",
          background: "#111827",
          color: "white",
          border: "1px solid #1f2937",
        }}
      >
        {CHAINS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <input
        className="wallet-input"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Enter wallet address"
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #1f2937",
          background: "#111827",
          color: "white",
          width: "320px",
          marginRight: "10px",
        }}
      />

      <button
        className="analyze-button"
        onClick={onSubmit}
        disabled={loading}
        style={{
          padding: "12px 16px",
          borderRadius: "8px",
          border: "none",
          background: "#3b82f6",
          color: "white",
          cursor: loading ? "default" : "pointer",
        }}
      >
        Analyze
      </button>
    </div>
  );
}

export default SearchBar;
