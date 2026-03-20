// Mock data for Blockchain-Enabled Mandi Trading System

export type CropPrice = {
  id: string;
  name: string;
  nameHi: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  change24h: number;
  changePercent: number;
  trend: "Rising" | "Falling" | "Stable";
  priceHistory: number[];
  msp: number;
  emoji: string;
  category: "cereal" | "pulse" | "oilseed" | "vegetable" | "fruit" | "spice" | "cash_crop" | "other";
};

export type Buyer = {
  id: string;
  name: string;
  company: string;
  avatar: string;
  trustScore: number;
  completedTrades: number;
  paymentSuccessRate: number;
  badge: "High Trust Buyer" | "Verified Buyer" | "New Buyer";
  offerPrice: number;
  location: string;
  distance: number;
};

export type Transporter = {
  id: string;
  name: string;
  vehicleType: string;
  vehicleNumber: string;
  avatar: string;
  trustScore: number;
  completedDeliveries: number;
  eta: string;
  costEstimate: number;
  badge: "Verified Transporter" | "Premium Fleet" | "New Driver";
  rating: number;
};

export type MandiLocation = {
  id: string;
  name: string;
  distance: number;
  currentPrice: number;
  demand: "High" | "Medium" | "Low";
};

export type TradeStatus = "idle" | "initiated" | "payment_locked" | "awaiting_pickup" | "in_transit" | "delivered" | "payment_released";

export type TradeTransaction = {
  id: string;
  txHash: string;
  smartContractId: string;
  blockId: string;
  timestamp: string;
  crop: CropPrice;
  quantity: number;
  totalAmount: number;
  buyer: Buyer;
  transporter: Transporter | null;
  mandi: MandiLocation;
  status: TradeStatus;
  supplyChain: SupplyChainStep[];
  farmer: { name: string; id: string; location: string };
};

export type SupplyChainStep = {
  id: string;
  label: string;
  status: "completed" | "active" | "pending";
  timestamp: string | null;
  verified: boolean;
  verificationHash: string | null;
  icon: string;
};

// === RENTAL MARKETPLACE TYPES ===

export type RentalCategory = "equipment" | "labor" | "land" | "storage";

export type RentalListing = {
  id: string;
  title: string;
  description: string;
  category: RentalCategory;
  subCategory: string;
  price: number;
  priceUnit: string; // "per hour", "per day", "per acre", "per season"
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerTotalRentals: number;
  location: string;
  distance: number;
  available: boolean;
  verified: boolean;
  emoji: string;
  images: string[];
  specs?: Record<string, string>;
};

// Generate mock hex strings
export function generateTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * 16)];
  return hash;
}

export function generateBlockId(): string {
  return `#${Math.floor(18000000 + Math.random() * 200000)}`;
}

export function generateContractId(): string {
  const chars = "0123456789abcdef";
  let id = "0x";
  for (let i = 0; i < 40; i++) id += chars[Math.floor(Math.random() * 16)];
  return id;
}

// Helper to generate price history from base price
function priceHist(base: number, volatility: number = 0.03): number[] {
  const pts: number[] = [];
  let p = base * (1 - volatility * 3);
  for (let i = 0; i < 7; i++) {
    p += (Math.random() - 0.4) * base * volatility;
    pts.push(Math.round(p));
  }
  return pts;
}

// ===========================
// CROP PRICES - Wide Variety
// ===========================

