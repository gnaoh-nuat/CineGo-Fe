import React, { useMemo } from "react";
import { MdEventSeat, MdFastfood, MdReceiptLong } from "react-icons/md";
import { formatCurrency, seatLabel } from "../../../utils/helper";

const TransactionDetail = ({
  seats = [],
  foods = [],
  selectedFoods = {},
  seatTotal = 0,
  foodTotal = 0,
}) => {
  const seatCount = seats.length;

  const seatPriceText = useMemo(() => {
    if (!seatCount || !seatTotal) return "";
    const unit = seatTotal / seatCount;
    if (Number.isFinite(unit)) return `${formatCurrency(unit)} / vé`;
    return "";
  }, [seatCount, seatTotal]);

  const seatLabels = useMemo(
    () =>
      seatCount
        ? seats
            .map((seat) => seatLabel(seat))
            .filter(Boolean)
            .join(", ")
        : "Chưa chọn ghế",
    [seatCount, seats]
  );

  const foodLines = useMemo(
    () =>
      Object.entries(selectedFoods || {})
        .filter(([, qty]) => qty > 0)
        .map(([id, quantity]) => {
          const food = foods.find((f) => String(f.id) === String(id));
          const price = Number(food?.price || 0);
          return {
            id,
            name: food?.name || `Combo #${id}`,
            description: food?.description,
            quantity,
            unitPrice: price,
            total: price * quantity,
          };
        }),
    [foods, selectedFoods]
  );

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <MdReceiptLong />
        </div>
        <h3 className="text-lg font-bold text-white">Chi tiết giao dịch</h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 last:pb-0 last:border-0">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                <MdEventSeat />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Vé xem phim</p>
                <p className="text-sm text-white/50 mt-1">
                  Số lượng: {seatCount.toString().padStart(2, "0")} • Vị trí:{" "}
                  {seatLabels}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white text-lg">
                {formatCurrency(seatTotal)}
              </p>
              {seatPriceText ? (
                <p className="text-sm text-white/50">{seatPriceText}</p>
              ) : null}
            </div>
          </div>

          {foodLines.map((food) => (
            <div
              key={food.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 last:pb-0 last:border-0"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 rounded bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                  <MdFastfood />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{food.name}</p>
                  <p className="text-sm text-white/50 mt-1">
                    Số lượng: {food.quantity.toString().padStart(2, "0")} •{" "}
                    {food.description || "Combo bắp nước"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-lg">
                  {formatCurrency(food.total)}
                </p>
                <p className="text-sm text-white/50">
                  {formatCurrency(food.unitPrice)} / combo
                </p>
              </div>
            </div>
          ))}

          {!foodLines.length ? (
            <div className="text-white/50 text-sm">
              Không có combo được chọn
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-4">
            <span className="text-white/70 text-sm">Tổng dịch vụ</span>
            <span className="text-white font-semibold">
              {formatCurrency(seatTotal + foodTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
