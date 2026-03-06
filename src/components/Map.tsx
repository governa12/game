import React from 'react';
import { motion } from 'motion/react';
import { Region } from '../types';
import { cn } from '../lib/utils';

interface MapProps {
  regions: Region[];
  onRegionClick: (region: Region) => void;
  playerSide: 'USA' | 'USSR';
}

export const Map: React.FC<MapProps> = ({ regions, onRegionClick, playerSide }) => {
  const continents = [
    { id: 'Americas', name: 'อเมริกา' },
    { id: 'Europe', name: 'ยุโรป' },
    { id: 'Asia', name: 'เอเชีย' },
    { id: 'Africa', name: 'แอฟริกา' },
    { id: 'Oceania', name: 'โอเชียเนีย' }
  ];

  return (
    <div className="relative w-full h-full bg-black/40 border border-terminal-green/30 rounded-lg overflow-hidden flex flex-col">
      {/* Background Layer (Fixed) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full border border-terminal-green/20">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-terminal-green/10" />
          ))}
        </div>
        
        {/* Radar Sweep Effect */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-10"
          style={{
            background: 'conic-gradient(from 0deg, transparent, var(--color-terminal-green))'
          }}
        />
      </div>

      {/* Scrollable Content Layer */}
      <div className="relative z-10 flex-1 overflow-auto custom-scrollbar p-8">
        <div className="flex flex-row items-start gap-12 pb-40 min-w-max h-full">
          {continents.map((cont) => {
            const continentRegions = regions.filter(r => r.continent === cont.id);
            if (continentRegions.length === 0) return null;

            return (
              <div key={cont.id} className="flex flex-col gap-6 w-80 shrink-0">
                <div className="flex items-center gap-3 border-b border-terminal-green/30 pb-2 sticky top-0 bg-black/80 backdrop-blur-md z-30">
                  <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                  <h2 className="text-xl font-black tracking-tighter uppercase">{cont.name}</h2>
                  <span className="text-[10px] opacity-40 ml-auto font-bold">{continentRegions.length} ประเทศ</span>
                </div>

                <div className="flex flex-col gap-4">
                  {continentRegions.map((region) => {
                    const isUsaDominant = region.influence > 0;
                    const borderColor = isUsaDominant ? 'border-blue-900/50' : 'border-red-900/50';
                    const bgColor = isUsaDominant ? 'bg-blue-900/20' : 'bg-red-900/20';

                    return (
                      <motion.button
                        key={region.id}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 255, 65, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onRegionClick(region)}
                        className={cn(
                          "relative flex flex-col items-start p-4 border rounded-md transition-colors text-left backdrop-blur-sm group shrink-0",
                          borderColor,
                          bgColor
                        )}
                      >
                        <div className="flex justify-between w-full mb-1">
                          <span className={cn(
                            "text-[8px] font-bold tracking-widest",
                            region.alliance === 'NATO' ? "text-blue-400" : region.alliance === 'WARSAW_PACT' ? "text-red-400" : "text-terminal-green/40"
                          )}>
                            {region.alliance === 'NATO' ? 'NATO' : region.alliance === 'WARSAW_PACT' ? 'WARSAW PACT' : 'NON-ALIGNED'}
                          </span>
                          <span className={cn("text-xs font-bold", region.stability < 30 ? "text-yellow-500 animate-pulse" : "text-terminal-green")}>
                            {region.stability}%
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold truncate w-full group-hover:text-white transition-colors">{region.nameTh}</h3>
                        <div className="text-[10px] font-bold text-terminal-green/60 uppercase tracking-tighter mb-3">
                          {region.capital}
                        </div>
                        
                        <div className="w-full bg-gray-800/50 h-1 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-red-600 h-full transition-all duration-500" 
                            style={{ width: `${Math.max(0, -region.influence)}%` }}
                          />
                          <div className="flex-1 bg-gray-700/30" />
                          <div 
                            className="bg-blue-600 h-full transition-all duration-500" 
                            style={{ width: `${Math.max(0, region.influence)}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between w-full mt-1 text-[8px] uppercase font-bold opacity-30">
                          <span>USSR</span>
                          <span>USA</span>
                        </div>

                        {region.status === 'Proxy War' && (
                          <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black animate-bounce shadow-lg z-20">
                            WAR
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