export const CROPS: CropPrice[] = [
  // CEREALS
  { id: "wheat", name: "Wheat", nameHi: "गेहूं", unit: "Quintal", currentPrice: 2275, previousPrice: 2250, change24h: 25, changePercent: 1.11, trend: "Rising", priceHistory: priceHist(2275), msp: 2275, emoji: "🌾", category: "cereal" },
  { id: "rice", name: "Rice (Paddy)", nameHi: "धान", unit: "Quintal", currentPrice: 2183, previousPrice: 2200, change24h: -17, changePercent: -0.77, trend: "Falling", priceHistory: priceHist(2183), msp: 2183, emoji: "🍚", category: "cereal" },
  { id: "bajra", name: "Bajra (Pearl Millet)", nameHi: "बाजरा", unit: "Quintal", currentPrice: 2500, previousPrice: 2480, change24h: 20, changePercent: 0.81, trend: "Rising", priceHistory: priceHist(2500), msp: 2500, emoji: "🌿", category: "cereal" },
  { id: "jowar", name: "Jowar (Sorghum)", nameHi: "ज्वार", unit: "Quintal", currentPrice: 3180, previousPrice: 3180, change24h: 0, changePercent: 0, trend: "Stable", priceHistory: priceHist(3180), msp: 3180, emoji: "🌱", category: "cereal" },
  { id: "maize", name: "Maize (Corn)", nameHi: "मक्का", unit: "Quintal", currentPrice: 2090, previousPrice: 2070, change24h: 20, changePercent: 0.97, trend: "Rising", priceHistory: priceHist(2090), msp: 2090, emoji: "🌽", category: "cereal" },
  { id: "ragi", name: "Ragi (Finger Millet)", nameHi: "रागी", unit: "Quintal", currentPrice: 3846, previousPrice: 3850, change24h: -4, changePercent: -0.10, trend: "Stable", priceHistory: priceHist(3846), msp: 3846, emoji: "🫘", category: "cereal" },
  { id: "barley", name: "Barley", nameHi: "जौ", unit: "Quintal", currentPrice: 1735, previousPrice: 1720, change24h: 15, changePercent: 0.87, trend: "Rising", priceHistory: priceHist(1735), msp: 1735, emoji: "🌾", category: "cereal" },

  // PULSES
  { id: "chana", name: "Chana (Chickpea)", nameHi: "चना", unit: "Quintal", currentPrice: 5440, previousPrice: 5400, change24h: 40, changePercent: 0.74, trend: "Rising", priceHistory: priceHist(5440), msp: 5440, emoji: "🫘", category: "pulse" },
  { id: "toor", name: "Toor Dal (Pigeon Pea)", nameHi: "तूर दाल", unit: "Quintal", currentPrice: 7000, previousPrice: 7050, change24h: -50, changePercent: -0.71, trend: "Falling", priceHistory: priceHist(7000), msp: 7000, emoji: "🥣", category: "pulse" },
  { id: "moong", name: "Moong Dal", nameHi: "मूंग दाल", unit: "Quintal", currentPrice: 8558, previousPrice: 8500, change24h: 58, changePercent: 0.68, trend: "Rising", priceHistory: priceHist(8558), msp: 8558, emoji: "🌿", category: "pulse" },
  { id: "urad", name: "Urad Dal", nameHi: "उड़द दाल", unit: "Quintal", currentPrice: 6950, previousPrice: 6950, change24h: 0, changePercent: 0, trend: "Stable", priceHistory: priceHist(6950), msp: 6950, emoji: "🫘", category: "pulse" },
  { id: "masoor", name: "Masoor Dal (Lentil)", nameHi: "मसूर दाल", unit: "Quintal", currentPrice: 6425, previousPrice: 6400, change24h: 25, changePercent: 0.39, trend: "Rising", priceHistory: priceHist(6425), msp: 6425, emoji: "🍲", category: "pulse" },

  // OILSEEDS
  { id: "mustard", name: "Mustard", nameHi: "सरसों", unit: "Quintal", currentPrice: 5650, previousPrice: 5600, change24h: 50, changePercent: 0.89, trend: "Rising", priceHistory: priceHist(5650), msp: 5450, emoji: "🌻", category: "oilseed" },
  { id: "soybean", name: "Soybean", nameHi: "सोयाबीन", unit: "Quintal", currentPrice: 4600, previousPrice: 4550, change24h: 50, changePercent: 1.10, trend: "Rising", priceHistory: priceHist(4600), msp: 4600, emoji: "🫘", category: "oilseed" },
  { id: "groundnut", name: "Groundnut", nameHi: "मूंगफली", unit: "Quintal", currentPrice: 6377, previousPrice: 6350, change24h: 27, changePercent: 0.43, trend: "Rising", priceHistory: priceHist(6377), msp: 6377, emoji: "🥜", category: "oilseed" },
  { id: "sunflower", name: "Sunflower", nameHi: "सूरजमुखी", unit: "Quintal", currentPrice: 6760, previousPrice: 6800, change24h: -40, changePercent: -0.59, trend: "Falling", priceHistory: priceHist(6760), msp: 6760, emoji: "🌻", category: "oilseed" },
  { id: "sesame", name: "Sesame (Til)", nameHi: "तिल", unit: "Quintal", currentPrice: 8635, previousPrice: 8600, change24h: 35, changePercent: 0.41, trend: "Rising", priceHistory: priceHist(8635), msp: 8635, emoji: "🌿", category: "oilseed" },

  // CASH CROPS
  { id: "cotton", name: "Cotton", nameHi: "कपास", unit: "Quintal", currentPrice: 6620, previousPrice: 6620, change24h: 0, changePercent: 0, trend: "Stable", priceHistory: priceHist(6620), msp: 6620, emoji: "🏵️", category: "cash_crop" },
  { id: "sugarcane", name: "Sugarcane", nameHi: "गन्ना", unit: "Quintal", currentPrice: 315, previousPrice: 310, change24h: 5, changePercent: 1.61, trend: "Rising", priceHistory: priceHist(315), msp: 315, emoji: "🎋", category: "cash_crop" },
  { id: "jute", name: "Jute", nameHi: "जूट", unit: "Quintal", currentPrice: 4750, previousPrice: 4700, change24h: 50, changePercent: 1.06, trend: "Rising", priceHistory: priceHist(4750), msp: 4750, emoji: "🧶", category: "cash_crop" },
  { id: "tobacco", name: "Tobacco", nameHi: "तम्बाकू", unit: "Quintal", currentPrice: 6800, previousPrice: 6850, change24h: -50, changePercent: -0.73, trend: "Falling", priceHistory: priceHist(6800), msp: 0, emoji: "🍃", category: "cash_crop" },

  // VEGETABLES
  { id: "potato", name: "Potato", nameHi: "आलू", unit: "Quintal", currentPrice: 1200, previousPrice: 1180, change24h: 20, changePercent: 1.69, trend: "Rising", priceHistory: priceHist(1200, 0.05), msp: 0, emoji: "🥔", category: "vegetable" },
  { id: "onion", name: "Onion", nameHi: "प्याज", unit: "Quintal", currentPrice: 2800, previousPrice: 2900, change24h: -100, changePercent: -3.45, trend: "Falling", priceHistory: priceHist(2800, 0.06), msp: 0, emoji: "🧅", category: "vegetable" },
  { id: "tomato", name: "Tomato", nameHi: "टमाटर", unit: "Quintal", currentPrice: 3500, previousPrice: 3200, change24h: 300, changePercent: 9.38, trend: "Rising", priceHistory: priceHist(3500, 0.08), msp: 0, emoji: "🍅", category: "vegetable" },
  { id: "brinjal", name: "Brinjal", nameHi: "बैंगन", unit: "Quintal", currentPrice: 1800, previousPrice: 1850, change24h: -50, changePercent: -2.70, trend: "Falling", priceHistory: priceHist(1800, 0.05), msp: 0, emoji: "🍆", category: "vegetable" },
  { id: "cabbage", name: "Cabbage", nameHi: "पत्ता गोभी", unit: "Quintal", currentPrice: 900, previousPrice: 920, change24h: -20, changePercent: -2.17, trend: "Falling", priceHistory: priceHist(900, 0.05), msp: 0, emoji: "🥬", category: "vegetable" },
  { id: "cauliflower", name: "Cauliflower", nameHi: "फूल गोभी", unit: "Quintal", currentPrice: 1500, previousPrice: 1480, change24h: 20, changePercent: 1.35, trend: "Rising", priceHistory: priceHist(1500, 0.05), msp: 0, emoji: "🥦", category: "vegetable" },
  { id: "green_chilli", name: "Green Chilli", nameHi: "हरी मिर्च", unit: "Quintal", currentPrice: 4200, previousPrice: 4000, change24h: 200, changePercent: 5.0, trend: "Rising", priceHistory: priceHist(4200, 0.07), msp: 0, emoji: "🌶️", category: "vegetable" },
  { id: "peas", name: "Green Peas", nameHi: "मटर", unit: "Quintal", currentPrice: 5500, previousPrice: 5400, change24h: 100, changePercent: 1.85, trend: "Rising", priceHistory: priceHist(5500, 0.04), msp: 0, emoji: "🟢", category: "vegetable" },
  { id: "okra", name: "Okra (Bhindi)", nameHi: "भिंडी", unit: "Quintal", currentPrice: 2200, previousPrice: 2200, change24h: 0, changePercent: 0, trend: "Stable", priceHistory: priceHist(2200, 0.04), msp: 0, emoji: "🥒", category: "vegetable" },
  { id: "garlic", name: "Garlic", nameHi: "लहसुन", unit: "Quintal", currentPrice: 8500, previousPrice: 8200, change24h: 300, changePercent: 3.66, trend: "Rising", priceHistory: priceHist(8500, 0.06), msp: 0, emoji: "🧄", category: "vegetable" },

  // FRUITS
  { id: "mango", name: "Mango", nameHi: "आम", unit: "Quintal", currentPrice: 4500, previousPrice: 4400, change24h: 100, changePercent: 2.27, trend: "Rising", priceHistory: priceHist(4500, 0.05), msp: 0, emoji: "🥭", category: "fruit" },
  { id: "banana", name: "Banana", nameHi: "केला", unit: "Quintal", currentPrice: 1200, previousPrice: 1200, change24h: 0, changePercent: 0, trend: "Stable", priceHistory: priceHist(1200, 0.03), msp: 0, emoji: "🍌", category: "fruit" },
  { id: "apple", name: "Apple", nameHi: "सेब", unit: "Quintal", currentPrice: 8000, previousPrice: 7800, change24h: 200, changePercent: 2.56, trend: "Rising", priceHistory: priceHist(8000, 0.04), msp: 0, emoji: "🍎", category: "fruit" },
  { id: "guava", name: "Guava", nameHi: "अमरूद", unit: "Quintal", currentPrice: 2800, previousPrice: 2850, change24h: -50, changePercent: -1.75, trend: "Falling", priceHistory: priceHist(2800, 0.04), msp: 0, emoji: "🍈", category: "fruit" },
  { id: "papaya", name: "Papaya", nameHi: "पपीता", unit: "Quintal", currentPrice: 1500, previousPrice: 1450, change24h: 50, changePercent: 3.45, trend: "Rising", priceHistory: priceHist(1500, 0.04), msp: 0, emoji: "🍈", category: "fruit" },

  // SPICES
  { id: "turmeric", name: "Turmeric (Haldi)", nameHi: "हल्दी", unit: "Quintal", currentPrice: 14500, previousPrice: 14200, change24h: 300, changePercent: 2.11, trend: "Rising", priceHistory: priceHist(14500, 0.04), msp: 0, emoji: "🟡", category: "spice" },
  { id: "red_chilli", name: "Red Chilli", nameHi: "लाल मिर्च", unit: "Quintal", currentPrice: 18000, previousPrice: 18200, change24h: -200, changePercent: -1.10, trend: "Falling", priceHistory: priceHist(18000, 0.04), msp: 0, emoji: "🌶️", category: "spice" },
  { id: "coriander", name: "Coriander Seeds", nameHi: "धनिया", unit: "Quintal", currentPrice: 7200, previousPrice: 7100, change24h: 100, changePercent: 1.41, trend: "Rising", priceHistory: priceHist(7200, 0.04), msp: 0, emoji: "🌿", category: "spice" },
  { id: "cumin", name: "Cumin (Jeera)", nameHi: "जीरा", unit: "Quintal", currentPrice: 32000, previousPrice: 31500, change24h: 500, changePercent: 1.59, trend: "Rising", priceHistory: priceHist(32000, 0.03), msp: 0, emoji: "✨", category: "spice" },
  { id: "cardamom", name: "Cardamom", nameHi: "इलायची", unit: "Kg", currentPrice: 2200, previousPrice: 2150, change24h: 50, changePercent: 2.33, trend: "Rising", priceHistory: priceHist(2200, 0.04), msp: 0, emoji: "🌿", category: "spice" },
  { id: "ginger", name: "Ginger (Adrak)", nameHi: "अदरक", unit: "Quintal", currentPrice: 4800, previousPrice: 4700, change24h: 100, changePercent: 2.13, trend: "Rising", priceHistory: priceHist(4800, 0.05), msp: 0, emoji: "🫚", category: "spice" },
];

