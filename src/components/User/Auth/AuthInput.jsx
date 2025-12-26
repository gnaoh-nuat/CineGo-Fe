import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const AuthInput = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  rightElement, // Dùng cho link "Quên mật khẩu?" ở phía trên label
  required = true,
  helperText,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  return (
    <div className="space-y-2">
      {/* Label & Right Element (Link Forgot Password) */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white/80" htmlFor={id}>
          {label}
        </label>
        {rightElement && rightElement}
      </div>

      {/* Input Container */}
      <div className="relative flex items-center w-full h-12 rounded-lg bg-white/5 border border-white/10 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden group hover:border-white/30">
        {/* Left Icon */}
        <div className="pl-4 pr-2 text-white/40 pointer-events-none group-focus-within:text-primary transition-colors">
          {icon}
        </div>

        {/* Input Field */}
        <input
          className="flex-1 h-full bg-transparent border-none text-white placeholder-white/30 text-base px-2 focus:ring-0 focus:outline-none w-full"
          id={id}
          name={name}
          // Logic: Nếu là password và đang show -> type="text", ngược lại giữ nguyên type truyền vào
          type={isPasswordType && showPassword ? "text" : type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />

        {/* Password Toggle Button (Eye Icon) */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 pl-2 text-white/40 hover:text-white focus:outline-none transition-colors cursor-pointer h-full flex items-center"
          >
            {showPassword ? (
              <MdVisibilityOff className="text-xl" />
            ) : (
              <MdVisibility className="text-xl" />
            )}
          </button>
        )}
      </div>

      {helperText ? (
        <p className="text-xs text-white/50 leading-relaxed">{helperText}</p>
      ) : null}
    </div>
  );
};

export default AuthInput;
