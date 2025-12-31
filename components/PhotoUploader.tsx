import React, { useCallback, useRef } from 'react';
import { Upload, ImagePlus } from 'lucide-react';
import { MAX_PHOTOS } from '../types';

interface PhotoUploaderProps {
  currentCount: number;
  onUpload: (files: FileList | null) => void;
  isLoading?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ currentCount, onUpload, isLoading = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentCount >= MAX_PHOTOS || isLoading) return;
      onUpload(e.dataTransfer.files);
    },
    [currentCount, onUpload, isLoading]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentCount >= MAX_PHOTOS || isLoading) return;
    onUpload(e.target.files);
    // Reset the input value so the same file can be selected again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  const remaining = MAX_PHOTOS - currentCount;
  const isDisabled = remaining <= 0 || isLoading;

  return (
    <div
      onDrop={isDisabled ? undefined : handleDrop}
      onDragOver={handleDragOver}
      className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 
        ${isDisabled 
          ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60' 
          : 'border-[#A9B7AA]/50 bg-[#A9B7AA]/5 hover:bg-[#A9B7AA]/10 hover:border-[#A9B7AA] cursor-pointer'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/heic,.heic"
        onChange={handleChange}
        disabled={isDisabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-[#A9B7AA]/20 text-[#A9B7AA]'}`}>
          {isDisabled ? <ImagePlus size={36} /> : <Upload size={36} />}
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-medium text-slate-700">
            {isLoading ? '處理照片中...' : (isDisabled ? '已達照片上限' : '點擊或拖曳上傳照片')}
          </p>
          <p className="text-lg text-slate-500">
            {isDisabled 
              ? `最多只能上傳 ${MAX_PHOTOS} 張照片` 
              : `支援 JPG, PNG, HEIC 格式 (還可上傳 ${remaining} 張)`}
          </p>
        </div>
      </div>
    </div>
  );
};