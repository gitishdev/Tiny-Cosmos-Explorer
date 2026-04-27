import { Search, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CELESTIAL_BODIES } from '../../data/planets';

export function Overlay() {
  const {
    selectedBodyId,
    isMotionEnabled,
    showConstellations,
    toggleMotion,
    toggleConstellations,
    setSelectedBodyId,
    searchQuery,
    setSearchQuery,
    setViewLevel,
    viewLevel
  } = useAppStore();

  const selectedBody = CELESTIAL_BODIES.find(b => b.id === selectedBodyId) || 
                       CELESTIAL_BODIES.flatMap(b => b.moons || []).find(m => m.id === selectedBodyId);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex flex-col sm:flex-row justify-between items-start pointer-events-none z-10 gap-4">
        <div className="pointer-events-auto">
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-500">
            LITTLE EXPLORER
          </h1>
          <p className="text-blue-200/50 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mt-1">Solar System Engine v1.2</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-full flex gap-1 self-start sm:self-auto">
            <button 
              onClick={() => !isMotionEnabled && toggleMotion()} 
              className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${isMotionEnabled ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'hover:bg-white/5 text-white/40'}`}
            >
              ORBITS ON
            </button>
            <button 
              onClick={() => isMotionEnabled && toggleMotion()} 
              className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${!isMotionEnabled ? 'bg-zinc-700 text-white shadow-[0_0_15px_rgba(100,100,100,0.5)]' : 'hover:bg-white/5 text-white/40'}`}
            >
              OFF
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-full flex gap-1 self-start sm:self-auto">
            <button 
              onClick={() => !showConstellations && toggleConstellations()} 
              className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${showConstellations ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'hover:bg-white/5 text-white/40'}`}
            >
              LINES ON
            </button>
            <button 
              onClick={() => showConstellations && toggleConstellations()} 
              className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${!showConstellations ? 'bg-zinc-700 text-white shadow-[0_0_15px_rgba(100,100,100,0.5)]' : 'hover:bg-white/5 text-white/40'}`}
            >
              OFF
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-xl flex items-center gap-2 sm:gap-3 self-start sm:self-auto hidden lg:flex">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[9px] sm:text-[10px] font-mono text-green-400 uppercase tracking-widest whitespace-nowrap">Real-time Render</span>
          </div>
        </div>
      </div>

      {selectedBody && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 w-64 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl pointer-events-auto z-10 animate-in slide-in-from-right-8 fade-in">
          <div className="mb-6">
            <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Target Locked</span>
            <h2 className="text-3xl font-bold mt-1 text-white">{selectedBody.name}</h2>
            <div className="h-1 w-12 bg-yellow-500 mt-2 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/40 uppercase font-bold">Fun Fact</p>
              <p className="text-sm font-medium text-blue-50 mt-1 pb-4 leading-relaxed">{selectedBody.fact}</p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={() => setSelectedBodyId(null)} 
                className="w-full py-3 sm:py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs sm:text-sm font-bold tracking-wider transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                BACK TO SPACE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[800px] max-w-full h-24 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] flex items-center justify-start sm:justify-around px-4 sm:px-8 shadow-2xl pointer-events-auto z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="flex items-center gap-6 sm:gap-8 min-w-max mx-auto px-4 sm:px-0">
          {CELESTIAL_BODIES.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((body) => {
            const isActive = selectedBodyId === body.id;
            const displayName = body.name.length > 5 ? body.name.substring(0, 4) : body.name;
            return (
              <button
                key={body.id}
                onClick={() => setSelectedBodyId(body.id)}
                className={`flex flex-col items-center gap-2 transition-all duration-300 outline-none min-w-[50px] ${isActive ? '-mt-10 sm:-mt-12 scale-110' : 'hover:scale-110'}`}
              >
                <div
                  className={`rounded-full shadow-inner relative transition-all duration-300 bg-cover bg-center ${
                    isActive 
                      ? 'w-14 h-14 sm:w-16 sm:h-16 border-4 border-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' 
                      : 'w-10 h-10 border-2 border-white/20'
                  }`}
                  style={{
                    backgroundImage: `url(${body.textureUrl})`,
                    backgroundColor: body.color
                  }}
                >
                  <div className="absolute inset-0 rounded-full box-shadow-inner border border-white/10"></div>
                </div>
                <span className={`uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-[11px] sm:text-[12px] font-black text-white' : 'text-[9px] sm:text-[10px] font-bold text-white/40'}`}>
                  {isActive ? body.name : displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 flex gap-3 pointer-events-auto z-10 w-[calc(100%-2rem)] sm:w-auto">
        <button 
          onClick={() => setViewLevel(viewLevel === 'galaxy' ? 'solar-system' : 'galaxy')} 
          className="p-3 sm:p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl cursor-pointer hover:bg-white/10 text-white transition-colors shadow-lg flex-shrink-0"
          title={viewLevel === 'galaxy' ? 'View Solar System' : 'View Galaxy'}
        >
          <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="relative pointer-events-auto bg-white/5 rounded-full border border-white/10 backdrop-blur-xl flex items-center hover:bg-white/10 transition-colors shadow-lg w-full sm:w-auto">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 absolute left-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search planets..."
              className="bg-transparent text-white pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 outline-none w-full sm:w-48 text-sm placeholder:text-white/30 rounded-full"
            />
        </div>
      </div>
    </>
  );
}
