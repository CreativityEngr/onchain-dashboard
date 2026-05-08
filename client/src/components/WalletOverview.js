import RiskBadge from "./RiskBadge";
import TransactionList from "./TransactionList";
import { getBadgeColor, getPnlColor } from "../utils/colors";
import {
  formatAge,
  formatSignedPercent,
  formatSignedUSD,
  formatToken,
  formatUSD,
} from "../utils/formatters";

const hasPnlValue = (pnl) =>
  pnl &&
  Number.isFinite(Number(pnl.totalUsd)) &&
  Number.isFinite(Number(pnl.totalPercent));

function WalletOverview({ wallet }) {
  const hasPnl = hasPnlValue(wallet.pnl);

  return (
    <div
      className="wallet-panel panel-card"
      style={{
        flex: "1 1 520px",
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #1f2937",
        minWidth: 0,
      }}
    >
      <h3>Wallet Overview</h3>

      <p className="wallet-address">
        <strong>Address:</strong> {wallet.address}
      </p>
      <p>
        <strong>Chain:</strong> {wallet.chain}
      </p>
      <p>
        <strong>Balance:</strong> {formatToken(wallet.balance)}
      </p>
      <p>
        <strong>Value:</strong> {formatUSD(wallet.usd)}
      </p>
      <p>
        <strong>PnL:</strong>{" "}
        <span
          style={{
            color: hasPnl ? getPnlColor(wallet.pnl.totalUsd) : "#94a3b8",
            fontWeight: "bold",
          }}
        >
          {hasPnl
            ? `${formatSignedUSD(wallet.pnl.totalUsd)} (${formatSignedPercent(
                wallet.pnl.totalPercent
              )})`
            : "Unavailable"}
        </span>
      </p>
      <p>
        <strong>Age:</strong> {formatAge(wallet.walletAge)}
      </p>
      <p>
        <strong>Risk:</strong>{" "}
        <RiskBadge score={wallet.riskScore ?? 0} level={wallet.riskLevel || "Low"} />
      </p>

      <p>
        <strong>Type:</strong>{" "}
        <span style={{ color: getBadgeColor(wallet.badge) }}>{wallet.badge}</span>
      </p>

      {wallet.tags?.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "16px",
            marginTop: "-4px",
          }}
        >
          {wallet.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "999px",
                color: "#cbd5e1",
                fontSize: "11px",
                fontWeight: "bold",
                padding: "4px 9px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <TransactionList wallet={wallet} />
    </div>
  );
}

export default WalletOverview;
