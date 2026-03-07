export interface IslamicEvent {
  day: number;
  month: string;
  monthNumber: number;
  title: string;
  titleUrdu: string;
  description: string;
  source: string; // internal reference only, not displayed
}

export const islamicEvents: IslamicEvent[] = [
  // Ramadan events
  { day: 1, month: "Ramadan", monthNumber: 9, title: "Beginning of Ramadan", titleUrdu: "رمضان المبارک کا آغاز", description: "The blessed month of fasting begins. The Quran was revealed in this month as a guidance for mankind.", source: "" },
  { day: 10, month: "Ramadan", monthNumber: 9, title: "Passing of Khadijah (RA)", titleUrdu: "حضرت خدیجہ رضی اللہ عنہا کا وصال", description: "The beloved first wife of Prophet Muhammad ﷺ passed away in the 10th year of Prophethood. She was the first person to accept Islam and stood by the Prophet ﷺ through every hardship.", source: "" },
  { day: 12, month: "Ramadan", monthNumber: 9, title: "Revelation of Torah to Musa (AS)", titleUrdu: "حضرت موسیٰ علیہ السلام پر تورات کا نزول", description: "According to narrations, the Torah was revealed to Prophet Musa (AS) on the 12th of Ramadan.", source: "" },
  { day: 15, month: "Ramadan", monthNumber: 9, title: "Birth of Imam Hasan (RA)", titleUrdu: "حضرت حسن رضی اللہ عنہ کی ولادت", description: "The grandson of Prophet Muhammad ﷺ, Hasan ibn Ali (RA), was born in the 3rd year after Hijrah.", source: "" },
  { day: 17, month: "Ramadan", monthNumber: 9, title: "Battle of Badr", titleUrdu: "غزوہ بدر — یومِ فرقان", description: "The first major battle in Islam took place on 17th Ramadan, 2 AH. 313 Muslims achieved a decisive victory against an army of approximately 1,000. This day is known as Yawm al-Furqan — the Day of Criterion, when Allah distinguished truth from falsehood.", source: "" },
  { day: 18, month: "Ramadan", monthNumber: 9, title: "Revelation of Zabur to Dawud (AS)", titleUrdu: "حضرت داؤد علیہ السلام پر زبور کا نزول", description: "According to narrations, the Zabur (Psalms) was revealed to Prophet Dawud (AS) on the 18th of Ramadan.", source: "" },
  { day: 20, month: "Ramadan", monthNumber: 9, title: "Conquest of Makkah", titleUrdu: "فتح مکہ", description: "The peaceful conquest of Makkah took place on 20th Ramadan, 8 AH. The Prophet ﷺ entered Makkah with 10,000 companions and cleansed the Ka'bah of all idols, restoring it to the worship of Allah alone.", source: "" },
  { day: 21, month: "Ramadan", monthNumber: 9, title: "Laylat al-Qadr — Odd Nights Begin", titleUrdu: "شبِ قدر کی تلاش — طاق راتوں کا آغاز", description: "The Prophet ﷺ advised seeking Laylat al-Qadr in the odd nights of the last ten days of Ramadan. This blessed night is better than a thousand months of worship.", source: "" },
  { day: 27, month: "Ramadan", monthNumber: 9, title: "Nuzul al-Quran — Most Likely Night", titleUrdu: "نزولِ قرآن — ستائیسویں شب", description: "Many scholars consider the 27th night of Ramadan as the most likely night for Laylat al-Qadr, when the Quran began to be revealed to Prophet Muhammad ﷺ.", source: "" },

  // Muharram
  { day: 1, month: "Muharram", monthNumber: 1, title: "Islamic New Year", titleUrdu: "اسلامی نیا سال", description: "The first day of the Islamic calendar. Muharram is one of the four sacred months in which fighting was traditionally forbidden.", source: "" },
  { day: 10, month: "Muharram", monthNumber: 1, title: "Day of Ashura", titleUrdu: "یومِ عاشوراء", description: "On this day, Allah saved Musa (AS) and the Children of Israel from Pharaoh. The Prophet ﷺ fasted on this day and recommended fasting on the 9th and 10th of Muharram.", source: "" },

  // Rabi ul Awwal
  { day: 12, month: "Rabi ul Awwal", monthNumber: 3, title: "Birth of Prophet Muhammad ﷺ", titleUrdu: "ولادتِ نبوی ﷺ — ربیع الاول", description: "Most scholars hold that the Prophet ﷺ was born on Monday, 12th Rabi ul Awwal in the Year of the Elephant (approximately 570 CE) in Makkah.", source: "" },

  // Rajab
  { day: 27, month: "Rajab", monthNumber: 7, title: "Isra and Mi'raj", titleUrdu: "شبِ معراج", description: "The miraculous Night Journey from Makkah to Jerusalem and the Ascension to the heavens. On this blessed night, the five daily prayers were prescribed for the Muslim Ummah.", source: "" },

  // Shaban
  { day: 15, month: "Shaban", monthNumber: 8, title: "Shab-e-Baraat", titleUrdu: "شبِ برات", description: "A night of forgiveness and mercy. The Prophet ﷺ mentioned that Allah looks at His creation on the middle night of Shaban and forgives all except those who associate partners with Him or harbor hatred.", source: "" },

  // Shawwal
  { day: 1, month: "Shawwal", monthNumber: 10, title: "Eid ul-Fitr", titleUrdu: "عید الفطر", description: "The festival of breaking the fast, celebrated after completing the month of Ramadan. It is a day of gratitude, joy, and community gathering.", source: "" },

  // Dhul Hijjah
  { day: 8, month: "Dhul Hijjah", monthNumber: 12, title: "Day of Tarwiyah — Hajj Begins", titleUrdu: "یومِ ترویہ — حج کا آغاز", description: "Pilgrims head to Mina to begin the rites of Hajj. The first ten days of Dhul Hijjah are among the best days for performing good deeds.", source: "" },
  { day: 9, month: "Dhul Hijjah", monthNumber: 12, title: "Day of Arafah", titleUrdu: "یومِ عرفہ", description: "The most important day of Hajj. The Prophet ﷺ said that fasting on the Day of Arafah expiates the sins of the previous year and the coming year. Pilgrims stand at the plain of Arafat in supplication.", source: "" },
  { day: 10, month: "Dhul Hijjah", monthNumber: 12, title: "Eid ul-Adha", titleUrdu: "عید الاضحیٰ", description: "The festival of sacrifice, commemorating Prophet Ibrahim (AS)'s willingness to sacrifice his son Ismail (AS) in obedience to Allah's command. Muslims worldwide perform Qurbani on this day.", source: "" },
];

export function getEventsForDay(day: number, monthNumber: number): IslamicEvent[] {
  return islamicEvents.filter(e => e.day === day && e.monthNumber === monthNumber);
}

export function getEventsForMonth(monthNumber: number): IslamicEvent[] {
  return islamicEvents.filter(e => e.monthNumber === monthNumber);
}
