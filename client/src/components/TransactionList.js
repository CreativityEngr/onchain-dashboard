import { EXPLORER_URLS } from "../constants/dashboard";
import { formatToken } from "../utils/formatters";

const getTxUrl = (chain, hash) => {
  const baseUrl = chain === "AVAX" ? EXPLORER_URLS.AVAX : EXPLORER_URLS.ETH;
  return `${baseUrl}/${hash}`;
};

function TransactionList({ wallet }) {
  const txs = wallet.txs || [];

  return (
    <>
      <h3 style={{ marginTop: "20px" }}>Recent Transactions</h3>

      {txs.length > 0 ? (
        txs.map((tx, index) => {
          const isIncoming =
            tx.to?.toLowerCase() === wallet.address.toLowerCase();
          const value = tx.tokenDecimal
            ? Number(tx.value) / Math.pow(10, tx.tokenDecimal)
            : Number(tx.value) / 1e18;
          const symbol = tx.tokenSymbol || wallet.chain;

          return (
            <div key={`${tx.hash}-${index}`} style={{ marginBottom: "12px" }}>
              <a
                href={getTxUrl(wallet.chain, tx.hash)}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#60a5fa",
                  display: "inline-block",
                  fontSize: "12px",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#93c5fd";
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#60a5fa";
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                {tx.hash.slice(0, 10)}...
              </a>

              <p
                style={{
                  color: isIncoming ? "#22c55e" : "#ef4444",
                }}
              >
                {isIncoming ? "Received" : "Sent"} - {formatToken(value)} {symbol}
              </p>
            </div>
          );
        })
      ) : (
        <p style={{ color: "#9ca3af" }}>No transactions available</p>
      )}
    </>
  );
}

export default TransactionList;
