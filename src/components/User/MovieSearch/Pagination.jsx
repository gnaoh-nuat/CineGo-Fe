import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getPaginationRange } from "../../../utils/helper";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const paginationRange = getPaginationRange(page, totalPages);

  const handlePage = (target) => {
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Button Prev */}
      <button
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <MdChevronLeft className="text-2xl" />
      </button>

      {/* Page Numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === "DOTS") {
          return (
            <span key={`dots-${index}`} className="text-white/50 px-1">
              ...
            </span>
          );
        }

        const isActive = page === pageNumber;
        return (
          <button
            key={pageNumber}
            onClick={() => handlePage(pageNumber)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all ${
              isActive
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "border-white/10 text-white hover:bg-white/5 hover:border-white/30"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Button Next */}
      <button
        onClick={() => handlePage(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <MdChevronRight className="text-2xl" />
      </button>
    </div>
  );
};

export default Pagination;
