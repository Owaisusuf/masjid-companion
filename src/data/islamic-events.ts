export interface IslamicEvent {
  day: number;
  month: string; // Islamic month name
  monthNumber: number;
  title: string;
  titleUrdu: string;
  description: string;
  source: string; // Quran/Hadith reference
}

export const islamicEvents: IslamicEvent[] = [
  // Ramadan events
  { day: 1, month: "Ramadan", monthNumber: 9, title: "Beginning of Ramadan", titleUrdu: "رمضان المبارک کا آغاز", description: "The blessed month of fasting begins. The Quran was revealed in this month.", source: "Quran 2:185" },
  { day: 10, month: "Ramadan", monthNumber: 9, title: "Death of Khadijah (RA)", titleUrdu: "حضرت خدیجہ رضی اللہ عنہا کا وصال", description: "The beloved first wife of Prophet Muhammad ﷺ passed away in 10th Ramadan, 10th year of Prophethood.", source: "Seerah Ibn Hisham" },
  { day: 12, month: "Ramadan", monthNumber: 9, title: "Revelation of Torah to Musa (AS)", titleUrdu: "حضرت موسیٰ علیہ السلام پر تورات کا نزول", description: "According to a narration, Torah was revealed on 12th of Ramadan.", source: "Musnad Ahmad" },
  { day: 15, month: "Ramadan", monthNumber: 9, title: "Birth of Imam Hasan (RA)", titleUrdu: "حضرت حسن رضی اللہ عنہ کی ولادت", description: "The grandson of Prophet Muhammad ﷺ was born in 3 AH.", source: "Tabaqat Ibn Sa'd" },
  { day: 17, month: "Ramadan", monthNumber: 9, title: "Battle of Badr", titleUrdu: "غزوہ بدر — یومِ فرقان", description: "The first major battle in Islam took place on 17th Ramadan, 2 AH. 313 Muslims defeated an army of 1000. Allah called it 'Yawm al-Furqan' — the Day of Criterion.", source: "Quran 8:41, Sahih Bukhari" },
  { day: 18, month: "Ramadan", monthNumber: 9, title: "Revelation of Zabur to Dawud (AS)", titleUrdu: "حضرت داؤد علیہ السلام پر زبور کا نزول", description: "According to a narration, Zabur (Psalms) was revealed on 18th Ramadan.", source: "Musnad Ahmad" },
  { day: 20, month: "Ramadan", monthNumber: 9, title: "Conquest of Makkah", titleUrdu: "فتح مکہ", description: "The peaceful conquest of Makkah took place on 20th Ramadan, 8 AH. The Prophet ﷺ entered Makkah with 10,000 companions and cleansed the Kaaba of idols.", source: "Sahih Bukhari, Sahih Muslim" },
  { day: 21, month: "Ramadan", monthNumber: 9, title: "Laylat al-Qadr (Odd Nights Begin)", titleUrdu: "شبِ قدر کی تلاش — طاق راتوں کا آغاز", description: "The Prophet ﷺ said: 'Seek Laylat al-Qadr in the odd nights of the last ten days of Ramadan.' This night is better than a thousand months.", source: "Quran 97:1-5, Sahih Bukhari 2017" },
  { day: 27, month: "Ramadan", monthNumber: 9, title: "Nuzul al-Quran (Most Likely Night)", titleUrdu: "نزولِ قرآن — ستائیسویں شب", description: "Many scholars consider 27th Ramadan as the most likely night for Laylat al-Qadr when the Quran began to be revealed.", source: "Quran 97:1, Sahih Muslim" },

  // Muharram
  { day: 1, month: "Muharram", monthNumber: 1, title: "Islamic New Year", titleUrdu: "اسلامی نیا سال", description: "The first day of the Islamic calendar. Muharram is one of the four sacred months.", source: "Quran 9:36" },
  { day: 10, month: "Muharram", monthNumber: 1, title: "Day of Ashura", titleUrdu: "یومِ عاشوراء", description: "Musa (AS) and Bani Israel were saved from Pharaoh. The Prophet ﷺ fasted on this day and recommended fasting on 9th and 10th.", source: "Sahih Bukhari 2004, Sahih Muslim 1134" },

  // Safar
  { day: 27, month: "Safar", monthNumber: 2, title: "Isra and Mi'raj (Some Opinions)", titleUrdu: "سفر — اسراء و معراج (بعض اقوال)", description: "Some scholars place the Night Journey in Safar, though 27 Rajab is more widely accepted.", source: "Various scholarly opinions" },

  // Rabi ul Awwal
  { day: 12, month: "Rabi ul Awwal", monthNumber: 3, title: "Birth of Prophet Muhammad ﷺ", titleUrdu: "ولادتِ نبوی ﷺ — ربیع الاول", description: "Most scholars hold that the Prophet ﷺ was born on Monday, 12th Rabi ul Awwal in the Year of the Elephant (570 CE).", source: "Seerah Ibn Hisham, Sahih Muslim" },

  // Rajab
  { day: 27, month: "Rajab", monthNumber: 7, title: "Isra and Mi'raj", titleUrdu: "شبِ معراج", description: "The Night Journey from Makkah to Jerusalem and the Ascension to the heavens. Five daily prayers were prescribed on this night.", source: "Quran 17:1, Sahih Bukhari 349" },

  // Shaban
  { day: 15, month: "Shaban", monthNumber: 8, title: "Shab-e-Baraat", titleUrdu: "شبِ برات", description: "The Prophet ﷺ said: 'Allah looks at His creation on the middle night of Shaban and forgives all except the polytheist and the one who harbors hatred.'", source: "Ibn Majah 1390" },

  // Shawwal
  { day: 1, month: "Shawwal", monthNumber: 10, title: "Eid ul-Fitr", titleUrdu: "عید الفطر", description: "The festival of breaking the fast. The Prophet ﷺ said: 'When Ramadan ends, the people of fasting have their day of celebration.'", source: "Sahih Bukhari, Sahih Muslim" },

  // Dhul Hijjah
  { day: 8, month: "Dhul Hijjah", monthNumber: 12, title: "Day of Tarwiyah — Hajj Begins", titleUrdu: "یومِ ترویہ — حج کا آغاز", description: "Pilgrims head to Mina. The first 10 days of Dhul Hijjah are the best days for good deeds.", source: "Sahih Bukhari 969" },
  { day: 9, month: "Dhul Hijjah", monthNumber: 12, title: "Day of Arafah", titleUrdu: "یومِ عرفہ", description: "The Prophet ﷺ said: 'Fasting on the Day of Arafah expiates sins of the previous and coming year.' Pilgrims stand at Arafat.", source: "Sahih Muslim 1162" },
  { day: 10, month: "Dhul Hijjah", monthNumber: 12, title: "Eid ul-Adha", titleUrdu: "عید الاضحیٰ", description: "The festival of sacrifice commemorating Ibrahim (AS)'s willingness to sacrifice his son Ismail (AS).", source: "Quran 37:102-107" },
];

// Get events for a specific Islamic day and month
export function getEventsForDay(day: number, monthNumber: number): IslamicEvent[] {
  return islamicEvents.filter(e => e.day === day && e.monthNumber === monthNumber);
}

// Get all events for a specific Islamic month
export function getEventsForMonth(monthNumber: number): IslamicEvent[] {
  return islamicEvents.filter(e => e.monthNumber === monthNumber);
}
