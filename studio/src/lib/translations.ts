// All UI string translations for 23 languages
// Keys are used with the t() function from LanguageContext

type TranslationMap = Record<string, Record<string, string>>;

const en: Record<string, string> = {
  // Home page
  "hey": "Hey!",
  "pro_farmer": "Pro Farmer",
  "weather_updates": "Weather Updates",
  "dr_farm_ai": "Dr. Farm AI",
  "crop_pathologist": "Crop Pathologist",
  "free": "Free",
  "unlimited_24_7": "24/7 Unlimited",
  "message": "Message",
  "video_call": "Video Call",
  "connecting": "Connecting...",
  "listening": "Listening... speak now",
  "ai_ready": "AI ready for your questions.",
  "online": "Online",

  // Weather
  "sunny": "Sunny",
  "feels": "Feels",
  "moisture": "Moisture",
  "wind": "Wind",
  "now": "Now",

  // Field page
  "live_field": "Live Field",
  "active": "Active",
  "sector_a": "Sector A",
  "moderate_risk": "Moderate Risk",
  "live": "Live",
  "optimal": "Optimal",
  "attention": "Attention",
  "critical": "Critical",
  "node_analytics": "Node Analytics",
  "active_alerts": "Active Alerts",
  "close": "Close",
  "temp": "Temp",
  "healthy": "healthy",
  "critical_status": "critical",
  "optimal_conditions": "Optimal Conditions",
  "no_intervention": "This sector is operating perfectly. No intervention required.",
  "trigger_sprinklers": "Trigger Sprinklers",
  "critical_dryness": "Critical Dryness",
  "critical_dryness_details": "Soil moisture critically low at 15%. High risk of crop perishing. Immediate remote irrigation required in this sector.",
  "moisture_critically_low": "Moisture critically low",
  "all_clear": "All Clear",
  "no_critical_issues": "No critical issues detected in the field.",

  // Chat page
  "local_ai_assistant": "Local AI Assistant",
  "on_phone_ai": "On-Phone AI 📱",
  "private_ai_phone": "Private AI running on your phone via Ollama in Termux. Zero cloud.",
  "private_ai_pc": "Your private farming assistant powered by local LLMs via Ollama.",
  "what_crops": "What crops to plant?",
  "soil_tips": "Soil health tips",
  "pest_control": "Pest control?",
  "ask_placeholder": "Ask about crops, soil, weather...",
  "connect_first": "Connect to Ollama first...",
  "disconnected": "Disconnected",
  "ollama_location": "Ollama Location",
  "pc_server": "PC Server",
  "on_phone": "On Phone",
  "model": "Model",

  // Scan / Live Analysis
  "ready_to_connect": "Ready to connect",

  // Mandi Prices
  "market_prices": "Market Prices",
  "live_mandi_rates": "Live nearby mandi rates",
  "nearest_deals": "Nearest Deals",
  "rate_per_quintal": "Rate / Quintal",
  "wheat": "Wheat (Gehu)",
  "paddy": "Paddy",
  "mustard": "Mustard",
  "cotton": "Cotton",
  "km_away": "km away",
  "trend": "TREND",
  "rising": "RISING",
  "falling": "FALLING",
  "stable": "STABLE",
  "trends_note": "Trends shown are calculated based on the local 7-day price movement for this specific crop, to help you make informed decisions without absolute commands.",

  // Schemes
  "government_schemes": "Government Schemes",
  "find_support": "Find support and subsidies you are eligible for.",
  "active_status": "Active",
  "closes_soon": "Closes Soon",
  "you_are_eligible": "You are eligible",
  "apply_now": "Apply Now",
  "check_eligibility": "Check Eligibility",
  "pm_kisan": "PM-Kisan Samman Nidhi",
  "pm_kisan_desc": "Financial benefit of ₹6,000 per year payable in three equal installments.",
  "tractor_subsidy": "Haryana Tractor Subsidy",
  "tractor_subsidy_desc": "Up to 50% subsidy on purchase of new tractors for registered farmers.",

  // More Services
  "more_services": "More Services",
  "tools_news_account": "Tools, news, and your account",
  "utility": "Utility",
  "community": "Community",
  "account": "Account",
  "farm_records": "Farm Records",
  "farm_records_desc": "Track crops, fertilizer, and yield",
  "gov_schemes": "Gov Schemes",
  "gov_schemes_desc": "Find PM-Kisan & subsidies",
  "marketplace": "Marketplace",
  "marketplace_desc": "Buy or sell equipment",
  "agri_news": "Agri News",
  "agri_news_desc": "Latest farming updates",
  "my_profile": "My Profile",
  "my_profile_desc": "Settings and personal details",
  "help_support": "Help & Support",
  "help_support_desc": "Contact doctor or admin",

  // Language
  "select_language": "Select Language",
};

