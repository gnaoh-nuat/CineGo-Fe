import React from "react";
import { formatDateTime, mapOrderStatus } from "@/utils/helper";

const OrderRow = ({ order }) => {
  const status = mapOrderStatus(order.status);
  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
      <td className="px-3 py-3 text-sm font-semibold text-white">
        {order.ticket_code}
      </td>
      <td className="px-3 py-3 text-sm text-white/80">{order.customer_name}</td>
      <td className="px-3 py-3 text-sm text-white/80">{order.movie_title}</td>
      <td className="px-3 py-3 text-sm text-white/60 whitespace-nowrap">
        {formatDateTime(order.show_time)}
      </td>
      <td className="px-3 py-3 text-right">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.badge}`}
        >
          {status.text}
        </span>
      </td>
    </tr>
  );
};

export default OrderRow;
