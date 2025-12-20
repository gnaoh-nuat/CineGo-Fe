import React from "react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center font-display">
      {/* Background Image - Đã thay link mới hoạt động tốt */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        <div className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <div className="text-white/50 text-sm">{subtitle}</div>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
