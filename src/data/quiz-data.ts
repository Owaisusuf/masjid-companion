export type QuizCategory =
  | "quran"
  | "hadith"
  | "seerah"
  | "islamic-history"
  | "sahaba"
  | "islamic-calendar"
  | "daily-sunnah"
  | "fiqh-basics"
  | "prophets-stories"
  | "aqeedah";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: Difficulty;
  question: string;
  questionUrdu: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationUrdu: string;
  reference: string;
}

export interface QuizCategoryInfo {
  id: QuizCategory;
  title: string;
  titleUrdu: string;
  icon: string;
  description: string;
  color: string;
}

export const quizCategories: QuizCategoryInfo[] = [
  { id: "quran", title: "Qur'an Quiz", titleUrdu: "قرآنی سوالات", icon: "📖", description: "Test your knowledge of the Holy Qur'an", color: "bg-emerald-500/10 text-emerald-700" },
  { id: "hadith", title: "Hadith Quiz", titleUrdu: "احادیث کے سوالات", icon: "📜", description: "Questions from authentic hadith collections", color: "bg-amber-500/10 text-amber-700" },
  { id: "seerah", title: "Seerah Quiz", titleUrdu: "سیرت النبی ﷺ", icon: "🕌", description: "Life of the Prophet Muhammad ﷺ", color: "bg-blue-500/10 text-blue-700" },
  { id: "islamic-history", title: "Islamic History", titleUrdu: "اسلامی تاریخ", icon: "🏛️", description: "Major events in Islamic history", color: "bg-purple-500/10 text-purple-700" },
  { id: "sahaba", title: "Sahaba Quiz", titleUrdu: "صحابہ کرام", icon: "⭐", description: "Companions of the Prophet ﷺ", color: "bg-yellow-500/10 text-yellow-700" },
  { id: "islamic-calendar", title: "Islamic Calendar", titleUrdu: "اسلامی تقویم", icon: "📅", description: "Islamic months, events and dates", color: "bg-teal-500/10 text-teal-700" },
  { id: "daily-sunnah", title: "Daily Sunnah", titleUrdu: "روزمرہ سنتیں", icon: "🤲", description: "Sunnahs for everyday life", color: "bg-rose-500/10 text-rose-700" },
  { id: "fiqh-basics", title: "Fiqh Basics", titleUrdu: "بنیادی فقہ", icon: "⚖️", description: "Basic Islamic jurisprudence", color: "bg-indigo-500/10 text-indigo-700" },
  { id: "prophets-stories", title: "Prophets Stories", titleUrdu: "انبیاء کے قصے", icon: "🌟", description: "Stories of the Prophets (AS)", color: "bg-cyan-500/10 text-cyan-700" },
  { id: "aqeedah", title: "Aqeedah Basics", titleUrdu: "عقیدہ", icon: "💎", description: "Islamic creed and belief fundamentals", color: "bg-orange-500/10 text-orange-700" },
];

