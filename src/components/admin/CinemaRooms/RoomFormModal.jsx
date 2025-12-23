import React, { useEffect, useState } from "react";

const RoomFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("2D");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setType(initialData.type || "2D");
      setStatus(initialData.status || "ACTIVE");
    } else {
      setName("");
      setType("2D");
      setStatus("ACTIVE");
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-5 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">
          {initialData ? "Chỉnh sửa phòng" : "Thêm phòng"}
        </h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên phòng"
          className="w-full px-3 py-2 rounded-xl bg-background-dark/60 border border-white/10 text-white mb-3"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-background-dark/60 border border-white/10 rounded-xl px-3 py-2 text-white"
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-background-dark/60 border border-white/10 rounded-xl px-3 py-2 text-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5">
            Huỷ
          </button>
          <button
            onClick={() => onSubmit({ ...initialData, name, type, status })}
            className="px-4 py-2 rounded-xl bg-primary text-white"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomFormModal;
