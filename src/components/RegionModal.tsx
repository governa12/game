import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Target, Users, AlertCircle, Droplets, Box, Zap as Energy, ShoppingBag, Factory as FactoryIcon, Ban, Hammer, Cpu, User, Landmark, MapPin, Maximize } from 'lucide-react';
import { Region, Superpower } from '../types';

interface RegionModalProps {
  region: Region | null;
  onClose: () => void;
  onAction: (action: 'influence' | 'destabilize' | 'aid') => void;
  playerSide: Superpower;
  budget: number;
}

export const RegionModal: React.FC<RegionModalProps> = ({ region, onClose, onAction, playerSide, budget }) => {
  if (!region) return null;

  const costs = {
    influence: 200,
    destabilize: 350,
    aid: 150
  };

  const ideologyTh: Record<string, string> = {
    Liberalism: 'เสรีนิยม',
    Communism: 'คอมมิวนิสต์',
    Nationalism: 'ชาตินิยม',
    Monarchy: 'ระบบกษัตริย์',
    Republic: 'สาธารณรัฐ',
    PanArabic: 'แพน-อาหรับ'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-terminal-bg border-2 border-terminal-green p-6 rounded-xl shadow-[0_0_30px_rgba(0,255,65,0.2)]"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-terminal-green">{region.nameTh}</h2>
              <p className="text-xs opacity-60 uppercase tracking-widest">เขต {region.continentTh}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-terminal-green hover:text-black rounded transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-terminal-green/20 rounded bg-black/20 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase font-bold">
                  <MapPin size={10} /> เมืองหลวง
                </div>
                <div className="text-sm font-bold truncate">{region.capital}</div>
              </div>
              <div className="p-3 border border-terminal-green/20 rounded bg-black/20 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase font-bold">
                  <Maximize size={10} /> ขนาดพื้นที่
                </div>
                <div className="text-sm font-bold">{region.areaKm2.toLocaleString()} กม.²</div>
              </div>
            </div>

            {/* Leader & Ideology */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-terminal-green/20 rounded bg-black/20 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase font-bold">
                  <User size={10} /> ผู้นำ
                </div>
                <div className="text-sm font-bold truncate">{region.leader.name}</div>
              </div>
              <div className="p-3 border border-terminal-green/20 rounded bg-black/20 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase font-bold">
                  <Landmark size={10} /> อุดมการณ์
                </div>
                <div className="text-sm font-bold">{ideologyTh[region.ideology]}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-terminal-green/20 rounded bg-black/20">
                <p className="text-[10px] opacity-50 mb-1">เสถียรภาพ</p>
                <div className="text-xl font-bold">{region.stability}%</div>
              </div>
              <div className="p-3 border border-terminal-green/20 rounded bg-black/20">
                <p className="text-[10px] opacity-50 mb-1">พันธมิตร</p>
                <div className="text-xl font-bold">
                  {region.alliance === 'NATO' ? 'NATO' : region.alliance === 'WARSAW_PACT' ? 'WARSAW PACT' : 'ไม่ฝักใฝ่ฝ่ายใด'}
                </div>
              </div>
            </div>

            {/* Production Info */}
            <div className="p-3 border border-terminal-green/20 rounded bg-black/20">
              <p className="text-[10px] opacity-50 mb-2 uppercase tracking-widest font-bold">ทรัพยากรที่ผลิตได้</p>
              <div className="flex flex-wrap gap-4">
                {region.production.oil && <ResourceIcon icon={<Droplets size={12} />} label="น้ำมัน" value={region.production.oil} />}
                {region.production.steel && <ResourceIcon icon={<Box size={12} />} label="เหล็ก" value={region.production.steel} />}
                {region.production.uranium && <ResourceIcon icon={<Energy size={12} />} label="ยูเรเนียม" value={region.production.uranium} />}
                {region.production.consumerGoods && <ResourceIcon icon={<ShoppingBag size={12} />} label="สินค้า" value={region.production.consumerGoods} />}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase opacity-50">ปฏิบัติการทางยุทธศาสตร์</h4>
              
              <ActionButton 
                icon={<Target size={18} />}
                label="ขยายอิทธิพล"
                desc="เผยแพร่อุดมการณ์ผ่านการทูตและสื่อ"
                cost={costs.influence}
                disabled={budget < costs.influence}
                onClick={() => onAction('influence')}
              />

              <ActionButton 
                icon={<Users size={18} />}
                label="บ่อนทำลาย"
                desc="สนับสนุนกลุ่มกบฏและแพร่ข่าวลือ"
                cost={costs.destabilize}
                disabled={budget < costs.destabilize}
                onClick={() => onAction('destabilize')}
              />

              <ActionButton 
                icon={<Shield size={18} />}
                label="ความช่วยเหลือทางเศรษฐกิจ"
                desc="เสริมสร้างความแข็งแกร่งให้รัฐบาลท้องถิ่น"
                cost={costs.aid}
                disabled={budget < costs.aid}
                onClick={() => onAction('aid')}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ResourceIcon = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="flex items-center gap-1 text-[10px]">
    <span className="text-terminal-green">{icon}</span>
    <span>{label}: {value}</span>
  </div>
);

const ActionButton = ({ icon, label, desc, cost, disabled, onClick }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center gap-4 p-3 border border-terminal-green/30 rounded hover:bg-terminal-green hover:text-black transition-all group disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-terminal-green"
  >
    <div className="p-2 border border-current rounded">{icon}</div>
    <div className="flex-1 text-left">
      <div className="font-bold">{label}</div>
      <div className="text-[10px] opacity-70 group-hover:opacity-100">{desc}</div>
    </div>
    <div className="text-sm font-bold">${cost}M</div>
  </button>
);
