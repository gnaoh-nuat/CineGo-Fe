import React, { useEffect, useState, useRef } from 'react';
import MovieTable from '@/components/admin/MovieTable';
import SearchBar from '@/components/admin/SearchBar';
import AddNewButton from '@/components/admin/AddNewButton';
import UserFormModal from '@/components/admin/UserFormModal';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 0,
        totalItems: 0
    });

    // Fetch users from server
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            let url = `${SummaryApi.getUsers.url}?page=${page}&size=${pagination.size}`;

            const response = await authenticatedFetch(url);
            const result = await response.json();

            if (result.success) {
                setUsers(result.data.items);
                setPagination({
                    page: result.data.page,
                    size: result.data.size,
                    totalPages: result.data.totalPages,
                    totalItems: result.data.totalItems
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUsers(1);
    }, []);

    // Handle Save (Create/Update)
    const handleSaveUser = async (formData) => {
        try {
            const isEdit = !!selectedUser;

            const url = isEdit
                ? `${SummaryApi.getUsers.url}/${selectedUser.id}`
                : SummaryApi.createUser.url;

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
                fetchUsers(pagination.page);
            } else {
                alert('Thao tác thất bại: ' + result.message);
            }
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
            alert('Không thể kết nối đến server.');
        }
    };

    // Handle Delete
    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}"?`)) return;

        try {
            const response = await authenticatedFetch(`${SummaryApi.deleteUser.url}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (response.ok || result.success) {
                alert('Đã xóa người dùng thành công!');
                fetchUsers(pagination.page);
            } else {
                alert('Xóa thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            alert('Lỗi hệ thống khi xóa.');
        }
    };

    return (
        <div className="mx-auto max-w-[96rem] space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Người dùng</h2>

                <div className="flex items-center gap-2">
                    <AddNewButton
                        onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                        label="Thêm người dùng"
                    />
                </div>
            </div>



            {/* Table Section */}
            <MovieTable
                items={users}
                loading={loading}
                pagination={pagination}
                fetchMovies={(page) => fetchUsers(page)}
                headers={["ID", "Họ tên", "Email", "SĐT", "Giới tính", "Ngày sinh", "Vai trò", "Hành động"]}
                renderRow={(user) => (
                    <>
                        <td className="px-6 py-4 text-center font-mono text-xs text-gray-500">{user.id}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                {user.image_url ? (
                                    <img
                                        src={user.image_url}
                                        alt={user.full_name}
                                        className="size-8 rounded-full object-cover border border-white/10"
                                    />
                                ) : (
                                    <div className="size-8 rounded-full bg-surface-light flex items-center justify-center text-xs font-bold text-white bg-primary/20 text-primary">
                                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                                <h4 className="font-bold text-white text-sm hover:text-primary transition-colors">
                                    {user.full_name || "N/A"}
                                </h4>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{user.phone || "---"}</td>

                        <td className="px-6 py-4 text-sm text-gray-400">
                            {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : '---'}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-400">
                            {user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : '---'}
                        </td>

                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${user.role === 'ADMIN'
                                ? 'bg-purple/10 text-purple border-purple/20'
                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                {user.role}
                            </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                    className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                                    title="Sửa"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id, user.full_name)}
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

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                editData={selectedUser}
            />
        </div>
    );
};

export default UserManagement;
