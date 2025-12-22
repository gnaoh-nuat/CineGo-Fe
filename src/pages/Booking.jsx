import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import BookingHero from "../components/User/Booking/BookingHero";
import DateSelector from "../components/User/Booking/DateSelector";
import CinemaList from "../components/User/Booking/CinemaList";
import { buildDateOptions } from "../utils/helper";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState({
    movie: true,
    provinces: false,
    showtimes: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [dateOptions] = useState(() => buildDateOptions(7));
  const [selectedDate, setSelectedDate] = useState(() => dateOptions[0]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const mapApiShowtimes = useCallback((rawList = []) => {
    return rawList.map((cinema) => ({
      id: cinema?.cinema_id || cinema?.id,
      cinema: {
        id: cinema?.cinema_id || cinema?.id,
        name: cinema?.cinema_name || cinema?.name,
        address: cinema?.address,
      },
      showtimes: (cinema?.showtimes || []).map((st) => ({
        id: st?.id || st?._id,
        startTime: st?.start_time || st?.startTime,
        format: st?.movie_format || st?.format || "2D",
        room: {
          id: st?.room_id || st?.roomId,
          name: st?.room_name || st?.roomName,
        },
      })),
    }));
  }, []);

  // ... (Giữ nguyên các useEffect fetch API như cũ) ...
  // Để gọn code, tôi không paste lại phần useEffect fetch, bạn giữ nguyên nhé.
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const resMovie = await fetch(`${SummaryApi.getMovieDetail.url}/${id}`, {
          method: SummaryApi.getMovieDetail.method,
        });
        const dataMovie = await resMovie.json();
        setMovie(dataMovie?.data?.movie || null);
      } catch (error) {
        console.error("Lỗi tải phim:", error);
      } finally {
        setLoading((prev) => ({ ...prev, movie: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, provinces: true }));
        const resProv = await fetch(
          `${SummaryApi.getProvinces.url}?page=1&size=50`,
          {
            method: SummaryApi.getProvinces.method,
          }
        );
        const dataProv = await resProv.json();
        const items = dataProv?.data?.items || [];
        setProvinces(items);

        if (items.length > 0) {
          const defaultProvince =
            items.find((p) => `${p.id}` === "1") || items[0];
          setSelectedProvince(defaultProvince);
        }
      } catch (error) {
        console.error("Lỗi tải tỉnh/thành:", error);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!id || !selectedDate?.value || !selectedProvince?.id) return;
      try {
        setLoading((prev) => ({ ...prev, showtimes: true }));
        const params = new URLSearchParams({
          movie_id: id,
          date: selectedDate.value,
          format: "ALL",
        });
        params.append("province_id", selectedProvince.id);
        const res = await fetch(
          `${SummaryApi.getShowtimes.url}?${params.toString()}`,
          {
            method: SummaryApi.getShowtimes.method,
          }
        );
        const data = await res.json();
        const rawList = Array.isArray(data?.data) ? data.data : [];
        setShowtimes(mapApiShowtimes(rawList));
      } catch (error) {
        console.error("Lỗi tải suất chiếu:", error);
        setShowtimes([]);
      } finally {
        setLoading((prev) => ({ ...prev, showtimes: false }));
      }
    };
    fetchShowtimes();
  }, [id, selectedDate, selectedProvince, mapApiShowtimes]);

  const handleSelectShowtime = (showtime, cinema) => {
    if (!showtime?.id) return;
    navigate(`/seat/${showtime.id}`, {
      state: {
        showtime: {
          ...showtime,
          cinemaName: cinema?.name,
          roomName: showtime?.room?.name,
          format: showtime?.format,
          startTime: showtime?.startTime,
          movieTitle: movie?.title,
          posterUrl: movie?.poster_urls?.[0],
          ageRating: movie?.age_rating,
          movieId: movie?.id,
        },
        movie,
        province: selectedProvince,
        date: selectedDate?.value,
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-background-dark text-white font-display">
      <BookingHero movie={movie} loading={loading.movie} />

      {/* UPDATE: Giảm margin-top âm để không che nội dung Hero */}
      {/* Cũ: -mt-32 md:-mt-48 */}
      {/* Mới: -mt-10 (chỉ đè nhẹ lên phần gradient dưới cùng) */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 -mt-10 space-y-8 pb-20">
        <DateSelector
          provinces={provinces}
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          dates={dateOptions}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          loading={loading.provinces}
        />

        <CinemaList
          groups={showtimes}
          loading={loading.showtimes}
          movieDuration={movie?.duration_minutes}
          onSelectShowtime={handleSelectShowtime}
        />
      </div>
    </div>
  );
};

export default Booking;
