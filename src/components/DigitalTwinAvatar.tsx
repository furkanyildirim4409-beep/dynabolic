import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Focus, Maximize2 } from "lucide-react";

interface BodyPartProps {
  position: [number, number, number];
  scale: [number, number, number];
  isHotspot?: boolean;
}

const BodyPart = ({ position, scale, isHotspot = false }: BodyPartProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isHotspot) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9;
      meshRef.current.material = new THREE.MeshBasicMaterial({
        color: isHotspot ? new THREE.Color(1, 0.2, 0.2) : new THREE.Color(0.8, 1, 0.0),
        wireframe: true,
        transparent: true,
        opacity: isHotspot ? pulse : 0.6,
      });
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={isHotspot ? "#ff3333" : "#ccff00"}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

interface HumanAvatarProps {
  waistScale?: number;
}

const HumanAvatar = ({ waistScale = 1 }: HumanAvatarProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ccff00" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Neck */}
      <BodyPart position={[0, 1.85, 0]} scale={[0.15, 0.2, 0.15]} />

      {/* Shoulders/Chest - HOTSPOT */}
      <BodyPart position={[0, 1.5, 0]} scale={[1.0, 0.4, 0.35]} isHotspot={true} />

      {/* Torso */}
      <BodyPart position={[0, 1.0, 0]} scale={[0.8, 0.6, 0.3]} />

      {/* Waist - Scalable */}
      <mesh position={[0, 0.5, 0]} scale={[0.6 * waistScale, 0.4, 0.25 * waistScale]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ccff00" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Hips */}
      <BodyPart position={[0, 0.1, 0]} scale={[0.7, 0.3, 0.3]} />

      {/* Left Arm */}
      <BodyPart position={[-0.65, 1.5, 0]} scale={[0.15, 0.35, 0.15]} isHotspot={true} />
      <BodyPart position={[-0.65, 1.0, 0]} scale={[0.12, 0.4, 0.12]} />
      <BodyPart position={[-0.65, 0.55, 0]} scale={[0.1, 0.3, 0.1]} />

      {/* Right Arm */}
      <BodyPart position={[0.65, 1.5, 0]} scale={[0.15, 0.35, 0.15]} isHotspot={true} />
      <BodyPart position={[0.65, 1.0, 0]} scale={[0.12, 0.4, 0.12]} />
      <BodyPart position={[0.65, 0.55, 0]} scale={[0.1, 0.3, 0.1]} />

      {/* Left Leg */}
      <BodyPart position={[-0.2, -0.4, 0]} scale={[0.2, 0.6, 0.2]} />
      <BodyPart position={[-0.2, -1.0, 0]} scale={[0.18, 0.6, 0.18]} />
      <BodyPart position={[-0.2, -1.5, 0]} scale={[0.22, 0.3, 0.3]} />

      {/* Right Leg */}
      <BodyPart position={[0.2, -0.4, 0]} scale={[0.2, 0.6, 0.2]} />
      <BodyPart position={[0.2, -1.0, 0]} scale={[0.18, 0.6, 0.18]} />
      <BodyPart position={[0.2, -1.5, 0]} scale={[0.22, 0.3, 0.3]} />
    </group>
  );
};

// Camera positions for different views
const CAMERA_VIEWS = {
  fullBody: { position: new THREE.Vector3(0, 1, 9), target: new THREE.Vector3(0, 0, 0) },
  head: { position: new THREE.Vector3(0, 0.8, 4), target: new THREE.Vector3(0, 0.3, 0) },
};

interface CameraControllerProps {
  zoomedToHead: boolean;
}

const CameraController = ({ zoomedToHead }: CameraControllerProps) => {
  const { camera } = useThree();
  const targetPosition = useRef(CAMERA_VIEWS.fullBody.position.clone());
  const currentPosition = useRef(camera.position.clone());

  useFrame(() => {
    const view = zoomedToHead ? CAMERA_VIEWS.head : CAMERA_VIEWS.fullBody;
    targetPosition.current.copy(view.position);

    // Smooth lerp animation
    currentPosition.current.lerp(targetPosition.current, 0.05);
    camera.position.copy(currentPosition.current);
    camera.lookAt(view.target);
  });

  return null;
};

interface DigitalTwinAvatarProps {
  waistScale?: number;
}

const DigitalTwinAvatar = ({ waistScale = 1 }: DigitalTwinAvatarProps) => {
  const [zoomedToHead, setZoomedToHead] = useState(false);

  const toggleZoom = () => {
    setZoomedToHead((prev) => !prev);
  };

  return (
    <div className="w-full h-[450px] relative">
      <Canvas camera={{ position: [0, 1, 9], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <CameraController zoomedToHead={zoomedToHead} />
        <group scale={[0.75, 0.75, 0.75]} position={[0, -1.8, 0]}>
          <HumanAvatar waistScale={waistScale} />
        </group>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          target={zoomedToHead ? [0, 0.3, 0] : [0, 0, 0]}
        />
      </Canvas>

      {/* Grid overlay effect */}
      <div className="absolute inset-0 pointer-events-none grid-pattern opacity-10" />

      {/* Zoom Toggle Button */}
      <motion.button
        onClick={toggleZoom}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/80 backdrop-blur-sm border border-white/10 text-foreground text-xs font-medium transition-colors hover:bg-secondary"
      >
        <AnimatePresence mode="wait">
          {zoomedToHead ? (
            <motion.div
              key="fullbody"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4 text-primary" />
              <span>Tam Vücut</span>
            </motion.div>
          ) : (
            <motion.div
              key="head"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Focus className="w-4 h-4 text-primary" />
              <span>Üst Vücut</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* View Indicator */}
      <AnimatePresence>
        {zoomedToHead && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-display tracking-wider"
          >
            ÜST VÜCUT GÖRÜNÜMÜ
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalTwinAvatar;
