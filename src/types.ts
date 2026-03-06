export type Superpower = 'USA' | 'USSR';
export type Alliance = 'NATO' | 'WARSAW_PACT' | 'NON_ALIGNED';
export type Ideology = 'Liberalism' | 'Communism' | 'Nationalism' | 'Monarchy' | 'Republic' | 'PanArabic';

export interface Leader {
  name: string;
  ideology: Ideology;
  termStart: number;
}

export interface Resources {
  oil: number;
  steel: number;
  uranium: number;
  consumerGoods: number;
  rawMaterials: number; // Iron, Coal, Rubber
  militaryHardware: number;
  technology: number;
}

export interface Factory {
  type: 'Refinery' | 'SteelMill' | 'ArmsPlant' | 'TechLab' | 'ConsumerFactory';
  level: number;
  output: number;
}

export interface MarketPrice {
  resource: keyof Resources;
  price: number;
  demand: number;
  supply: number;
}

export interface Region {
  id: string;
  name: string;
  nameTh: string;
  influence: number; // -100 (USSR) to 100 (USA)
  stability: number; // 0 to 100
  status: 'Stable' | 'Unstable' | 'Proxy War' | 'Aligned';
  continent: 'Americas' | 'Europe' | 'Asia' | 'Africa' | 'Oceania';
  continentTh: string;
  production: Partial<Resources>;
  factories: Factory[];
  alliance: Alliance;
  tradeEmbargo: boolean;
  ideology: Ideology;
  leader: Leader;
  entryYear: number; // Year the country becomes active in the game
  capital: string;
  areaKm2: number;
}

export interface GameState {
  turn: number;
  year: number;
  playerSide: Superpower;
  playerLeader: Leader;
  defcon: number; // 5 (Peace) to 1 (Nuclear War)
  budget: number;
  prestige: number;
  resources: Resources;
  market: MarketPrice[];
  regions: Region[];
  history: string[];
  isGameOver: boolean;
  gameOverReason?: string;
  tradeWarActive: boolean;
  nextElectionYear: number;
}

