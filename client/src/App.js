import { useState } from "react";
import axios from "axios";

function App() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    if (!address || address.length !== 42) {
      alert("Enter a valid wallet address");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/wallet/${address}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>ChainLens</h2>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address"
        style={{
          padding: "10px",
          marginRight: "10px",
          width: "300px"
        }}
      />

      <button onClick={fetchWallet}>
        Fetch
      </button>

      {loading && <p>Loading...</p>}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>Balance:</strong> {data.balance} ETH</p>
          <p><strong>Value:</strong> ${data.usd}</p>

          <h3>Recent Transactions</h3>

          {Array.isArray(data.txs) && data.txs.map((tx, index) => (
            <div key={index}>
              <p>Hash: {tx.hash}</p>
              <p>Value: {parseFloat(tx.value) / 1e18} ETH</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;