// Category labels
export const CROP_CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "all", label: "All Crops", emoji: "📊" },
  { key: "cereal", label: "Cereals", emoji: "🌾" },
  { key: "pulse", label: "Pulses", emoji: "🫘" },
  { key: "oilseed", label: "Oilseeds", emoji: "🌻" },
  { key: "cash_crop", label: "Cash Crops", emoji: "💰" },
  { key: "vegetable", label: "Vegetables", emoji: "🥬" },
  { key: "fruit", label: "Fruits", emoji: "🍎" },
  { key: "spice", label: "Spices", emoji: "🌶️" },
  { key: "rising", label: "Rising ↑", emoji: "📈" },
  { key: "above_msp", label: "≥ MSP", emoji: "🛡️" },
];

// ===========================
// RENTAL MARKETPLACE
// ===========================

export const RENTAL_LISTINGS: RentalListing[] = [
  // EQUIPMENT
  {
    id: "r1", title: "Mahindra 575 DI Tractor", description: "Well-maintained 45HP tractor, perfect for ploughing and hauling. Comes with driver.",
    category: "equipment", subCategory: "Tractor", price: 800, priceUnit: "per hour",
    ownerName: "Ramesh Yadav", ownerAvatar: "https://i.pravatar.cc/150?img=15", ownerRating: 4.8, ownerTotalRentals: 156,
    location: "Pipli", distance: 3, available: true, verified: true, emoji: "🚜",
    images: [], specs: { "HP": "45 HP", "Hours Used": "2,400 hrs", "Year": "2021", "Fuel": "Diesel" },
  },
  {
    id: "r2", title: "Swaraj 744 FE Tractor", description: "48HP tractor available with rotavator attachment. Ideal for field preparation.",
    category: "equipment", subCategory: "Tractor", price: 900, priceUnit: "per hour",
    ownerName: "Sukhdev Singh", ownerAvatar: "https://i.pravatar.cc/150?img=51", ownerRating: 4.6, ownerTotalRentals: 89,
    location: "Thanesar", distance: 8, available: true, verified: true, emoji: "🚜",
    images: [], specs: { "HP": "48 HP", "Attachment": "Rotavator", "Year": "2022", "Fuel": "Diesel" },
  },
  {
    id: "r3", title: "Combined Harvester", description: "John Deere W70 combine harvester. Experienced operator included.",
    category: "equipment", subCategory: "Harvester", price: 2500, priceUnit: "per hour",
    ownerName: "Jagdish Farms", ownerAvatar: "https://i.pravatar.cc/150?img=22", ownerRating: 4.9, ownerTotalRentals: 312,
    location: "Karnal", distance: 30, available: true, verified: true, emoji: "🔧",
    images: [], specs: { "Model": "John Deere W70", "Cutting Width": "14 ft", "Year": "2023" },
  },
  {
    id: "r4", title: "Rotavator (Standalone)", description: "Heavy-duty rotavator attachment, fits most 40+ HP tractors.",
    category: "equipment", subCategory: "Attachment", price: 400, priceUnit: "per hour",
    ownerName: "Krishan Lal", ownerAvatar: "https://i.pravatar.cc/150?img=40", ownerRating: 4.3, ownerTotalRentals: 45,
    location: "Ladwa", distance: 15, available: true, verified: false, emoji: "⚙️",
    images: [], specs: { "Width": "6 ft", "Blades": "42", "Condition": "Good" },
  },
  {
    id: "r5", title: "Drone Sprayer", description: "10L capacity agricultural drone for pesticide/fertilizer spraying. Operator included.",
    category: "equipment", subCategory: "Drone", price: 500, priceUnit: "per acre",
    ownerName: "AgriTech Solutions", ownerAvatar: "https://i.pravatar.cc/150?img=35", ownerRating: 4.7, ownerTotalRentals: 78,
    location: "Kurukshetra", distance: 6, available: true, verified: true, emoji: "🛸",
    images: [], specs: { "Capacity": "10L", "Coverage": "1 acre/10min", "Type": "Hexacopter" },
  },
  {
    id: "r6", title: "Seed Drill Machine", description: "Multi-crop seed drill for precise sowing. Available with tractor.",
    category: "equipment", subCategory: "Seed Drill", price: 600, priceUnit: "per hour",
    ownerName: "Harpal Singh", ownerAvatar: "https://i.pravatar.cc/150?img=17", ownerRating: 4.5, ownerTotalRentals: 32,
    location: "Shahabad", distance: 20, available: false, verified: true, emoji: "🌱",
    images: [], specs: { "Rows": "9", "Type": "Zero-till", "Condition": "Excellent" },
  },
  {
    id: "r7", title: "Water Tanker (5000L)", description: "Mobile water tanker for irrigation support. Driver included.",
    category: "equipment", subCategory: "Tanker", price: 1200, priceUnit: "per trip",
    ownerName: "Pawan Transport", ownerAvatar: "https://i.pravatar.cc/150?img=48", ownerRating: 4.4, ownerTotalRentals: 210,
    location: "Pipli", distance: 5, available: true, verified: true, emoji: "💧",
    images: [], specs: { "Capacity": "5,000L", "Pump": "Included", "Delivery": "30km radius" },
  },

  // LABOR
  {
    id: "l1", title: "Experienced Farm Worker", description: "Skilled in sowing, harvesting, and general farm work. 10+ years experience.",
    category: "labor", subCategory: "Farm Worker", price: 500, priceUnit: "per day",
    ownerName: "Mohan Lal", ownerAvatar: "https://i.pravatar.cc/150?img=59", ownerRating: 4.6, ownerTotalRentals: 340,
    location: "Pipli", distance: 2, available: true, verified: true, emoji: "👷",
    images: [], specs: { "Experience": "10+ years", "Skills": "Sowing, Harvesting, Irrigation", "Available": "Full day" },
  },
  {
    id: "l2", title: "Harvesting Team (5 Workers)", description: "Team of 5 experienced harvesters available for wheat/paddy cutting.",
    category: "labor", subCategory: "Harvest Team", price: 2000, priceUnit: "per day",
    ownerName: "Bhim Singh Group", ownerAvatar: "https://i.pravatar.cc/150?img=13", ownerRating: 4.8, ownerTotalRentals: 89,
    location: "Thanesar", distance: 10, available: true, verified: true, emoji: "👥",
    images: [], specs: { "Team Size": "5 workers", "Specialty": "Wheat & Paddy", "Tools": "Included" },
  },
  {
    id: "l3", title: "Tractor Driver / Operator", description: "Licensed tractor operator available for all farm operations.",
    category: "labor", subCategory: "Operator", price: 600, priceUnit: "per day",
    ownerName: "Raju Kumar", ownerAvatar: "https://i.pravatar.cc/150?img=8", ownerRating: 4.5, ownerTotalRentals: 67,
    location: "Ladwa", distance: 12, available: true, verified: true, emoji: "🧑‍🔧",
    images: [], specs: { "License": "Heavy Vehicle", "Experience": "8 years", "Tractors": "Mahindra, Swaraj, John Deere" },
  },
  {
    id: "l4", title: "Drone Pilot for Spraying", description: "Certified drone pilot for precision spraying operations.",
    category: "labor", subCategory: "Drone Pilot", price: 1500, priceUnit: "per day",
    ownerName: "Vikash Tech", ownerAvatar: "https://i.pravatar.cc/150?img=33", ownerRating: 4.9, ownerTotalRentals: 42,
    location: "Kurukshetra", distance: 7, available: true, verified: true, emoji: "🎮",
    images: [], specs: { "Certification": "DGCA Licensed", "Drones": "DJI Agras T30", "Coverage": "50 acres/day" },
  },

  // LAND
  {
    id: "la1", title: "5 Acre Irrigated Farmland", description: "Well-irrigated flat farmland with bore well. Available for seasonal lease.",
    category: "land", subCategory: "Farmland", price: 15000, priceUnit: "per acre/season",
    ownerName: "Dharamveer Singh", ownerAvatar: "https://i.pravatar.cc/150?img=45", ownerRating: 4.7, ownerTotalRentals: 12,
    location: "Shahabad", distance: 18, available: true, verified: true, emoji: "🏞️",
    images: [], specs: { "Area": "5 acres", "Irrigation": "Bore well", "Soil": "Alluvial", "Road Access": "Yes" },
  },
  {
    id: "la2", title: "2 Acre Organic Certified Land", description: "Certified organic farmland, no chemical use in 5 years. Perfect for premium crops.",
    category: "land", subCategory: "Organic Land", price: 22000, priceUnit: "per acre/season",
    ownerName: "Green Valley Farm", ownerAvatar: "https://i.pravatar.cc/150?img=29", ownerRating: 4.8, ownerTotalRentals: 8,
    location: "Pehowa", distance: 25, available: true, verified: true, emoji: "🌿",
    images: [], specs: { "Area": "2 acres", "Certification": "NPOP Organic", "Water": "Canal + Well" },
  },

  // STORAGE
  {
    id: "s1", title: "Cold Storage Unit (50 MT)", description: "Temperature-controlled cold storage for vegetables and fruits.",
    category: "storage", subCategory: "Cold Storage", price: 8, priceUnit: "per quintal/day",
    ownerName: "Haryana Cold Chain", ownerAvatar: "https://i.pravatar.cc/150?img=38", ownerRating: 4.6, ownerTotalRentals: 450,
    location: "Karnal", distance: 32, available: true, verified: true, emoji: "❄️",
    images: [], specs: { "Capacity": "50 MT", "Temp Range": "2°C - 8°C", "24/7": "Yes", "Security": "CCTV" },
  },
  {
    id: "s2", title: "Grain Warehouse (200 MT)", description: "Dry warehouse for grain & cereal storage. Pest-controlled.",
    category: "storage", subCategory: "Warehouse", price: 4, priceUnit: "per quintal/day",
    ownerName: "Godown Services", ownerAvatar: "https://i.pravatar.cc/150?img=20", ownerRating: 4.4, ownerTotalRentals: 230,
    location: "Thanesar", distance: 10, available: true, verified: true, emoji: "🏭",
    images: [], specs: { "Capacity": "200 MT", "Type": "Dry Storage", "Pest Control": "Monthly", "Insurance": "Available" },
  },
];

