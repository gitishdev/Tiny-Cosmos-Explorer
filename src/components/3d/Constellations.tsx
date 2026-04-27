import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CELESTIAL_BODIES } from '../../data/planets';
import { useAppStore } from '../../store/useAppStore';

const milkyWayStars = CELESTIAL_BODIES.filter(b => b.system === 'milky_way');

const asterisms = [
  {
    name: 'Winter Stars',
    stars: ['Sirius', 'Betelgeuse', 'Rigel', 'Aldebaran'],
    description: 'Prominent winter constellation stars in the Northern Hemisphere.',
    lines: [['sirius', 'betelgeuse'], ['betelgeuse', 'rigel'], ['rigel', 'aldebaran']]
  },
  {
    name: 'Summer Triangle',
    stars: ['Vega', 'Altair', 'Deneb'],
    description: 'A massive asterism visible overhead during summer nights.',
    lines: [['vega', 'altair'], ['altair', 'deneb'], ['deneb', 'vega']]
  },
  {
    name: 'Spring Arc',
    stars: ['Arcturus', 'Spica'],
    description: '"Arc to Arcturus, then speed on to Spica!"',
    lines: [['arcturus', 'spica']]
  },
  {
    name: 'Supergiants',
    stars: ['Antares', 'UY Scuti'],
    description: 'A massive connection bridging some of the largest red stars.',
    lines: [['antares', 'uy_scuti']]
  },
  {
    name: 'Northern Expanse',
    stars: ['Polaris', 'Deneb'],
    description: 'Linking the North Star towards the constellation of the Swan.',
    lines: [['polaris', 'deneb']]
  },
  {
    name: 'Southern Beacons',
    stars: ['Canopus', 'Sirius'],
    description: 'The two brightest stars in our night sky.',
    lines: [['canopus', 'sirius']]
  },
  {
    name: 'Orion\'s Arrow',
    stars: ['Betelgeuse', 'Aldebaran', 'Rigel'],
    description: 'Tracing the bow of the Hunter towards the Bull.',
    lines: [['betelgeuse', 'aldebaran'], ['aldebaran', 'rigel']]
  },
  {
    name: 'Galactic Core Path',
    stars: ['Antares', 'Altair'],
    description: 'A line of sight cutting near the dense center of the Milky Way.',
    lines: [['antares', 'altair']]
  },
  {
    name: 'Polar Connection',
    stars: ['Polaris', 'Vega'],
    description: 'Vega will be the North Star again in about 12,000 years.',
    lines: [['polaris', 'vega']]
  }
];

