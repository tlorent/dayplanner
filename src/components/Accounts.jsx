import { ACCOUNTS } from "../constants/tags";
import { SectionLabel } from "./SectionLabel";

export function Accounts() {
  return (
    <div>
      <SectionLabel>accounts</SectionLabel>
      <div className="flex flex-col gap-0.5">
        {ACCOUNTS.map((acc) => (
          <div
            key={acc.name}
            className="flex justify-between items-center px-3 py-2"
            style={{ background: acc.bg }}
          >
            <span
              className="font-syne text-[12px] font-bold"
              style={{ color: acc.text }}
            >
              {acc.name}
            </span>
            <span
              className="font-mono text-[10px] opacity-70"
              style={{ color: acc.text }}
            >
              {acc.handle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
