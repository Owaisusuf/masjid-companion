export interface Hadith {
  id: number;
  arabic: string;
  english: string;
  reference: string;
}

export const hadithCollection: Hadith[] = [
  {
    id: 1,
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    english: "The best among you are those who learn the Quran and teach it.",
    reference: "Sahih al-Bukhari 5027",
  },
  {
    id: 2,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    english: "Actions are judged by intentions, and every person will be rewarded according to their intention.",
    reference: "Sahih al-Bukhari 1",
  },
  {
    id: 3,
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    english: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    reference: "Sahih al-Bukhari 6018",
  },
  {
    id: 4,
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    reference: "Sahih al-Bukhari 13",
  },
  {
    id: 5,
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    english: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    reference: "Sahih al-Bukhari 10",
  },
  {
    id: 6,
    arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    english: "Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.",
    reference: "Sahih al-Bukhari 38",
  },
  {
    id: 7,
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    english: "Cleanliness is half of faith.",
    reference: "Sahih Muslim 223",
  },
  {
    id: 8,
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    english: "Supplication (Dua) is the essence of worship.",
    reference: "Sunan al-Tirmidhi 3371",
  },
  {
    id: 9,
    arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ",
    english: "Indeed Allah is gentle and loves gentleness in all matters.",
    reference: "Sahih al-Bukhari 6927",
  },
  {
    id: 10,
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    english: "Your smile for your brother is a charity.",
    reference: "Sunan al-Tirmidhi 1956",
  },
  {
    id: 11,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    english: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.",
    reference: "Sahih Muslim 2699",
  },
  {
    id: 12,
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    english: "The strong believer is better and more beloved to Allah than the weak believer.",
    reference: "Sahih Muslim 2664",
  },
  {
    id: 13,
    arabic: "إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ",
    english: "When a person dies, their deeds end except for three: ongoing charity, knowledge that benefits, or a righteous child who prays for them.",
    reference: "Sahih Muslim 1631",
  },
  {
    id: 14,
    arabic: "لَا تَغْضَبْ",
    english: "Do not get angry.",
    reference: "Sahih al-Bukhari 6116",
  },
  {
    id: 15,
    arabic: "اتَّقِ اللَّهِ حَيْثُمَا كُنْتَ",
    english: "Fear Allah wherever you are, follow a bad deed with a good deed and it will erase it, and treat people with good character.",
    reference: "Sunan al-Tirmidhi 1987",
  },
];

export function getDailyHadith(): Hadith {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return hadithCollection[dayOfYear % hadithCollection.length];
}
