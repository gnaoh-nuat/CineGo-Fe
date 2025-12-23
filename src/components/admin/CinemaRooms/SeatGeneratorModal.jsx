import React, { useState } from "react";

const SeatGeneratorModal = ({
  isOpen,
  onClose,
  onGenerate,
  defaultRows = 8,
  defaultCols = 10,
}) => {
  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(defaultCols);
  const [type, setType] = useState("STANDARD");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-5 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Sinh ghế hàng loạt</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            min={1}
            className="px-3 py-2 rounded-xl bg-background-dark/60 border border-white/10 text-white"
            placeholder="Số hàng"
          />
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            min={1}
            className="px-3 py-2 rounded-xl bg-background-dark/60 border border-white/10 text-white"
            placeholder="Số cột"
          />
        </div>

        <div className="mt-3">
          <label className="text-xs text-white/60">Loại ghế</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-2 bg-background-dark/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
          >
            <option value="STANDARD">Standard</option>
            <option value="VIP">VIP</option>
            <option value="COUPLE">Couple</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5">
            Huỷ
          </button>
          <button
            onClick={() => onGenerate({ rows, cols, type })}
            className="px-4 py-2 rounded-xl bg-primary text-white"
          >
            Sinh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatGeneratorModal;