export const translations: TranslationMap = { en };

// Helper to add a language with only overrides (English fallback for missing keys)
function addLang(code: string, t: Record<string, string>) {
  translations[code] = t;
}

addLang("hi", {
  "hey": "नमस्ते!",
  "pro_farmer": "प्रो किसान",
  "weather_updates": "मौसम अपडेट",
  "dr_farm_ai": "डॉ. फार्म AI",
  "crop_pathologist": "फसल रोग विशेषज्ञ",
  "free": "मुफ़्त",
  "unlimited_24_7": "24/7 असीमित",
  "message": "संदेश",
  "video_call": "वीडियो कॉल",
  "connecting": "कनेक्ट हो रहा है...",
  "listening": "सुन रहा है... अब बोलिए",
  "ai_ready": "AI आपके सवालों के लिए तैयार है।",
  "online": "ऑनलाइन",
  "sunny": "धूप",
  "feels": "महसूस",
  "moisture": "नमी",
  "wind": "हवा",
  "now": "अभी",
  "live_field": "लाइव खेत",
  "active": "सक्रिय",
  "sector_a": "सेक्टर A",
  "moderate_risk": "मध्यम जोखिम",
  "live": "लाइव",
  "optimal": "उत्तम",
  "attention": "ध्यान दें",
  "critical": "गंभीर",
  "node_analytics": "नोड विश्लेषण",
  "active_alerts": "सक्रिय अलर्ट",
  "close": "बंद करें",
  "temp": "तापमान",
  "healthy": "स्वस्थ",
  "critical_status": "गंभीर",
  "optimal_conditions": "उत्तम स्थिति",
  "no_intervention": "यह सेक्टर पूरी तरह से सही चल रहा है। किसी हस्तक्षेप की आवश्यकता नहीं।",
  "trigger_sprinklers": "स्प्रिंकलर चालू करें",
  "critical_dryness": "गंभीर सूखापन",
  "critical_dryness_details": "मिट्टी की नमी 15% पर गंभीर रूप से कम। फसल नष्ट होने का उच्च जोखिम। इस क्षेत्र में तत्काल सिंचाई की आवश्यकता।",
  "moisture_critically_low": "नमी गंभीर रूप से कम",
  "all_clear": "सब ठीक",
  "no_critical_issues": "खेत में कोई गंभीर समस्या नहीं पाई गई।",
  "local_ai_assistant": "स्थानीय AI सहायक",
  "on_phone_ai": "फ़ोन पर AI 📱",
  "private_ai_phone": "Termux में Ollama के माध्यम से आपके फ़ोन पर चलने वाला निजी AI।",
  "private_ai_pc": "Ollama द्वारा संचालित आपका निजी कृषि सहायक।",
  "what_crops": "कौन सी फसल लगाएं?",
  "soil_tips": "मिट्टी स्वास्थ्य सुझाव",
  "pest_control": "कीट नियंत्रण?",
  "ask_placeholder": "फसल, मिट्टी, मौसम के बारे में पूछें...",
  "connect_first": "पहले Ollama से कनेक्ट करें...",
  "disconnected": "डिस्कनेक्ट",
  "ollama_location": "Ollama स्थान",
  "pc_server": "PC सर्वर",
  "on_phone": "फ़ोन पर",
  "model": "मॉडल",
  "ready_to_connect": "कनेक्ट करने के लिए तैयार",
  "market_prices": "मंडी भाव",
  "live_mandi_rates": "पास की मंडी के लाइव भाव",
  "nearest_deals": "निकटतम सौदे",
  "rate_per_quintal": "भाव / क्विंटल",
  "wheat": "गेहूं",
  "paddy": "धान",
  "mustard": "सरसों",
  "cotton": "कपास",
  "km_away": "किमी दूर",
  "trend": "रुझान",
  "rising": "बढ़ रहा",
  "falling": "गिर रहा",
  "stable": "स्थिर",
  "trends_note": "रुझान इस विशिष्ट फसल के स्थानीय 7-दिवसीय मूल्य आधारित हैं।",
  "government_schemes": "सरकारी योजनाएँ",
  "find_support": "आपके लिए उपलब्ध सहायता और सब्सिडी खोजें।",
  "active_status": "सक्रिय",
  "closes_soon": "जल्द बंद",
  "you_are_eligible": "आप पात्र हैं",
  "apply_now": "अभी आवेदन करें",
  "check_eligibility": "पात्रता जाँचें",
  "pm_kisan": "पीएम-किसान सम्मान निधि",
  "pm_kisan_desc": "₹6,000 प्रति वर्ष तीन समान किस्तों में।",
  "tractor_subsidy": "हरियाणा ट्रैक्टर सब्सिडी",
  "tractor_subsidy_desc": "पंजीकृत किसानों को नए ट्रैक्टर पर 50% तक सब्सिडी।",
  "more_services": "अधिक सेवाएँ",
  "tools_news_account": "उपकरण, समाचार और आपका खाता",
  "utility": "उपयोगिता",
  "community": "समुदाय",
  "account": "खाता",
  "farm_records": "खेत रिकॉर्ड",
  "farm_records_desc": "फसल, उर्वरक और उपज ट्रैक करें",
  "gov_schemes": "सरकारी योजनाएँ",
  "gov_schemes_desc": "पीएम-किसान और सब्सिडी खोजें",
  "marketplace": "बाज़ार",
  "marketplace_desc": "उपकरण खरीदें या बेचें",
  "agri_news": "कृषि समाचार",
  "agri_news_desc": "नवीनतम कृषि अपडेट",
  "my_profile": "मेरी प्रोफ़ाइल",
  "my_profile_desc": "सेटिंग्स और व्यक्तिगत विवरण",
  "help_support": "सहायता और समर्थन",
  "help_support_desc": "डॉक्टर या व्यवस्थापक से संपर्क करें",
  "select_language": "भाषा चुनें",
});

