import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Edges } from "@react-three/drei";
import * as THREE from "three";

const RotatingIcosahedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.z += 0.001;
    }
  });

  const edgeColor = useMemo(() => new THREE.Color("#ccff00"), []);

  return (
    <Icosahedron ref={meshRef} args={[2.5, 0]} position={[0, 0, 0]}>
      <meshBasicMaterial transparent opacity={0} />
      <Edges
        scale={1}
        threshold={15}
        color={edgeColor}
      />
    </Icosahedron>
  );
};

const IcosahedronBackground = () => {
  return (
    <div className="absolute inset-0 opacity-20">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <RotatingIcosahedron />
      </Canvas>
    </div>
  );
};

export default IcosahedronBackground;
