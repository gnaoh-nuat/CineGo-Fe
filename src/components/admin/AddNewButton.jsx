import React from 'react';

const AddNewButton = ({ onClick, label = 'Thêm mới', icon = 'add', className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-3 py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 ${className}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </button>
  );
};

export default AddNewButton;
