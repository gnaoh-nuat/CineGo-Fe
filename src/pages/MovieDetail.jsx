import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";

// Components
import CastList from "../components/User/MovieDetail/CastList";
import CrewList from "../components/User/MovieDetail/CrewList";
import HeroBackdrop from "../components/User/MovieDetail/HeroBackdrop";
import MovieHeading from "../components/User/MovieDetail/MovieHeading";
import MovieOverview from "../components/User/MovieDetail/MovieOverview";
import PosterCard from "../components/User/MovieDetail/PosterCard";
import RelatedMovies from "../components/User/MovieDetail/RelatedMovies";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy chi tiết phim
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${SummaryApi.getMovieDetail.url}/${id}`, {
          method: SummaryApi.getMovieDetail.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (result.success) {
          setMovie(result.data.movie);
        } else {
          console.error("Không tìm thấy phim");
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
    window.scrollTo(0, 0);
  }, [id]);

  // --- RENDER ---

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="w-full min-h-screen bg-background-dark flex items-center justify-center text-white text-xl">
        Không tìm thấy thông tin phim.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background-dark font-display text-white pb-10">
      {/* 1. Ảnh nền */}
      <HeroBackdrop movie={movie} />

      {/* Wrapper chính */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 -mt-80 mb-20">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* 2. Cột trái: Poster & Trailer */}
          <PosterCard movie={movie} />

          {/* 3. Cột phải: Thông tin chi tiết */}
          <div className="flex-grow pt-4 lg:pt-16 text-center lg:text-left">
            <MovieHeading movie={movie} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
              {/* Overview */}
              <div className="xl:col-span-2 space-y-6">
                <MovieOverview movie={movie} />
              </div>
            </div>

            {/* Phần ngăn cách border-t chứa Crew và Cast */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col gap-12">
                {/* Đạo diễn */}
                <CrewList director={movie.director} />

                {/* Diễn viên */}
                <CastList actors={movie.actors} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section phim tương tự */}
      <RelatedMovies currentMovieId={movie.id} genres={movie.genres} />
    </div>
  );
};

export default MovieDetail;
