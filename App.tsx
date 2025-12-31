import React, { useState, useEffect, useRef } from 'react';
import { Home, Download, RefreshCw, Info, Eye, Smartphone, Monitor } from 'lucide-react';
import { PhotoData, DEFAULT_CATEGORIES, MAX_PHOTOS, LayoutMode } from './types';
import { PhotoUploader } from './components/PhotoUploader';
import { PhotoCard } from './components/PhotoCard';
import { PdfPreview } from './components/PdfPreview';
import { PreviewModal } from './components/PreviewModal';
import { generatePdfFromHtml } from './services/pdfGenerator';
import { processImageFile } from './services/imageUtils';
// imageUtils import kept

const PREVIEW_CONTAINER_ID = 'pdf-preview-container';

const App: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // For image conversion
  const [isGenerating, setIsGenerating] = useState(false); // For PDF generation
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0); // To force reset uploader

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    setError(null);

    const newFiles = Array.from(fileList);
    const availableSlots = MAX_PHOTOS - photos.length;

    if (newFiles.length > availableSlots) {
      setError(`超過上限，僅處理前 ${availableSlots} 張照片。`);
    }

    const filesToProcess = newFiles.slice(0, availableSlots);
    setIsProcessing(true);

    try {
      // Process files (handle HEIC conversion)
      const processedFiles = await Promise.all(
        filesToProcess.map(async (file) => await processImageFile(file))
      );

      const newPhotos: PhotoData[] = processedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        category: DEFAULT_CATEGORIES[0], // Default to first category
        isCustomCategory: false,
        isCustomCategory: false
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (err) {
      console.error(err);
      setError('處理照片時發生錯誤，請確認檔案格式是否正確。');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateCategory = (id: string, category: string, isCustom: boolean) => {
    setPhotos(prev => prev.map(p =>
      p.id === id ? { ...p, category, isCustomCategory: isCustom } : p
    ));
  };

  // Functions removed

  // Functions removed

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const target = prev.find(p => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const resetAll = () => {
    photos.forEach(photo => URL.revokeObjectURL(photo.previewUrl));
    setPhotos([]);
    setError(null);
    setLayoutMode(null); // Reset layout mode to go back to selection screen
    setUploaderKey(prev => prev + 1);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (dragItem.current === null || dragItem.current === index) return;

    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[dragItem.current];
    newPhotos.splice(dragItem.current, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    setPhotos(newPhotos);
    dragItem.current = index;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDownloadPdf = async (customFilename: string) => {
    if (photos.length === 0 || !layoutMode) return;

    // Determine filename
    let filename = customFilename.trim() || "家訪照片紀錄";
    if (!filename.toLowerCase().endsWith('.pdf')) filename += '.pdf';

    try {
      setIsGenerating(true);
      // Ensure the DOM is fully updated with the hidden preview
      await new Promise(resolve => setTimeout(resolve, 500));
      await generatePdfFromHtml(PREVIEW_CONTAINER_ID, filename, layoutMode);
      setShowPreviewModal(false); // Close modal on success
    } catch (err) {
      console.error(err);
      setError('生成 PDF 時發生錯誤，請重試。');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 1. Selection Screen ---
  if (!layoutMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-[LXGW WenKai TC] p-4">
        <div className="text-center mb-12">
          <div className="bg-[#A9B7AA] w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <Home size={40} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-4">家訪照片排版助手</h1>
          <p className="text-xl text-slate-500">請先選擇您想要的輸出版型</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <button
            onClick={() => setLayoutMode('portrait')}
            className="group bg-white p-10 rounded-2xl shadow-sm border-2 border-slate-200 hover:border-[#A9B7AA] hover:shadow-xl transition-all flex flex-col items-center text-center gap-6"
          >
            <div className="w-32 h-44 border-4 border-slate-300 rounded-lg bg-slate-100 group-hover:bg-[#A9B7AA]/10 group-hover:border-[#A9B7AA] transition-colors relative flex flex-col p-2">
              <div className="w-full h-4 border-b-2 border-slate-300 mb-2"></div>
              <div className="flex-1 grid grid-cols-2 gap-1">
                <div className="bg-slate-300/50 rounded-sm"></div>
                <div className="bg-slate-300/50 rounded-sm"></div>
                <div className="bg-slate-300/50 rounded-sm"></div>
                <div className="bg-slate-300/50 rounded-sm"></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2 group-hover:text-[#A9B7AA]">直式版型</h2>
              <p className="text-slate-500 text-lg">
                標準 A4 直向<br />
                照片比例 3:4<br />
                頁眉位於上方
              </p>
            </div>
          </button>

          <button
            onClick={() => setLayoutMode('landscape')}
            className="group bg-white p-10 rounded-2xl shadow-sm border-2 border-slate-200 hover:border-[#A9B7AA] hover:shadow-xl transition-all flex flex-col items-center text-center gap-6"
          >
            <div className="w-44 h-32 border-4 border-slate-300 rounded-lg bg-slate-100 group-hover:bg-[#A9B7AA]/10 group-hover:border-[#A9B7AA] transition-colors relative flex p-2 gap-2">
              <div className="h-full w-4 border-r-2 border-slate-300"></div>
              <div className="flex-1 grid grid-cols-2 gap-1">
                <div className="bg-slate-300/50 rounded-sm"></div>
                <div className="bg-slate-300/50 rounded-sm"></div>
                <div className="bg-slate-300/50 rounded-sm"></div>
                <div className="bg-slate-300/50 rounded-sm"></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2 group-hover:text-[#A9B7AA]">橫式版型</h2>
              <p className="text-slate-500 text-lg">
                A4 橫向<br />
                照片比例 4:3<br />
                頁眉位於左方 (直書)
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- 2. Main App Screen ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32 font-[LXGW WenKai TC]">
      {/* Hidden Preview Container for actual PDF Generation */}
      <PdfPreview photos={photos} containerId={PREVIEW_CONTAINER_ID} layoutMode={layoutMode} />

      {/* Visual Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={handleDownloadPdf}
        photos={photos}
        isGenerating={isGenerating}
        layoutMode={layoutMode}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#A9B7AA] p-2.5 rounded-lg text-white">
              <Home size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">家訪照片排版助手</h1>
              <p className="text-base text-slate-500 hidden sm:block mt-0.5">
                目前模式：{layoutMode === 'portrait' ? '直式 (3:4)' : '橫式 (4:3)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              title="重選版型/清空"
            >
              <RefreshCw size={24} />
              <span className="hidden sm:inline font-medium text-lg">重選版型</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">

        {/* Instructions */}
        {photos.length === 0 && (
          <div className="mb-10 bg-[#A9B7AA]/10 border border-[#A9B7AA]/30 rounded-xl p-6 flex items-start gap-4 text-[#526053]">
            <Info className="shrink-0 mt-1" size={28} />
            <div className="text-xl">
              <p className="font-semibold mb-2">使用說明 ({layoutMode === 'portrait' ? '直式' : '橫式'}模式)：</p>
              <ul className="list-disc list-inside space-y-2 opacity-90">
                <li>請上傳 1 至 10 張家訪照片 (支援 JPG/PNG/HEIC)。</li>
                <li>此模式照片比例為 <strong>{layoutMode === 'portrait' ? '3:4' : '4:3'}</strong>，系統將強制調整比例填滿。</li>
                <li>拖曳照片可調整排序。</li>
                <li>系統將自動排版，點擊下方「預覽與下載」查看結果。</li>
              </ul>
            </div>
          </div>
        )}

        {/* Uploader */}
        <div className="mb-10">
          <PhotoUploader
            key={uploaderKey}
            currentCount={photos.length}
            onUpload={handleUpload}
            isLoading={isProcessing}
          />
          {error && (
            <div className="mt-4 text-lg text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg animate-fade-in">
              {error}
            </div>
          )}
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                index={index}
                photo={photo}
                onUpdateCategory={updateCategory}
                onRemove={removePhoto}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        )}

        {/* Footer Signature */}
        <div className="mt-12 text-center text-slate-300 text-xl font-medium tracking-widest">
          嘿，小耕同學
        </div>
      </main>

      {/* Floating Action Bar (Mobile Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-xl font-medium text-slate-600">
            已選擇 <span className="text-[#A9B7AA] font-bold text-2xl">{photos.length}</span> / {MAX_PHOTOS} 張
          </div>

          <button
            onClick={() => setShowPreviewModal(true)}
            disabled={photos.length === 0 || isProcessing || isGenerating}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-xl text-white shadow-md transition-all
              ${photos.length === 0 || isProcessing || isGenerating
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#A9B7AA] hover:bg-[#8F9E90] active:scale-95 shadow-[#A9B7AA]/40'
              }
            `}
          >
            {isProcessing ? (
              <span>處理中...</span>
            ) : (
              <>
                <Eye size={24} />
                <span>預覽與下載</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;