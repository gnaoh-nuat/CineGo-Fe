import React from "react";
import HeroSlider from "../components/User/Home/HeroSlider";
import TrailerList from "../components/User/Home/TrailerList";
import MovieList from "../components/User/Home/MovieList";
import PromotionBanner from "../components/User/Home/PromotionBanner";
import CastList from "../components/User/Home/CastList";
import MembershipSection from "../components/User/Home/MembershipSection";

const Home = () => {
  return (
    // Thêm 'bg-background-dark' và 'min-h-screen'
    <div className="flex-grow bg-background-dark min-h-screen text-white">
      <HeroSlider />
      <TrailerList />
      <MovieList
        title="Phim đang chiếu"
        params={{ status: "NOW_PLAYING", size: 6 }}
      />
      <PromotionBanner />
      <MovieList
        title="Phim sắp chiếu"
        params={{ status: "COMING_SOON", size: 6 }}
      />
      <CastList />
      <MembershipSection />
    </div>
  );
};

export default Home;
