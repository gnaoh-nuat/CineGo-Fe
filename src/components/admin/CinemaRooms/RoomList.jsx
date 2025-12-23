import React from "react";

const RoomList = ({
  rooms = [],
  selectedRoomId,
  onSelectRoom,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  loading,
}) => {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header Box */}
      <div className="flex items-center justify-between bg-surface-dark p-4 rounded-xl border border-white/10 shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-xl">
              meeting_room
            </span>
          </div>
          <h3 className="font-bold text-base text-white">Danh sách Phòng</h3>
        </div>
        <button
          onClick={onAddRoom}
          className="size-9 rounded-lg bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all border border-white/5 hover:border-primary/50 text-white/60"
          title="Thêm phòng mới"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>
      </div>

      {/* List Container */}
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 shadow-inner bg-black/20">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30 gap-2">
            <span className="material-symbols-outlined text-4xl opacity-50">
              no_meeting_room
            </span>
            <p className="text-sm">Chưa có phòng nào</p>
          </div>
        ) : (
          rooms.map((r) => {
            const isSelected = selectedRoomId === r.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelectRoom(r)}
                className={`group relative p-4 rounded-xl border-l-4 transition-all cursor-pointer shadow-md ${
                  isSelected
                    ? "bg-white/[0.08] border-l-primary border-y border-r border-white/10"
                    : "bg-surface-dark border-l-transparent border border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className={`font-bold text-base ${
                      isSelected
                        ? "text-white"
                        : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {r.name}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRoom(r);
                      }}
                      className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRoom(r.id);
                      }}
                      className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-danger transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/15">
                    {r.type || "2D"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoomList;
