import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, TrendingUp, DollarSign, Droplets, Box, Zap as Energy, ShoppingBag, User, Landmark } from 'lucide-react';
import { GameState } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  gameState: GameState;
  onEndTurn: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState, onEndTurn }) => {
  const defconColors = [
    'text-red-600',    // 1
    'text-orange-600', // 2
    'text-yellow-500', // 3
    'text-green-500',  // 4
    'text-blue-500'    // 5
  ];

  const ideologyTh: Record<string, string> = {
    Liberalism: 'เสรีนิยม',
    Communism: 'คอมมิวนิสต์',
    Nationalism: 'ชาตินิยม',
    Monarchy: 'ระบบกษัตริย์',
    Republic: 'สาธารณรัฐ',
    PanArabic: 'แพน-อาหรับ'
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Superpower Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border border-terminal-green/30 rounded-lg bg-black/20">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center border-2",
            gameState.playerSide === 'USA' ? "border-blue-600 bg-blue-900/20" : "border-red-600 bg-red-900/20"
          )}>
            <Globe className={gameState.playerSide === 'USA' ? "text-blue-500" : "text-red-500"} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tighter">กองบัญชาการ {gameState.playerSide === 'USA' ? 'สหรัฐฯ' : 'โซเวียต'}</h2>
            <p className="text-xs opacity-60">ปีปฏิบัติการ: ค.ศ. {gameState.year}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={cn("text-4xl font-black italic", defconColors[gameState.defcon - 1])}>
            DEFCON {gameState.defcon}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-2">
        {/* Leader & Ideology */}
        <div className="flex-shrink-0 grid grid-cols-2 gap-4">
          <div className="p-3 border border-terminal-green/20 rounded-lg bg-black/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-terminal-green/10 flex items-center justify-center text-terminal-green">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase opacity-40">ผู้นำปัจจุบัน</p>
              <p className="text-sm font-bold truncate">{gameState.playerLeader.name}</p>
            </div>
          </div>
          <div className="p-3 border border-terminal-green/20 rounded-lg bg-black/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-terminal-green/10 flex items-center justify-center text-terminal-green">
              <Landmark size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase opacity-40">อุดมการณ์</p>
              <p className="text-sm font-bold">{ideologyTh[gameState.playerLeader.ideology]}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-shrink-0 grid grid-cols-2 gap-4">
          <StatCard 
            icon={<DollarSign size={16} />} 
            label="งบประมาณ" 
            value={`$${gameState.budget}M`} 
            color="text-yellow-500"
          />
          <StatCard 
            icon={<TrendingUp size={16} />} 
            label="ชื่อเสียง" 
            value={gameState.prestige} 
            color="text-purple-500"
          />
        </div>

        {/* Resources Grid */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-2">
          <ResourceCard icon={<Droplets size={12} />} label="น้ำมัน" value={gameState.resources.oil} />
          <ResourceCard icon={<Box size={12} />} label="เหล็ก" value={gameState.resources.steel} />
          <ResourceCard icon={<Energy size={12} />} label="ยูเรเนียม" value={gameState.resources.uranium} />
          <ResourceCard icon={<ShoppingBag size={12} />} label="สินค้า" value={gameState.resources.consumerGoods} />
        </div>

        {/* Log */}
        <div className="flex-1 min-h-[200px] border border-terminal-green/30 rounded-lg bg-black/40 p-4 flex flex-col overflow-hidden">
          <h3 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
            <Zap size={12} /> ข้อมูลข่าวกรอง
          </h3>
          <div className="flex-1 overflow-y-auto font-retro text-lg space-y-1 custom-scrollbar pr-2">
            {gameState.history.map((entry, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className="border-l-2 border-terminal-green/20 pl-2 py-1"
              >
                <span className="opacity-40 mr-2">[{gameState.year}]</span>
                {entry}
              </motion.div>
            ))}
            {gameState.history.length === 0 && (
              <p className="opacity-30 italic">Awaiting data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0">
        <button
          onClick={onEndTurn}
          disabled={gameState.isGameOver}
          className="w-full py-4 bg-terminal-green text-black font-bold text-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
        >
          จบเทิร์น
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className="p-3 border border-terminal-green/20 rounded-lg bg-black/20">
    <div className="flex items-center gap-2 opacity-60 mb-1">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={cn("text-xl font-bold", color)}>{value}</div>
  </div>
);

const ResourceCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="p-2 border border-terminal-green/10 rounded bg-black/40 flex flex-col items-center">
    <div className="text-terminal-green/60 mb-1">{icon}</div>
    <div className="text-[8px] uppercase opacity-40 mb-1">{label}</div>
    <div className="text-xs font-bold">{value}</div>
  </div>
);
