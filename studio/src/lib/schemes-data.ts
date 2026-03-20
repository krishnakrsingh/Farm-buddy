// ============================================================
// Schemes Data Layer — Types + Realistic Indian Government Schemes
// ============================================================

// ── Types ────────────────────────────────────────────────────

export type ImpactLevel = "HIGH" | "MEDIUM" | "LOW";
export type SchemeStatus = "Active" | "Closing Soon" | "Upcoming";
export type BenefitType = "cash" | "subsidy" | "insurance" | "loan" | "equipment";

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  description: string;
  whyItMatters: string;
  benefitAmount: number; // ₹ per year
  benefitLabel: string; // e.g. "₹6,000/year", "Up to 50% subsidy"
  benefitType: BenefitType;
  impactLevel: ImpactLevel;
  status: SchemeStatus;
  deadline: string | null; // null = ongoing
  lastUpdated: string; // ISO date
  eligibility: {
    states: string[]; // empty = all states
    crops: string[]; // empty = all crops
    minLandAcres: number;
    maxLandAcres: number; // Infinity = no cap
    description: string; // farmer-friendly 1-liner
  };
  applicationSteps: ApplicationStep[];
  requiredDocuments: string[];
  tags: string[];
}

export interface UserProfile {
  state: string;
  cropType: string;
  landSizeAcres: number;
}

export interface EligibilityResult {
  scheme: Scheme;
  relevanceScore: number; // 0-100
  matchReasons: string[];
}

// ── Constants ────────────────────────────────────────────────

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export const CROP_TYPES = [
  "Wheat", "Rice", "Cotton", "Sugarcane", "Maize",
  "Pulses", "Soybean", "Groundnut", "Mustard", "Vegetables",
  "Fruits", "Millets", "Jute", "Tea", "Spices",
] as const;

export const LAND_SIZE_OPTIONS = [
  { label: "Less than 1 acre", value: 0.5 },
  { label: "1–2 acres", value: 1.5 },
  { label: "2–5 acres", value: 3.5 },
  { label: "5–10 acres", value: 7.5 },
  { label: "More than 10 acres", value: 12 },
] as const;

export const DEFAULT_PROFILE: UserProfile = {
  state: "Uttar Pradesh",
  cropType: "Wheat",
  landSizeAcres: 3.5,
};

// ── Schemes Database ─────────────────────────────────────────

