import React, { Suspense } from "react";
import { Link } from "react-router-dom";

// Import Component
const IntroSection = React.lazy(() =>
  import("../components/User/About/IntroSection")
);
const VideoSection = React.lazy(() =>
  import("../components/User/About/VideoSection")
);
const PartnerSlider = React.lazy(() =>
  import("../components/User/About/PartnerSlider")
);

const SectionLoader = () => (
  <div className="w-full h-64 bg-white/5 rounded-lg animate-pulse my-8"></div>
);

const About = () => {
  return (
    <main className="pt-28 pb-20 px-4 md:px-8 bg-background-dark min-h-screen text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-white/40 mb-6 font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">Về chúng tôi</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-16 md:mb-24 text-center md:text-left border-b border-white/5 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight animate-fade-in-up">
            Câu chuyện của{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              CineGo
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed animate-fade-in-up delay-100 mx-auto md:mx-0">
            Không chỉ là xem phim, đó là hành trình cảm xúc. Chúng tôi mang rạp
            chiếu phim đến ngay trong tầm tay bạn.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-20 md:space-y-32">
          <Suspense fallback={<SectionLoader />}>
            <section aria-label="Giới thiệu chung">
              <IntroSection />
            </section>
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <section aria-label="Video giới thiệu" className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
              <VideoSection />
            </section>
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <section aria-label="Đối tác của CineGo">
              {/* Đã xóa phần tiêu đề text-center ở đây để tránh bị lặp */}
              <PartnerSlider />
            </section>
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default About;
