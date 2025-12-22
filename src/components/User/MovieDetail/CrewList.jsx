import React from "react";
import { MdVideocam } from "react-icons/md";
import { getRoleName } from "../../../utils/helper";

const CrewList = ({ director }) => {
  if (!director) return null;

  return (
    <div className="w-full max-w-lg">
      <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
        <MdVideocam className="text-sm" /> {getRoleName("DIRECTOR")}
      </h4>

      <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-5 flex items-center gap-6 hover:bg-surface-dark hover:border-white/10 transition-all group">
        <div className="size-20 lg:size-24 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-lg group-hover:border-primary group-hover:shadow-primary/20 transition-all">
          <img
            src={director.image_url || "https://placehold.co/150x150"}
            alt={director.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow text-left">
          <p className="text-white font-bold text-xl lg:text-2xl leading-tight group-hover:text-primary transition-colors">
            {director.name}
          </p>
          <p className="text-white/50 text-sm mt-1">
            {getRoleName(director.person_type || "DIRECTOR")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrewList;
