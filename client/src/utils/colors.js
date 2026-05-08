import { COLORS } from "../constants/dashboard";

export const getRiskColor = (level) => {
  if (level === "High") return COLORS.red;
  if (level === "Medium") return COLORS.yellow;
  return COLORS.green;
};

export const getPnlColor = (value) =>
  Number(value) >= 0 ? COLORS.green : COLORS.red;

export const getBadgeColor = (badge) => {
  if (badge === "Whale") return COLORS.green;
  if (badge === "High Net Worth") return COLORS.blue;
  if (badge === "Mid Holder") return COLORS.yellow;
  return COLORS.gray;
};
