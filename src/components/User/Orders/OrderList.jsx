import React from "react";
import OrderCard from "./OrderCard";

const OrderList = ({ orders = [], loading, onShowQr, onViewDetail }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-surface-dark border border-white/5 rounded-xl h-48 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center text-white/60 py-12 border border-dashed border-white/10 rounded-xl">
        Bạn chưa có vé nào.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onShowQr={onShowQr}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
};

export default OrderList;