addLang("bn", {
  "hey": "নমস্কার!","pro_farmer": "প্রো কৃষক","weather_updates": "আবহাওয়া আপডেট","dr_farm_ai": "ডঃ ফার্ম AI","crop_pathologist": "ফসল রোগ বিশেষজ্ঞ","free": "বিনামূল্যে","unlimited_24_7": "24/7 সীমাহীন","message": "বার্তা","video_call": "ভিডিও কল","connecting": "সংযোগ হচ্ছে...","listening": "শুনছি... এখন বলুন","ai_ready": "AI আপনার প্রশ্নের জন্য প্রস্তুত।","online": "অনলাইন","sunny": "রৌদ্রজ্জ্বল","feels": "অনুভব","moisture": "আর্দ্রতা","wind": "বাতাস","now": "এখন","live_field": "লাইভ মাঠ","active": "সক্রিয়","sector_a": "সেক্টর A","moderate_risk": "মাঝারি ঝুঁকি","live": "লাইভ","optimal": "সর্বোত্তম","attention": "মনোযোগ","critical": "জটিল","node_analytics": "নোড বিশ্লেষণ","active_alerts": "সক্রিয় সতর্কতা","close": "বন্ধ","temp": "তাপমাত্রা","optimal_conditions": "সর্বোত্তম অবস্থা","no_intervention": "এই সেক্টর পুরোপুরি কাজ করছে।","trigger_sprinklers": "স্প্রিংকলার চালু করুন","all_clear": "সব ঠিক","market_prices": "বাজার দর","live_mandi_rates": "কাছের মান্ডি দর","nearest_deals": "নিকটতম চুক্তি","rate_per_quintal": "দর / কুইন্টাল","wheat": "গম","paddy": "ধান","mustard": "সরিষা","cotton": "তুলা","km_away": "কিমি দূরে","government_schemes": "সরকারি প্রকল্প","apply_now": "এখনই আবেদন করুন","more_services": "আরও সেবা","select_language": "ভাষা নির্বাচন করুন","ready_to_connect": "সংযোগের জন্য প্রস্তুত",
});

