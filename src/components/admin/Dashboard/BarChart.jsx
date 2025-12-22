import React, { useMemo } from "react";
import { formatCurrency } from "@/utils/helper";

const BarChart = ({ data }) => {
  const max = useMemo(() => Math.max(...data.map((d) => d.total), 1), [data]);

  return (
    <div className="relative h-64 w-full overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-white/30 font-mono select-none pointer-events-none">
        {[1, 0.75, 0.5, 0.25, 0].map((r) => (
          <div
            key={r}
            className={`w-full border-b ${
              r === 0 ? "border-white/15" : "border-white/5"
            } h-0 flex items-center`}
          >
            <span className="-mt-3">
              {formatCurrency((max * r).toFixed(0))}
            </span>
          </div>
        ))}
      </div>

      {/* Bars Container */}
      <div className="absolute inset-0 flex justify-between px-1 md:px-4 pb-2 gap-2">
        {data.map((item) => {
          const height = Math.max((item.total / max) * 100, 2);
          return (
            <div
              key={item.month}
              className="flex flex-1 flex-col items-center gap-2 group h-full justify-end"
            >
              <div className="flex w-full items-end justify-center flex-1">
                <div
                  className="relative w-full max-w-[26px] rounded-sm bg-primary shadow-[0_-6px_18px_rgba(234,42,51,0.35)] transition-all duration-300 hover:bg-primary/90"
                  style={{ height: `${height}%` }}
                  title={`Tháng ${item.month}: ${formatCurrency(item.total)}`}
                />
              </div>
              <span className="text-[10px] font-semibold text-white/70">
                T{item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
