import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SummaryApi from "../../../common";
import {
  formatDuration,
  getGenres,
  getStatusTag,
  getYear,
} from "../../../utils/helper";

// 1. Import các icon cần thiết từ Material Design pack
import {
  MdStar,
  MdSchedule,
  MdConfirmationNumber,
  MdInfoOutline,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const HeroSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${SummaryApi.getMovies.url}?page=1&size=4`,
          {
            method: SummaryApi.getMovies.method,
          }
        );
        const result = await response.json();
        if (result.success) setMovies(result.data.items);
      } catch (error) {
        console.error("Lỗi tải slider:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const scrollToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.offsetWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    if (movies.length) scrollToSlide((currentIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    if (movies.length)
      scrollToSlide((currentIndex - 1 + movies.length) % movies.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, movies.length]);

  const handleScroll = () => {
    if (sliderRef.current) {
      const newIndex = Math.round(
        sliderRef.current.scrollLeft / sliderRef.current.offsetWidth
      );
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-background-dark">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const PLACEHOLDER_IMG = "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden group bg-background-dark text-white">
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {movies.map((movie) => {
          const posterUrl = movie.poster_urls?.[0] || PLACEHOLDER_IMG;
          const statusInfo = getStatusTag(movie.status);

          return (
            <div
              key={movie.id}
              className="min-w-full h-full relative snap-start flex"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={posterUrl}
                  alt="background"
                  className="w-full h-full object-cover blur-md scale-105 opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/40 to-transparent"></div>
              </div>

              <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 h-full flex items-center">
                <div className="flex flex-col md:flex-row items-center w-full gap-8 md:gap-16">
                  {/* Left Info */}
                  <div className="flex-1 flex flex-col gap-4 md:gap-6 text-center md:text-left pt-10 md:pt-0">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded uppercase tracking-wider w-fit mx-auto md:mx-0 ${statusInfo.classes}`}
                    >
                      {statusInfo.text}
                    </span>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-lg line-clamp-2 text-white">
                      {movie.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 text-white/90 text-sm md:text-base font-medium drop-shadow-md">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <MdStar className="text-xl" />
                        <span>N/A</span>
                      </div>
                      <span className="hidden md:inline">•</span>
                      <span>{getYear(movie.release_date)}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="truncate max-w-[200px]">
                        {getGenres(movie.genres)}
                      </span>
                      <span className="hidden md:inline">•</span>
                      <div className="flex items-center gap-1">
                        <MdSchedule className="text-lg" />
                        <span>{formatDuration(movie.duration_minutes)}</span>
                      </div>
                    </div>

                    <p className="text-white/80 text-sm md:text-lg line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-md">
                      {movie.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-transform transform hover:scale-105 shadow-lg shadow-primary/30"
                      >
                        <MdConfirmationNumber className="text-xl" />
                        Đặt Vé Ngay
                      </Link>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all"
                      >
                        <MdInfoOutline className="text-xl" />
                        Chi Tiết
                      </Link>
                    </div>
                  </div>

                  {/* Right Poster */}
                  <div className="hidden md:block flex-shrink-0 w-[280px] lg:w-[350px] relative animate-fade-in-up">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500 bg-surface-dark">
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-surface-dark/50 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all hidden md:flex z-20 group/btn"
      >
        <MdChevronLeft className="text-3xl group-hover/btn:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-surface-dark/50 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all hidden md:flex z-20 group/btn"
      >
        <MdChevronRight className="text-3xl group-hover/btn:scale-110 transition-transform" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-8 bg-primary"
                : "w-2 bg-white/40 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
