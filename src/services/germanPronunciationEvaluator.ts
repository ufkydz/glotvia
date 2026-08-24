export interface WordEvaluation {
  word: string;
  isCorrect: boolean;
  accuracy: number; // 0 - 100
  spokenAs?: string;
  phoneticTarget: string;
  phoneticRuleTip?: string;
}

export type PronunciationGrade =
  | 'Mükemmel'
  | 'Çok iyi'
  | 'İyi'
  | 'Geliştirilmeli'
  | 'Tekrar dene';

export interface PronunciationEvaluationResult {
  targetText: string;
  spokenText: string;
  score: number; // 0 - 100
  grade: PronunciationGrade;
  correctWords: WordEvaluation[];
  needsImprovementWords: WordEvaluation[];
  allWords: WordEvaluation[];
  overallFeedbackTr: string;
  phoneticNoteTr?: string;
  disclaimer: string;
}

/**
 * Standard Levenshtein distance algorithm for calculating similarity between strings
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array(bn + 1)
    .fill(null)
    .map(() => Array(an + 1).fill(null));

  for (let i = 0; i <= an; i += 1) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= bn; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= bn; j += 1) {
    for (let i = 1; i <= an; i += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[bn][an];
}

/**
 * Calculate string similarity percentage (0 - 100)
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  const maxLen = Math.max(s1.length, s2.length);
  const distance = calculateLevenshteinDistance(s1, s2);
  const similarity = ((maxLen - distance) / maxLen) * 100;
  return Math.max(0, Math.min(100, Math.round(similarity)));
}

/**
 * Phonetic generator and rule tip finder for German words
 */