export const ALL_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortName: "PM-KISAN",
    description: "Direct cash transfer of ₹6,000 per year to small and marginal farmer families, paid in 3 equal instalments of ₹2,000 every 4 months.",
    whyItMatters: "Guaranteed income support — money directly in your bank account, no middlemen.",
    benefitAmount: 6000,
    benefitLabel: "₹6,000/year",
    benefitType: "cash",
    impactLevel: "HIGH",
    status: "Active",
    deadline: null,
    lastUpdated: "2026-03-15T00:00:00Z",
    eligibility: {
      states: [],
      crops: [],
      minLandAcres: 0,
      maxLandAcres: 5,
      description: "All farmer families with cultivable land up to 5 acres",
    },
    applicationSteps: [
      { step: 1, title: "Visit CSC or Portal", description: "Go to your nearest Common Service Centre (CSC) or visit pmkisan.gov.in", icon: "Globe" },
      { step: 2, title: "Submit Aadhaar & Bank Details", description: "Provide Aadhaar number, bank account (IFSC), and mobile number", icon: "CreditCard" },
      { step: 3, title: "Land Verification", description: "Your land records will be verified by the state government", icon: "FileCheck" },
      { step: 4, title: "Receive Payment", description: "Once approved, ₹2,000 is deposited every 4 months directly to your account", icon: "Banknote" },
    ],
    requiredDocuments: ["Aadhaar Card", "Bank Passbook (with IFSC)", "Land Ownership Documents", "Mobile Number"],
    tags: ["Direct Benefit", "Cash Transfer", "Central Govt"],
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    shortName: "PMFBY",
    description: "Comprehensive crop insurance at very low premiums — just 2% for Kharif, 1.5% for Rabi crops. Protects against natural calamities, pests, and diseases.",
    whyItMatters: "If your crop fails due to flood, drought, or pests — you still get paid. Peace of mind for just ₹500-800.",
    benefitAmount: 25000,
    benefitLabel: "Up to ₹2,00,000 cover",
    benefitType: "insurance",
    impactLevel: "HIGH",
    status: "Active",
    deadline: "2026-07-31",
    lastUpdated: "2026-03-10T00:00:00Z",
    eligibility: {
      states: [],
      crops: ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Pulses", "Soybean", "Groundnut", "Mustard"],
      minLandAcres: 0,
      maxLandAcres: Infinity,
      description: "All farmers growing notified crops in notified areas",
    },
    applicationSteps: [
      { step: 1, title: "Visit Your Bank Branch", description: "Go to your bank where you have a crop loan or KCC account", icon: "Building" },
      { step: 2, title: "Fill Insurance Form", description: "Fill out the crop insurance proposal form with crop and area details", icon: "FileText" },
      { step: 3, title: "Pay Small Premium", description: "Pay 2% premium for Kharif, 1.5% for Rabi (rest is paid by government)", icon: "Wallet" },
      { step: 4, title: "Report Crop Loss", description: "In case of loss, report within 72 hours via app or toll-free number", icon: "AlertTriangle" },
    ],
    requiredDocuments: ["Aadhaar Card", "Bank Account Details", "Land Records / Khasra", "Sowing Certificate", "Crop Details"],
    tags: ["Insurance", "Crop Protection", "Central Govt"],
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    shortName: "Kisan Credit Card",
    description: "Get a credit card with a limit of up to ₹3 lakh at just 4% interest (after subsidy). Use it for seeds, fertilizers, equipment, and daily farm needs.",
    whyItMatters: "Cheapest farm loan available — no need to borrow from moneylenders at 24-36% interest.",
    benefitAmount: 15000,
    benefitLabel: "₹3L credit @ 4% interest",
    benefitType: "loan",
    impactLevel: "HIGH",
    status: "Active",
    deadline: null,
    lastUpdated: "2026-03-12T00:00:00Z",
    eligibility: {
      states: [],
      crops: [],
      minLandAcres: 0,
      maxLandAcres: Infinity,
      description: "All farmers, sharecroppers, and tenant farmers",
    },
    applicationSteps: [
      { step: 1, title: "Visit Any Bank", description: "Go to any commercial bank, cooperative bank, or regional rural bank", icon: "Building" },
      { step: 2, title: "Submit Application", description: "Fill the KCC application form with land and identity documents", icon: "FileText" },
      { step: 3, title: "Land & Credit Assessment", description: "Bank will assess your land value and set a credit limit", icon: "Search" },
      { step: 4, title: "Get Your KCC", description: "Receive your Kisan Credit Card and start using it for farm expenses", icon: "CreditCard" },
    ],
    requiredDocuments: ["Aadhaar Card", "PAN Card (optional)", "Land Documents", "Passport Size Photos", "Bank Account"],
    tags: ["Loan", "Credit", "Low Interest", "Central Govt"],
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM (Solar Pump Scheme)",
    shortName: "PM-KUSUM",
    description: "Get a solar water pump with 60% government subsidy. Reduce electricity bills to zero and earn extra by selling surplus solar power to the grid.",
    whyItMatters: "Free irrigation forever — save ₹30,000-50,000/year on diesel and electricity, plus earn from extra solar power.",
    benefitAmount: 45000,
    benefitLabel: "60% subsidy on solar pump",
    benefitType: "subsidy",
    impactLevel: "HIGH",
    status: "Active",
    deadline: "2026-09-30",
    lastUpdated: "2026-03-08T00:00:00Z",
    eligibility: {
      states: ["Rajasthan", "Gujarat", "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Haryana", "Karnataka", "Andhra Pradesh", "Tamil Nadu", "Telangana"],
      crops: [],
      minLandAcres: 1,
      maxLandAcres: Infinity,
      description: "Farmers with at least 1 acre of irrigable land in participating states",
    },
    applicationSteps: [
      { step: 1, title: "Apply Online", description: "Apply on the MNRE portal or your state's renewable energy department website", icon: "Globe" },
      { step: 2, title: "Site Inspection", description: "A government officer will visit your farm to verify land and water requirements", icon: "Map" },
      { step: 3, title: "Pay Your Share (40%)", description: "Pay 40% of pump cost (remaining 60% is subsidy). Bank loans available for your share.", icon: "Wallet" },
      { step: 4, title: "Installation", description: "Approved vendor installs the solar pump. Start free irrigation immediately!", icon: "Zap" },
    ],
    requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Account", "Electricity Bill (if applicable)", "Passport Photos"],
    tags: ["Solar", "Subsidy", "Irrigation", "Green Energy"],
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    shortName: "Soil Health Card",
    description: "Free soil testing with a detailed health card showing nutrient status. Get customized fertilizer recommendations to improve yields by 15-20%.",
    whyItMatters: "Know exactly what your soil needs — stop wasting money on wrong fertilizers, boost yields naturally.",
    benefitAmount: 8000,
    benefitLabel: "Free testing + 15-20% yield gain",
    benefitType: "subsidy",
    impactLevel: "MEDIUM",
    status: "Active",
    deadline: null,
    lastUpdated: "2026-02-28T00:00:00Z",
    eligibility: {
      states: [],
      crops: [],
      minLandAcres: 0,
      maxLandAcres: Infinity,
      description: "All farmers across India — completely free of cost",
    },
    applicationSteps: [
      { step: 1, title: "Contact Agriculture Office", description: "Visit your block/district agriculture office or call the helpline", icon: "Phone" },
      { step: 2, title: "Soil Sample Collection", description: "An officer collects soil samples from your field (or you can submit)", icon: "FlaskConical" },
      { step: 3, title: "Receive Health Card", description: "Get your Soil Health Card with nutrient analysis in 2-3 weeks", icon: "FileCheck" },
      { step: 4, title: "Follow Recommendations", description: "Use the card's fertilizer recommendations to optimize your input costs", icon: "Sprout" },
    ],
    requiredDocuments: ["Aadhaar Card", "Land Details (Village, Survey No.)", "Mobile Number"],
    tags: ["Free", "Soil Testing", "Yield Improvement", "Central Govt"],
  },
  {
    id: "enam",
    name: "e-NAM (National Agriculture Market)",
    shortName: "e-NAM",
    description: "Sell your produce online to buyers anywhere in India. Get the best price by comparing bids from multiple mandis. No middlemen, transparent pricing.",
    whyItMatters: "Get 10-15% better prices by selling directly to the highest bidder — cut out the dalal.",
    benefitAmount: 12000,
    benefitLabel: "10-15% better crop prices",
    benefitType: "cash",
    impactLevel: "MEDIUM",
    status: "Active",
    deadline: null,
    lastUpdated: "2026-03-05T00:00:00Z",
    eligibility: {
      states: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Haryana", "Gujarat", "Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Punjab", "Jharkhand", "Chhattisgarh", "Odisha", "West Bengal", "Bihar"],
      crops: ["Wheat", "Rice", "Maize", "Soybean", "Groundnut", "Mustard", "Cotton", "Pulses", "Vegetables", "Fruits"],
      minLandAcres: 0,
      maxLandAcres: Infinity,
      description: "Farmers in states with e-NAM mandis who want better crop prices",
    },
    applicationSteps: [
      { step: 1, title: "Register at Mandi", description: "Visit your nearest e-NAM mandi and register as a seller", icon: "UserPlus" },
      { step: 2, title: "Get Lot Tested", description: "Bring your produce for quality assaying and get a grade certificate", icon: "PackageCheck" },
      { step: 3, title: "List Online", description: "Your produce is listed on the e-NAM portal for buyers across India to bid", icon: "Globe" },
      { step: 4, title: "Accept Best Bid", description: "Accept the highest bid. Payment is transferred directly to your bank.", icon: "Banknote" },
    ],
    requiredDocuments: ["Aadhaar Card", "Bank Account", "Mandi License (if applicable)", "Mobile Number"],
    tags: ["Market Access", "Better Prices", "Digital", "Central Govt"],
  },
  {
    id: "mksp",
    name: "Mahila Kisan Sashaktikaran Pariyojana",
    shortName: "MKSP (Women Farmers)",
    description: "Special support for women farmers — free training, seed kits, small equipment, and up to ₹60,000 in financial support for agri-enterprises.",
    whyItMatters: "Empowers women farmers with tools, training, and capital to start their own farm business.",
    benefitAmount: 30000,
    benefitLabel: "Up to ₹60,000 support",
    benefitType: "subsidy",
    impactLevel: "MEDIUM",
    status: "Active",
    deadline: "2026-12-31",
    lastUpdated: "2026-03-01T00:00:00Z",
    eligibility: {
      states: [],
      crops: [],
      minLandAcres: 0,
      maxLandAcres: 5,
      description: "Women farmers and SHG (Self Help Group) members with small landholdings",
    },
    applicationSteps: [
      { step: 1, title: "Join SHG / Contact NRLM", description: "Join a local Self Help Group or contact the NRLM office in your district", icon: "Users" },
      { step: 2, title: "Attend Training", description: "Participate in agriculture and skills training programs offered free of cost", icon: "GraduationCap" },
      { step: 3, title: "Submit Proposal", description: "Submit a simple proposal for your agri-enterprise (help available)", icon: "FileText" },
      { step: 4, title: "Receive Support", description: "Get seed kits, equipment, and financial support for your farm business", icon: "Gift" },
    ],
    requiredDocuments: ["Aadhaar Card", "SHG Membership (if applicable)", "Bank Account", "Land Records (if any)", "Photos"],
    tags: ["Women", "Training", "Enterprise", "Central Govt"],
  },
  {
    id: "mgnrega",
    name: "MGNREGA (Farm Labour Guarantee)",
    shortName: "MGNREGA",
    description: "Guaranteed 100 days of paid work per year at ₹267-350/day. Includes farm-related work like land leveling, well digging, and irrigation channels.",
    whyItMatters: "Guaranteed income during lean farming season — plus gets your land improved for free.",
    benefitAmount: 28000,
    benefitLabel: "100 days × ₹280/day",
    benefitType: "cash",
    impactLevel: "MEDIUM",
    status: "Active",
    deadline: null,
    lastUpdated: "2026-03-18T00:00:00Z",
    eligibility: {
      states: [],
      crops: [],
      minLandAcres: 0,
      maxLandAcres: Infinity,
      description: "All rural households — at least one adult member willing to do manual work",
    },
    applicationSteps: [
      { step: 1, title: "Get Job Card", description: "Apply for MGNREGA Job Card at your Gram Panchayat office", icon: "IdCard" },
      { step: 2, title: "Request Work", description: "Submit a written application requesting work (work must start within 15 days)", icon: "FileText" },
      { step: 3, title: "Work at Site", description: "Report to the allocated work site. Attendance is recorded daily.", icon: "HardHat" },
      { step: 4, title: "Receive Wages", description: "Wages are deposited to your bank/post office account within 15 days", icon: "Banknote" },
    ],
    requiredDocuments: ["Aadhaar Card", "Job Card (or apply for one)", "Bank / Post Office Account", "Passport Photo"],
    tags: ["Employment", "Guaranteed Work", "Rural", "Central Govt"],
  },
  {
    id: "up-krishi-yantra",
    name: "UP Krishi Yantra Subsidy Yojana",
    shortName: "UP Agri Equipment Subsidy",
    description: "Get 50-80% subsidy on farm equipment like rotavators, threshers, sprayers, and seed drills. Specifically for UP small and marginal farmers.",
    whyItMatters: "Buy a ₹1 lakh machine for just ₹20,000–50,000 — mechanize your farm at throwaway prices.",
    benefitAmount: 35000,
    benefitLabel: "50–80% equipment subsidy",
    benefitType: "equipment",
    impactLevel: "HIGH",
    status: "Closing Soon",
    deadline: "2026-04-30",
    lastUpdated: "2026-03-19T00:00:00Z",
    eligibility: {
      states: ["Uttar Pradesh"],
      crops: [],
      minLandAcres: 0,
      maxLandAcres: 10,
      description: "Small and marginal farmers registered in UP with less than 10 acres",
    },
    applicationSteps: [
      { step: 1, title: "Register on DBT Portal", description: "Register on UP Agriculture DBT portal (upagriculture.com)", icon: "Globe" },
      { step: 2, title: "Select Equipment", description: "Choose the equipment you need from the approved list on the portal", icon: "Tractor" },
      { step: 3, title: "Submit Application", description: "Upload Aadhaar, land records, and bank details. Apply for the subsidy.", icon: "Upload" },
      { step: 4, title: "Buy & Claim", description: "After approval, buy from an empanelled dealer. Subsidy is sent to your bank.", icon: "Banknote" },
    ],
    requiredDocuments: ["Aadhaar Card", "Land Records (Khatauni)", "Bank Passbook", "Caste Certificate (for extra subsidy)", "Mobile Number"],
    tags: ["Equipment", "State Scheme", "UP Only", "Subsidy"],
  },
  {
    id: "rajasthan-drip-irrigation",
    name: "Rajasthan Drip Irrigation Subsidy",
    shortName: "RJ Drip Subsidy",
    description: "Get 70-85% subsidy on drip and sprinkler irrigation systems. Save 40-60% water, increase yields, and reduce labour costs dramatically.",
    whyItMatters: "Install ₹80,000 drip system for just ₹12,000 — save water, boost yield, and reduce farm labour.",
    benefitAmount: 40000,
    benefitLabel: "70–85% irrigation subsidy",
    benefitType: "subsidy",
    impactLevel: "HIGH",
    status: "Active",
    deadline: "2026-08-31",
    lastUpdated: "2026-03-14T00:00:00Z",
    eligibility: {
      states: ["Rajasthan"],
      crops: ["Vegetables", "Fruits", "Cotton", "Groundnut", "Mustard", "Spices"],
      minLandAcres: 0.5,
      maxLandAcres: Infinity,
      description: "Rajasthan farmers with at least 0.5 acres growing eligible crops",
    },
    applicationSteps: [
      { step: 1, title: "Apply on e-Mitra", description: "Visit your nearest e-Mitra kiosk or apply online on Rajasthan Agriculture portal", icon: "Globe" },
      { step: 2, title: "Field Survey", description: "Agriculture department officer visits your farm to verify land and water source", icon: "Map" },
      { step: 3, title: "Choose Vendor", description: "Select an approved drip irrigation vendor from the government panel", icon: "Store" },
      { step: 4, title: "Installation & Subsidy", description: "Vendor installs the system. 70-85% cost is reimbursed to your bank.", icon: "Droplets" },
    ],
    requiredDocuments: ["Aadhaar Card", "Jamabandi (Land Record)", "Bank Account", "Borewell / Water Source Details", "Caste Certificate"],
    tags: ["Irrigation", "Water Saving", "State Scheme", "Rajasthan Only"],
  },
];
