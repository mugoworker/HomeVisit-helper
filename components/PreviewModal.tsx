import React, { useEffect, useState } from 'react';
import { X, Download, Loader2, FileSignature } from 'lucide-react';
import { PhotoData, PHOTOS_PER_PAGE, LayoutMode } from '../types';
import { PdfPage, A4_SHORT_PX, A4_LONG_PX } from './PdfPage';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
  photos: PhotoData[];
  isGenerating: boolean;
  layoutMode: LayoutMode;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  photos,
  isGenerating,
  layoutMode
}) => {
  const [scale, setScale] = useState(0.5);
  const [filename, setFilename] = useState('');

  // Split photos into pages
  const pages = [];
  for (let i = 0; i < photos.length; i += PHOTOS_PER_PAGE) {
    pages.push(photos.slice(i, i + PHOTOS_PER_PAGE));
  }

  useEffect(() => {
    const calculateScale = () => {
      const containerWidth = Math.min(window.innerWidth - 48, 1000); // 48px for padding
      
      const pageWidth = layoutMode === 'portrait' ? A4_SHORT_PX : A4_LONG_PX;
      
      // Calculate scale to fit width
      let newScale = Math.min((containerWidth / pageWidth), 0.8);
      
      // If landscape, might need to check height constraints on small screens?
      // Usually width is the bottleneck for A4, but just in case.
      
      setScale(newScale);
    };

    if (isOpen) {
      calculateScale();
      window.addEventListener('resize', calculateScale);
      // Reset filename when opening
      setFilename('');
    }

    return () => window.removeEventListener('resize', calculateScale);
  }, [isOpen, layoutMode]);

  if (!isOpen) return null;

  const pageWidth = layoutMode === 'portrait' ? A4_SHORT_PX : A4_LONG_PX;
  const pageHeight = layoutMode === 'portrait' ? A4_LONG_PX : A4_SHORT_PX;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-100 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">預覽 PDF 內容</h2>
            <p className="text-lg text-slate-500 mt-1">
              共 {pages.length} 頁 ({layoutMode === 'portrait' ? '直式' : '橫式'})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
        </div>

        {/* Modal Body - Scrollable Preview */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-200/50 flex flex-col items-center gap-8">
          {pages.map((pagePhotos, pageIndex) => (
            <div 
              key={pageIndex} 
              className="shadow-lg transition-transform"
              style={{
                width: `${pageWidth * scale}px`,
                height: `${pageHeight * scale}px`,
              }}
            >
              {/* We render the PdfPage with a scale prop to fit visually */}
              <PdfPage
                photos={pagePhotos}
                pageIndex={pageIndex}
                totalPages={pages.length}
                scale={scale}
                layoutMode={layoutMode}
              />
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-8 py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
          
          {/* Filename Input */}
          <div className="flex-1 w-full sm:max-w-md flex items-center gap-3 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#A9B7AA] focus-within:border-transparent transition-all">
            <FileSignature className="text-slate-400" size={24} />
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="輸入檔名 (預設：家訪照片紀錄)"
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-slate-700 placeholder:text-slate-400 py-2 outline-none"
              disabled={isGenerating}
            />
            <span className="text-slate-400 font-medium text-lg">.pdf</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 text-lg font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              返回修改
            </button>
            <button
              onClick={() => onConfirm(filename)}
              disabled={isGenerating}
              className="flex items-center gap-3 px-8 py-3 rounded-lg bg-[#A9B7AA] text-white text-lg font-bold hover:bg-[#8F9E90] shadow-[#A9B7AA]/40 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
            >
               {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>處理中...</span>
                </>
              ) : (
                <>
                  <Download size={24} />
                  <span>確認下載 PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};