import React from "react";

const TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "SUCCESSFUL", label: "Hoàn thành" },
  { key: "PROCESSING", label: "Đang xử lý" },
  { key: "CANCELLED", label: "Đã hủy" },
];

const OrderFilter = ({ active, onChange }) => {
  return (
    <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors border-b-2 ${
            active === tab.key
              ? "text-primary border-primary font-bold"
              : "text-white/60 hover:text-white border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default OrderFilter;
