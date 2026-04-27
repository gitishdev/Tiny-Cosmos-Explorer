import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore, cameraTargetPosition } from '../../store/useAppStore';
import { CelestialBody } from '../../data/planets';

export function Planet({ body }: { body: CelestialBody }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const isMotionEnabled = useAppStore(state => state.isMotionEnabled);
  const selectedBodyId = useAppStore(state => state.selectedBodyId);
  const setSelectedBodyId = useAppStore(state => state.setSelectedBodyId);

  const angleRef = useRef(body.angleOffset ?? (Math.random() * Math.PI * 2));
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [ringTexture, setRingTexture] = useState<THREE.Texture | null>(null);
  const isSelected = selectedBodyId === body.id;
  const isMilkyWay = body.system === 'milky_way';
  const hasOrbitLine = body.distance > 0 && !isMilkyWay;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    if (body.textureUrl) {
      loader.load(
        body.textureUrl,
        (tex) => setTexture(tex),
        undefined,
        (err) => console.warn(`Failed to load texture for ${body.name}`, err)
      );
    }
    
    if (body.ringTextureUrl) {
      loader.load(
        body.ringTextureUrl,
        (tex) => setRingTexture(tex),
        undefined,
        (err) => console.warn(`Failed to load ring texture for ${body.name}`, err)
      );
    }
  }, [body.textureUrl, body.ringTextureUrl, body.name]);

  const points = [];
  if (hasOrbitLine) {
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * body.distance, 0, Math.sin(theta) * body.distance));
    }
  }

  useFrame((state, delta) => {
    if (isMotionEnabled && body.distance > 0) {
      angleRef.current += body.speed * delta * (isMilkyWay ? 5 : 15);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }

    if (groupRef.current) {
        if (body.distance > 0) {
          groupRef.current.position.x = Math.cos(angleRef.current) * body.distance;
          groupRef.current.position.z = Math.sin(angleRef.current) * body.distance;
          if (isMilkyWay && body.yOffset !== undefined) {
             groupRef.current.position.y = body.yOffset;
          }
        } else {
          groupRef.current.position.set(0, 0, 0);
        }

        if (isSelected) {
          groupRef.current.getWorldPosition(cameraTargetPosition);
        }
    }
  });

  return (
    <group>
      {hasOrbitLine && <Line points={points} color="#ffffff" opacity={0.15} transparent lineWidth={1} />}

      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBodyId(body.id);
          }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[body.radius, 32, 32]} />
          {body.type === 'star' ? (
            <meshBasicMaterial map={texture} color={texture ? [1.5, 1.5, 1.5] : body.color} toneMapped={false} />
          ) : (
            <meshStandardMaterial map={texture} color={texture ? 'white' : body.color} roughness={0.7} metalness={0.1} />
          )}
        </mesh>

        {body.id === 'saturn' && (
           <mesh rotation={[Math.PI / 2 + 0.3, 0, 0]} onClick={(e) => e.stopPropagation()}>
             <ringGeometry args={[body.radius * 1.2, body.radius * 1.8, 64]} />
             <meshBasicMaterial map={ringTexture} color={ringTexture ? 'white' : body.color} side={THREE.DoubleSide} transparent opacity={0.8} />
           </mesh>
        )}

        {isSelected && (
          <mesh>
            <sphereGeometry args={[body.radius * 1.15, 32, 32]} />
            <meshBasicMaterial color="#3b82f6" wireframe opacity={0.4} transparent />
          </mesh>
        )}

        {body.moons && body.moons.map(moon => (
           <Planet key={moon.id} body={moon} />
        ))}
      </group>
    </group>
  );
}
