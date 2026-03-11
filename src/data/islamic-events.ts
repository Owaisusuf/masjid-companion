export interface IslamicEvent {
  day: number | null;
  month: string;
  monthNumber: number;
  title: string;
  titleUrdu: string;
  description: string;
  source: string;
}

export const islamicEvents: IslamicEvent[] = [
  // MUHARRAM
  { day: 1, month: "Muharram", monthNumber: 1, title: "Beginning of the Hijri Calendar", titleUrdu: "آغازِ ہجری تقویم", description: "The Islamic calendar begins with the Hijrah (migration) of the Prophet ﷺ from Makkah to Madinah. The system was formally adopted during the caliphate of Umar ibn al-Khattab.", source: "" },
  { day: 10, month: "Muharram", monthNumber: 1, title: "Day of Ashura", titleUrdu: "یومِ عاشوراء", description: "The Prophet ﷺ fasted on the 10th of Muharram and encouraged Muslims to fast it because it expiates the sins of the previous year.", source: "Sahih Muslim 1162" },
  { day: 10, month: "Muharram", monthNumber: 1, title: "Martyrdom of Husayn (RA) — 61 AH", titleUrdu: "شہادتِ امام حسین رضی اللہ عنہ", description: "Husayn ibn Ali was martyred in Karbala during the conflict with the army of Yazid. This became one of the most significant tragedies in Islamic history.", source: "" },

  // SAFAR
  { day: null, month: "Safar", monthNumber: 2, title: "Expedition of Abwa (2 AH)", titleUrdu: "غزوہ الابواء", description: "The first military expedition led personally by the Prophet ﷺ after migration.", source: "" },
  { day: null, month: "Safar", monthNumber: 2, title: "Expedition of Buwat (2 AH)", titleUrdu: "غزوہ بواط", description: "Another early expedition aimed at intercepting Quraysh trade caravans.", source: "" },
  { day: null, month: "Safar", monthNumber: 2, title: "False belief about Safar rejected", titleUrdu: "صفر کی بدشگونی کی تردید", description: "The Prophet ﷺ said there is no bad omen in Safar.", source: "Sahih al-Bukhari 5757" },

  // RABI AL-AWWAL
  { day: null, month: "Rabi al-Awwal", monthNumber: 3, title: "Birth of the Prophet ﷺ (Monday, exact day uncertain)", titleUrdu: "ولادتِ رسول ﷺ", description: "The Prophet ﷺ was born in Makkah during the Year of the Elephant.", source: "Sahih Muslim 1162" },
  { day: 12, month: "Rabi al-Awwal", monthNumber: 3, title: "Death of the Prophet ﷺ — 11 AH", titleUrdu: "وصالِ رسول ﷺ", description: "The Prophet ﷺ passed away in Madinah at the age of 63.", source: "Sahih al-Bukhari 4442" },
  { day: null, month: "Rabi al-Awwal", monthNumber: 3, title: "Arrival in Madinah (Hijrah completion)", titleUrdu: "مدینہ منورہ میں آمد", description: "The Prophet ﷺ reached Madinah and the first Islamic state began.", source: "" },

  // RABI AL-THANI
  // No major authenticated events fixed to a specific date in this month.

  // JUMADA AL-ULA
  { day: null, month: "Jumada al-Ula", monthNumber: 5, title: "Battle of Mu'tah — 8 AH", titleUrdu: "غزوہ مؤتہ", description: "A major battle between Muslims and the Byzantine army. Three commanders were martyred: Zayd ibn Harithah, Ja'far ibn Abi Talib, and Abdullah ibn Rawahah.", source: "" },

  // JUMADA AL-THANI
  { day: null, month: "Jumada al-Thani", monthNumber: 6, title: "Death of Fatimah (RA) — 11 AH", titleUrdu: "وصالِ حضرت فاطمہ رضی اللہ عنہا", description: "The daughter of the Prophet ﷺ passed away about six months after him.", source: "Sahih al-Bukhari 3714" },

  // RAJAB
  { day: null, month: "Rajab", monthNumber: 7, title: "Isra and Mi'raj (exact day not authentically established)", titleUrdu: "واقعہ اسراء و معراج", description: "Allah took the Prophet ﷺ from Makkah to Jerusalem and then through the heavens. The exact day is not authentically established.", source: "Sahih al-Bukhari 3887" },
  { day: null, month: "Rajab", monthNumber: 7, title: "Battle of Tabuk preparation — 9 AH", titleUrdu: "غزوہ تبوک کی تیاری", description: "The Muslims began preparation for one of the largest expeditions of the Prophet ﷺ.", source: "" },

  // SHA'BAN
  { day: null, month: "Shaban", monthNumber: 8, title: "Frequent fasting of the Prophet ﷺ", titleUrdu: "کثرتِ روزہ", description: "The Prophet ﷺ used to fast more in Shaʿban than in any other month except Ramadan.", source: "Sahih al-Bukhari 1969" },

  // RAMADAN
  { day: 17, month: "Ramadan", monthNumber: 9, title: "Battle of Badr — 2 AH", titleUrdu: "غزوہ بدر — یوم الفرقان", description: "313 Muslims defeated an army of approximately 1,000 Quraysh.", source: "" },
  { day: null, month: "Ramadan", monthNumber: 9, title: "Conquest of Makkah — 8 AH", titleUrdu: "فتح مکہ", description: "The Prophet ﷺ entered Makkah peacefully with 10,000 companions.", source: "Sahih al-Bukhari 4280" },
  { day: null, month: "Ramadan", monthNumber: 9, title: "Laylat al-Qadr (Last 10 Nights)", titleUrdu: "لیلۃ القدر", description: "A night better than one thousand months.", source: "Sahih al-Bukhari 2017" },

  // SHAWWAL
  { day: 1, month: "Shawwal", monthNumber: 10, title: "Eid al-Fitr", titleUrdu: "عید الفطر", description: "Festival marking the completion of Ramadan fasting.", source: "Sahih Muslim 892" },
  { day: null, month: "Shawwal", monthNumber: 10, title: "Battle of Uhud — 3 AH", titleUrdu: "غزوہ اُحد", description: "The Muslims fought Quraysh outside Madinah.", source: "" },

  // DHUL-QI'DAH
  { day: null, month: "Dhul Qadah", monthNumber: 11, title: "Treaty of Hudaybiyyah — 6 AH", titleUrdu: "صلح حدیبیہ", description: "A peace treaty between the Muslims and Quraysh which later led to the spread of Islam.", source: "Sahih al-Bukhari 2731" },

  // DHUL-HIJJAH
  { day: 8, month: "Dhul Hijjah", monthNumber: 12, title: "Day of Tarwiyah", titleUrdu: "یوم الترویہ", description: "Pilgrims begin the Hajj journey.", source: "" },
  { day: 9, month: "Dhul Hijjah", monthNumber: 12, title: "Day of Arafah", titleUrdu: "یوم عرفہ", description: "The most important day of Hajj.", source: "Sahih Muslim 1162" },
  { day: 10, month: "Dhul Hijjah", monthNumber: 12, title: "Eid al-Adha", titleUrdu: "عید الاضحی", description: "Commemorates the sacrifice of Prophet Ibrahim (AS).", source: "" },
  { day: null, month: "Dhul Hijjah", monthNumber: 12, title: "Days of Tashriq (11–13)", titleUrdu: "ایام تشریق", description: "Days of remembrance of Allah during Hajj.", source: "Sahih Muslim 1141" },
];

export function getEventsForDay(day: number, monthNumber: number): IslamicEvent[] {
  return islamicEvents.filter(e => e.day === day && e.monthNumber === monthNumber);
}

export function getEventsForMonth(monthNumber: number): IslamicEvent[] {
  return islamicEvents.filter(e => e.monthNumber === monthNumber);
}
