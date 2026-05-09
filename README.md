# ChainLens

**Portfolio-grade multi-chain wallet analytics for Ethereum and Avalanche.**

ChainLens is a full-stack wallet intelligence dashboard that turns raw on-chain activity into readable portfolio, transaction, risk, flow, and wallet classification insights. It supports Ethereum and Avalanche C-Chain wallets with a modular React frontend and Express backend designed for maintainability, reliability, and future expansion.

The project is built as a serious portfolio-grade analytics product: practical data sources, defensive fallbacks, clean UI behavior, and a codebase organized for continued development.

---

## Overview

ChainLens helps users inspect an EVM wallet beyond a basic balance lookup. It combines wallet value, portfolio allocation, transaction history, inflow/outflow patterns, risk signals, smart-money tags, and conservative PnL estimates into a single responsive dashboard.

Supported chains:

- Ethereum
- Avalanche C-Chain

Core focus:

- Make wallet activity understandable
- Keep analytics deterministic and explainable
- Avoid fake precision when data is incomplete
- Preserve a clean, maintainable solo-developer architecture

---

## Key Capabilities

- **Wallet Overview**  
  Native balance, USD value, wallet age, wallet type, risk score, smart-money tags, and PnL availability.

- **Portfolio Analytics**  
  Portfolio allocation chart, token allocation bars, token USD values, and proportional exposure.

- **Transaction Analytics**  
  Recent native and token transfers normalized into one transaction feed with explorer links.

- **Flow Analytics**  
  Inflow, outflow, and net flow calculations using stablecoin and native asset valuation rules.

- **Risk Scoring**  
  Lightweight deterministic scoring based on large outflows, unknown-token exposure, activity frequency, portfolio concentration, and diversity.

- **Smart Money Tagging**  
  Rule-based labels such as Whale, Smart Money, Active Trader, Fresh Wallet, and Long-Term Holder.

- **PnL Tracking**  
  Conservative native-asset unrealized PnL estimation for ETH and AVAX when sufficient acquisition data exists. If the data is insufficient, ChainLens returns `Unavailable` instead of misleading numbers.

- **Search History**  
  Recent wallet lookups stored locally with quick reload and clear-history support.

- **Responsive Dashboard**  
  Mobile-friendly layout with preserved desktop presentation.

---

## Tech Stack

### Frontend

- React
- Recharts
- ethers.js address validation
- CSS modules by structure, with responsive CSS
- LocalStorage for search history

### Backend

- Node.js
- Express
- ethers.js
- axios
- dotenv

### APIs

- Covalent: balances, portfolio allocation, primary transaction data
- Avalanche Glacier API: Avalanche transaction fallback and wallet age support
- Etherscan API: Ethereum transaction fallback
- CoinGecko: current and historical native asset pricing

---

## Architecture

The codebase is split into small, purpose-specific modules while keeping the application simple and deployable.

```text
onchain-dashboard/
  client/
    src/
      components/
        AnalyticsPanel.js
        EmptyChart.js
        FlowSection.js
        PortfolioSection.js
        RiskBadge.js
        SearchBar.js
        SearchHistory.js
        TransactionList.js
        WalletOverview.js
      constants/
        dashboard.js
      styles/
        responsive.css
      utils/
        charts.js
        colors.js
        formatters.js
        searchHistory.js
      App.js
      index.js

  server/
    config/
      chains.js
      constants.js
    routes/
      wallet.js
    services/
      covalentService.js
      etherscanService.js
      glacierService.js
      pnlService.js
      priceService.js
      providerService.js
      scoringService.js
      walletService.js
    utils/
      analytics.js
      numbers.js
      time.js
      transactions.js
    index.js
```

### Backend Flow

```text
wallet route
  -> wallet service
    -> provider balance
    -> price service
    -> transaction services
    -> portfolio service
    -> analytics helpers
    -> risk scoring
    -> smart tags
    -> PnL service
  -> frontend-compatible response
```

The wallet API response remains stable for the frontend:

```js
{
  address,
  chain,
  balance,
  usd,
  walletAge,
  badge,
  inflow,
  outflow,
  netFlow,
  riskScore,
  riskLevel,
  tags,
  pnl,
  portfolio,
  txs
}
```

---

## Feature Breakdown

### Wallet Classification

Wallet type is determined using robust fallback logic:

- Whale: portfolio value >= $1,000,000 or extremely large native holdings
- High Net Worth: >= $100,000
- Mid Holder: >= $10,000
- Retail: below $10,000

### Flow Analytics

Flow analytics are USD-based:

- Stablecoins use direct USD value
- ETH and AVAX transfers use current market price
- Unknown tokens are ignored
- Unrealistic spam values are filtered

### Risk Scoring

Risk scoring considers:

- Very large outflows
- Unknown-token interaction count
- High transaction frequency
- Low portfolio diversity
- Suspicious concentration

### PnL Tracking

PnL is intentionally conservative:

- Supports ETH and AVAX only
- Uses weighted average acquisition estimate when data is sufficient
- Does not calculate PnL for stablecoins or obscure tokens
- Returns `Unavailable` instead of fabricating precision

---

## Screenshots

Add production screenshots here before publishing the live demo.

### Dashboard Overview

```text
screenshots/dashboard-overview.png
```

### Wallet Analytics

```text
screenshots/wallet-analytics.png
```

### Mobile Layout

```text
screenshots/mobile-dashboard.png
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chainlens.git
cd chainlens
```

### 2. Configure backend environment

```bash
cd server
cp .env.example .env
```

Fill in the required keys:

```bash
COVALENT_API_KEY=your_covalent_key
GLACIER_API_KEY=your_glacier_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Install and run backend

```bash
npm install
node index.js
```

Backend runs on:

```text
http://localhost:5000
```

### 4. Install and run frontend

Open a second terminal:

```bash
cd client
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

Create `server/.env` using `server/.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `COVALENT_API_KEY` | Yes | Portfolio balances and primary transaction data |
| `GLACIER_API_KEY` | Recommended | Avalanche transaction fallback and oldest activity lookup |
| `ETHERSCAN_API_KEY` | Recommended | Ethereum transaction fallback |

The backend is defensive: missing or failing providers return safe fallback values instead of crashing the API.

---

## API Integrations

### Covalent

Used as the primary data source for wallet balances, token holdings, portfolio value, and supported transaction data.

### Avalanche Glacier API

Used to improve Avalanche reliability, especially for transaction history and wallet age fallback.

### Etherscan

Used as an Ethereum transaction fallback source.

### CoinGecko

Used for current ETH/AVAX pricing and historical native-asset pricing for conservative PnL estimates.

---

## Roadmap

- Add production deployment configuration
- Add backend unit tests for analytics and transaction normalization
- Add cached API responses for rate-limit resilience
- Add wallet watchlist support
- Add richer historical portfolio snapshots
- Add optional CSV export for transactions and flows
- Add multi-wallet comparison mode

---

## Why This Project Exists

Most wallet explorers show balances and transactions, but they rarely explain what a wallet is doing. ChainLens is built to bridge that gap with practical analytics: portfolio composition, money flow, risk signals, smart-money classification, and conservative performance insight.

The goal is not to be a block explorer clone. The goal is to provide a maintainable, full-stack portfolio intelligence dashboard that demonstrates real-world product thinking, API integration, data normalization, and frontend/backend architecture.