addLang("te", {
  "hey": "హలో!","pro_farmer": "ప్రో రైతు","weather_updates": "వాతావరణ నవీకరణలు","dr_farm_ai": "డా. ఫార్మ్ AI","crop_pathologist": "పంట వ్యాధి నిపుణుడు","free": "ఉచితం","unlimited_24_7": "24/7 అపరిమితం","message": "సందేశం","video_call": "వీడియో కాల్","connecting": "కనెక్ట్ అవుతోంది...","listening": "వింటోంది... ఇప్పుడు మాట్లాడండి","ai_ready": "AI మీ ప్రశ్నలకు సిద్ధంగా ఉంది.","online": "ఆన్‌లైన్","sunny": "ఎండ","moisture": "తేమ","wind": "గాలి","now": "ఇప్పుడు","live_field": "లైవ్ పొలం","active_alerts": "సక్రమ హెచ్చరికలు","market_prices": "మార్కెట్ ధరలు","wheat": "గోధుమ","paddy": "వరి","mustard": "ఆవాలు","cotton": "పత్తి","government_schemes": "ప్రభుత్వ పథకాలు","apply_now": "ఇప్పుడు దరఖాస్తు చేయండి","more_services": "మరిన్ని సేవలు","select_language": "భాష ఎంచుకోండి","ready_to_connect": "కనెక్ట్ చేయడానికి సిద్ధం",
});

addLang("mr", {
  "hey": "नमस्कार!","pro_farmer": "प्रो शेतकरी","weather_updates": "हवामान अपडेट","dr_farm_ai": "डॉ. फार्म AI","crop_pathologist": "पीक रोग तज्ञ","free": "मोफत","unlimited_24_7": "24/7 अमर्यादित","message": "संदेश","video_call": "व्हिडिओ कॉल","connecting": "कनेक्ट होत आहे...","listening": "ऐकत आहे... आता बोला","ai_ready": "AI तुमच्या प्रश्नांसाठी तयार आहे.","online": "ऑनलाइन","sunny": "उन्हाळा","moisture": "ओलावा","wind": "वारा","now": "आता","live_field": "लाइव शेत","active_alerts": "सक्रिय सूचना","market_prices": "बाजार भाव","wheat": "गहू","paddy": "भात","mustard": "मोहरी","cotton": "कापूस","government_schemes": "सरकारी योजना","apply_now": "आता अर्ज करा","more_services": "अधिक सेवा","select_language": "भाषा निवडा","ready_to_connect": "कनेक्ट करण्यास तयार",
});

