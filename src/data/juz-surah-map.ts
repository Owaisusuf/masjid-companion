export interface JuzInfo {
  number: number;
  name: string;
  nameArabic: string;
  surahs: string[];
}

export const juzSurahMap: JuzInfo[] = [
  { number: 1, name: "Alif Laam Meem", nameArabic: "الٓمٓ", surahs: ["Al-Fatiha", "Al-Baqarah (1-141)"] },
  { number: 2, name: "Sayaqool", nameArabic: "سَيَقُولُ", surahs: ["Al-Baqarah (142-252)"] },
  { number: 3, name: "Tilkal Rusul", nameArabic: "تِلْكَ الرُّسُلُ", surahs: ["Al-Baqarah (253-286)", "Aal-e-Imran (1-91)"] },
  { number: 4, name: "Lan Tanaloo", nameArabic: "لَنْ تَنَالُوا", surahs: ["Aal-e-Imran (92-200)", "An-Nisa (1-23)"] },
  { number: 5, name: "Wal Muhsanat", nameArabic: "وَالْمُحْصَنَاتُ", surahs: ["An-Nisa (24-147)"] },
  { number: 6, name: "La Yuhibbullah", nameArabic: "لَا يُحِبُّ اللَّهُ", surahs: ["An-Nisa (148-176)", "Al-Ma'idah (1-81)"] },
  { number: 7, name: "Wa Iza Sami'oo", nameArabic: "وَإِذَا سَمِعُوا", surahs: ["Al-Ma'idah (82-120)", "Al-An'am (1-110)"] },
  { number: 8, name: "Wa Law Annana", nameArabic: "وَلَوْ أَنَّنَا", surahs: ["Al-An'am (111-165)", "Al-A'raf (1-87)"] },
  { number: 9, name: "Qalal Mala", nameArabic: "قَالَ الْمَلَأُ", surahs: ["Al-A'raf (88-206)", "Al-Anfal (1-40)"] },
  { number: 10, name: "Wa A'lamoo", nameArabic: "وَاعْلَمُوا", surahs: ["Al-Anfal (41-75)", "At-Tawbah (1-92)"] },
  { number: 11, name: "Ya'taziroon", nameArabic: "يَعْتَذِرُونَ", surahs: ["At-Tawbah (93-129)", "Yunus", "Hud (1-5)"] },
  { number: 12, name: "Wa Mamin Daabbah", nameArabic: "وَمَا مِنْ دَابَّةٍ", surahs: ["Hud (6-123)", "Yusuf (1-52)"] },
  { number: 13, name: "Wa Ma Ubarri'u", nameArabic: "وَمَا أُبَرِّئُ", surahs: ["Yusuf (53-111)", "Ar-Ra'd", "Ibrahim (1-52)"] },
  { number: 14, name: "Rubama", nameArabic: "رُبَمَا", surahs: ["Al-Hijr", "An-Nahl (1-128)"] },
  { number: 15, name: "Subhanallazi", nameArabic: "سُبْحَانَ الَّذِي", surahs: ["Al-Isra", "Al-Kahf (1-74)"] },
  { number: 16, name: "Qal Alam", nameArabic: "قَالَ أَلَمْ", surahs: ["Al-Kahf (75-110)", "Maryam", "Ta-Ha (1-135)"] },
  { number: 17, name: "Iqtaraba", nameArabic: "اقْتَرَبَ", surahs: ["Al-Anbiya", "Al-Hajj (1-78)"] },
  { number: 18, name: "Qad Aflaha", nameArabic: "قَدْ أَفْلَحَ", surahs: ["Al-Mu'minun", "An-Nur", "Al-Furqan (1-20)"] },
  { number: 19, name: "Wa Qalallazina", nameArabic: "وَقَالَ الَّذِينَ", surahs: ["Al-Furqan (21-77)", "Ash-Shu'ara", "An-Naml (1-55)"] },
  { number: 20, name: "Amman Khalaqa", nameArabic: "أَمَّنْ خَلَقَ", surahs: ["An-Naml (56-93)", "Al-Qasas", "Al-Ankabut (1-45)"] },
  { number: 21, name: "Utlu Ma Uhiya", nameArabic: "اتْلُ مَا أُوحِيَ", surahs: ["Al-Ankabut (46-69)", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab (1-30)"] },
  { number: 22, name: "Wa Manyaqnut", nameArabic: "وَمَنْ يَقْنُتْ", surahs: ["Al-Ahzab (31-73)", "Saba", "Fatir (1-45)"] },
  { number: 23, name: "Wa Mali", nameArabic: "وَمَا لِيَ", surahs: ["Ya-Sin", "As-Saffat", "Sad (1-88)"] },
  { number: 24, name: "Faman Azlamu", nameArabic: "فَمَنْ أَظْلَمُ", surahs: ["Az-Zumar", "Ghafir (1-85)"] },
  { number: 25, name: "Ilayhi Yuraddu", nameArabic: "إِلَيْهِ يُرَدُّ", surahs: ["Fussilat", "Ash-Shura", "Az-Zukhruf (1-89)"] },
  { number: 26, name: "Ha Meem", nameArabic: "حم", surahs: ["Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat (1-18)"] },
  { number: 27, name: "Qala Fama Khatbukum", nameArabic: "قَالَ فَمَا خَطْبُكُمْ", surahs: ["Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah (1-96)"] },
  { number: 28, name: "Qad Sami Allahu", nameArabic: "قَدْ سَمِعَ اللَّهُ", surahs: ["Al-Mujadila", "Al-Hashr", "Al-Mumtahina", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim"] },
  { number: 29, name: "Tabarakallazi", nameArabic: "تَبَارَكَ الَّذِي", surahs: ["Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat"] },
  { number: 30, name: "Amma Yatasa'aloon", nameArabic: "عَمَّ يَتَسَاءَلُونَ", surahs: ["An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Lail", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"] },
];
