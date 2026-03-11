export interface Dua {
  id: number;
  category: string;
  categoryUrdu: string;
  title: string;
  titleUrdu: string;
  arabic: string;
  english: string;
  urdu: string;
  reference: string;
}

export const duaCategories = [
  { key: "salah", label: "After Salah", urdu: "بعد نماز" },
  { key: "morning-evening", label: "Morning & Evening", urdu: "صبح و شام" },
  { key: "sleep", label: "Before Sleep", urdu: "سونے سے پہلے" },
  { key: "food", label: "Food & Drink", urdu: "کھانے پینے" },
  { key: "travel", label: "Travel", urdu: "سفر" },
  { key: "general", label: "General Dhikr", urdu: "عام ذکر" },
];

export const duasCollection: Dua[] = [
  {
    id: 1,
    category: "salah",
    categoryUrdu: "بعد نماز",
    title: "After Salah – Istighfar",
    titleUrdu: "نماز کے بعد – استغفار",
    arabic: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ",
    english: "I seek the forgiveness of Allah (three times).",
    urdu: "میں اللہ سے معافی مانگتا ہوں (تین بار)۔",
    reference: "Sahih Muslim 591",
  },
  {
    id: 2,
    category: "salah",
    categoryUrdu: "بعد نماز",
    title: "After Salah – Allahumma Anta As-Salam",
    titleUrdu: "نماز کے بعد – اللهم أنت السلام",
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ",
    english: "O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor.",
    urdu: "اے اللہ! تو سلامتی والا ہے اور سلامتی تجھی سے ہے۔ اے بزرگی اور عزت والے! تو بابرکت ہے۔",
    reference: "Sahih Muslim 591",
  },
  {
    id: 3,
    category: "salah",
    categoryUrdu: "بعد نماز",
    title: "After Salah – Tasbih, Tahmid, Takbir",
    titleUrdu: "نماز کے بعد – تسبیح، تحمید، تکبیر",
    arabic: "سُبْحَانَ اللَّهِ (33)\nالْحَمْدُ لِلَّهِ (33)\nاللَّهُ أَكْبَرُ (34)",
    english: "Glory be to Allah (33), Praise be to Allah (33), Allah is the Greatest (34).",
    urdu: "اللہ پاک ہے (33 بار)، تمام تعریفیں اللہ کے لیے ہیں (33 بار)، اللہ سب سے بڑا ہے (34 بار)۔",
    reference: "Sahih Muslim 597",
  },
  {
    id: 4,
    category: "morning-evening",
    categoryUrdu: "صبح و شام",
    title: "Morning & Evening – رضيت بالله رباً",
    titleUrdu: "صبح و شام – رضيت بالله رباً",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
    english: "I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Prophet.",
    urdu: "میں اللہ کو اپنا رب، اسلام کو اپنا دین اور محمد ﷺ کو اپنا نبی مان کر راضی ہوں۔",
    reference: "Sunan Abu Dawud 5072",
  },
  {
    id: 5,
    category: "morning-evening",
    categoryUrdu: "صبح و شام",
    title: "Morning & Evening – Protection Dua",
    titleUrdu: "صبح و شام – حفاظت کی دعا",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    english: "In the name of Allah with whose name nothing in the earth or heaven can harm, and He is the All-Hearing, All-Knowing.",
    urdu: "اللہ کے نام کے ساتھ جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سب کچھ سننے اور جاننے والا ہے۔",
    reference: "Sunan Abu Dawud 5088",
  },
  {
    id: 6,
    category: "sleep",
    categoryUrdu: "سونے سے پہلے",
    title: "Before Sleep – Dua",
    titleUrdu: "سونے سے پہلے – دعا",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    english: "In Your name O Allah, I die and I live.",
    urdu: "اے اللہ! تیرے نام کے ساتھ میں مرتا ہوں اور زندہ ہوتا ہوں۔",
    reference: "Sahih al-Bukhari 6324",
  },
  {
    id: 7,
    category: "sleep",
    categoryUrdu: "سونے سے پہلے",
    title: "Before Sleep – Tasbih Fatimah",
    titleUrdu: "سونے سے پہلے – تسبیح فاطمہ",
    arabic: "سُبْحَانَ اللَّهِ (33)\nالْحَمْدُ لِلَّهِ (33)\nاللَّهُ أَكْبَرُ (34)",
    english: "Glory be to Allah (33), Praise be to Allah (33), Allah is the Greatest (34).",
    urdu: "اللہ پاک ہے (33 بار)، سب تعریفیں اللہ کے لیے ہیں (33 بار)، اللہ سب سے بڑا ہے (34 بار)۔",
    reference: "Sahih al-Bukhari 5362",
  },
  {
    id: 8,
    category: "food",
    categoryUrdu: "کھانے پینے",
    title: "Before Eating",
    titleUrdu: "کھانے سے پہلے",
    arabic: "بِسْمِ اللَّهِ",
    english: "In the name of Allah.",
    urdu: "اللہ کے نام سے۔",
    reference: "Sahih al-Bukhari 5376",
  },
  {
    id: 9,
    category: "food",
    categoryUrdu: "کھانے پینے",
    title: "After Eating",
    titleUrdu: "کھانے کے بعد",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ",
    english: "All praise is for Allah who fed me this and provided it for me.",
    urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھانا کھلایا اور یہ رزق عطا کیا۔",
    reference: "Sunan Abu Dawud 4023",
  },
  {
    id: 10,
    category: "travel",
    categoryUrdu: "سفر",
    title: "Travel – When Boarding Transport",
    titleUrdu: "سفر – سواری پر بیٹھتے وقت",
    arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ\nسُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    english: "Allah is the Greatest (three times). Glory be to the One who subjected this for us, and we could not have done it ourselves.",
    urdu: "اللہ سب سے بڑا ہے (تین بار)۔ پاک ہے وہ جس نے اس سواری کو ہمارے لیے مسخر کیا ورنہ ہم اس پر قابو نہ پا سکتے تھے۔",
    reference: "Sahih Muslim 1342",
  },
  {
    id: 11,
    category: "general",
    categoryUrdu: "عام ذکر",
    title: "General Dhikr",
    titleUrdu: "عام ذکر",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    english: "Glory be to Allah and praise be to Him.",
    urdu: "اللہ پاک ہے اور تمام تعریفیں اسی کے لیے ہیں۔",
    reference: "Sahih Muslim 2691",
  },
];
