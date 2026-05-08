import { getRiskColor } from "../utils/colors";

function RiskBadge({ score = 0, level = "Low" }) {
  const color = getRiskColor(level);

  return (
    <span
      style={{
        background: `${color}22`,
        border: `1px solid ${color}55`,
        borderRadius: "999px",
        color,
        display: "inline-block",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 10px",
      }}
    >
      {score}/100 | {level}
    </span>
  );
}

export default RiskBadge;
