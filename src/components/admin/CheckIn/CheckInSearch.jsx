import React from "react";

const CheckInSearch = ({ value, onChange, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm font-bold text-white/60 uppercase tracking-wide">
          <span className="material-symbols-outlined text-lg">keyboard</span>
          Nhập mã vé thủ công
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <input
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder="VD: CG-123456..."
              className="block w-full px-4 py-3 bg-background-dark border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono tracking-wide transition-all group-hover:border-white/20"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !value}
            className="bg-white/5 hover:bg-primary hover:text-white text-white/80 px-5 py-3 rounded-xl font-bold border border-white/10 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined">search</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckInSearch;