export const INITIAL_REGIONS: Region[] = [
  // --- AMERICAS ---
  { 
    id: 'usa', name: 'United States of America', nameTh: 'สหรัฐอเมริกา', influence: 100, stability: 100, status: 'Aligned', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { rawMaterials: 50, consumerGoods: 50, technology: 20 }, factories: [{ type: 'TechLab', level: 2, output: 10 }], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'Harry S. Truman', ideology: 'Liberalism', termStart: 1945 }, entryYear: 1945,
    capital: 'Washington, D.C.', areaKm2: 9833517
  },
  { 
    id: 'canada', name: 'Canada', nameTh: 'แคนาดา', influence: 90, stability: 95, status: 'Aligned', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { rawMaterials: 40, uranium: 10 }, factories: [], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'Mackenzie King', ideology: 'Liberalism', termStart: 1935 }, entryYear: 1945,
    capital: 'Ottawa', areaKm2: 9984670
  },
  { 
    id: 'cuba', name: 'Republic of Cuba', nameTh: 'คิวบา', influence: 20, stability: 40, status: 'Unstable', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { rawMaterials: 15 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Fulgencio Batista', ideology: 'Nationalism', termStart: 1952 }, entryYear: 1945,
    capital: 'Havana', areaKm2: 109884
  },
  { 
    id: 'brazil', name: 'Federative Republic of Brazil', nameTh: 'บราซิล', influence: 20, stability: 65, status: 'Stable', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { rawMaterials: 40, steel: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Getúlio Vargas', ideology: 'Nationalism', termStart: 1951 }, entryYear: 1945,
    capital: 'Rio de Janeiro', areaKm2: 8515767
  },
  { 
    id: 'mexico', name: 'United Mexican States', nameTh: 'เม็กซิโก', influence: 30, stability: 70, status: 'Stable', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { oil: 20, rawMaterials: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Manuel Ávila Camacho', ideology: 'Republic', termStart: 1940 }, entryYear: 1945,
    capital: 'Mexico City', areaKm2: 1964375
  },
  { 
    id: 'argentina', name: 'Argentine Republic', nameTh: 'อาร์เจนตินา', influence: 10, stability: 60, status: 'Unstable', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { rawMaterials: 30 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Juan Perón', ideology: 'Nationalism', termStart: 1946 }, entryYear: 1945,
    capital: 'Buenos Aires', areaKm2: 2780400
  },

  // --- EUROPE ---
  { 
    id: 'uk', name: 'United Kingdom', nameTh: 'สหราชอาณาจักร', influence: 85, stability: 90, status: 'Aligned', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { steel: 20, consumerGoods: 15 }, factories: [{ type: 'SteelMill', level: 1, output: 10 }], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'Clement Attlee', ideology: 'Liberalism', termStart: 1945 }, entryYear: 1945,
    capital: 'London', areaKm2: 242495
  },
  { 
    id: 'france', name: 'French Republic', nameTh: 'ฝรั่งเศส', influence: 75, stability: 80, status: 'Aligned', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { steel: 15, consumerGoods: 10 }, factories: [{ type: 'ConsumerFactory', level: 1, output: 10 }], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Charles de Gaulle', ideology: 'Republic', termStart: 1944 }, entryYear: 1945,
    capital: 'Paris', areaKm2: 643801
  },
  { 
    id: 'w_germany', name: 'West Germany', nameTh: 'เยอรมนีตะวันตก', influence: 60, stability: 70, status: 'Unstable', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { steel: 30, technology: 10 }, factories: [{ type: 'SteelMill', level: 1, output: 15 }], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'Konrad Adenauer', ideology: 'Liberalism', termStart: 1949 }, entryYear: 1949,
    capital: 'Bonn', areaKm2: 248577
  },
  { 
    id: 'e_germany', name: 'East Germany', nameTh: 'เยอรมนีตะวันออก', influence: -60, stability: 70, status: 'Unstable', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { steel: 20, rawMaterials: 10 }, factories: [{ type: 'ArmsPlant', level: 1, output: 10 }], alliance: 'WARSAW_PACT', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Walter Ulbricht', ideology: 'Communism', termStart: 1950 }, entryYear: 1949,
    capital: 'East Berlin', areaKm2: 108333
  },
  { 
    id: 'italy', name: 'Italian Republic', nameTh: 'อิตาลี', influence: 50, stability: 65, status: 'Stable', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { consumerGoods: 20 }, factories: [], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Alcide De Gasperi', ideology: 'Liberalism', termStart: 1945 }, entryYear: 1945,
    capital: 'Rome', areaKm2: 301340
  },
  { 
    id: 'poland', name: 'Poland', nameTh: 'โปแลนด์', influence: -80, stability: 75, status: 'Aligned', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { rawMaterials: 30, steel: 10 }, factories: [], alliance: 'WARSAW_PACT', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Bolesław Bierut', ideology: 'Communism', termStart: 1944 }, entryYear: 1945,
    capital: 'Warsaw', areaKm2: 312696
  },
  { 
    id: 'hungary', name: 'Hungary', nameTh: 'ฮังการี', influence: -70, stability: 60, status: 'Unstable', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { rawMaterials: 15 }, factories: [], alliance: 'WARSAW_PACT', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Mátyás Rákosi', ideology: 'Communism', termStart: 1945 }, entryYear: 1945,
    capital: 'Budapest', areaKm2: 93030
  },
  { 
    id: 'czechoslovakia', name: 'Czechoslovakia', nameTh: 'เชโกสโลวาเกีย', influence: -75, stability: 70, status: 'Aligned', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { steel: 20, militaryHardware: 10 }, factories: [], alliance: 'WARSAW_PACT', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Klement Gottwald', ideology: 'Communism', termStart: 1948 }, entryYear: 1945,
    capital: 'Prague', areaKm2: 127900
  },

  // --- ASIA ---
  { 
    id: 'ussr', name: 'Soviet Union', nameTh: 'สหภาพโซเวียต', influence: -100, stability: 100, status: 'Aligned', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { oil: 60, rawMaterials: 40, uranium: 20 }, factories: [{ type: 'Refinery', level: 2, output: 20 }], alliance: 'WARSAW_PACT', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Joseph Stalin', ideology: 'Communism', termStart: 1922 }, entryYear: 1945,
    capital: 'Moscow', areaKm2: 22402200
  },
  { 
    id: 'china', name: 'China', nameTh: 'จีน', influence: -40, stability: 50, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 40, steel: 15 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Mao Zedong', ideology: 'Communism', termStart: 1949 }, entryYear: 1949,
    capital: 'Beijing', areaKm2: 9596961
  },
  { 
    id: 'india', name: 'Republic of India', nameTh: 'อินเดีย', influence: 0, stability: 60, status: 'Stable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 30, technology: 5 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Jawaharlal Nehru', ideology: 'Republic', termStart: 1947 }, entryYear: 1947,
    capital: 'New Delhi', areaKm2: 3287263
  },
  { 
    id: 'pakistan', name: 'Pakistan', nameTh: 'ปากีสถาน', influence: 10, stability: 50, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Muhammad Ali Jinnah', ideology: 'Republic', termStart: 1947 }, entryYear: 1947,
    capital: 'Karachi', areaKm2: 796095
  },
  { 
    id: 'japan', name: 'Japan', nameTh: 'ญี่ปุ่น', influence: 50, stability: 60, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { technology: 20, consumerGoods: 30 }, factories: [{ type: 'ConsumerFactory', level: 1, output: 20 }], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'Hirohito', ideology: 'Monarchy', termStart: 1926 }, entryYear: 1945,
    capital: 'Tokyo', areaKm2: 377975
  },
  { 
    id: 'thailand', name: 'Thailand', nameTh: 'ไทย', influence: 10, stability: 60, status: 'Stable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 20, oil: 5 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Monarchy', leader: { name: 'Bhumibol Adulyadej', ideology: 'Monarchy', termStart: 1946 }, entryYear: 1945,
    capital: 'Bangkok', areaKm2: 513120
  },
  { 
    id: 'vietnam', name: 'Vietnam', nameTh: 'เวียดนาม', influence: -10, stability: 30, status: 'Proxy War', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Ho Chi Minh', ideology: 'Communism', termStart: 1945 }, entryYear: 1945,
    capital: 'Hanoi', areaKm2: 331212
  },
  { 
    id: 'korea_s', name: 'South Korea', nameTh: 'เกาหลีใต้', influence: 20, stability: 40, status: 'Proxy War', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { consumerGoods: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Syngman Rhee', ideology: 'Nationalism', termStart: 1948 }, entryYear: 1948,
    capital: 'Seoul', areaKm2: 100210
  },
  { 
    id: 'korea_n', name: 'North Korea', nameTh: 'เกาหลีเหนือ', influence: -20, stability: 40, status: 'Proxy War', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Kim Il-sung', ideology: 'Communism', termStart: 1948 }, entryYear: 1948,
    capital: 'Pyongyang', areaKm2: 120540
  },
  { 
    id: 'indonesia', name: 'Indonesia', nameTh: 'อินโดนีเซีย', influence: 0, stability: 45, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { oil: 20, rawMaterials: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Sukarno', ideology: 'Nationalism', termStart: 1945 }, entryYear: 1945,
    capital: 'Jakarta', areaKm2: 1904569
  },
  { 
    id: 'iran', name: 'Iran', nameTh: 'อิหร่าน', influence: 30, stability: 70, status: 'Stable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { oil: 60 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Monarchy', leader: { name: 'Mohammad Reza Pahlavi', ideology: 'Monarchy', termStart: 1941 }, entryYear: 1945,
    capital: 'Tehran', areaKm2: 1648195
  },
  { 
    id: 'israel', name: 'Israel', nameTh: 'อิสราเอล', influence: 40, stability: 75, status: 'Stable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { technology: 10, militaryHardware: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'David Ben-Gurion', ideology: 'Republic', termStart: 1948 }, entryYear: 1948,
    capital: 'Jerusalem', areaKm2: 22072
  },
  { 
    id: 'iraq', name: 'Iraq', nameTh: 'อิรัก', influence: 0, stability: 50, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { oil: 40 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'PanArabic', leader: { name: 'Faisal II', ideology: 'Monarchy', termStart: 1939 }, entryYear: 1945,
    capital: 'Baghdad', areaKm2: 438317
  },

  // --- AFRICA ---
  { 
    id: 'egypt', name: 'Egypt', nameTh: 'อียิปต์', influence: 0, stability: 50, status: 'Unstable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { oil: 20, rawMaterials: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'PanArabic', leader: { name: 'Gamal Abdel Nasser', ideology: 'PanArabic', termStart: 1954 }, entryYear: 1945,
    capital: 'Cairo', areaKm2: 1001450
  },
  { 
    id: 'congo', name: 'Congo', nameTh: 'คองโก', influence: 0, stability: 20, status: 'Proxy War', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { uranium: 30, rawMaterials: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Patrice Lumumba', ideology: 'Nationalism', termStart: 1960 }, entryYear: 1960,
    capital: 'Leopoldville', areaKm2: 2344858
  },
  { 
    id: 'algeria', name: 'Algeria', nameTh: 'แอลจีเรีย', influence: -10, stability: 30, status: 'Proxy War', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { oil: 15 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Ahmed Ben Bella', ideology: 'Nationalism', termStart: 1962 }, entryYear: 1962,
    capital: 'Algiers', areaKm2: 2381741
  },
  { 
    id: 'ghana', name: 'Ghana', nameTh: 'กานา', influence: -5, stability: 50, status: 'Stable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { rawMaterials: 15 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Kwame Nkrumah', ideology: 'Nationalism', termStart: 1957 }, entryYear: 1957,
    capital: 'Accra', areaKm2: 238533
  },
  { 
    id: 'nigeria', name: 'Nigeria', nameTh: 'ไนจีเรีย', influence: 5, stability: 40, status: 'Unstable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { oil: 25, rawMaterials: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Nnamdi Azikiwe', ideology: 'Republic', termStart: 1960 }, entryYear: 1960,
    capital: 'Lagos', areaKm2: 923768
  },
  { 
    id: 'ethiopia', name: 'Ethiopia', nameTh: 'เอธิโอเปีย', influence: 0, stability: 55, status: 'Stable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { rawMaterials: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Monarchy', leader: { name: 'Haile Selassie', ideology: 'Monarchy', termStart: 1930 }, entryYear: 1945,
    capital: 'Addis Ababa', areaKm2: 1104300
  },
  { 
    id: 'angola', name: 'Angola', nameTh: 'แองโกลา', influence: -15, stability: 20, status: 'Proxy War', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { oil: 10, rawMaterials: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Agostinho Neto', ideology: 'Communism', termStart: 1975 }, entryYear: 1975,
    capital: 'Luanda', areaKm2: 1246700
  },
  { 
    id: 'south_africa', name: 'South Africa', nameTh: 'แอฟริกาใต้', influence: 40, stability: 60, status: 'Stable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { rawMaterials: 40, uranium: 15 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Jan Smuts', ideology: 'Nationalism', termStart: 1939 }, entryYear: 1945,
    capital: 'Pretoria', areaKm2: 1221037
  },

  // --- OCEANIA ---
  { 
    id: 'australia', name: 'Australia', nameTh: 'ออสเตรเลีย', influence: 80, stability: 90, status: 'Aligned', continent: 'Oceania', continentTh: 'โอเชียเนีย', 
    production: { rawMaterials: 40, uranium: 10 }, factories: [], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'John Curtin', ideology: 'Liberalism', termStart: 1941 }, entryYear: 1945,
    capital: 'Canberra', areaKm2: 7692024
  },
  { 
    id: 'new_zealand', name: 'New Zealand', nameTh: 'นิวซีแลนด์', influence: 80, stability: 95, status: 'Aligned', continent: 'Oceania', continentTh: 'โอเชียเนีย', 
    production: { rawMaterials: 20 }, factories: [], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Liberalism', leader: { name: 'Peter Fraser', ideology: 'Liberalism', termStart: 1940 }, entryYear: 1945,
    capital: 'Wellington', areaKm2: 268021
  },

  // --- ADDITIONAL ASIA ---
  { 
    id: 'philippines', name: 'Philippines', nameTh: 'ฟิลิปปินส์', influence: 40, stability: 50, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Manuel Roxas', ideology: 'Republic', termStart: 1946 }, entryYear: 1946,
    capital: 'Manila', areaKm2: 300000
  },
  { 
    id: 'malaysia', name: 'Malaysia', nameTh: 'มาเลเซีย', influence: 20, stability: 60, status: 'Stable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 30, oil: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Monarchy', leader: { name: 'Tunku Abdul Rahman', ideology: 'Monarchy', termStart: 1957 }, entryYear: 1957,
    capital: 'Kuala Lumpur', areaKm2: 330803
  },
  { 
    id: 'singapore', name: 'Singapore', nameTh: 'สิงคโปร์', influence: 30, stability: 80, status: 'Stable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { technology: 20, consumerGoods: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Lee Kuan Yew', ideology: 'Republic', termStart: 1959 }, entryYear: 1965,
    capital: 'Singapore', areaKm2: 728
  },
  { 
    id: 'burma', name: 'Burma', nameTh: 'พม่า', influence: -10, stability: 40, status: 'Unstable', continent: 'Asia', continentTh: 'เอเชีย', 
    production: { rawMaterials: 25 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'U Nu', ideology: 'Nationalism', termStart: 1948 }, entryYear: 1948,
    capital: 'Rangoon', areaKm2: 676578
  },

  // --- ADDITIONAL AFRICA ---
  { 
    id: 'libya', name: 'Libya', nameTh: 'ลิเบีย', influence: -20, stability: 50, status: 'Stable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { oil: 50 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'PanArabic', leader: { name: 'Muammar Gaddafi', ideology: 'PanArabic', termStart: 1969 }, entryYear: 1951,
    capital: 'Tripoli', areaKm2: 1759540
  },
  { 
    id: 'kenya', name: 'Kenya', nameTh: 'เคนยา', influence: 10, stability: 60, status: 'Stable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { rawMaterials: 15 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Jomo Kenyatta', ideology: 'Republic', termStart: 1963 }, entryYear: 1963,
    capital: 'Nairobi', areaKm2: 580367
  },
  { 
    id: 'zimbabwe', name: 'Zimbabwe', nameTh: 'ซิมบับเว', influence: -30, stability: 40, status: 'Unstable', continent: 'Africa', continentTh: 'แอฟริกา', 
    production: { rawMaterials: 20 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Communism', leader: { name: 'Robert Mugabe', ideology: 'Communism', termStart: 1980 }, entryYear: 1980,
    capital: 'Harare', areaKm2: 390757
  },

  // --- ADDITIONAL AMERICAS ---
  { 
    id: 'chile', name: 'Chile', nameTh: 'ชิลี', influence: -10, stability: 50, status: 'Unstable', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { rawMaterials: 30 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Salvador Allende', ideology: 'Communism', termStart: 1970 }, entryYear: 1945,
    capital: 'Santiago', areaKm2: 756102
  },
  { 
    id: 'venezuela', name: 'Venezuela', nameTh: 'เวเนซุเอลา', influence: 20, stability: 70, status: 'Stable', continent: 'Americas', continentTh: 'อเมริกา', 
    production: { oil: 50 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Rómulo Betancourt', ideology: 'Republic', termStart: 1945 }, entryYear: 1945,
    capital: 'Caracas', areaKm2: 916445
  },

  // --- ADDITIONAL EUROPE ---
  { 
    id: 'spain', name: 'Spain', nameTh: 'สเปน', influence: 30, stability: 80, status: 'Stable', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { rawMaterials: 20, steel: 10 }, factories: [], alliance: 'NON_ALIGNED', tradeEmbargo: false,
    ideology: 'Nationalism', leader: { name: 'Francisco Franco', ideology: 'Nationalism', termStart: 1939 }, entryYear: 1945,
    capital: 'Madrid', areaKm2: 505990
  },
  { 
    id: 'turkey', name: 'Turkey', nameTh: 'ตุรกี', influence: 50, stability: 70, status: 'Stable', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { rawMaterials: 20, steel: 10 }, factories: [], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Republic', leader: { name: 'Ismet Inönü', ideology: 'Republic', termStart: 1938 }, entryYear: 1945,
    capital: 'Ankara', areaKm2: 783356
  },
  { 
    id: 'greece', name: 'Greece', nameTh: 'กรีซ', influence: 40, stability: 40, status: 'Proxy War', continent: 'Europe', continentTh: 'ยุโรป', 
    production: { rawMaterials: 10 }, factories: [], alliance: 'NATO', tradeEmbargo: false,
    ideology: 'Monarchy', leader: { name: 'George II', ideology: 'Monarchy', termStart: 1935 }, entryYear: 1945,
    capital: 'Athens', areaKm2: 131957
  },
];
