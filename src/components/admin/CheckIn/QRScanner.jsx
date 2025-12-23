import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import jsQR from "jsqr";

const QRScanner = ({ onDetected, scanning, onScanningChange }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  // Hàm dọn dẹp camera triệt để
  const stopCamera = useCallback(() => {
    // Xóa timer loop
    if (rafRef.current) {
      clearTimeout(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (onScanningChange) onScanningChange(false);
  }, [onScanningChange]);

  // Dọn dẹp khi unmount
  useEffect(() => {
    // Kiểm tra trình duyệt có hỗ trợ getUserMedia không
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError("Trình duyệt không hỗ trợ truy cập Camera (cần HTTPS hoặc localhost).");
    }
    return () => stopCamera();
  }, [stopCamera]);

  const scanLoop = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return;

    // Chỉ quét khi video đã sẵn sàng dữ liệu
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      try {
        // Init canvas nếu chưa có
        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
        }
        const canvas = canvasRef.current;
        const video = videoRef.current;

        // Cập nhật kích thước canvas theo video
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Lấy dữ liệu pixel để quét
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Sử dụng jsQR để tìm mã
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          stopCamera();
          onDetected?.(code.data);
          return;
        }
      } catch (err) {
        console.error("Scan error:", err);
      }
    }

    // Loop lại sau 100ms (khoảng 10 FPS) để tiết kiệm CPU
    rafRef.current = setTimeout(() => {
      scanLoop();
    }, 100);
  }, [onDetected, stopCamera]);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Ưu tiên camera sau
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Chờ metadata load xong mới play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              // Bắt đầu vòng lặp quét sau khi video chạy
              scanLoop();
            })
            .catch((e) => console.error("Play error:", e));
        };
      }

      if (onScanningChange) onScanningChange(true);

    } catch (err) {
      console.error("Camera error:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      toast.error("Lỗi: Không thể mở camera.");
      stopCamera();
    }
  };

  return (
    <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 shadow-lg flex-1 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            qr_code_scanner
          </span>
          Camera Quét QR
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`size-2.5 rounded-full ${scanning ? "bg-success animate-pulse" : "bg-white/20"
              }`}
          />
          <span
            className={`font-medium ${scanning ? "text-success" : "text-white/40"
              }`}
          >
            {scanning ? "Đang quét..." : "Chờ kích hoạt"}
          </span>
        </div>
      </div>

      <div className="relative flex-1 bg-black/40 rounded-xl overflow-hidden group border border-dashed border-white/10 hover:border-primary/30 flex flex-col items-center justify-center p-4 transition-all duration-300">
        {/* Vùng hiển thị Camera */}
        <div className="relative w-full h-full max-h-[350px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transform scale-100 transition-opacity duration-500 ${scanning ? "opacity-100" : "opacity-0"
              }`}
            muted
            playsInline
          />

          {/* Hiệu ứng tia quét Laser & Khung ngắm */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {/* Tia laser chạy dọc */}
              <div className="w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(234,42,51,0.8)] absolute top-0 animate-[scan_2s_infinite_ease-in-out]"></div>

              {/* 4 góc khung ngắm */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg opacity-80"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg opacity-80"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg opacity-80"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg opacity-80"></div>
            </div>
          )}

          {/* Màn hình chờ khi chưa bật */}
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 gap-4 p-6 text-center">
              <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-2 animate-pulse">
                <span className="material-symbols-outlined text-4xl">
                  videocam_off
                </span>
              </div>
              <p className="text-sm max-w-[250px]">
                Nhấn nút bên dưới để cấp quyền và bắt đầu quét mã vé.
              </p>
              {!isSupported && (
                <p className="text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-lg border border-warning/20">
                  Trình duyệt này có thể không hỗ trợ Camera.
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="absolute bottom-20 left-4 right-4 bg-danger/10 border border-danger/20 text-danger text-xs px-4 py-3 rounded-lg text-center backdrop-blur-md z-20">
            {error}
          </div>
        )}

        <div className="absolute bottom-6 flex gap-3 z-20">
          {!scanning ? (
            <button
              onClick={startCamera}
              type="button"
              disabled={!isSupported}
              className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">videocam</span>
              Kích hoạt Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold border border-white/10 transition-all backdrop-blur-md flex items-center gap-2 transform active:scale-95"
            >
              <span className="material-symbols-outlined">stop_circle</span>
              Dừng quét
            </button>
          )}
        </div>
      </div>

      {/* Định nghĩa animation scan */}
      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
