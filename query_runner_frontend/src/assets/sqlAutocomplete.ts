// SQL editörü için tahmin motoru: tablo/kolon/keyword önerileri ve
// dropdown'un imleç altına konumlandırılması için yardımcılar.

export interface Suggestion {
  value: string;
  kind: 'table' | 'column' | 'keyword';
  detail?: string; // kolonlar için ait olduğu tablo
}

export interface TableInfo {
  name: string;
  columns: { name: string; type: string }[];
}

export const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'ON', 'AS',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'DISTINCT', 'AND', 'OR', 'NOT',
  'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'COUNT', 'SUM', 'AVG',
  'MIN', 'MAX', 'ASC', 'DESC', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM',
  'VALUES', 'COALESCE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION',
  'EXISTS', 'INTERVAL', 'CURRENT_DATE',
];

const MAX_SUGGESTIONS = 8;

// İmleçten geriye doğru aktif kelimeyi (tanımlayıcıyı) çıkarır.
export function getCurrentWord(text: string, caretPos: number): { word: string; start: number } {
  const before = text.slice(0, caretPos);
  const match = before.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (!match) return { word: '', start: caretPos };
  return { word: match[0], start: caretPos - match[0].length };
}

// Aktif kelimeden önceki son SQL anahtar kelimesini bulur (bağlam için).
function lastKeywordBefore(textBeforeWord: string): string {
  const tokens = textBeforeWord.toUpperCase().match(/[A-Z_]+/g) || [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (['FROM', 'JOIN', 'SELECT', 'WHERE', 'ON', 'BY', 'AND', 'OR', 'SET', 'INTO', 'UPDATE'].includes(tokens[i])) {
      return tokens[i];
    }
  }
  return '';
}

export function buildSuggestions(
  word: string,
  textBeforeWord: string,
  tables: TableInfo[],
): Suggestion[] {
  if (!word) return [];
  const lower = word.toLowerCase();

  const context = lastKeywordBefore(textBeforeWord);
  const tableContext = ['FROM', 'JOIN', 'INTO', 'UPDATE'].includes(context);
  const columnContext = ['SELECT', 'WHERE', 'ON', 'BY', 'AND', 'OR', 'SET'].includes(context);

  // Sorgu metninde adı geçen tabloların kolonları öncelikli
  const textLower = textBeforeWord.toLowerCase();
  const mentionedTables = new Set(tables.filter(t => textLower.includes(t.name)).map(t => t.name));

  // Kısa ad önce: "cus" → customers, customer_addresses
  const tableMatches: Suggestion[] = tables
    .filter(t => t.name.toLowerCase().startsWith(lower))
    .sort((a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name))
    .map(t => ({ value: t.name, kind: 'table' as const }));

  const columnMatches: Suggestion[] = [];
  const seenColumns = new Set<string>();
  // Önce sorguda geçen tabloların kolonları, sonra kalanlar
  const orderedTables = [...tables].sort((a, b) =>
    Number(mentionedTables.has(b.name)) - Number(mentionedTables.has(a.name)));
  for (const t of orderedTables) {
    for (const c of t.columns) {
      if (!c.name.toLowerCase().startsWith(lower) || seenColumns.has(c.name)) continue;
      seenColumns.add(c.name);
      columnMatches.push({ value: c.name, kind: 'column', detail: t.name });
    }
  }

  const keywordMatches: Suggestion[] = SQL_KEYWORDS
    .filter(k => k.toLowerCase().startsWith(lower))
    .map(k => ({ value: k, kind: 'keyword' as const }));

  let ordered: Suggestion[];
  if (tableContext) {
    ordered = [...tableMatches, ...keywordMatches, ...columnMatches];
  } else if (columnContext) {
    ordered = [...columnMatches, ...keywordMatches, ...tableMatches];
  } else {
    ordered = [...keywordMatches, ...tableMatches, ...columnMatches];
  }

  // Kelime zaten tek ve tam eşleşmeyse önermeye gerek yok
  if (ordered.length === 1 && ordered[0].value.toLowerCase() === lower) return [];

  return ordered.slice(0, MAX_SUGGESTIONS);
}

// Kopyalanacak stiller: mirror div'in textarea ile aynı satır kırılımını
// üretmesi için gerekli olanlar.
const MIRROR_STYLES = [
  'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
  'lineHeight', 'textTransform', 'wordSpacing', 'textIndent', 'tabSize',
] as const;

// İmlecin textarea içindeki piksel konumunu mirror div tekniğiyle ölçer.
export function getCaretCoordinates(
  textarea: HTMLTextAreaElement,
  caretPos: number,
): { top: number; left: number } {
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(textarea);

  mirror.style.position = 'absolute';
  mirror.style.top = '0px';
  mirror.style.left = '0px';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.style.overflow = 'hidden';

  for (const prop of MIRROR_STYLES) {
    mirror.style[prop] = computed[prop];
  }

  const textBeforeCaret = textarea.value.substring(0, caretPos);
  mirror.textContent = textBeforeCaret;

  // Son karakter alt satıra geçişse, boşluğu ve yüksekliği doğru hesaplamak için non-breaking space ekle
  if (textBeforeCaret.endsWith('\n')) {
    mirror.textContent += '\xA0';
  }

  const marker = document.createElement('span');
  marker.textContent = textarea.value.substring(caretPos, caretPos + 1) || '.';
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const rawLineHeight = parseFloat(computed.lineHeight);
  const fontSize = parseFloat(computed.fontSize) || 14;
  const lineHeight = isNaN(rawLineHeight) ? fontSize * 1.5 : rawLineHeight;

  const top = marker.offsetTop + lineHeight - textarea.scrollTop;
  const left = marker.offsetLeft - textarea.scrollLeft;

  document.body.removeChild(mirror);

  return { top, left };
}
