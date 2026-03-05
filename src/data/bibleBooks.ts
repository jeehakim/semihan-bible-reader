export interface BibleBook {
  korean: string
  chapters: number
}

export const bibleBooks: BibleBook[] = [
  { korean: '창세기', chapters: 50 },
  { korean: '출애굽기', chapters: 40 },
  { korean: '레위기', chapters: 27 },
  { korean: '민수기', chapters: 36 },
  { korean: '신명기', chapters: 34 },
  { korean: '여호수아', chapters: 24 },
  { korean: '사사기', chapters: 21 },
  { korean: '룻기', chapters: 4 },
  { korean: '사무엘상', chapters: 31 },
  { korean: '사무엘하', chapters: 24 },
  { korean: '열왕기상', chapters: 22 },
  { korean: '열왕기하', chapters: 25 },
  { korean: '역대상', chapters: 29 },
  { korean: '역대하', chapters: 36 },
  { korean: '에스라', chapters: 10 },
  { korean: '느헤미야', chapters: 13 },
  { korean: '에스더', chapters: 10 },
  { korean: '욥기', chapters: 42 },
  { korean: '시편', chapters: 150 },
  { korean: '잠언', chapters: 31 },
  { korean: '전도서', chapters: 12 },
  { korean: '아가', chapters: 8 },
  { korean: '이사야', chapters: 66 },
  { korean: '예레미야', chapters: 52 },
  { korean: '예레미야애가', chapters: 5 },
  { korean: '에스겔', chapters: 48 },
  { korean: '다니엘', chapters: 12 },
  { korean: '호세아', chapters: 14 },
  { korean: '요엘', chapters: 3 },
  { korean: '아모스', chapters: 9 },
  { korean: '오바댜', chapters: 1 },
  { korean: '요나', chapters: 4 },
  { korean: '미가', chapters: 7 },
  { korean: '나훔', chapters: 3 },
  { korean: '하박국', chapters: 3 },
  { korean: '스바냐', chapters: 3 },
  { korean: '학개', chapters: 2 },
  { korean: '스가랴', chapters: 14 },
  { korean: '말라기', chapters: 4 },
  { korean: '마태복음', chapters: 28 },
  { korean: '마가복음', chapters: 16 },
  { korean: '누가복음', chapters: 24 },
  { korean: '요한복음', chapters: 21 },
  { korean: '사도행전', chapters: 28 },
  { korean: '로마서', chapters: 16 },
  { korean: '고린도전서', chapters: 16 },
  { korean: '고린도후서', chapters: 13 },
  { korean: '갈라디아서', chapters: 6 },
  { korean: '에베소서', chapters: 6 },
  { korean: '빌립보서', chapters: 4 },
  { korean: '골로새서', chapters: 4 },
  { korean: '데살로니가전서', chapters: 5 },
  { korean: '데살로니가후서', chapters: 3 },
  { korean: '디모데전서', chapters: 6 },
  { korean: '디모데후서', chapters: 4 },
  { korean: '디도서', chapters: 3 },
  { korean: '빌레몬서', chapters: 1 },
  { korean: '히브리서', chapters: 13 },
  { korean: '야고보서', chapters: 5 },
  { korean: '베드로전서', chapters: 5 },
  { korean: '베드로후서', chapters: 3 },
  { korean: '요한1서', chapters: 5 },
  { korean: '요한2서', chapters: 1 },
  { korean: '요한3서', chapters: 1 },
  { korean: '유다서', chapters: 1 },
  { korean: '요한계시록', chapters: 22 }
]

export function getBibleBookOptions() {
  return bibleBooks.map((book, index) => ({
    value: index,
    label: book.korean
  }))
}

export function getChapterOptions(bookIndex: number) {
  const book = bibleBooks[bookIndex]
  if (!book) return []

  return Array.from({ length: book.chapters }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}장`
  }))
}