addLang("ta", {
  "hey": "வணக்கம்!","pro_farmer": "ப்ரோ விவசாயி","weather_updates": "வானிலை புதுப்பிப்புகள்","dr_farm_ai": "டாக்டர் ஃபார்ம் AI","crop_pathologist": "பயிர் நோய் நிபுணர்","free": "இலவசம்","unlimited_24_7": "24/7 வரம்பற்ற","message": "செய்தி","video_call": "வீடியோ அழைப்பு","connecting": "இணைக்கிறது...","listening": "கேட்கிறது... இப்போது பேசுங்கள்","ai_ready": "AI உங்கள் கேள்விகளுக்கு தயாராக உள்ளது.","online": "ஆன்லைன்","sunny": "வெயில்","moisture": "ஈரப்பதம்","wind": "காற்று","now": "இப்போது","live_field": "நேரடி வயல்","active_alerts": "செயலில் எச்சரிக்கைகள்","market_prices": "சந்தை விலைகள்","wheat": "கோதுமை","paddy": "நெல்","mustard": "கடுகு","cotton": "பருத்தி","government_schemes": "அரசு திட்டங்கள்","apply_now": "இப்போது விண்ணப்பிக்கவும்","more_services": "மேலும் சேவைகள்","select_language": "மொழியைத் தேர்ந்தெடுக்கவும்","ready_to_connect": "இணைக்க தயாராக உள்ளது",
});

addLang("gu", {
  "hey": "નમસ્તે!","pro_farmer": "પ્રો ખેડૂત","weather_updates": "હવામાન અપડેટ","dr_farm_ai": "ડૉ. ફાર્મ AI","free": "મફત","message": "સંદેશ","video_call": "વિડિયો કૉલ","online": "ઓનલાઇન","sunny": "તડકો","moisture": "ભેજ","wind": "પવન","now": "હમણાં","live_field": "લાઇવ ખેતર","market_prices": "બજાર ભાવ","wheat": "ઘઉં","paddy": "ડાંગર","mustard": "રાઈ","cotton": "કપાસ","government_schemes": "સરકારી યોજનાઓ","apply_now": "હમણાં અરજી કરો","more_services": "વધુ સેવાઓ","select_language": "ભાષા પસંદ કરો","ready_to_connect": "કનેક્ટ કરવા તૈયાર",
});

addLang("kn", {
  "hey": "ನಮಸ್ಕಾರ!","pro_farmer": "ಪ್ರೊ ರೈತ","weather_updates": "ಹವಾಮಾನ ನವೀಕರಣಗಳು","dr_farm_ai": "ಡಾ. ಫಾರ್ಮ್ AI","free": "ಉಚಿತ","message": "ಸಂದೇಶ","video_call": "ವೀಡಿಯೊ ಕಾಲ್","online": "ಆನ್‌ಲೈನ್","sunny": "ಬಿಸಿಲು","moisture": "ತೇವಾಂಶ","wind": "ಗಾಳಿ","now": "ಈಗ","live_field": "ಲೈವ್ ಹೊಲ","market_prices": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು","wheat": "ಗೋಧಿ","paddy": "ಭತ್ತ","cotton": "ಹತ್ತಿ","government_schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು","apply_now": "ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ","more_services": "ಹೆಚ್ಚಿನ ಸೇವೆಗಳು","select_language": "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ","ready_to_connect": "ಸಂಪರ್ಕಿಸಲು ಸಿದ್ಧ",
});

addLang("ml", {
  "hey": "നമസ്കാരം!","pro_farmer": "പ്രോ കർഷകൻ","weather_updates": "കാലാവസ്ഥ അപ്‌ഡേറ്റുകൾ","dr_farm_ai": "ഡോ. ഫാം AI","free": "സൗജന്യം","message": "സന്ദേശം","video_call": "വീഡിയോ കോൾ","online": "ഓൺലൈൻ","sunny": "വെയിൽ","moisture": "ഈർപ്പം","wind": "കാറ്റ്","now": "ഇപ്പോൾ","live_field": "ലൈവ് വയൽ","market_prices": "വിപണി വിലകൾ","wheat": "ഗോതമ്പ്","paddy": "നെല്ല്","cotton": "പരുത്തി","government_schemes": "സർക്കാർ പദ്ധതികൾ","apply_now": "ഇപ്പോൾ അപേക്ഷിക്കുക","more_services": "കൂടുതൽ സേവനങ്ങൾ","select_language": "ഭാഷ തിരഞ്ഞെടുക്കുക","ready_to_connect": "ബന്ധിപ്പിക്കാൻ തയ്യാർ",
});

