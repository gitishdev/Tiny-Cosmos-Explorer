/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SolarSystem } from './components/3d/SolarSystem';
import { Overlay } from './components/UI/Overlay';

export default function App() {
  return (
    <div className="w-full h-screen bg-[#020205] overflow-hidden relative text-white font-sans select-none">
      <div className="absolute inset-0 opacity-40 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #020205 100%)' }}></div>
      <SolarSystem />
      <Overlay />
    </div>
  );
}
