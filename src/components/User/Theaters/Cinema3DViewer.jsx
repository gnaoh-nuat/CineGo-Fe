import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Html,
  useProgress,
} from "@react-three/drei";

// Import file model từ assets
// Vite sẽ tự động xử lý đường dẫn này
import modelPath from "../../../assets/cinema_model.glb";

// Component hiển thị thanh loading khi model đang tải
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-sm font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md">
        {progress.toFixed(0)} % loaded
      </div>
    </Html>
  );
}

// Component chứa Model
const Model = () => {
  // Load file GLB
  const { scene } = useGLTF(modelPath);

  // Clone scene để tránh lỗi khi mount lại component
  const sceneClone = React.useMemo(() => scene.clone(), [scene]);

  return <primitive object={sceneClone} />;
};

const Cinema3DViewer = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black relative">
      {/* Canvas là không gian 3D chính */}
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 5] }}>
        <Suspense fallback={<Loader />}>
          {/* Stage: Tự động thiết lập ánh sáng và căn giữa model đẹp mắt */}
          <Stage environment="city" intensity={0.5} contactShadow={false}>
            <Model />
          </Stage>
        </Suspense>

        {/* OrbitControls: Cho phép xoay, zoom bằng chuột */}
        <OrbitControls autoRotate autoRotateSpeed={0.5} makeDefault />
      </Canvas>

      {/* Hướng dẫn sử dụng */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full pointer-events-none">
        <p className="text-white/70 text-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Xoay: Chuột trái | Di chuyển: Chuột phải | Zoom: Con lăn
        </p>
      </div>
    </div>
  );
};

// Preload model để trải nghiệm mượt mà hơn
useGLTF.preload(modelPath);

export default Cinema3DViewer;
