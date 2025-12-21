import React from "react";
import { formatCurrency } from "../../../utils/helper";
import { MdAdd, MdRemove } from "react-icons/md";

const ServiceList = ({
  foods = [],
  quantities = {},
  loading = false,
  onChange,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-surface-dark border border-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!foods || foods.length === 0) {
    return (
      <div className="text-center py-6 bg-surface-dark border border-dashed border-white/10 rounded-xl text-white/40 text-sm">
        Không có dịch vụ đi kèm.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {foods.map((item) => {
        const qty = quantities[item.id] || 0;
        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group ${
              qty > 0
                ? "bg-white/[0.03] border-primary/40 shadow-inner"
                : "bg-surface-dark border-white/5 hover:border-white/10"
            }`}
          >
            {/* Image */}
            <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 relative border border-white/5">
              <img
                src={item.image_url || "https://placehold.co/80x80?text=Food"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4
                className="text-white font-bold text-sm truncate"
                title={item.name}
              >
                {item.name}
              </h4>
              <p className="text-white/40 text-xs mt-0.5 line-clamp-1">
                {item.description}
              </p>
              <p className="text-primary font-bold text-sm mt-1">
                {formatCurrency(item.price)}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-1 bg-black/20 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => onChange?.(item.id, qty + 1)}
                className="w-6 h-6 flex items-center justify-center rounded bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                <MdAdd className="text-sm" />
              </button>

              <span
                className={`text-sm font-bold w-6 text-center ${
                  qty > 0 ? "text-white" : "text-white/20"
                }`}
              >
                {qty}
              </span>

              <button
                type="button"
                disabled={qty <= 0}
                onClick={() => onChange?.(item.id, Math.max(qty - 1, 0))}
                className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <MdRemove className="text-sm" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceList;
