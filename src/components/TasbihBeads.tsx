
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Vector3, MeshStandardMaterial, SphereGeometry } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface BeadProps {
  position: [number, number, number];
  color: string;
  size?: number;
  isHighlighted?: boolean;
  index: number;
}

const Bead: React.FC<BeadProps> = ({ position, color, size = 0.5, isHighlighted, index }) => {
  const meshRef = useRef<Mesh>(null);
  const geometry = new SphereGeometry(1, 32, 32);
  
  // Create animated position and rotation for the bead
  const { spring } = useSpring({
    spring: isHighlighted ? 1 : 0,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  const scale = spring.to([0, 1], [size, size * 1.2]);
  const posY = spring.to([0, 1], [position[1], position[1] + 0.2]);
  
  // Slow gentle rotation effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2 + index * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.3) * 0.1;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={[position[0], posY, position[2]]}
      scale={scale}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </animated.mesh>
  );
};

interface TasbihBeadsProps {
  count: number;
  loopSize: number;
  color?: string;
  onBeadClick?: () => void;
}

const BeadString: React.FC<TasbihBeadsProps> = ({ count, loopSize, color = 'gold', onBeadClick }) => {
  const calculateBeadPosition = (index: number, total: number): [number, number, number] => {
    const radius = 2.5;
    const angleStep = (2 * Math.PI) / total;
    const angle = angleStep * index;
    
    return [
      radius * Math.sin(angle),
      0,
      radius * Math.cos(angle)
    ];
  };

  return (
    <group onClick={onBeadClick}>
      {Array.from({ length: loopSize }).map((_, index) => (
        <Bead
          key={`bead-${index}`}
          position={calculateBeadPosition(index, loopSize)}
          color={getBeadColor(color)}
          isHighlighted={index < count}
          index={index}
        />
      ))}
    </group>
  );
};

// Helper function to convert color IDs to actual hex colors
const getBeadColor = (colorId: string): string => {
  const colorMap: Record<string, string> = {
    'gold': '#D4AF37',
    'silver': '#C0C0C0',
    'emerald': '#50C878',
    'ruby': '#E0115F',
    'sapphire': '#0F52BA',
    'amber': '#FFBF00',
    'pearl': '#F5F7F8',
    'obsidian': '#3D3635'
  };
  
  return colorMap[colorId] || colorMap.gold;
};

const TasbihBeads: React.FC<TasbihBeadsProps> = (props) => {
  return (
    <div className="w-full h-60 bg-gradient-to-b from-white/5 to-white/20 rounded-xl overflow-hidden">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={['#f8f8f8']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <BeadString {...props} />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default TasbihBeads;
