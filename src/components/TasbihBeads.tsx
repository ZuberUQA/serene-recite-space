
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';

interface BeadProps {
  position: [number, number, number];
  color: string;
  size?: number;
  isHighlighted?: boolean;
  isActive?: boolean;
  index: number;
  onBeadClick?: () => void;
}

const Bead: React.FC<BeadProps> = ({ position, color, size = 0.5, isHighlighted, isActive, index, onBeadClick }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Reset clicked state after animation completes
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => {
        setClicked(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [clicked]);
  
  // Animation effects
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Base rotation animation
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2 + index * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.3) * 0.1;
    
    // Scale effects based on state
    let targetScale = size;
    
    if (clicked) {
      // Dramatic pulse when clicked
      const clickPulse = Math.sin(state.clock.getElapsedTime() * 15) * 0.2 + 1;
      targetScale = size * (clickPulse + 0.3);
    } else if (hovered) {
      // Hover effect
      targetScale = size * 1.2;
    } else if (isActive) {
      // Currently active bead (most recent count)
      const activePulse = Math.sin(state.clock.getElapsedTime() * 5) * 0.1 + 1;
      targetScale = size * (activePulse + 0.2);
    } else if (isHighlighted) {
      // General highlighted beads (all counted so far)
      const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.05 + 1;
      targetScale = size * (pulse + 0.1);
    }
    
    // Smooth scale transition
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale } as any, 
      0.1
    );
    
    // Position animation for highlighted beads
    if (isHighlighted) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    } else {
      meshRef.current.position.y = position[1];
    }
  });

  const handleClick = () => {
    if (onBeadClick) {
      setClicked(true);
      onBeadClick();
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "#FFD700" : color}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
        emissive={clicked || isActive ? color : "#000000"}
        emissiveIntensity={clicked ? 0.5 : isActive ? 0.3 : 0}
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
  const [activeBead, setActiveBead] = useState<number | null>(count > 0 ? count - 1 : null);
  
  // Update active bead when count changes
  useEffect(() => {
    if (count > 0) {
      setActiveBead((count - 1) % loopSize);
    } else {
      setActiveBead(null);
    }
  }, [count, loopSize]);
  
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

  const handleBeadClick = () => {
    if (onBeadClick) {
      onBeadClick();
    }
  };

  return (
    <group>
      {Array.from({ length: loopSize }).map((_, index) => (
        <Bead
          key={`bead-${index}`}
          position={calculateBeadPosition(index, loopSize)}
          color={getBeadColor(color)}
          isHighlighted={index < count}
          isActive={index === activeBead}
          index={index}
          onBeadClick={handleBeadClick}
        />
      ))}
      {/* Thin string connecting the beads */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[2.5, 0.02, 8, loopSize]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.3} roughness={0.7} />
      </mesh>
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
    <div className="w-full h-60 bg-gradient-to-b from-white/5 to-white/20 rounded-xl overflow-hidden shadow-inner">
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
