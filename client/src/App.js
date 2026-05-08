import { useState } from "react";
import axios from "axios";
import { isAddress } from "ethers";

import AnalyticsPanel from "./components/AnalyticsPanel";
import SearchBar from "./components/SearchBar";
import SearchHistory from "./components/SearchHistory";
import WalletOverview from "./components/WalletOverview";
import {
  clearPersistedSearchHistory,
  createSearchHistory,
  loadSearchHistory,
  persistSearchHistory,
} from "./utils/searchHistory";
import "./styles/responsive.css";

function App() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chain, setChain] = useState("avax");
  const [searchHistory, setSearchHistory] = useState(loadSearchHistory);

  const saveSearchHistory = (nextAddress, nextChain) => {
    setSearchHistory((currentHistory) => {
      const nextHistory = createSearchHistory(
        currentHistory,
        nextAddress,
        nextChain
      );

      persistSearchHistory(nextHistory);
      return nextHistory;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    clearPersistedSearchHistory();
  };

  const fetchWallet = async (nextAddress = address, nextChain = chain) => {
    const cleanAddress =
      typeof nextAddress === "string" ? nextAddress.trim() : address.trim();

    if (!isAddress(cleanAddress)) {
      alert("Enter valid address");
      return;
    }

    try {
      setLoading(true);
      setAddress(cleanAddress);
      setChain(nextChain);

      const res = await axios.get(
        `http://localhost:5000/wallet/${cleanAddress}?chain=${nextChain}`
      );

      setData(res.data);
      saveSearchHistory(cleanAddress, nextChain);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-shell"
      style={{
        background: "#0b0f19",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h2 className="app-title" style={{ color: "#3b82f6" }}>
        ChainLens Dashboard
      </h2>

      <SearchBar
        address={address}
        chain={chain}
        loading={loading}
        onAddressChange={setAddress}
        onChainChange={setChain}
        onSubmit={() => fetchWallet()}
      />

      <SearchHistory
        history={searchHistory}
        onClear={clearSearchHistory}
        onSelect={fetchWallet}
      />

      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}

      {data && (
        <div
          className="dashboard-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            marginTop: "30px",
            alignItems: "flex-start",
          }}
        >
          <WalletOverview wallet={data} />
          <AnalyticsPanel wallet={data} />
        </div>
      )}
    </div>
  );
}

export default App;