export const RENTAL_CATEGORIES: { key: RentalCategory | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "All", emoji: "🔍" },
  { key: "equipment", label: "Equipment", emoji: "🚜" },
  { key: "labor", label: "Workers", emoji: "👷" },
  { key: "land", label: "Land", emoji: "🏞️" },
  { key: "storage", label: "Storage", emoji: "❄️" },
];

// Buyers mock data
export const BUYERS: Buyer[] = [
  { id: "b1", name: "Rajesh Agarwal", company: "AgraFoods Pvt Ltd", avatar: "https://i.pravatar.cc/150?img=12", trustScore: 96, completedTrades: 342, paymentSuccessRate: 99.4, badge: "High Trust Buyer", offerPrice: 2310, location: "Karnal", distance: 35 },
  { id: "b2", name: "Priya Sharma", company: "HarvestLink Corp", avatar: "https://i.pravatar.cc/150?img=26", trustScore: 91, completedTrades: 187, paymentSuccessRate: 98.2, badge: "Verified Buyer", offerPrice: 2290, location: "Thanesar", distance: 12 },
  { id: "b3", name: "Amit Gupta", company: "KisanDirect", avatar: "https://i.pravatar.cc/150?img=53", trustScore: 88, completedTrades: 94, paymentSuccessRate: 97.8, badge: "Verified Buyer", offerPrice: 2280, location: "Pipli", distance: 4 },
  { id: "b4", name: "Vikram Singh", company: "FarmGate Trading", avatar: "https://i.pravatar.cc/150?img=60", trustScore: 78, completedTrades: 23, paymentSuccessRate: 95.0, badge: "New Buyer", offerPrice: 2300, location: "Shahabad", distance: 22 },
];

