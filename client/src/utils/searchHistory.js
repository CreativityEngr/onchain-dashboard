import { isAddress } from "ethers";

import { HISTORY_KEY } from "../constants/dashboard";

export const loadSearchHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(saved)
      ? saved
          .filter((item) => item?.address && isAddress(item.address.trim()))
          .slice(0, 10)
      : [];
  } catch {
    return [];
  }
};

export const createSearchHistory = (currentHistory, address, chain) => {
  const entry = {
    address,
    chain,
    timestamp: Date.now(),
  };

  return [
    entry,
    ...currentHistory.filter(
      (item) =>
        !(
          item.address.toLowerCase() === address.toLowerCase() &&
          item.chain === chain
        )
    ),
  ].slice(0, 10);
};

export const persistSearchHistory = (history) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearPersistedSearchHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
