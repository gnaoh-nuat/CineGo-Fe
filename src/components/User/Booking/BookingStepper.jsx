import React from "react";
import { Link } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";

const steps = [
  { id: 1, label: "Suất chiếu" },
  { id: 2, label: "Chọn ghế" },
  { id: 3, label: "Thanh toán" },
];

const BookingStepper = ({
  currentStep = 2,
  movieId,
  seatId,
  seatState,
  title,
}) => {
  const heading =
    title || (currentStep === 3 ? "Thanh toán" : "Chọn ghế và dịch vụ");

  return (
    <div className="w-full mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Trang chủ
        </Link>
        <MdChevronRight className="text-xs" />
        {movieId ? (
          <Link
            to={`/booking/${movieId}`}
            className="hover:text-primary transition-colors"
          >
            Chọn suất
          </Link>
        ) : (
          <span className="text-white/30 cursor-default">Chọn suất</span>
        )}
        {currentStep >= 2 && (
          <>
            <MdChevronRight className="text-xs" />
            {seatId ? (
              <Link
                to={`/seat/${seatId}`}
                state={seatState}
                className="hover:text-primary transition-colors"
              >
                Chọn ghế & Dịch vụ
              </Link>
            ) : (
              <span className="text-white/30 cursor-default">
                Chọn ghế & Dịch vụ
              </span>
            )}
          </>
        )}
        {currentStep === 3 && (
          <>
            <MdChevronRight className="text-xs" />
            <span className="text-white font-medium">Thanh toán</span>
          </>
        )}
      </div>

      {/* Stepper Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white hidden md:block">
          {heading}
        </h1>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isPassed = step.id < currentStep;

            // Styles
            let circleClass =
              "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ";
            let textClass = "text-sm font-medium transition-colors ";

            if (isActive) {
              circleClass += "bg-white text-background-dark scale-110";
              textClass += "text-white";
            } else if (isPassed) {
              circleClass += "bg-primary text-white";
              textClass += "text-white/60";
            } else {
              circleClass += "bg-white/10 text-white/50";
              textClass += "text-white/30";
            }

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <span className={circleClass}>{step.id}</span>
                  <span className={textClass}>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-8 h-px bg-white/10 mx-1" />
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
