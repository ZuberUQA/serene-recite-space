
export interface DhikrPhrase {
  id: string;
  nameEn: string;
  nameAr: string;
  textAr: string;
  textEn: string | null;
  transliteration: string | null;
  count: number;
  category: string;
}

export const defaultDhikrPhrases: DhikrPhrase[] = [
  {
    id: "subhanallah",
    nameEn: "Subhanallah",
    nameAr: "سبحان الله",
    textAr: "سُبْحَانَ اللَّهِ",
    textEn: "Glory be to Allah",
    transliteration: "Subhanallah",
    count: 33,
    category: "tasbih"
  },
  {
    id: "alhamdulillah",
    nameEn: "Alhamdulillah",
    nameAr: "الحمد لله",
    textAr: "الْحَمْدُ لِلَّهِ",
    textEn: "Praise be to Allah",
    transliteration: "Alhamdulillah",
    count: 33,
    category: "tasbih"
  },
  {
    id: "allahuakbar",
    nameEn: "Allahu Akbar",
    nameAr: "الله أكبر",
    textAr: "اللَّهُ أَكْبَرُ",
    textEn: "Allah is the Greatest",
    transliteration: "Allahu Akbar",
    count: 33,
    category: "tasbih"
  },
  {
    id: "lailahaillallah",
    nameEn: "La ilaha illallah",
    nameAr: "لا إله إلا الله",
    textAr: "لَا إِلَهَ إِلَّا اللَّهُ",
    textEn: "There is no god but Allah",
    transliteration: "La ilaha illallah",
    count: 100,
    category: "tahlil"
  },
  {
    id: "hasbunallah",
    nameEn: "Hasbunallah",
    nameAr: "حسبنا الله ونعم الوكيل",
    textAr: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    textEn: "Allah is sufficient for us, and He is the Best Guardian",
    transliteration: "Hasbunallah wa ni'mal wakeel",
    count: 33,
    category: "dhikr"
  },
  {
    id: "astaghfirullah",
    nameEn: "Astaghfirullah",
    nameAr: "أستغفر الله",
    textAr: "أَسْتَغْفِرُ اللَّهَ",
    textEn: "I seek forgiveness from Allah",
    transliteration: "Astaghfirullah",
    count: 100,
    category: "istighfar"
  },
  {
    id: "salawat",
    nameEn: "Salawat",
    nameAr: "الصلوات على النبي",
    textAr: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    textEn: "O Allah, bestow Your favor on Muhammad and on the family of Muhammad",
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
    count: 33,
    category: "salawat"
  }
];

export const defaultLoopSizes = [33, 99, 100, 500, 1000];

export const beadColors = [
  { id: "gold", name: "Gold", color: "#D4AF37" },
  { id: "green", name: "Green", color: "#4CAF50" },
  { id: "red", name: "Red", color: "#F44336" },
  { id: "purple", name: "Purple", color: "#9C27B0" }
];

export const getDefaultDhikr = (): DhikrPhrase => defaultDhikrPhrases[0];
