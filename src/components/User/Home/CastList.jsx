import React, { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import SummaryApi from "../../../common";
import { getRoleName } from "../../../utils/helper";

const CastList = () => {
  const [peoples, setPeoples] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPeoples = async () => {
      try {
        // Giới hạn lấy 12 người để vừa đủ hiển thị và scroll
        const response = await fetch(
          `${SummaryApi.getPeoples.url}?page=1&size=12`,
          {
            method: SummaryApi.getPeoples.method,
          }
        );
        const result = await response.json();

        if (result.success) {
          setPeoples(result.data.items);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách diễn viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeoples();
  }, []);

  // Hàm xử lý cuộn danh sách
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!loading && peoples.length === 0) return null;

  return (
    <section className="py-12 bg-surface-dark/10 w-full border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-primary pl-4 uppercase tracking-wide">
            Nghệ sĩ nổi bật
          </h2>

          {/* Nút điều hướng (Chỉ hiện trên Desktop nếu cần thiết) */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-white/5 hover:bg-white/20 hover:text-primary transition-all border border-white/10"
            >
              <MdChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-white/5 hover:bg-white/20 hover:text-primary transition-all border border-white/10"
            >
              <MdChevronRight className="text-2xl" />
            </button>
          </div>
        </div>

        {/* List Container */}
        <div className="relative group">
          {loading ? (
            // Skeleton Loading
            <div className="flex gap-8 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 min-w-[120px] animate-pulse"
                >
                  <div className="size-24 rounded-full bg-white/5"></div>
                  <div className="w-20 h-4 bg-white/5 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            // Scrollable List
            <div
              ref={scrollRef}
              className="flex overflow-x-auto no-scrollbar gap-8 pb-4 snap-x scroll-smooth"
            >
              {peoples.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col items-center gap-3 min-w-[120px] snap-start group/item cursor-pointer"
                >
                  {/* Avatar Container */}
                  <div className="size-24 md:size-28 rounded-full bg-surface-dark border-2 border-white/10 overflow-hidden relative shadow-lg shadow-black/30 group-hover/item:border-primary transition-colors duration-300">
                    <img
                      src={person.image_url || "https://placehold.co/150x150"}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h4 className="text-white font-medium text-sm md:text-base group-hover/item:text-primary transition-colors truncate max-w-[140px]">
                      {person.name}
                    </h4>
                    <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                      {getRoleName(person.person_type)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mũi tên mờ 2 bên để báo hiệu có thể cuộn (Optional UI Enhancement) */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-background-dark to-transparent pointer-events-none md:hidden"></div>
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-background-dark to-transparent pointer-events-none md:hidden"></div>
        </div>
      </div>
    </section>
  );
};

export default CastList;