export function Constellations() {
  const isMotionEnabled = useAppStore(state => state.isMotionEnabled);
  const showConstellations = useAppStore(state => state.showConstellations);

  const [hoveredAst, setHoveredAst] = useState<string | null>(null);

  const anglesRef = useRef(
    milkyWayStars.reduce((acc, star) => {
      acc[star.id] = star.angleOffset ?? 0;
      return acc;
    }, {} as Record<string, number>)
  );

  const linesRef = useRef<{ [key: string]: any[] }>({});
  const labelsRef = useRef<{ [key: string]: THREE.Group }>({});

  useFrame((state, delta) => {
    if (isMotionEnabled) {
      for (const star of milkyWayStars) {
        anglesRef.current[star.id] += star.speed * delta * 5;
      }
    }

    for (const ast of asterisms) {
        let cx = 0, cy = 0, cz = 0;
        const uniqueStars = new Set<string>();

        ast.lines.forEach((ids, lineIdx) => {
            const [id1, id2] = ids;
            uniqueStars.add(id1);
            uniqueStars.add(id2);

            const star1 = milkyWayStars.find(s => s.id === id1);
            const star2 = milkyWayStars.find(s => s.id === id2);

            if (star1 && star2) {
                const angle1 = anglesRef.current[id1];
                const x1 = Math.cos(angle1) * star1.distance;
                const z1 = Math.sin(angle1) * star1.distance;
                const y1 = star1.yOffset ?? 0;

                const angle2 = anglesRef.current[id2];
                const x2 = Math.cos(angle2) * star2.distance;
                const z2 = Math.sin(angle2) * star2.distance;
                const y2 = star2.yOffset ?? 0;

                const array = linesRef.current[ast.name];
                if (array && array[lineIdx]) {
                    array[lineIdx].geometry.setPositions([
                        x1, y1, z1,
                        x2, y2, z2
                    ]);
                }
            }
        });

        const uniqueStarsList = Array.from(uniqueStars);
        if (uniqueStarsList.length > 0) {
            uniqueStarsList.forEach(id => {
                const star = milkyWayStars.find(s => s.id === id);
                if (star) {
                    const angle = anglesRef.current[id];
                    cx += Math.cos(angle) * star.distance;
                    cz += Math.sin(angle) * star.distance;
                    cy += star.yOffset ?? 0;
                }
            });
            cx /= uniqueStarsList.length;
            cy /= uniqueStarsList.length;
            cz /= uniqueStarsList.length;
            
            const labelObj = labelsRef.current[ast.name];
            if (labelObj) {
                labelObj.position.set(cx, cy, cz);
            }
        }
    }
  });

  return (
    <group>
      {asterisms.map((ast) => {
        const isHovered = hoveredAst === ast.name;
        const isAnyHovered = hoveredAst !== null;

        let baseOpacity = 0;
        if (showConstellations) {
            baseOpacity = isHovered ? 0.8 : (isAnyHovered ? 0.1 : 0.4);
        } else {
            baseOpacity = isHovered ? 0.8 : 0;
        }

        const isVisible = baseOpacity > 0;
        const color: [number, number, number] = isHovered ? [1.5, 2.0, 4.0] : [0.8, 1.2, 3.0];
        const lineWidth = isHovered ? 2.5 : 1.5;

        return (
          <group key={ast.name}>
            {ast.lines.map((_, lineIdx) => (
                <Line
                  key={`${ast.name}-line-${lineIdx}`}
                  ref={(el) => {
                      if (!linesRef.current[ast.name]) linesRef.current[ast.name] = [];
                      linesRef.current[ast.name][lineIdx] = el;
                  }}
                  points={[[0,0,0], [0,0,0]]} // Dummy initial points
                  color={color}
                  transparent
                  opacity={baseOpacity}
                  visible={isVisible}
                  lineWidth={lineWidth}
                  toneMapped={false}
                />
            ))}

            <group ref={(el) => { if (el) labelsRef.current[ast.name] = el; }}>
              <Html center className="pointer-events-auto z-10" zIndexRange={[100, 0]}>
                 <div 
                   className="group relative"
                   onMouseEnter={() => setHoveredAst(ast.name)}
                   onMouseLeave={() => setHoveredAst(null)}
                 >
                   <div className={`text-[10px] sm:text-xs font-mono whitespace-nowrap uppercase tracking-widest px-2.5 py-1 rounded-md border backdrop-blur-md shadow-lg cursor-default transition-all duration-300 ${
                       isHovered 
                       ? 'bg-purple-900/60 text-white border-purple-400 scale-110' 
                       : 'bg-black/40 text-purple-200/80 border-purple-500/30 hover:bg-black/80'
                   }`}>
                      {ast.name}
                   </div>
                   
                   {/* Tooltip */}
                   <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-900/95 border border-purple-500/50 text-purple-100 p-3 rounded-xl shadow-2xl pointer-events-none transition-all duration-300 ${
                       isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                   }`}>
                     <div className="font-bold text-sm mb-1 text-white">{ast.name}</div>
                     <div className="text-[10px] text-purple-300 mb-2 font-mono leading-relaxed">
                         Includes: {ast.stars.join(', ')}
                     </div>
                     <div className="text-xs leading-relaxed text-purple-100/80">
                         {ast.description}
                     </div>
                   </div>
                 </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}
