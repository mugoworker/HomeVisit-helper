import React, { forwardRef } from 'react';
import { PhotoData, PHOTOS_PER_PAGE, LayoutMode } from '../types';

interface PdfPageProps {
  photos: PhotoData[];
  pageIndex: number;
  totalPages: number;
  scale?: number; // Optional scale for preview purposes
  layoutMode: LayoutMode;
}

export const A4_SHORT_PX = 794;
export const A4_LONG_PX = 1123;

export const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(({ photos, pageIndex, totalPages, scale = 1, layoutMode }, ref) => {
  const isPortrait = layoutMode === 'portrait';
  
  // Dimensions based on mode
  const width = isPortrait ? A4_SHORT_PX : A4_LONG_PX;
  const height = isPortrait ? A4_LONG_PX : A4_SHORT_PX;

  return (
    <div
      ref={ref}
      className={`bg-white relative shadow-sm ${isPortrait ? 'flex flex-col' : 'flex flex-row'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        padding: isPortrait ? '40px' : '40px 40px 40px 0', // Landscape has left header, so 0 padding left
        boxSizing: 'border-box',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        marginBottom: scale === 1 ? '0' : `${height * (scale - 1)}px` // Adjust layout flow if scaled
      }}
      data-page={`page-${pageIndex}`}
    >
      {/* Header Logic */}
      {isPortrait ? (
        /* Portrait Header: Top */
        <div className="w-full mb-4 border-b-2 border-slate-800 pb-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-wider inline-block">家訪照片紀錄</h1>
          <div className="flex justify-between text-sm text-slate-600 mt-1">
            <span>頁次: {pageIndex + 1} / {totalPages}</span>
          </div>
        </div>
      ) : (
        /* Landscape Header: Left Side (Vertical Text) */
        <div className="h-full w-24 border-r-2 border-slate-800 py-6 flex flex-col justify-between items-center shrink-0 ml-4 mr-6">
           {/* Added text-center to H1 to ensure glyphs are centered in the line column */}
           <h1 className="text-3xl font-bold text-slate-900 tracking-widest [writing-mode:vertical-rl] leading-none text-center">
             家訪照片紀錄
           </h1>
           <div className="text-sm text-slate-600 [writing-mode:vertical-rl] flex items-center gap-2 tracking-widest text-center">
             <span>頁次: {pageIndex + 1} / {totalPages}</span>
           </div>
        </div>
      )}

      {/* Grid Content */}
      <div className={`w-full flex-1 grid grid-cols-2 gap-4 ${isPortrait ? 'content-start mt-2' : 'content-center'}`}>
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className={`relative border border-slate-300 bg-white flex items-center justify-center overflow-hidden rounded-sm ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
          >
            {/* Photo - Object Fill to stretch and fit without whitespace or cropping */}
            <img
              src={photo.previewUrl}
              alt={photo.category}
              className="w-full h-full object-fill" 
            />
            
            {/* Label Overlay - Strictly Centered */}
            <div className="absolute top-0 left-0 bg-white/90 px-4 py-2 border-b border-r border-slate-300 shadow-sm z-10 min-w-[6rem] flex items-center justify-center">
              <span className="text-lg font-bold text-slate-800 tracking-wide text-center leading-none">
                {photo.category || '未分類'}
              </span>
            </div>
          </div>
        ))}
        
        {/* Fill empty slots if less than 4 photos on last page */}
        {Array.from({ length: PHOTOS_PER_PAGE - photos.length }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className={`border border-dashed border-slate-200 bg-transparent ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
          />
        ))}
      </div>
    </div>
  );
});

PdfPage.displayName = 'PdfPage';