addLang("or", {
  "hey": "ନମସ୍କାର!","pro_farmer": "ପ୍ରୋ ଚାଷୀ","weather_updates": "ପାଣିପାଗ ଅପଡେଟ","free": "ମାଗଣା","message": "ସନ୍ଦେଶ","online": "ଅନଲାଇନ","sunny": "ଖରା","moisture": "ଆର୍ଦ୍ରତା","wind": "ପବନ","now": "ବର୍ତ୍ତମାନ","live_field": "ଲାଇଭ କ୍ଷେତ୍ର","market_prices": "ବଜାର ଦର","wheat": "ଗହମ","paddy": "ଧାନ","government_schemes": "ସରକାରୀ ଯୋଜନା","apply_now": "ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ","more_services": "ଅଧିକ ସେବା","select_language": "ଭାଷା ବାଛନ୍ତୁ","ready_to_connect": "ସଂଯୋଗ ପାଇଁ ପ୍ରସ୍ତୁତ",
});

addLang("pa", {
  "hey": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ!","pro_farmer": "ਪ੍ਰੋ ਕਿਸਾਨ","weather_updates": "ਮੌਸਮ ਅੱਪਡੇਟ","dr_farm_ai": "ਡਾ. ਫਾਰਮ AI","free": "ਮੁਫ਼ਤ","message": "ਸੁਨੇਹਾ","video_call": "ਵੀਡੀਓ ਕਾਲ","online": "ਆਨਲਾਈਨ","sunny": "ਧੁੱਪ","moisture": "ਨਮੀ","wind": "ਹਵਾ","now": "ਹੁਣ","live_field": "ਲਾਈਵ ਖੇਤ","market_prices": "ਮੰਡੀ ਭਾਅ","wheat": "ਕਣਕ","paddy": "ਝੋਨਾ","mustard": "ਸਰ੍ਹੋਂ","cotton": "ਕਪਾਹ","government_schemes": "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ","apply_now": "ਹੁਣੇ ਅਪਲਾਈ ਕਰੋ","more_services": "ਹੋਰ ਸੇਵਾਵਾਂ","select_language": "ਭਾਸ਼ਾ ਚੁਣੋ","ready_to_connect": "ਕਨੈਕਟ ਕਰਨ ਲਈ ਤਿਆਰ",
});

addLang("as", {
  "hey": "নমস্কাৰ!","pro_farmer": "প্ৰ' কৃষক","weather_updates": "বতৰ আপডেট","free": "বিনামূলীয়া","message": "বাৰ্তা","online": "অনলাইন","sunny": "ৰ'দ","moisture": "আৰ্দ্ৰতা","wind": "বতাহ","now": "এতিয়া","live_field": "লাইভ পথাৰ","market_prices": "বজাৰ দৰ","wheat": "ঘেঁহু","paddy": "ধান","government_schemes": "চৰকাৰী আঁচনি","apply_now": "এতিয়াই আবেদন কৰক","more_services": "অধিক সেৱা","select_language": "ভাষা বাছনি কৰক","ready_to_connect": "সংযোগৰ বাবে সাজু",
});

addLang("mai", {
  "hey": "प्रणाम!","pro_farmer": "प्रो किसान","weather_updates": "मौसम अपडेट","free": "मुफ़्त","message": "संदेश","online": "ऑनलाइन","sunny": "धूप","moisture": "नमी","wind": "हवा","now": "अखन","live_field": "लाइव खेत","market_prices": "बाजार भाव","wheat": "गेहूँ","government_schemes": "सरकारी योजना","apply_now": "अखन आवेदन करू","more_services": "आओर सेवा","select_language": "भाषा चुनू","ready_to_connect": "कनेक्ट करबाक लेल तैयार",
});

