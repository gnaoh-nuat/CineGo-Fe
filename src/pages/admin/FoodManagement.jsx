import React, { useEffect, useState } from 'react';
import MovieTable from '@/components/admin/MovieTable';
import AddNewButton from '@/components/admin/AddNewButton';
import FoodFormModal from '@/components/admin/FoodFormModal';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const FoodManagement = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 0,
        totalItems: 0
    });

    const fetchFoods = async (page = 1) => {
        setLoading(true);
        try {
            let url = `${SummaryApi.getFoods.url}?page=${page}&size=${pagination.size}`;

            const response = await authenticatedFetch(url);
            const result = await response.json();

            if (result.success) {
                setFoods(result.data.items);
                setPagination({
                    page: result.data.page,
                    size: result.data.size,
                    totalPages: result.data.totalPages,
                    totalItems: result.data.totalItems
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách đồ ăn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods(1);
    }, []);

    const handleSaveFood = async (formData) => {
        try {
            const isEdit = !!selectedFood;
            const url = isEdit
                ? `${SummaryApi.updateFood.url}/${selectedFood.id}`
                : SummaryApi.createFood.url;

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
                fetchFoods(pagination.page);
            } else {
                alert('Thao tác thất bại: ' + result.message);
            }
        } catch (error) {
            console.error("Lỗi khi lưu đồ ăn:", error);
            alert('Không thể kết nối đến server.');
        }
    };

    const handleDeleteFood = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) return;

        try {
            const response = await authenticatedFetch(`${SummaryApi.deleteFood.url}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (response.ok || result.success) {
                alert('Đã xóa đồ ăn thành công!');
                fetchFoods(pagination.page);
            } else {
                alert('Xóa thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa đồ ăn:', error);
            alert('Lỗi hệ thống khi xóa.');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="mx-auto max-w-[96rem] space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Đồ ăn & Thức uống</h2>

                <div className="flex items-center gap-2">
                    <AddNewButton
                        onClick={() => { setSelectedFood(null); setIsModalOpen(true); }}
                        label="Thêm Đồ ăn"
                    />
                </div>
            </div>

            {/* Table Section */}
            <MovieTable
                items={foods}
                loading={loading}
                pagination={pagination}
                fetchMovies={(page) => fetchFoods(page)}
                headers={["ID", "Tên món", "Giá bán", "Hành động"]}
                renderRow={(item) => (
                    <>
                        <td className="px-6 py-4 text-center font-mono text-xs text-gray-500">{item.id}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-12 w-16 rounded bg-surface bg-center bg-cover border border-white/10"
                                    style={{ backgroundImage: `url(${item.image_url})` }}
                                ></div>
                                <span className="font-bold text-white text-base tracking-wide">{item.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white font-bold">
                            {formatPrice(item.price)}
                        </td>

                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => { setSelectedFood(item); setIsModalOpen(true); }}
                                    className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                                    title="Sửa"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteFood(item.id, item.name)}
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

            <FoodFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFood}
                editData={selectedFood}
            />
        </div>
    );
};

export default FoodManagement;
