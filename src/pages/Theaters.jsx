import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import TheaterHero from "../components/User/Theaters/TheaterHero";
import TheaterSidebar from "../components/User/Theaters/TheaterSidebar";
import CinemaDetail from "../components/User/Theaters/CinemaDetail";
import { MdLoyalty } from "react-icons/md";

const Theaters = () => {
  // Data States
  const [provinces, setProvinces] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [cinemaDetail, setCinemaDetail] = useState(null);

  // Selection States
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);

  // Loading States
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 1. Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await fetch(
          `${SummaryApi.getProvinces.url}?page=1&size=100`,
          {
            method: SummaryApi.getProvinces.method,
          }
        );
        const json = await res.json();
        const items = json.data?.items || [];
        setProvinces(items);

        // Auto select first province (VD: Ha Noi / HCM)
        if (items.length > 0) {
          setSelectedProvinceId(items[0].id);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Cinemas when Province changes
  useEffect(() => {
    if (!selectedProvinceId) return;

    const fetchCinemas = async () => {
      setLoadingCinemas(true);
      setCinemas([]); // Clear list cũ để hiện loading
      try {
        const res = await fetch(
          `${SummaryApi.getCinemas.url}?page=1&size=100&province_id=${selectedProvinceId}`,
          {
            method: SummaryApi.getCinemas.method,
          }
        );
        const json = await res.json();
        const items = json.data?.items || [];
        setCinemas(items);

        // Auto select first cinema
        if (items.length > 0) {
          setSelectedCinemaId(items[0].id);
        } else {
          setSelectedCinemaId(null);
          setCinemaDetail(null);
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      } finally {
        setLoadingCinemas(false);
      }
    };
    fetchCinemas();
  }, [selectedProvinceId]);

  // 3. Fetch Cinema Detail when Cinema changes
  useEffect(() => {
    if (!selectedCinemaId) return;

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const res = await fetch(
          `${SummaryApi.getCinemaDetail.url}/${selectedCinemaId}`,
          {
            method: SummaryApi.getCinemaDetail.method,
          }
        );
        const json = await res.json();
        setCinemaDetail(json.data?.cinema || json.data || null);
      } catch (error) {
        console.error("Error fetching cinema detail:", error);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [selectedCinemaId]);

  return (
    <div className="bg-background-dark min-h-screen font-display text-white flex flex-col">
      <TheaterHero />

      {/* Main Content: Fix height to screen size for better scrolling */}
      <section className="flex-1 bg-background-dark py-6 lg:py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[calc(100vh-150px)] min-h-[600px] flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar: Province & Cinema List */}
          <div className="w-full lg:w-[400px] shrink-0 h-full overflow-hidden">
            <TheaterSidebar
              provinces={provinces}
              selectedProvinceId={selectedProvinceId}
              onSelectProvince={setSelectedProvinceId}
              cinemas={cinemas}
              selectedCinemaId={selectedCinemaId}
              onSelectCinema={setSelectedCinemaId}
              loadingProvinces={loadingProvinces}
              loadingCinemas={loadingCinemas}
            />
          </div>

          {/* Right Content: Cinema Details */}
          <div className="w-full lg:flex-1 h-full overflow-hidden hidden lg:block">
            <CinemaDetail cinema={cinemaDetail} loading={loadingDetail} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Theaters;