addLang("sa", {
  "hey": "नमस्ते!","pro_farmer": "प्रो कृषकः","weather_updates": "वातावरण-सूचनाः","free": "निःशुल्कम्","message": "सन्देशः","online": "सक्रियम्","sunny": "प्रकाशमानम्","moisture": "आर्द्रता","wind": "वायुः","now": "अधुना","live_field": "प्रत्यक्ष क्षेत्रम्","market_prices": "विपणि-मूल्यानि","wheat": "गोधूमः","government_schemes": "शासकीय-योजनाः","apply_now": "अधुना आवेदनं कुर्वन्तु","more_services": "अधिकाः सेवाः","select_language": "भाषां चिनोतु","ready_to_connect": "संयोजनाय सज्जम्",
});

addLang("ur", {
  "hey": "!السلام علیکم","pro_farmer": "پرو کسان","weather_updates": "موسم اپ ڈیٹ","dr_farm_ai": "ڈاکٹر فارم AI","free": "مفت","message": "پیغام","video_call": "ویڈیو کال","online": "آن لائن","sunny": "دھوپ","moisture": "نمی","wind": "ہوا","now": "ابھی","live_field": "لائیو کھیت","market_prices": "منڈی بھاؤ","wheat": "گندم","paddy": "دھان","mustard": "سرسوں","cotton": "کپاس","government_schemes": "سرکاری اسکیمیں","apply_now": "ابھی درخواست دیں","more_services": "مزید خدمات","select_language": "زبان منتخب کریں","ready_to_connect": "جڑنے کے لیے تیار",
});

addLang("sat", {
  "hey": "ᱡᱚᱦᱟᱨ!","select_language": "ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ","ready_to_connect": "ᱡᱩᱲᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱭᱟᱨ",
});

addLang("doi", {
  "hey": "नमस्कार!","select_language": "भाषा चुनो","ready_to_connect": "जोड़ने आस्तै तैयार","market_prices": "मंडी भाव","government_schemes": "सरकारी योजनाएं","more_services": "होर सेवाएं",
});

addLang("kok", {
  "hey": "नमस्कार!","select_language": "भास निवडात","ready_to_connect": "जोडपाक तयार","market_prices": "बाजार भाव","government_schemes": "सरकारी येवजणो","more_services": "अदीक सेवा",
});

addLang("mni", {
  "hey": "খুরুমজরি!","select_language": "লোন খনবীয়ু","ready_to_connect": "কানেক্ট তৌবা থৌরাং",
});

addLang("brx", {
  "hey": "नमस्कार!","select_language": "राव सायख","ready_to_connect": "जथाय लानाय थाखाय थियारि",
});

addLang("sd", {
  "hey": "!سلام","select_language": "ٻولي چونڊيو","ready_to_connect": "ڳنڍڻ لاءِ تيار",
});

addLang("ks", {
  "hey": "आदाब!","select_language": "ज़बान चुनिव","ready_to_connect": "जोड़ुन तयार",
});

addLang("ne", {
  "hey": "नमस्ते!","pro_farmer": "प्रो किसान","weather_updates": "मौसम अपडेट","dr_farm_ai": "डा. फार्म AI","free": "निःशुल्क","message": "सन्देश","video_call": "भिडियो कल","online": "अनलाइन","sunny": "घाम","moisture": "चिस्यान","wind": "हावा","now": "अहिले","live_field": "लाइभ खेत","market_prices": "बजार मूल्य","wheat": "गहुँ","paddy": "धान","mustard": "तोरी","cotton": "कपास","government_schemes": "सरकारी योजनाहरू","apply_now": "अहिले आवेदन दिनुहोस्","more_services": "थप सेवाहरू","select_language": "भाषा छान्नुहोस्","ready_to_connect": "जडान गर्न तयार",
});

export { translations };
