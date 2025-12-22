import React from "react";
import { formatCurrency } from "../../../utils/helper";
import { MdAdd, MdRemove, MdFastfood } from "react-icons/md";

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
            className="h-28 rounded-xl bg-surface-dark border border-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!foods || foods.length === 0) {
    return (
      <div className="text-center py-8 bg-surface-dark border border-dashed border-white/10 rounded-xl text-white/40 text-sm">
        Hiện chưa có dịch vụ nào.
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
            className={`flex items-center justify-between bg-white/5 p-3 rounded-xl border transition-all duration-300 ${
              qty > 0
                ? "border-primary/50 bg-white/[0.08]"
                : "border-white/5 hover:border-white/20"
            }`}
          >
            {/* Left Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <MdFastfood className="text-white/20 text-xl" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">
                  {item.name}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1 ml-2">
              <button
                type="button"
                onClick={() => onChange?.(item.id, Math.max(qty - 1, 0))}
                disabled={qty <= 0}
                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <MdRemove className="text-xs" />
              </button>
              <span
                className={`text-sm font-bold w-4 text-center ${
                  qty > 0 ? "text-white" : "text-white/30"
                }`}
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => onChange?.(item.id, qty + 1)}
                className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              >
                <MdAdd className="text-xs" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceList;
