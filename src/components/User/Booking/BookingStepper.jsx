import React from "react";
import { Link } from "react-router-dom";
import { MdChevronRight, MdCheck } from "react-icons/md";

const steps = [
  { id: 1, label: "Chọn suất chiếu", path: -1 }, // path -1 để quay lại
  { id: 2, label: "Chọn ghế & Dịch vụ", path: null },
  { id: 3, label: "Thanh toán", path: null },
];

const BookingStepper = ({ currentStep = 2, movieId }) => {
  return (
    <div className="w-full mb-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <MdChevronRight />
          {movieId ? (
            <Link
              to={`/booking/${movieId}`}
              className="hover:text-primary transition-colors"
            >
              Đặt vé
            </Link>
          ) : (
            <span className="text-white/30">Đặt vé</span>
          )}
          <MdChevronRight />
          <span className="text-white font-medium">Chọn ghế</span>
        </div>
      </div>

      {/* Stepper Visual */}
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center w-full max-w-3xl">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle & Label */}
                <div className="relative flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 transition-all z-10 ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(234,42,51,0.5)] scale-110"
                        : isCompleted
                        ? "bg-white border-white text-surface-dark"
                        : "bg-surface-dark border-white/20 text-white/30"
                    }`}
                  >
                    {isCompleted ? <MdCheck className="text-lg" /> : step.id}
                  </div>
                  <span
                    className={`absolute top-full mt-2 text-[10px] md:text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-white/70"
                        : "text-white/30"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 h-[2px] mx-2 md:mx-4 bg-white/10 relative">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-white transition-all duration-500 ${
                        isCompleted ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStepper;
