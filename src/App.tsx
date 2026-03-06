import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map } from './components/Map';
import { Dashboard } from './components/Dashboard';
import { RegionModal } from './components/RegionModal';
import { GameState, Region, INITIAL_REGIONS, Superpower, Factory, Leader, Ideology } from './types';
import { RefreshCw, Skull, User } from 'lucide-react';

const LEADERS: Record<Superpower, Record<Ideology, string[]>> = {
  USA: {
    Liberalism: ['Harry S. Truman', 'Dwight D. Eisenhower', 'John F. Kennedy', 'Lyndon B. Johnson', 'Richard Nixon', 'Gerald Ford', 'Jimmy Carter', 'Ronald Reagan', 'George H.W. Bush'],
    Communism: ['Gus Hall', 'William Z. Foster'],
    Nationalism: ['Douglas MacArthur', 'Barry Goldwater'],
    Monarchy: ['Norton I (Claimant)'],
    Republic: ['Thomas E. Dewey', 'Adlai Stevenson'],
    PanArabic: []
  },
  USSR: {
    Communism: ['Joseph Stalin', 'Nikita Khrushchev', 'Leonid Brezhnev', 'Yuri Andropov', 'Konstantin Chernenko', 'Mikhail Gorbachev'],
    Liberalism: ['Andrei Sakharov (Reformist)', 'Boris Yeltsin'],
    Nationalism: ['Alexander Solzhenitsyn (Cultural)', 'Vladimir Zhirinovsky'],
    Monarchy: ['Vladimir Kirillovich (Claimant)'],
    Republic: ['Alexander Kerensky (Exile)'],
    PanArabic: []
  }
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    year: 1945,
    playerSide: 'USA',
    playerLeader: { name: 'Harry S. Truman', ideology: 'Liberalism', termStart: 1945 },
    defcon: 5,
    budget: 1000,
    prestige: 50,
    resources: { 
      oil: 100, 
      steel: 100, 
      uranium: 0, 
      consumerGoods: 100,
      rawMaterials: 200,
      militaryHardware: 50,
      technology: 20
    },
    market: [
      { resource: 'oil', price: 10, demand: 100, supply: 100 },
      { resource: 'steel', price: 15, demand: 80, supply: 80 },
      { resource: 'uranium', price: 50, demand: 10, supply: 5 },
      { resource: 'consumerGoods', price: 5, demand: 200, supply: 180 },
      { resource: 'rawMaterials', price: 8, demand: 150, supply: 150 },
      { resource: 'militaryHardware', price: 40, demand: 50, supply: 40 },
      { resource: 'technology', price: 100, demand: 20, supply: 15 },
    ],
    regions: INITIAL_REGIONS.filter(r => r.entryYear <= 1945),
    history: ['สงครามโลกครั้งที่ 2 สิ้นสุดลง การต่อสู้ครั้งใหม่กำลังเริ่มต้นขึ้น'],
    isGameOver: false,
    tradeWarActive: false,
    nextElectionYear: 1948,
  });

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [showSideSelection, setShowSideSelection] = useState(false);

  const checkGameOver = useCallback((state: GameState) => {
    if (state.defcon <= 1) {
      return { over: true, reason: 'หายนะนิวเคลียร์ล้างโลก ไม่มีใครรอดชีวิต' };
    }
    if (state.year >= 1991) {
      const usaScore = state.regions.reduce((acc, r) => acc + (r.influence > 0 ? r.influence : 0), 0);
      const ussrScore = state.regions.reduce((acc, r) => acc + (r.influence < 0 ? Math.abs(r.influence) : 0), 0);
      const winner = usaScore > ussrScore ? 'สหรัฐอเมริกา' : 'สหภาพโซเวียต';
      return { over: true, reason: `สงครามเย็นสิ้นสุดลง ${winner} กลายเป็นมหาอำนาจเพียงหนึ่งเดียวของโลก` };
    }
    return { over: false };
  }, []);

  const handleEndTurn = () => {
    setGameState(prev => {
      const nextYear = prev.year + 1;
      const nextTurn = prev.turn + 1;
      
      // Check for new countries entering the world stage (Decolonization)
      const newCountries = INITIAL_REGIONS.filter(r => r.entryYear === nextYear);
      let currentRegions = [...prev.regions];
      let newHistory = [...prev.history];

      if (newCountries.length > 0) {
        currentRegions = [...currentRegions, ...newCountries];
        newCountries.forEach(c => {
          newHistory = [`${c.nameTh} ได้รับเอกราชและเข้าสู่เวทีโลก`, ...newHistory];
        });
      }

      // 1. Production & Consumption
      let produced = { oil: 0, steel: 0, uranium: 0, consumerGoods: 0, rawMaterials: 0, militaryHardware: 0, technology: 0 };
      let globalSupply = { oil: 0, steel: 0, uranium: 0, consumerGoods: 0, rawMaterials: 0, militaryHardware: 0, technology: 0 };
      let globalDemand = { oil: 100 + (nextTurn * 5), steel: 80 + (nextTurn * 3), uranium: 10 + (nextTurn * 1), consumerGoods: 200 + (nextTurn * 10), rawMaterials: 150 + (nextTurn * 5), militaryHardware: 50 + (nextTurn * 2), technology: 20 + (nextTurn * 3) };

      const updatedRegions = currentRegions.map(r => {
        let newInfluence = r.influence;
        let newStability = r.stability;
        let newIdeology = r.ideology;
        
        // AI Logic
        const aiPower = 5 + Math.floor(Math.random() * 8);
        if (prev.playerSide === 'USA') newInfluence -= aiPower;
        else newInfluence += aiPower;

        // Stability drift
        if (newStability < 50) newStability += Math.floor(Math.random() * 4) - 1;
        else if (newStability > 80) newStability -= Math.floor(Math.random() * 2);

        // Ideology Drift based on influence
        if (newInfluence > 50 && newIdeology !== 'Liberalism' && Math.random() > 0.8) {
          newIdeology = 'Liberalism';
        } else if (newInfluence < -50 && newIdeology !== 'Communism' && Math.random() > 0.8) {
          newIdeology = 'Communism';
        } else if (newStability < 30 && Math.random() > 0.9) {
          const ideologies: Ideology[] = ['Nationalism', 'Republic', 'Monarchy', 'PanArabic'];
          newIdeology = ideologies[Math.floor(Math.random() * ideologies.length)];
        }

        // Production Logic
        const isControlled = prev.playerSide === 'USA' ? newInfluence > 20 : newInfluence < -20;

        // Base Production
        Object.entries(r.production).forEach(([res, amount]) => {
          const key = res as keyof typeof produced;
          globalSupply[key] += amount || 0;
          if (isControlled && !r.tradeEmbargo) produced[key] += amount || 0;
        });

        // Factory Production (Requires inputs)
        r.factories.forEach(f => {
          let output = f.level * f.output;
          if (isControlled && !r.tradeEmbargo) {
            if (f.type === 'SteelMill' && prev.resources.rawMaterials > 5) {
              produced.steel += output;
            } else if (f.type === 'Refinery' && produced.oil > 5) {
              produced.oil += output;
            } else if (f.type === 'ArmsPlant' && prev.resources.steel > 5) {
              produced.militaryHardware += output;
            } else if (f.type === 'TechLab' && prev.resources.uranium > 1) {
              produced.technology += output;
            } else if (f.type === 'ConsumerFactory' && prev.resources.rawMaterials > 5) {
              produced.consumerGoods += output;
            }
          }
          globalSupply.militaryHardware += f.type === 'ArmsPlant' ? output : 0;
          globalSupply.technology += f.type === 'TechLab' ? output : 0;
          globalSupply.steel += f.type === 'SteelMill' ? output : 0;
          globalSupply.consumerGoods += f.type === 'ConsumerFactory' ? output : 0;
        });

        let newStatus: Region['status'] = 'Stable';
        if (newStability < 25) newStatus = 'Proxy War';
        else if (newStability < 60) newStatus = 'Unstable';
        else if (Math.abs(newInfluence) > 70) newStatus = 'Aligned';

        return { 
          ...r, 
          influence: Math.max(-100, Math.min(100, newInfluence)), 
          stability: Math.max(0, Math.min(100, newStability)),
          status: newStatus,
          ideology: newIdeology
        };
      });

      // 2. Election Logic
      let nextLeader = prev.playerLeader;
      let nextElectionYear = prev.nextElectionYear;
      let historyAdd = '';

      if (nextYear >= prev.nextElectionYear) {
        const sideLeaders = LEADERS[prev.playerSide][prev.playerLeader.ideology];
        const leaderIndex = sideLeaders.indexOf(prev.playerLeader.name);
        const newLeaderName = sideLeaders[(leaderIndex + 1) % sideLeaders.length];
        
        nextLeader = {
          name: newLeaderName,
          ideology: prev.playerLeader.ideology,
          termStart: nextYear
        };
        nextElectionYear = nextYear + (prev.playerSide === 'USA' ? 4 : 8);
        historyAdd = ` | การเลือกตั้งเสร็จสิ้น: ${nextLeader.name} ขึ้นเป็นผู้นำคนใหม่`;
      }

      // 3. Market Price Updates (Supply & Demand)
      const nextMarket = prev.market.map(m => {
        const supply = globalSupply[m.resource] || 1;
        const demand = globalDemand[m.resource] || 1;
        const ratio = demand / supply;
        let newPrice = m.price * (0.9 + (ratio * 0.2));
        newPrice = Math.max(1, Math.min(500, newPrice));
        return { ...m, price: Math.floor(newPrice), supply, demand };
      });

      // 4. Resource Consumption & Budget
      const consumption = { 
        oil: 20 + (prev.turn * 2), 
        steel: 15 + (prev.turn * 2), 
        consumerGoods: 30 + (prev.turn * 5),
        rawMaterials: 40 + (prev.turn * 3),
        militaryHardware: 10 + (prev.turn * 2),
        technology: 5 + (prev.turn * 1)
      };

      const tradeWarCost = prev.tradeWarActive ? 200 : 0;
      const budgetGain = 500 + (prev.prestige * 5) - tradeWarCost;

      const nextResources = {
        oil: Math.max(0, prev.resources.oil + produced.oil - consumption.oil),
        steel: Math.max(0, prev.resources.steel + produced.steel - consumption.steel),
        uranium: prev.resources.uranium + produced.uranium,
        consumerGoods: Math.max(0, prev.resources.consumerGoods + produced.consumerGoods - consumption.consumerGoods),
        rawMaterials: Math.max(0, prev.resources.rawMaterials + produced.rawMaterials - consumption.rawMaterials),
        militaryHardware: Math.max(0, prev.resources.militaryHardware + produced.militaryHardware - consumption.militaryHardware),
        technology: Math.max(0, prev.resources.technology + produced.technology - consumption.technology),
      };

      const newState = {
        ...prev,
        year: nextYear,
        turn: nextTurn,
        budget: prev.budget + budgetGain,
        resources: nextResources,
        market: nextMarket,
        regions: updatedRegions,
        playerLeader: nextLeader,
        nextElectionYear: nextElectionYear,
        history: [`ปี ${nextYear}: ตลาดโลกผันผวน ราคาน้ำมันอยู่ที่ $${nextMarket.find(m => m.resource === 'oil')?.price}${historyAdd}`, ...newHistory].slice(0, 30)
      };

      const { over, reason } = checkGameOver(newState);
      if (over) return { ...newState, isGameOver: true, gameOverReason: reason };
      return newState;
    });
  };

  const handleAction = (action: 'influence' | 'destabilize' | 'aid') => {
    if (!selectedRegion) return;
    const costs = { influence: 200, destabilize: 350, aid: 150 };
    const cost = costs[action];
    if (gameState.budget < cost) return;

    setGameState(prev => {
      let newDefcon = prev.defcon;
      const updatedRegions = prev.regions.map(r => {
        if (r.id !== selectedRegion.id) return r;
        let newInf = r.influence;
        let newStab = r.stability;
        const sideMult = prev.playerSide === 'USA' ? 1 : -1;

        if (action === 'influence') newInf += 30 * sideMult;
        else if (action === 'destabilize') {
          newStab -= 35;
          newInf += 15 * sideMult;
          if (Math.random() > 0.65) newDefcon = Math.max(1, newDefcon - 1);
        } else if (action === 'aid') newStab += 40;

        return { ...r, influence: Math.max(-100, Math.min(100, newInf)), stability: Math.max(0, Math.min(100, newStab)) };
      });

      return {
        ...prev,
        budget: prev.budget - cost,
        defcon: newDefcon,
        regions: updatedRegions,
        history: [`ปฏิบัติการ ${action} ใน ${selectedRegion.nameTh} สำเร็จ`, ...prev.history].slice(0, 20)
      };
    });
    setSelectedRegion(null);
  };

  const startWithSide = (side: Superpower) => {
    setGameState(prev => ({
      ...prev,
      playerSide: side,
      playerLeader: side === 'USA' 
        ? { name: 'Harry S. Truman', ideology: 'Liberalism', termStart: 1945 }
        : { name: 'Joseph Stalin', ideology: 'Communism', termStart: 1922 },
      nextElectionYear: side === 'USA' ? 1948 : 1953,
      history: [`ฝ่าย ${side === 'USA' ? 'สหรัฐฯ' : 'โซเวียต'} เริ่มปฏิบัติการ`],
    }));
    setShowSideSelection(false);
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-terminal-bg crt p-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center max-w-2xl">
          <h1 className="text-7xl font-black italic tracking-tighter mb-4 text-terminal-green">IRON CURTAIN</h1>
          <p className="text-xl font-retro mb-8 opacity-80">แบบจำลองกองบัญชาการยุทธศาสตร์โลก v1.1.0</p>
          {!showSideSelection ? (
            <button onClick={() => setShowSideSelection(true)} className="px-12 py-4 border-2 border-terminal-green text-terminal-green text-2xl font-bold hover:bg-terminal-green hover:text-black transition-all">เริ่มระบบ</button>
          ) : (
            <div className="flex flex-col gap-6">
              <p className="text-lg font-bold uppercase tracking-widest text-terminal-amber">เลือกฝ่ายของคุณ</p>
              <div className="flex gap-6 justify-center">
                <button onClick={() => startWithSide('USA')} className="px-8 py-4 border-2 border-blue-600 text-blue-500 text-xl font-bold hover:bg-blue-600 hover:text-white transition-all">สหรัฐอเมริกา</button>
                <button onClick={() => startWithSide('USSR')} className="px-8 py-4 border-2 border-red-600 text-red-500 text-xl font-bold hover:bg-red-600 hover:text-white transition-all">สหภาพโซเวียต</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-terminal-bg crt flex flex-col p-6 gap-6 overflow-hidden">
      <div className="flex justify-between items-center border-b border-terminal-green/30 pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black italic tracking-tighter">IRON CURTAIN</h1>
          <div className="h-4 w-[1px] bg-terminal-green/30" />
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest opacity-60">
            <span>สถานะ: ออนไลน์</span>
            <span>เวลา: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < (6 - gameState.defcon) ? 'bg-red-600 animate-pulse' : 'bg-terminal-green/20'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        <div className="col-span-8 h-full">
          <Map regions={gameState.regions} onRegionClick={setSelectedRegion} playerSide={gameState.playerSide} />
        </div>
        <div className="col-span-4 h-full">
          <Dashboard gameState={gameState} onEndTurn={handleEndTurn} />
        </div>
      </div>

      <RegionModal region={selectedRegion} onClose={() => setSelectedRegion(null)} onAction={handleAction} playerSide={gameState.playerSide} budget={gameState.budget} />

      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12 text-center">
            {gameState.defcon <= 1 ? <Skull className="text-red-600 w-32 h-32 mb-8 animate-pulse" /> : <RefreshCw className="text-terminal-green w-32 h-32 mb-8" />}
            <h2 className="text-6xl font-black italic mb-4 text-white">จบเกม</h2>
            <p className="text-2xl font-retro max-w-2xl mb-12 text-terminal-green">{gameState.gameOverReason}</p>
            <button onClick={() => window.location.reload()} className="px-12 py-4 border-2 border-white text-white text-2xl font-bold hover:bg-white hover:text-black transition-all">เริ่มใหม่</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
