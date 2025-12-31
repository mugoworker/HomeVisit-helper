
export interface PhotoData {
  id: string;
  file: File;
  previewUrl: string;
  category: string;
  isCustomCategory: boolean;
}

export const DEFAULT_CATEGORIES = [
  '客廳',
  '餐廳',
  '廚房',
  '少年房間',
  '書房',
  '浴廁',
  '陽台',
  '玄關',
  '大門',
  '建物外觀'
];

export const MAX_PHOTOS = 10;
export const PHOTOS_PER_PAGE = 4;

export type LayoutMode = 'portrait' | 'landscape';
