import React from 'react';
import { PhotoData } from '../types';

export const A4_SHORT_PX = 794; // 210mm @ 96dpi (approx)
export const A4_LONG_PX = 1123; // 297mm @ 96dpi (approx)

interface PdfPageProps {
  photos: PhotoData[];
  pageIndex: number;
  totalPages: number;
  layoutMode: 'portrait' | 'landscape';
}

export const PdfPage: React.FC<PdfPageProps> = ({ photos, pageIndex, totalPages, layoutMode }) => {
  const isPortrait = layoutMode === 'portrait';
  const width = isPortrait ? A4_SHORT_PX : A4_LONG_PX;
  const height = isPortrait ? A4_LONG_PX : A4_SHORT_PX;

  // Calculate padding and grid gap
  const pagePadding = 40;
  const headerHeight = 60;

  const contentWidth = width - (pagePadding * 2);
  const contentHeight = height - (pagePadding * 2) - headerHeight;

  return (
    <div
      data-page
      className="bg-white relative overflow-hidden flex"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        padding: `${pagePadding}px`,
        flexDirection: isPortrait ? 'column' : 'row'
      }}
    >
      {/* Header */}
      {isPortrait ? (
        // Portrait Header (Top)
        <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-4 shrink-0" style={{ height: `${headerHeight}px`, width: '100%' }}>
          <h1 className="text-3xl font-bold text-slate-900 tracking-widest">家訪照片紀錄</h1>
          <div className="text-slate-500 font-medium">
            第 {pageIndex + 1} 頁，共 {totalPages} 頁
          </div>
        </div>
      ) : (
        // Landscape Header (Left, Vertical Text)
        <div className="flex flex-col justify-between items-center border-r-2 border-slate-800 pr-3 mr-4 shrink-0" style={{ width: `${headerHeight}px`, height: '100%' }}>
          <h1 className="text-3xl font-bold text-slate-900 tracking-widest" style={{ writingMode: 'vertical-rl' }}>家訪照片紀錄</h1>
          <div className="text-slate-500 font-medium" style={{ writingMode: 'vertical-rl' }}>
            第 {pageIndex + 1} 頁，共 {totalPages} 頁
          </div>
        </div>
      )}

      {/* Main Content Area (Grid) */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Grid Container */}
        <div className="flex-1 grid grid-cols-2 gap-4 content-start">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`relative border border-slate-300 bg-white flex items-center justify-center overflow-hidden rounded-sm ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
            >
              <img
                src={photo.previewUrl}
                alt={photo.category}
                className="w-full h-full object-fill"
              />

              <div className="absolute top-0 left-0 bg-white/90 px-4 py-2 border-b border-r border-slate-300 shadow-sm z-10 min-w-[6rem] flex items-center justify-center">
                <span className="text-lg font-bold text-slate-800 tracking-wide text-center leading-none">
                  {photo.category || '未分類'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};