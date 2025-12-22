import React from "react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
}) => {
  return (
    <div className={`border-b border-white/5 ${className}`}>
      <div className="relative w-full md:w-80">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
          search
        </span>
        <input
          className="w-full bg-surface-dark/70 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all"
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
