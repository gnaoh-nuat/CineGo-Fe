import React from 'react';

export default function OrderTable({ orders, loading, pagination, fetchOrders, onViewDetail, onStatusChange }) {

    const getStatusBadge = (status) => {
        let colorClass = 'bg-gray-700 text-gray-300 border-gray-600';
        let label = status;

        switch (status) {
            case 'SUCCESSFUL':
                colorClass = 'bg-success/10 text-success border-success/20';
                label = 'Thành công';
                break;
            case 'PENDING':
                colorClass = 'bg-warning/10 text-warning border-warning/20';
                label = 'Chờ xử lý';
                break;
            case 'FAILED':
                colorClass = 'bg-red-500/10 text-red-500 border-red-500/20';
                label = 'Thất bại';
                break;
            default:
                break;
        }

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${colorClass}`}>
                {label}
            </span>
        );
    };

    return (
        <div className="rounded-3xl bg-surface-dark border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-surface-light/50 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4 text-center">ID</th>
                            <th className="px-6 py-4">Mã đơn hàng</th>
                            <th className="px-6 py-4">Khách hàng</th>
                            <th className="px-6 py-4">Tổng tiền</th>
                            <th className="px-6 py-4 text-center">PTTT</th>
                            <th className="px-6 py-4">Ngày thanh toán</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="8" className="p-10 text-center">Đang tải dữ liệu...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="8" className="p-10 text-center">Không có đơn hàng nào</td></tr>
                        ) : orders.map((order) => {
                            return (
                                <tr key={order.id} className="hover:bg-white/5 group transition-colors">
                                    <td className="px-6 py-4 text-center font-mono text-xs">{order.id}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-white group-hover:text-primary transition-colors">
                                        {order.booking_code}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{order.User?.full_name || "N/A"}</span>
                                            <span className="text-[10px] text-gray-500">{order.User?.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        {Number(order.total_amount).toLocaleString()} đ
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
                                            {order.payment_method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order.payment_time ? new Date(order.payment_time).toLocaleString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onViewDetail(order.id)}
                                            className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex items-center justify-between p-4 border-t border-white/5">
                <span className="text-xs text-gray-500">Tổng cộng {pagination.totalItems} đơn hàng</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchOrders(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <span className="flex items-center px-3 text-xs font-bold text-white bg-primary rounded-full">
                        {pagination.page}
                    </span>
                    <button
                        onClick={() => fetchOrders(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
