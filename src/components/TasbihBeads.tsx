
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';

interface BeadProps {
  position: [number, number, number];
  color: string;
  size?: number;
  isHighlighted?: boolean;
  index: number;
}

const Bead: React.FC<BeadProps> = ({ position, color, size = 0.5, isHighlighted, index }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Simple animation without spring
  useFrame((state) => {
    if (meshRef.current) {
      // Basic rotation animation
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2 + index * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.3) * 0.1;
      
      // Pulsing effect for highlighted beads
      if (isHighlighted) {
        const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.05 + 1;
        meshRef.current.scale.setScalar(size * (pulse + 0.2));
      } else {
        meshRef.current.scale.setScalar(size);
      }
      
      // Small position adjustment for highlighted beads
      if (isHighlighted) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      } else {
        meshRef.current.position.y = position[1];
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
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
    </mesh>
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
