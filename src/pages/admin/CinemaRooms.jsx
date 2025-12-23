import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";
import { authenticatedFetch } from "../../utils/helper";
import CinemaRoomFilter from "../../components/admin/CinemaRooms/CinemaRoomFilter";
import RoomList from "../../components/admin/CinemaRooms/RoomList";
import RoomSeatMap from "../../components/admin/CinemaRooms/RoomSeatMap";
import RoomFormModal from "../../components/admin/CinemaRooms/RoomFormModal";
import SeatGeneratorModal from "../../components/admin/CinemaRooms/SeatGeneratorModal";
import SeatTypeModal from "../../components/admin/CinemaRooms/SeatTypeModal";
import { toast } from "react-toastify";
import { seatLabel } from "../../utils/helper";

const CinemaRooms = () => {
  // --- States ---
  const [provinces, setProvinces] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [seats, setSeats] = useState([]);

  // Selections
  const [provinceId, setProvinceId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Loading & UI States
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [seatGenOpen, setSeatGenOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingSeat, setEditingSeat] = useState(null);

  // 1. Fetch Provinces (Public/Admin)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await authenticatedFetch(
          `${SummaryApi.getProvinces.url}?page=1&size=100`
        );
        const data = await res.json();
        if (data?.success) setProvinces(data.data.items || []);
      } catch (err) {
        console.error("Lỗi tải tỉnh thành:", err);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Cinemas (Theo Province)
  useEffect(() => {
    if (!provinceId) {
      setCinemas([]);
      setCinemaId("");
      return;
    }
    const fetchCinemas = async () => {
      try {
        const res = await authenticatedFetch(
          `${SummaryApi.getCinemas.url}?page=1&size=100&province_id=${provinceId}`
        );
        const data = await res.json();
        if (data?.success) setCinemas(data.data.items || []);
        else setCinemas([]);
      } catch (err) {
        console.error("Lỗi tải rạp:", err);
      }
    };
    fetchCinemas();
  }, [provinceId]);

  // 3. Fetch Rooms (Theo Cinema) - Cần Auth
  const fetchRooms = async () => {
    if (!cinemaId) return;
    setLoadingRooms(true);
    try {
      // API: /cinema-rooms?cinema_id=...
      const res = await authenticatedFetch(
        `${SummaryApi.getCinemaRooms.url}?page=1&size=100&cinema_id=${cinemaId}`
      );
      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết, vui lòng đăng nhập lại");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (data?.success) {
        setRooms(data.data.items || []);
        // Nếu phòng đang chọn không còn trong danh sách mới, reset selection
        if (
          selectedRoom &&
          !data.data.items.find((r) => r.id === selectedRoom.id)
        ) {
          setSelectedRoom(null);
        }
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error("Lỗi tải phòng chiếu:", err);
      toast.error("Không thể tải danh sách phòng");
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (cinemaId) {
      fetchRooms();
      setSelectedRoom(null);
    } else {
      setRooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinemaId]);

  // 4. Fetch Seats (Theo Room) - Cần Auth
  const fetchSeats = async (roomId) => {
    if (!roomId) return;
    setLoadingSeats(true);
    try {
      const res = await authenticatedFetch(
        `${SummaryApi.getSeatsByRoom.url}/${roomId}`
      );
      const data = await res.json();
      if (data?.success) {
        const normalized = (data.data.items || []).map((s) => ({
          ...s,
          // Chuẩn hóa type về UPPERCASE để render đúng màu/icon
          type: (s?.type || s?.seat_type || s?.seatType || "STANDARD")
            .toString()
            .toUpperCase(),
        }));
        setSeats(normalized);
      } else {
        setSeats([]);
      }
    } catch (err) {
      console.error("Lỗi tải ghế:", err);
      toast.error("Không thể tải sơ đồ ghế");
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    if (selectedRoom) fetchSeats(selectedRoom.id);
    else setSeats([]);
  }, [selectedRoom]);

  // --- Handlers ---

  const handleSaveRoom = async (roomData) => {
    if (!cinemaId) return;
    try {
      const url = editingRoom
        ? `${SummaryApi.updateCinemaRoom.url}/${editingRoom.id}`
        : SummaryApi.createCinemaRoom.url;

      const method = editingRoom
        ? SummaryApi.updateCinemaRoom.method
        : SummaryApi.createCinemaRoom.method;

      const payload = editingRoom
        ? roomData
        : { ...roomData, cinema_id: Number(cinemaId) };

      const res = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        setRoomModalOpen(false);
        toast.success(
          editingRoom ? "Cập nhật phòng thành công" : "Thêm phòng thành công"
        );
        fetchRooms();
      } else {
        toast.error(data?.message || "Lưu thất bại");
      }
    } catch (err) {
      console.error("Save room error", err);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
    try {
      const res = await authenticatedFetch(
        `${SummaryApi.deleteCinemaRoom.url}/${id}`,
        {
          method: SummaryApi.deleteCinemaRoom.method,
        }
      );
      const data = await res.json();
      if (data?.success) {
        toast.success("Xóa phòng thành công");
        setRooms((prev) => prev.filter((r) => r.id !== id));
        if (selectedRoom?.id === id) setSelectedRoom(null);
      } else {
        toast.error(data?.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Delete room error", err);
    }
  };

  const handleGenerateSeats = async ({ rows, cols, type }) => {
    if (!selectedRoom) return;
    // Backend đang có thể ghi đè ghế cũ khi sinh lại, cảnh báo trước
    if (
      seats.length > 0 &&
      !window.confirm(
        "Sinh thêm có thể ghi đè sơ đồ ghế cũ (tuỳ backend). Tiếp tục?"
      )
    ) {
      return;
    }
    try {
      // API Generate: POST /seats/room/{id} body { rowCount, colCount }
      const res = await authenticatedFetch(
        `${SummaryApi.generateSeats.url}/${selectedRoom.id}`,
        {
          method: SummaryApi.generateSeats.method,
          body: JSON.stringify({
            rowCount: rows,
            colCount: cols,
            type: (type || "STANDARD").toUpperCase(),
          }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        setSeatGenOpen(false);
        toast.success(`Đã sinh ${data.data?.totalSeats || ""} ghế`);
        fetchSeats(selectedRoom.id);
      } else {
        toast.error(data?.message || "Tạo ghế thất bại");
      }
    } catch (err) {
      console.error("Generate seats error", err);
    }
  };

  const handleUpdateSeatType = (seat) => {
    if (!seat?.id) return;
    setEditingSeat({ ...seat, label: seatLabel(seat) });
  };

  const handleSubmitSeatType = async (type) => {
    if (!selectedRoom || !editingSeat?.id) return;
    const normalizedType = (type || "STANDARD").toUpperCase();
    const allowed = ["STANDARD", "VIP", "COUPLE"];
    if (!allowed.includes(normalizedType)) {
      toast.error("Loại ghế không hợp lệ");
      return;
    }

    try {
      const res = await authenticatedFetch(
        `${SummaryApi.updateSeatsBatch.url}/${selectedRoom.id}`,
        {
          method: SummaryApi.updateSeatsBatch.method,
          body: JSON.stringify({
            seats: [{ id: editingSeat.id, type: normalizedType }],
          }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        toast.success("Đã cập nhật loại ghế");
        setSeats((prev) =>
          prev.map((s) =>
            s.id === editingSeat.id ? { ...s, type: normalizedType } : s
          )
        );
        setEditingSeat(null);
      } else {
        toast.error(data?.message || "Cập nhật ghế thất bại");
      }
    } catch (err) {
      console.error("Update seat type error", err);
      toast.error("Cập nhật ghế thất bại");
    }
  };

  const handleDeleteAllSeats = async () => {
    if (!selectedRoom || seats.length === 0) return;
    if (
      !window.confirm(
        "Cảnh báo: Hành động này sẽ xóa TOÀN BỘ ghế trong phòng này!"
      )
    )
      return;

    try {
      // API Delete Batch yêu cầu danh sách seatIds
      const seatIds = seats.map((s) => s.id);
      const res = await authenticatedFetch(
        `${SummaryApi.deleteSeatsBatch.url}/${selectedRoom.id}`,
        {
          method: SummaryApi.deleteSeatsBatch.method,
          body: JSON.stringify({ seatIds }),
        }
      );

      const data = await res.json();
      if (data?.success) {
        toast.success("Đã xóa toàn bộ ghế");
        setSeats([]);
      } else {
        toast.error("Xóa ghế thất bại");
      }
    } catch (err) {
      console.error("Delete seats error", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] w-full bg-background-dark text-white font-display overflow-hidden">
      {/* Header Page */}
      <div className="h-16 shrink-0 border-b border-white/10 bg-background-dark/90 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/50 font-bold mb-1">
            Quản lý hệ thống
          </p>
          <h1 className="text-xl font-bold text-white">Phòng chiếu & Ghế</h1>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {/* Top Filter */}
        <CinemaRoomFilter
          provinces={provinces}
          cinemas={cinemas}
          selectedProvinceId={provinceId}
          selectedCinemaId={cinemaId}
          onSelectProvince={setProvinceId}
          onSelectCinema={setCinemaId}
        />

        {/* Main Grid Content */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Left Column: Room List */}
          <div className="col-span-12 lg:col-span-4 h-full min-h-0 flex flex-col">
            <RoomList
              rooms={rooms}
              loading={loadingRooms}
              selectedRoomId={selectedRoom?.id}
              onSelectRoom={setSelectedRoom}
              onAddRoom={() => {
                if (!cinemaId) {
                  toast.warn("Vui lòng chọn Rạp trước");
                  return;
                }
                setEditingRoom(null);
                setRoomModalOpen(true);
              }}
              onEditRoom={(r) => {
                setEditingRoom(r);
                setRoomModalOpen(true);
              }}
              onDeleteRoom={handleDeleteRoom}
            />
          </div>

          {/* Right Column: Seat Map */}
          <div className="col-span-12 lg:col-span-8 h-full min-h-0 flex flex-col">
            <RoomSeatMap
              seats={seats}
              roomInfo={selectedRoom}
              loading={loadingSeats}
              onGenerateSeats={() => setSeatGenOpen(true)}
              onDeleteAllSeats={handleDeleteAllSeats}
              onUpdateSeatType={handleUpdateSeatType}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <RoomFormModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        onSubmit={handleSaveRoom}
        initialData={editingRoom}
      />

      <SeatGeneratorModal
        isOpen={seatGenOpen}
        onClose={() => setSeatGenOpen(false)}
        onGenerate={handleGenerateSeats}
      />

      <SeatTypeModal
        isOpen={!!editingSeat}
        seat={editingSeat}
        onClose={() => setEditingSeat(null)}
        onSubmit={handleSubmitSeatType}
      />
    </div>
  );
};

export default CinemaRooms;
