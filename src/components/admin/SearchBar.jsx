import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Tìm kiếm...', className = '' }) => {
  return (
    <div className={`border-b border-white/5 ${className}`}>
      <div className="relative w-full md:w-80">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
        <input
          className="w-full bg-surface/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-black placeholder:text-white/30 focus:border-primary outline-none transition-all"
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
