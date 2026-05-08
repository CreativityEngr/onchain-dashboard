import FlowSection from "./FlowSection";
import PortfolioSection from "./PortfolioSection";

function AnalyticsPanel({ wallet }) {
  return (
    <div
      className="analytics-panel panel-card"
      style={{
        flex: "1 1 340px",
        maxWidth: "420px",
        minWidth: 0,
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #1f2937",
      }}
    >
      <FlowSection wallet={wallet} />
      <PortfolioSection portfolio={wallet.portfolio || []} />
    </div>
  );
}

export default AnalyticsPanel;