export const quizQuestions: QuizQuestion[] = [
  // ══════ QURAN ══════
  {
    id: "q1",
    category: "quran",
    difficulty: "beginner",
    question: "How many Surahs are in the Holy Qur'an?",
    questionUrdu: "قرآن مجید میں کتنی سورتیں ہیں؟",
    options: ["100", "114", "120", "99"],
    correctIndex: 1,
    explanation: "The Holy Qur'an contains 114 Surahs (chapters).",
    explanationUrdu: "قرآن مجید میں 114 سورتیں ہیں۔",
    reference: "Qur'an",
  },
  {
    id: "q2",
    category: "quran",
    difficulty: "beginner",
    question: "Which is the longest Surah in the Qur'an?",
    questionUrdu: "قرآن کی سب سے طویل سورت کون سی ہے؟",
    options: ["Al-Imran", "Al-Baqarah", "An-Nisa", "Al-Maidah"],
    correctIndex: 1,
    explanation: "Surah Al-Baqarah is the longest Surah with 286 verses.",
    explanationUrdu: "سورۃ البقرہ سب سے طویل سورت ہے جس میں 286 آیات ہیں۔",
    reference: "Qur'an 2:1-286",
  },
  {
    id: "q3",
    category: "quran",
    difficulty: "intermediate",
    question: "Which Surah is known as the 'Heart of the Qur'an'?",
    questionUrdu: "قرآن کا دل کس سورت کو کہا جاتا ہے؟",
    options: ["Surah Ar-Rahman", "Surah Yasin", "Surah Al-Mulk", "Surah Al-Kahf"],
    correctIndex: 1,
    explanation: "The Prophet ﷺ said: 'Everything has a heart and the heart of the Qur'an is Yasin.'",
    explanationUrdu: "نبی ﷺ نے فرمایا: ہر چیز کا ایک دل ہے اور قرآن کا دل یٰسین ہے۔",
    reference: "Sunan al-Tirmidhi 2887",
  },
  {
    id: "q4",
    category: "quran",
    difficulty: "intermediate",
    question: "In which Surah is Ayat al-Kursi found?",
    questionUrdu: "آیت الکرسی کس سورت میں ہے؟",
    options: ["Al-Imran", "Al-Baqarah", "An-Nisa", "Al-Maidah"],
    correctIndex: 1,
    explanation: "Ayat al-Kursi is verse 255 of Surah Al-Baqarah.",
    explanationUrdu: "آیت الکرسی سورۃ البقرہ کی آیت نمبر 255 ہے۔",
    reference: "Qur'an 2:255",
  },
  {
    id: "q5",
    category: "quran",
    difficulty: "advanced",
    question: "How many times is the word 'Qul' (Say) mentioned in the Qur'an?",
    questionUrdu: "قرآن میں لفظ 'قل' کتنی بار آیا ہے؟",
    options: ["232", "332", "132", "432"],
    correctIndex: 1,
    explanation: "The word 'Qul' (Say) appears 332 times in the Qur'an.",
    explanationUrdu: "لفظ 'قل' قرآن مجید میں 332 بار آیا ہے۔",
    reference: "Qur'anic word count studies",
  },

  // ══════ HADITH ══════
  {
    id: "h1",
    category: "hadith",
    difficulty: "beginner",
    question: "Which hadith collection is considered the most authentic?",
    questionUrdu: "سب سے زیادہ مستند حدیث کی کتاب کون سی ہے؟",
    options: ["Sahih Muslim", "Sahih al-Bukhari", "Sunan Abu Dawud", "Jami al-Tirmidhi"],
    correctIndex: 1,
    explanation: "Sahih al-Bukhari, compiled by Imam Bukhari, is considered the most authentic book after the Qur'an.",
    explanationUrdu: "صحیح بخاری، جو امام بخاری نے مرتب کی، قرآن کے بعد سب سے مستند کتاب مانی جاتی ہے۔",
    reference: "Scholarly consensus",
  },
  {
    id: "h2",
    category: "hadith",
    difficulty: "beginner",
    question: "What does 'Sahih' mean in hadith terminology?",
    questionUrdu: "حدیث کی اصطلاح میں 'صحیح' کا کیا مطلب ہے؟",
    options: ["Weak", "Fabricated", "Authentic", "Good"],
    correctIndex: 2,
    explanation: "Sahih means authentic — a hadith with an unbroken chain of trustworthy narrators.",
    explanationUrdu: "صحیح کا مطلب مستند ہے — ایسی حدیث جس کی سند مسلسل اور ثقہ راویوں سے ہو۔",
    reference: "Usul al-Hadith",
  },
  {
    id: "h3",
    category: "hadith",
    difficulty: "intermediate",
    question: "The hadith 'Actions are judged by intentions' is from which collection?",
    questionUrdu: "حدیث 'اعمال کا دارومدار نیتوں پر ہے' کس مجموعے سے ہے؟",
    options: ["Sahih Muslim", "Sunan Abu Dawud", "Sahih al-Bukhari", "Muwatta Malik"],
    correctIndex: 2,
    explanation: "This hadith is the first hadith in Sahih al-Bukhari, narrated by Umar ibn al-Khattab (RA).",
    explanationUrdu: "یہ حدیث صحیح بخاری کی پہلی حدیث ہے، حضرت عمر بن خطاب رضی اللہ عنہ سے مروی ہے۔",
    reference: "Sahih al-Bukhari 1",
  },
  {
    id: "h4",
    category: "hadith",
    difficulty: "advanced",
    question: "How many hadiths did Imam Bukhari select for his Sahih from his collection?",
    questionUrdu: "امام بخاری نے اپنے مجموعے سے کتنی احادیث صحیح بخاری میں شامل کیں؟",
    options: ["2,602", "7,563", "7,275", "4,000"],
    correctIndex: 2,
    explanation: "Imam Bukhari selected approximately 7,275 hadiths (including repetitions) from about 600,000.",
    explanationUrdu: "امام بخاری نے تقریباً 6 لاکھ احادیث سے 7,275 احادیث (تکرار سمیت) منتخب کیں۔",
    reference: "Muqaddimah Fath al-Bari",
  },

  // ══════ SEERAH ══════
  {
    id: "s1",
    category: "seerah",
    difficulty: "beginner",
    question: "In which city was the Prophet ﷺ born?",
    questionUrdu: "نبی ﷺ کس شہر میں پیدا ہوئے؟",
    options: ["Madinah", "Ta'if", "Makkah", "Jerusalem"],
    correctIndex: 2,
    explanation: "The Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant.",
    explanationUrdu: "نبی محمد ﷺ مکہ مکرمہ میں عام الفیل میں پیدا ہوئے۔",
    reference: "Ibn Hisham, As-Sirah an-Nabawiyyah",
  },
  {
    id: "s2",
    category: "seerah",
    difficulty: "beginner",
    question: "What was the name of the Prophet's ﷺ first wife?",
    questionUrdu: "نبی ﷺ کی پہلی بیوی کا نام کیا تھا؟",
    options: ["Aisha (RA)", "Hafsa (RA)", "Khadijah (RA)", "Sawdah (RA)"],
    correctIndex: 2,
    explanation: "Khadijah bint Khuwaylid (RA) was the first wife of the Prophet ﷺ and the first person to accept Islam.",
    explanationUrdu: "خدیجہ بنت خویلد رضی اللہ عنہا نبی ﷺ کی پہلی بیوی اور اسلام قبول کرنے والی پہلی شخصیت تھیں۔",
    reference: "Sahih al-Bukhari 3815",
  },
  {
    id: "s3",
    category: "seerah",
    difficulty: "intermediate",
    question: "At what age did the Prophet ﷺ receive the first revelation?",
    questionUrdu: "نبی ﷺ کو کتنی عمر میں پہلی وحی آئی؟",
    options: ["25", "35", "40", "45"],
    correctIndex: 2,
    explanation: "The Prophet ﷺ was 40 years old when he received the first revelation in the Cave of Hira.",
    explanationUrdu: "نبی ﷺ کی عمر 40 سال تھی جب غارِ حرا میں پہلی وحی نازل ہوئی۔",
    reference: "Sahih al-Bukhari 3",
  },
  {
    id: "s4",
    category: "seerah",
    difficulty: "intermediate",
    question: "Which battle is called 'Yawm al-Furqan' (Day of Distinction)?",
    questionUrdu: "کس جنگ کو 'یوم الفرقان' کہا جاتا ہے؟",
    options: ["Uhud", "Khandaq", "Badr", "Hunayn"],
    correctIndex: 2,
    explanation: "The Battle of Badr is called Yawm al-Furqan because it distinguished truth from falsehood.",
    explanationUrdu: "غزوہ بدر کو یوم الفرقان کہا جاتا ہے کیونکہ اس نے حق اور باطل کو الگ کر دیا۔",
    reference: "Qur'an 8:41",
  },

  // ══════ ISLAMIC HISTORY ══════
  {
    id: "ih1",
    category: "islamic-history",
    difficulty: "beginner",
    question: "Who was the first Caliph of Islam?",
    questionUrdu: "اسلام کا پہلا خلیفہ کون تھا؟",
    options: ["Umar (RA)", "Uthman (RA)", "Ali (RA)", "Abu Bakr (RA)"],
    correctIndex: 3,
    explanation: "Abu Bakr as-Siddiq (RA) was the first Caliph after the Prophet ﷺ.",
    explanationUrdu: "ابو بکر صدیق رضی اللہ عنہ نبی ﷺ کے بعد اسلام کے پہلے خلیفہ تھے۔",
    reference: "Sahih al-Bukhari 3668",
  },
  {
    id: "ih2",
    category: "islamic-history",
    difficulty: "intermediate",
    question: "In which year did the Conquest of Makkah occur?",
    questionUrdu: "فتح مکہ کس سال ہوئی؟",
    options: ["6 AH", "8 AH", "10 AH", "2 AH"],
    correctIndex: 1,
    explanation: "The Conquest of Makkah occurred in 8 AH (630 CE).",
    explanationUrdu: "فتح مکہ 8 ہجری (630 عیسوی) میں ہوئی۔",
    reference: "Sahih al-Bukhari 4280",
  },
  {
    id: "ih3",
    category: "islamic-history",
    difficulty: "advanced",
    question: "The Treaty of Hudaybiyyah was signed in which year?",
    questionUrdu: "صلح حدیبیہ کس سال ہوئی؟",
    options: ["4 AH", "6 AH", "8 AH", "10 AH"],
    correctIndex: 1,
    explanation: "The Treaty of Hudaybiyyah was signed in 6 AH between the Muslims and the Quraysh.",
    explanationUrdu: "صلح حدیبیہ 6 ہجری میں مسلمانوں اور قریش کے درمیان ہوئی۔",
    reference: "Sahih al-Bukhari 2731",
  },

  // ══════ SAHABA ══════
  {
    id: "sa1",
    category: "sahaba",
    difficulty: "beginner",
    question: "Who was given the title 'As-Siddiq' (The Truthful)?",
    questionUrdu: "کسے 'الصدیق' کا لقب دیا گیا؟",
    options: ["Umar (RA)", "Ali (RA)", "Uthman (RA)", "Abu Bakr (RA)"],
    correctIndex: 3,
    explanation: "Abu Bakr (RA) was given the title As-Siddiq because he immediately believed in the Prophet's ﷺ account of the Night Journey.",
    explanationUrdu: "ابو بکر رضی اللہ عنہ کو الصدیق کا لقب اس لیے ملا کیونکہ انہوں نے فوراً واقعہ معراج کی تصدیق کی۔",
    reference: "Sahih al-Bukhari 3675",
  },
  {
    id: "sa2",
    category: "sahaba",
    difficulty: "intermediate",
    question: "Which companion narrated the most hadiths?",
    questionUrdu: "کس صحابی نے سب سے زیادہ احادیث بیان کیں؟",
    options: ["Abdullah ibn Umar (RA)", "Abu Hurairah (RA)", "Anas ibn Malik (RA)", "Aisha (RA)"],
    correctIndex: 1,
    explanation: "Abu Hurairah (RA) narrated approximately 5,374 hadiths, the most of any companion.",
    explanationUrdu: "ابو ہریرہ رضی اللہ عنہ نے تقریباً 5,374 احادیث بیان کیں جو کسی بھی صحابی سے زیادہ ہیں۔",
    reference: "Al-Isabah fi Tamyiz al-Sahabah",
  },

  // ══════ ISLAMIC CALENDAR ══════
  {
    id: "ic1",
    category: "islamic-calendar",
    difficulty: "beginner",
    question: "Which is the first month of the Islamic calendar?",
    questionUrdu: "اسلامی تقویم کا پہلا مہینہ کون سا ہے؟",
    options: ["Rajab", "Ramadan", "Muharram", "Shawwal"],
    correctIndex: 2,
    explanation: "Muharram is the first month of the Islamic Hijri calendar.",
    explanationUrdu: "محرم اسلامی ہجری تقویم کا پہلا مہینہ ہے۔",
    reference: "Qur'an 9:36",
  },
  {
    id: "ic2",
    category: "islamic-calendar",
    difficulty: "intermediate",
    question: "How many sacred months are mentioned in the Qur'an?",
    questionUrdu: "قرآن میں کتنے حرمت والے مہینے بیان ہوئے ہیں؟",
    options: ["2", "3", "4", "5"],
    correctIndex: 2,
    explanation: "Four sacred months: Dhul-Qi'dah, Dhul-Hijjah, Muharram, and Rajab.",
    explanationUrdu: "چار حرمت والے مہینے: ذوالقعدہ، ذوالحجہ، محرم اور رجب۔",
    reference: "Qur'an 9:36",
  },

  // ══════ DAILY SUNNAH ══════
  {
    id: "ds1",
    category: "daily-sunnah",
    difficulty: "beginner",
    question: "What should a Muslim say before eating?",
    questionUrdu: "مسلمان کو کھانے سے پہلے کیا کہنا چاہیے؟",
    options: ["Alhamdulillah", "SubhanAllah", "Bismillah", "Allahu Akbar"],
    correctIndex: 2,
    explanation: "The Prophet ﷺ instructed us to say 'Bismillah' before eating.",
    explanationUrdu: "نبی ﷺ نے کھانے سے پہلے 'بسم اللہ' کہنے کا حکم دیا۔",
    reference: "Sahih al-Bukhari 5376",
  },
  {
    id: "ds2",
    category: "daily-sunnah",
    difficulty: "beginner",
    question: "With which hand should a Muslim eat according to the Sunnah?",
    questionUrdu: "سنت کے مطابق مسلمان کو کس ہاتھ سے کھانا چاہیے؟",
    options: ["Left", "Right", "Both", "Any"],
    correctIndex: 1,
    explanation: "The Prophet ﷺ said: 'Eat with your right hand.'",
    explanationUrdu: "نبی ﷺ نے فرمایا: 'دائیں ہاتھ سے کھاؤ۔'",
    reference: "Sahih Muslim 2020",
  },

  // ══════ FIQH BASICS ══════
  {
    id: "f1",
    category: "fiqh-basics",
    difficulty: "beginner",
    question: "How many daily obligatory prayers (Salah) are there in Islam?",
    questionUrdu: "اسلام میں روزانہ کتنی فرض نمازیں ہیں؟",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "There are five daily obligatory prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
    explanationUrdu: "پانچ فرض نمازیں ہیں: فجر، ظہر، عصر، مغرب اور عشاء۔",
    reference: "Sahih al-Bukhari 8",
  },
  {
    id: "f2",
    category: "fiqh-basics",
    difficulty: "intermediate",
    question: "What is the minimum amount of gold that makes Zakat obligatory?",
    questionUrdu: "سونے پر زکوٰۃ کتنی مقدار پر فرض ہوتی ہے؟",
    options: ["50 grams", "85 grams (7.5 tola)", "100 grams", "200 grams"],
    correctIndex: 1,
    explanation: "Zakat on gold becomes obligatory at 85 grams (approximately 7.5 tola).",
    explanationUrdu: "سونے پر زکوٰۃ 85 گرام (تقریباً ساڑھے سات تولے) پر فرض ہوتی ہے۔",
    reference: "Sunan Abu Dawud 1573",
  },

  // ══════ PROPHETS STORIES ══════
  {
    id: "p1",
    category: "prophets-stories",
    difficulty: "beginner",
    question: "Which Prophet built the Ka'bah?",
    questionUrdu: "کعبہ کس نبی نے تعمیر کیا؟",
    options: ["Musa (AS)", "Isa (AS)", "Ibrahim (AS)", "Nuh (AS)"],
    correctIndex: 2,
    explanation: "Prophet Ibrahim (AS) and his son Isma'il (AS) built the Ka'bah.",
    explanationUrdu: "حضرت ابراہیم علیہ السلام اور ان کے بیٹے اسماعیل علیہ السلام نے کعبہ تعمیر کیا۔",
    reference: "Qur'an 2:127",
  },
  {
    id: "p2",
    category: "prophets-stories",
    difficulty: "intermediate",
    question: "Which Prophet was swallowed by a whale?",
    questionUrdu: "کس نبی کو مچھلی نے نگل لیا؟",
    options: ["Dawud (AS)", "Sulayman (AS)", "Yunus (AS)", "Ayyub (AS)"],
    correctIndex: 2,
    explanation: "Prophet Yunus (AS) was swallowed by a whale and prayed to Allah from its belly.",
    explanationUrdu: "حضرت یونس علیہ السلام کو مچھلی نے نگل لیا اور انہوں نے اس کے پیٹ سے اللہ سے دعا کی۔",
    reference: "Qur'an 37:139-148",
  },

  // ══════ AQEEDAH ══════
  {
    id: "a1",
    category: "aqeedah",
    difficulty: "beginner",
    question: "How many pillars of Islam are there?",
    questionUrdu: "اسلام کے ارکان کتنے ہیں؟",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "Five pillars: Shahada, Salah, Zakat, Sawm, and Hajj.",
    explanationUrdu: "پانچ ارکان: شہادت، نماز، زکوٰۃ، روزہ اور حج۔",
    reference: "Sahih al-Bukhari 8",
  },
  {
    id: "a2",
    category: "aqeedah",
    difficulty: "beginner",
    question: "How many pillars of Iman (Faith) are there?",
    questionUrdu: "ایمان کے ارکان کتنے ہیں؟",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    explanation: "Six pillars: Belief in Allah, Angels, Books, Prophets, Day of Judgment, and Divine Decree.",
    explanationUrdu: "چھ ارکان: اللہ، فرشتوں، کتابوں، نبیوں، قیامت اور تقدیر پر ایمان۔",
    reference: "Sahih Muslim 8",
  },
  {
    id: "a3",
    category: "aqeedah",
    difficulty: "intermediate",
    question: "What is the meaning of 'Tawheed'?",
    questionUrdu: "توحید کا مطلب کیا ہے؟",
    options: ["Prophethood", "Oneness of Allah", "Day of Judgment", "Angels"],
    correctIndex: 1,
    explanation: "Tawheed means the absolute Oneness of Allah in His Lordship, worship, and names/attributes.",
    explanationUrdu: "توحید کا مطلب اللہ کی ربوبیت، عبادت اور اسماء و صفات میں مکمل وحدانیت ہے۔",
    reference: "Qur'an 112:1-4",
  },
];
