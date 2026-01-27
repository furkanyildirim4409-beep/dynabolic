import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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

interface DigitalTwinAvatarProps {
  waistScale?: number;
}

const DigitalTwinAvatar = ({ waistScale = 1 }: DigitalTwinAvatarProps) => {
  return (
    <div className="w-full h-64 relative">
      <Canvas camera={{ position: [0, 0.5, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <HumanAvatar waistScale={waistScale} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Grid overlay effect */}
      <div className="absolute inset-0 pointer-events-none grid-pattern opacity-10" />
    </div>
  );
};

export default DigitalTwinAvatar;