export function getGermanWordPhoneticAndTip(rawWord: string): {
  phonetic: string;
  tip?: string;
} {
  const word = rawWord.toLowerCase().replace(/[.,!?;:"]/g, '');
  let phonetic = `[${word}]`;
  let tip: string | undefined = undefined;

  // 1. "eu" or "äu" -> [oy] (Euro -> Oyro, Deutsch -> Doyç)
  if (word.includes('eu') || word.includes('äu')) {
    phonetic = `[${word.replace(/eu|äu/g, 'oy')}]`;
    tip = "Bu kelimedeki 'eu' / 'äu' sesi Türkçedeki 'oy' sesine yakındır (örn: Deutsch -> Doyç).";
  }
  // 2. "ei" or "ey" -> [ay] (Mein -> Mayn, Eins -> Ayns)
  else if (word.includes('ei') || word.includes('ey')) {
    phonetic = `[${word.replace(/ei|ey/g, 'ay')}]`;
    tip = "Almanca'da 'ei' yan yana geldiğinde 'ay' olarak okunur (örn: Nein -> Nayn).";
  }
  // 3. "ie" -> [i:] uzun i (Sie -> Zii, Wie -> Vii)
  else if (word.includes('ie')) {
    phonetic = `[${word.replace(/ie/g, 'ii')}]`;
    tip = "Almanca'da 'ie' harfleri uzun ve berrak bir 'i' sesi verir (örn: Sie -> Zii).";
  }
  // 4. "sch" -> [ş] (Schule -> Şule)
  else if (word.includes('sch')) {
    phonetic = `[${word.replace(/sch/g, 'ş')}]`;
    tip = "'sch' üçlü harf grubu Türkçe 'ş' sesi gibi kuvvetli çıkarılır.";
  }
  // 5. "st" or "sp" at beginning -> [şt / şp] (Sport -> Şport, Stadt -> Ştat)
  else if (word.startsWith('st')) {
    phonetic = `[${word.replace(/^st/, 'şt')}]`;
    tip = "Kelime başındaki 'st' harfleri her zaman 'şt' olarak okunur.";
  } else if (word.startsWith('sp')) {
    phonetic = `[${word.replace(/^sp/, 'şp')}]`;
    tip = "Kelime başındaki 'sp' harfleri her zaman 'şp' olarak okunur.";
  }
  // 6. "ch" (ich-laut vs ach-laut)
  else if (word.includes('ch')) {
    phonetic = `[${word.replace(/ch/g, 'h')}]`;
    if (/[ieäöü]ch/.test(word)) {
      tip = "'ch' harfi i, e, ä, ö, ü harflerinden sonra yumuşak damağa doğru 'h/hy' gibi hışırtılı çıkar (Ich-Laut).";
    } else {
      tip = "'ch' harfi a, o, u harflerinden sonra boğazın gerisinden gırtlaksı 'h' olarak çıkar (Ach-Laut).";
    }
  }
  // 7. "z" -> [ts] (Zimmer -> Tsim-mır)
  else if (word.includes('z')) {
    phonetic = `[${word.replace(/z/g, 'ts')}]`;
    tip = "'Z' harfi Almanca'da 'ts' (t+s birleşik) olarak patlatılarak çıkarılır.";
  }
  // 8. "v" -> [f] (Vater -> Faatır, Vier -> Fia)
  else if (word.includes('v')) {
    phonetic = `[${word.replace(/v/g, 'f')}]`;
    tip = "'V' harfi Almanca kökenli kelimelerde Türkçe 'F' gibi telaffuz edilir (örn: Vater -> Faatır).";
  }
  // 9. "w" -> [v] (Wasser -> Vasır, Wo -> Vo)
  else if (word.includes('w')) {
    phonetic = `[${word.replace(/w/g, 'v')}]`;
    tip = "'W' harfi Türkçe 'V' sesi gibi okunur.";
  }
  // 10. "-er" at word end -> [-a]
  else if (word.endsWith('er')) {
    phonetic = `[${word.replace(/er$/, 'a')}]`;
    tip = "Kelime sonundaki '-er' eki konuşma dilinde hafifçe '-a' sesine kayar.";
  }
  // 11. "-ig" at word end -> [-ih] (Königs, zwanzig)
  else if (word.endsWith('ig')) {
    phonetic = `[${word.replace(/ig$/, 'ih')}]`;
    tip = "Kelime sonundaki '-ig' eki standart Almanca'da yumuşak '-ih' olarak telaffuz edilir.";
  }
  // 12. "ß" -> [s] (heißen, groß)
  else if (word.includes('ß')) {
    phonetic = `[${word.replace(/ß/g, 's')}]`;
    tip = "'ß' (Eszett) harfi keskin, sert bir 's' sesidir.";
  }
  // 13. Umlauts: ä, ö, ü
  else if (word.includes('ö')) {
    tip = "'ö' sesinde dudaklar yuvarlanarak öne doğru büzülür.";
  } else if (word.includes('ü')) {
    tip = "'ü' sesinde dudaklar ileri uzatılarak daraltılır.";
  } else if (word.includes('ä')) {
    tip = "'ä' sesi açık Türkçe 'e' sesine yakındır.";
  }

  return { phonetic, tip };
}

/**
 * Determine score bracket / grade according to strict guidelines:
 * 90-100: Mükemmel
 * 75-89: Çok iyi
 * 60-74: İyi
 * 40-59: Geliştirilmeli
 * 0-39: Tekrar dene
 */
export function getGradeFromScore(score: number): PronunciationGrade {
  if (score >= 90) return 'Mükemmel';
  if (score >= 75) return 'Çok iyi';
  if (score >= 60) return 'İyi';
  if (score >= 40) return 'Geliştirilmeli';
  return 'Tekrar dene';
}

/**
 * Normalize text for fair linguistic comparison (strips accents/punctuation)
 */
export function cleanGermanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:\"'„“«»()—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main Pronunciation Evaluator Function
 * Works on-device without requiring external servers or APIs
 */
export function evaluateGermanPronunciation(
  targetText: string,
  spokenText: string
): PronunciationEvaluationResult {
  const normTarget = cleanGermanText(targetText);
  const normSpoken = cleanGermanText(spokenText);

  const rawTargetWords = targetText.trim().split(/\s+/).filter(Boolean);
  const targetWords = normTarget.split(/\s+/).filter(Boolean);
  const spokenWords = normSpoken.split(/\s+/).filter(Boolean);

  const allWords: WordEvaluation[] = [];
  const correctWords: WordEvaluation[] = [];
  const needsImprovementWords: WordEvaluation[] = [];

  let totalAccuracySum = 0;

  // Word-by-word token analysis
  for (let i = 0; i < targetWords.length; i++) {
    const tWord = targetWords[i];
    const originalWord = rawTargetWords[i] || tWord;
    const { phonetic, tip } = getGermanWordPhoneticAndTip(originalWord);

    // Look for exact or fuzzy match in spoken words
    let bestAccuracy = 0;
    let matchedSpoken: string | undefined = undefined;

    // Check direct positional word first
    if (i < spokenWords.length) {
      const sim = calculateStringSimilarity(tWord, spokenWords[i]);
      if (sim > bestAccuracy) {
        bestAccuracy = sim;
        matchedSpoken = spokenWords[i];
      }
    }

    // Check nearby words in case of dropped/added words
    for (let j = 0; j < spokenWords.length; j++) {
      const sim = calculateStringSimilarity(tWord, spokenWords[j]);
      if (sim > bestAccuracy) {
        bestAccuracy = sim;
        matchedSpoken = spokenWords[j];
      }
    }

    // Determine correctness (threshold 75% similarity)
    const isCorrect = bestAccuracy >= 75;

    const evaluation: WordEvaluation = {
      word: originalWord,
      isCorrect,
      accuracy: bestAccuracy,
      spokenAs: matchedSpoken,
      phoneticTarget: phonetic,
      phoneticRuleTip: tip
    };

    allWords.push(evaluation);
    if (isCorrect) {
      correctWords.push(evaluation);
    } else {
      needsImprovementWords.push(evaluation);
    }

    totalAccuracySum += bestAccuracy;
  }

  // Calculate full sentence Levenshtein similarity
  const sentenceSimilarity = calculateStringSimilarity(normTarget, normSpoken);

  // Blend word-average and sentence similarity
  const wordAvg =
    targetWords.length > 0
      ? Math.round(totalAccuracySum / targetWords.length)
      : sentenceSimilarity;

  let overallScore = Math.round(wordAvg * 0.65 + sentenceSimilarity * 0.35);

  // If user spoke nothing or completely irrelevant audio
  if (!normSpoken) {
    overallScore = 0;
  }

  overallScore = Math.max(0, Math.min(100, overallScore));
  const grade = getGradeFromScore(overallScore);

  let overallFeedbackTr = '';
  switch (grade) {
    case 'Mükemmel':
      overallFeedbackTr =
        'Tebrikler! Telaffuzunuz mükemmel derecede net ve Almanca fonetik kalıplarına tam uyumlu.';
      break;
    case 'Çok iyi':
      overallFeedbackTr =
        'Çok iyi bir performans! Almanca artikülasyonunuz anlaşılır ve akıcı.';
      break;
    case 'İyi':
      overallFeedbackTr =
        'İyi bir deneme! Bazı harf bileşimlerinin (ch, z, eu vb.) seslerine biraz daha dikkat ederek tam puan alabilirsiniz.';
      break;
    case 'Geliştirilmeli':
      overallFeedbackTr =
        'Cümle genel olarak anlaşıldı ancak bazı kelimeleri heceleyerek ve yavaş hızda dinleyip tekrar etmeniz önerilir.';
      break;
    case 'Tekrar dene':
      overallFeedbackTr =
        'Ses tam olarak eşleştirilemedi. Lütfen mikrofonunuza yakınlaşarak doğru sesi dinleyin ve tekrar deneyin.';
      break;
  }

  const disclaimer =
    'Bu puan, cihaz üzeri konuşma tanıma (Speech-to-Text) ve Almanca fonetik benzerlik kuralları ile hesaplanan bir telaffuz tahminidir.';

  return {
    targetText,
    spokenText,
    score: overallScore,
    grade,
    correctWords,
    needsImprovementWords,
    allWords,
    overallFeedbackTr,
    disclaimer
  };
}