// Transporters
export const TRANSPORTERS: Transporter[] = [
  { id: "t1", name: "Suresh Transport", vehicleType: "Tata 407", vehicleNumber: "HR-07-AB-1234", avatar: "https://i.pravatar.cc/150?img=14", trustScore: 94, completedDeliveries: 512, eta: "45 min", costEstimate: 1800, badge: "Verified Transporter", rating: 4.8 },
  { id: "t2", name: "FastHaul Logistics", vehicleType: "Mahindra Bolero Pickup", vehicleNumber: "HR-03-CD-5678", avatar: "https://i.pravatar.cc/150?img=32", trustScore: 97, completedDeliveries: 1203, eta: "30 min", costEstimate: 2200, badge: "Premium Fleet", rating: 4.9 },
  { id: "t3", name: "Kishan Carriers", vehicleType: "Eicher 10.59", vehicleNumber: "HR-12-EF-9012", avatar: "https://i.pravatar.cc/150?img=57", trustScore: 85, completedDeliveries: 78, eta: "1 hr 15 min", costEstimate: 1500, badge: "New Driver", rating: 4.4 },
];

// Mandis
export const MANDIS: MandiLocation[] = [
  { id: "m1", name: "Pipli Mandi", distance: 4, currentPrice: 2275, demand: "High" },
  { id: "m2", name: "Thanesar Mandi", distance: 12, currentPrice: 2310, demand: "Medium" },
  { id: "m3", name: "Ladwa Mandi", distance: 18, currentPrice: 2300, demand: "High" },
  { id: "m4", name: "Shahabad Mandi", distance: 22, currentPrice: 2240, demand: "Low" },
  { id: "m5", name: "Karnal Mandi", distance: 35, currentPrice: 2350, demand: "High" },
];

// Supply chain template
export function createSupplyChainSteps(): SupplyChainStep[] {
  return [
    { id: "s1", label: "Harvested & Weighed", status: "pending", timestamp: null, verified: false, verificationHash: null, icon: "🌾" },
    { id: "s2", label: "Quality Inspected", status: "pending", timestamp: null, verified: false, verificationHash: null, icon: "🔍" },
    { id: "s3", label: "Packed & Sealed", status: "pending", timestamp: null, verified: false, verificationHash: null, icon: "📦" },
    { id: "s4", label: "Dispatched", status: "pending", timestamp: null, verified: false, verificationHash: null, icon: "🚛" },
    { id: "s5", label: "Delivered to Mandi", status: "pending", timestamp: null, verified: false, verificationHash: null, icon: "🏪" },
    { id: "s6", label: "Payment Released", status: "pending", timestamp: null, verified: false, verificationHash: null, icon: "💰" },
  ];
}
