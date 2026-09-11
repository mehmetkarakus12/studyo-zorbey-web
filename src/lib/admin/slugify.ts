const turkishCharMap: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

// Unicode "Combining Diacritical Marks" bloğu (U+0300 - U+036F), \u kaçış
// dizileriyle yazıldı (kaynak dosyada görünmez birleşik karakter olmasın
// diye) — NFD normalizasyonundan sonra kalan aksanları temizler.
const COMBINING_DIACRITICS_START = 0x0300;
const COMBINING_DIACRITICS_END = 0x036f;

function stripCombiningDiacritics(value: string): string {
  let result = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code < COMBINING_DIACRITICS_START || code > COMBINING_DIACRITICS_END) {
      result += char;
    }
  }
  return result;
}

/**
 * Türkçe karakterleri doğru şekilde çeviren, URL-güvenli slug üretici.
 * "İ"/"ı" özellikle elle eşlenir — JS'in `toLowerCase()`'ı Türkçe "İ"yi
 * "i̇" (nokta + birleşik işaret) yaptığı için bu eşleme ÖNCE yapılır.
 */
export function slugify(input: string): string {
  let ascii = "";
  for (const char of input) {
    ascii += turkishCharMap[char] ?? char;
  }

  return stripCombiningDiacritics(ascii.toLowerCase().normalize("NFD"))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
