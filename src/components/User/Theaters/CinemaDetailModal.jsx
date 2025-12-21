import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdLocationOn,
  MdTheaters,
  MdOutlineGridOn,
  MdInfoOutline,
} from "react-icons/md";
import SummaryApi from "../../../common";
import { getPrimaryPoster } from "../../../utils/helper";

const CinemaDetailModal = ({ cinemaId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [cinema, setCinema] = useState(null);
  const [rooms] = useState([]);

  useEffect(() => {
    if (!cinemaId) return;

    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const cinemaRes = await fetch(
          `${SummaryApi.getCinemaDetail.url}/${cinemaId}`,
          {
            method: SummaryApi.getCinemaDetail.method,
            signal: controller.signal,
            headers: authHeaders,
          }
        );

        const cinemaJson = await cinemaRes.json();

        if (cinemaJson?.success) {
          setCinema(cinemaJson.data?.cinema || cinemaJson.data || null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Không tải được thông tin rạp", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    return () => controller.abort();
  }, [cinemaId]);

  if (!cinemaId) return null;

  const cover = getPrimaryPoster(cinema?.image_urls);
  const provinceLabel = cinema?.Province?.name || "Đang cập nhật";
  const roomTitle = "Thông tin phòng đang được cập nhật";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 border border-white/10"
          aria-label="Đóng"
        >
          <MdClose />
        </button>

        <div className="relative h-56">
          <img
            src={cover}
            alt={cinema?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
          <div className="absolute left-5 bottom-5">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/80 text-white text-xs font-bold uppercase tracking-wide mb-2">
              {provinceLabel}
            </div>
            <h2 className="text-2xl md:text-3xl font-black drop-shadow">
              {cinema?.name || "Tên rạp"}
            </h2>
            <p className="flex items-center gap-2 text-white/80 mt-1 text-sm">
              <MdLocationOn className="text-primary text-lg" />
              <span>{cinema?.address || "Đang cập nhật địa chỉ"}</span>
            </p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-white/60 uppercase tracking-[0.14em] font-semibold">
              <MdTheaters className="text-primary text-lg" />
              Thông tin rạp
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/80 text-sm leading-relaxed">
              {cinema?.description ||
                "Rạp CineGo mang đến trải nghiệm âm thanh và hình ảnh chuẩn điện ảnh, không gian hiện đại cùng vị trí thuận tiện cho việc di chuyển."}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-white/60 uppercase tracking-[0.14em] font-semibold mb-3">
              <MdOutlineGridOn className="text-primary text-lg" />
              Phòng chiếu
            </div>
            {loading ? (
              <div className="animate-pulse text-white/60">Đang tải...</div>
            ) : (
              <div className="text-white/50 text-sm flex items-center gap-2">
                <MdInfoOutline />
                {roomTitle}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaDetailModal;
