import React, { useEffect, useState } from 'react';
import MovieTable from '@/components/admin/MovieTable';
import AddNewButton from '@/components/admin/AddNewButton';
import VoucherFormModal from '@/components/admin/VoucherFormModal';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 0,
        totalItems: 0
    });

    const fetchVouchers = async (page = 1) => {
        setLoading(true);
        try {
            let url = `${SummaryApi.getVouchers.url}?page=${page}&size=${pagination.size}`;

            const response = await authenticatedFetch(url);
            const result = await response.json();

            if (result.success) {
                setVouchers(result.data.items);
                setPagination({
                    page: result.data.page,
                    size: result.data.size,
                    totalPages: result.data.totalPages,
                    totalItems: result.data.totalItems
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách voucher:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers(1);
    }, []);

    const handleSaveVoucher = async (formData) => {
        try {
            const isEdit = !!selectedVoucher;
            const url = isEdit
                ? `${SummaryApi.getVouchers.url}/${selectedVoucher.id}`
                : SummaryApi.createVoucher.url;

            const method = isEdit ? 'PUT' : 'POST';

            const response = await authenticatedFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok || result.success) {
                alert(isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
                setIsModalOpen(false);
                fetchVouchers(pagination.page);
            } else {
                alert('Thao tác thất bại: ' + result.message);
            }
        } catch (error) {
            console.error("Lỗi khi lưu voucher:", error);
            alert('Không thể kết nối đến server.');
        }
    };

    const handleDeleteVoucher = async (id, code) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa voucher "${code}"?`)) return;

        try {
            const response = await authenticatedFetch(`${SummaryApi.deleteVoucher.url}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (response.ok || result.success) {
                alert('Đã xóa voucher thành công!');
                fetchVouchers(pagination.page);
            } else {
                alert('Xóa thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa voucher:', error);
            alert('Lỗi hệ thống khi xóa.');
        }
    };

    // Helper to format Date
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="mx-auto max-w-[96rem] space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Voucher</h2>

                <div className="flex items-center gap-2">
                    <AddNewButton
                        onClick={() => { setSelectedVoucher(null); setIsModalOpen(true); }}
                        label="Thêm Voucher"
                    />
                </div>
            </div>

            {/* Table Section */}
            <MovieTable
                items={vouchers}
                loading={loading}
                pagination={pagination}
                fetchMovies={(page) => fetchVouchers(page)}
                headers={["ID", "Mã Voucher", "Giảm giá", "Ngày bắt đầu", "Ngày kết thúc", "Trạng thái", "Hành động"]}
                renderRow={(item) => (
                    <>
                        <td className="px-6 py-4 text-center font-mono text-xs text-gray-500">{item.id}</td>
                        <td className="px-6 py-4">
                            <span className="font-bold text-white text-base tracking-wide">{item.code}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-success font-bold">
                            {item.discount_percent}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                            {formatDate(item.start_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                            {formatDate(item.end_date)}
                        </td>

                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.is_active
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                {item.is_active ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => { setSelectedVoucher(item); setIsModalOpen(true); }}
                                    className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                                    title="Sửa"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteVoucher(item.id, item.code)}
                                    className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-colors"
                                    title="Xóa"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </td>
                    </>
                )}
            />

            <VoucherFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveVoucher}
                editData={selectedVoucher}
            />
        </div>
    );
};

export default VoucherManagement;
