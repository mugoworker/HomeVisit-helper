import React from 'react';
import { PhotoData, PHOTOS_PER_PAGE, LayoutMode } from '../types';
import { PdfPage, A4_SHORT_PX, A4_LONG_PX } from './PdfPage';

interface PdfPreviewProps {
  photos: PhotoData[];
  containerId: string;
  layoutMode: LayoutMode;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ photos, containerId, layoutMode }) => {
  // Split photos into pages
  const pages = [];
  for (let i = 0; i < photos.length; i += PHOTOS_PER_PAGE) {
    pages.push(photos.slice(i, i + PHOTOS_PER_PAGE));
  }
  
  const width = layoutMode === 'portrait' ? A4_SHORT_PX : A4_LONG_PX;

  return (
    <div 
      id={containerId} 
      style={{ 
        position: 'absolute', 
        top: '-10000px', 
        left: 0, 
        width: `${width}px`,
      }}
    >
      {pages.map((pagePhotos, pageIndex) => (
        <PdfPage 
          key={pageIndex}
          photos={pagePhotos}
          pageIndex={pageIndex}
          totalPages={pages.length}
          layoutMode={layoutMode}
        />
      ))}
    </div>
  );
};