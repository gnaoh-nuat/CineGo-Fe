import React from "react";
import { MdArrowBack, MdArrowForward, MdGroups } from "react-icons/md";
import { getRoleName } from "../../../utils/helper";

const CastList = ({ actors }) => {
  if (!actors || actors.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <MdGroups className="text-sm" /> {getRoleName("ACTOR")}
        </h4>
        {/* Giữ lại UI nút điều hướng nếu sau này muốn làm slider, hiện tại chỉ để trang trí */}
        <div className="flex gap-2 opacity-50 pointer-events-none">
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50">
            <MdArrowBack className="text-base" />
          </button>
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50">
            <MdArrowForward className="text-base" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {actors.map((actor) => (
          <div key={actor.id} className="group relative">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-dark border border-white/5 relative mb-3">
              <img
                src={actor.image_url || "https://placehold.co/150x150"}
                alt={actor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="text-left px-1">
              <p className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">
                {actor.name}
              </p>
              <p className="text-white/40 text-xs truncate">
                {getRoleName(actor.person_type || "ACTOR")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastList;
