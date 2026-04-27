import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { CELESTIAL_BODIES } from '../../data/planets';
import { Planet } from './Planet';
import { Constellations } from './Constellations';
import { useAppStore, cameraTargetPosition } from '../../store/useAppStore';

function SceneController() {
   const controlsRef = useRef<any>(null);
   const selectedBodyId = useAppStore(state => state.selectedBodyId);
   const viewLevel = useAppStore(state => state.viewLevel);

   useEffect(() => {
      if (!controlsRef.current) return;

      if (viewLevel === 'galaxy') {
         controlsRef.current.setLookAt(0, 1000, 1400, 0, 0, 0, true);
      } else if (!selectedBodyId) {
         controlsRef.current.setLookAt(0, 80, 120, 0, 0, 0, true);
      }
   }, [selectedBodyId, viewLevel]);

   useFrame(() => {
      if (selectedBodyId && controlsRef.current) {
         controlsRef.current.setTarget(cameraTargetPosition.x, cameraTargetPosition.y, cameraTargetPosition.z, true);
      }
   });

   return <CameraControls ref={controlsRef} makeDefault minDistance={3} maxDistance={5000} dampingFactor={0.05} />;
}

export function SolarSystem() {
  return (
    <Canvas camera={{ position: [0, 80, 120], fov: 45, far: 20000 }} className="absolute inset-0 z-0">
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#fffcf5" distance={500} decay={1.5} />

      {CELESTIAL_BODIES.filter(b => b.type === 'star').map((star) => (
         <Planet key={star.id} body={star} />
      ))}

      {CELESTIAL_BODIES.filter(b => b.type === 'planet').map((planet) => (
         <Planet key={planet.id} body={planet} />
      ))}

      <Constellations />

      <Stars radius={800} depth={300} count={8000} factor={8} saturation={0.5} fade speed={1} />

      <EffectComposer>
         <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>

      <SceneController />
    </Canvas>
  );
}
