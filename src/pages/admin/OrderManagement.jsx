import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StatCard from '@/components/admin/StatCard';
import OrderTable from '@/components/admin/OrderTable';
import SummaryApi from '@/common';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 0,
        totalItems: 0
    });

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'PENDING', label: 'Chờ xử lý' },
        { value: 'SUCCESSFUL', label: 'Thành công' },
        { value: 'FAILED', label: 'Thất bại' }
    ];

    const fetchOrders = async (page = 1, status = currentStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            let url = `${SummaryApi.getOrders.url}?page=${page}&size=${pagination.size}`;
            if (status) {
                url += `&status=${status}`;
            }

            const response = await fetch(url, {
                method: SummaryApi.getOrders.method,
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.data.items);
                setPagination({
                    page: data.data.page,
                    size: data.data.size,
                    totalPages: data.data.totalPages,
                    totalItems: data.data.totalItems
                });
            } else {
                toast.error(data.message || "Không thể lấy danh sách đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching orders", error);
            toast.error("Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1, currentStatus);
    }, [currentStatus]);

    const handleStatusFilterChange = (status) => {
        setCurrentStatus(status);
        // Effect will trigger fetch
    };

    const handleViewDetail = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            const url = `${SummaryApi.getOrderDetail.url}/${id}`;

            const response = await fetch(url, {
                method: SummaryApi.getOrderDetail.method,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setSelectedOrder(data.data);
                setShowDetailModal(true);
            } else {
                toast.error("Không thể lấy chi tiết đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching order detail", error);
            toast.error("Lỗi khi tải chi tiết");
        }
    };

    return (
        <div className="mx-auto max-w-[96rem] space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-black text-white">Quản lý Đơn hàng</h2>

                <div className="flex gap-2 bg-surface-dark p-1 rounded-xl border border-white/10">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleStatusFilterChange(opt.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentStatus === opt.value
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <OrderTable
                orders={orders}
                loading={loading}
                pagination={pagination}
                fetchOrders={(p) => fetchOrders(p, currentStatus)}
                onViewDetail={handleViewDetail}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-surface-dark border border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">Chi tiết đơn hàng</h3>
                                <p className="text-sm text-gray-400 font-mono mt-1">{selectedOrder.booking_code}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Khách hàng</label>
                                    <p className="text-white font-medium">{selectedOrder.User?.full_name}</p>
                                    <p className="text-sm text-gray-400">{selectedOrder.User?.email}</p>
                                    <p className="text-sm text-gray-400">{selectedOrder.User?.phone}</p>
                                </div>
                                <div className="text-right">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Trạng thái</label>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedOrder.status === 'SUCCESSFUL' ? 'bg-success/10 text-success border-success/20' :
                                            selectedOrder.status === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-background-dark rounded-xl p-4 border border-white/5">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">payments</span>
                                    Thông tin thanh toán
                                </h4>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-gray-400">Phương thức:</span>
                                    <span className="text-white text-right font-medium">{selectedOrder.payment_method}</span>

                                    <span className="text-gray-400">Vé:</span>
                                    <span className="text-white text-right">{Number(selectedOrder.ticket_total).toLocaleString()} đ</span>

                                    <span className="text-gray-400">Đồ ăn/uống:</span>
                                    <span className="text-white text-right">{Number(selectedOrder.food_total).toLocaleString()} đ</span>

                                    <span className="text-gray-400">Giảm giá:</span>
                                    <span className="text-success text-right">-{Number(selectedOrder.discount_applied).toLocaleString()} đ</span>

                                    <span className="text-white font-bold pt-2 border-t border-white/10 mt-1">Tổng cộng:</span>
                                    <span className="text-primary font-bold text-lg text-right pt-2 border-t border-white/10 mt-1">
                                        {Number(selectedOrder.total_amount).toLocaleString()} đ
                                    </span>
                                </div>
                            </div>

                            {/* Ticket Items */}
                            {selectedOrder.Tickets && selectedOrder.Tickets.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-white mb-2">Vé đã đặt</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.Tickets.map((ticket, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {ticket.Showtime?.CinemaRoom?.Cinema?.name} - {ticket.Showtime?.CinemaRoom?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Ghế: <span className="text-primary font-bold">{ticket.Seat?.row}{ticket.Seat?.number}</span> ({ticket.Seat?.type})
                                                    </p>
                                                </div>
                                                <span className="text-white font-bold">{Number(ticket.price).toLocaleString()} đ</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Food Items */}
                            {selectedOrder.OrderFoods && selectedOrder.OrderFoods.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-white mb-2">Đồ ăn kèm</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.OrderFoods.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.Food?.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                                                    <div>
                                                        <p className="text-white font-medium">{item.Food?.name}</p>
                                                        <p className="text-xs text-gray-400">SL: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="text-white font-bold">{Number(item.price_at_purchase).toLocaleString()} đ</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* QR Code */}
                            {selectedOrder.qr_code_url && (
                                <div className="flex justify-center mt-6">
                                    <div className="bg-white p-2 rounded-xl">
                                        <img src={selectedOrder.qr_code_url} alt="QR Code" className="w-32 h-32" />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
