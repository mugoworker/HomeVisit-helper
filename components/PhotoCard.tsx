import React from 'react';
import { X, Type, ChevronDown, GripHorizontal } from 'lucide-react';
import { PhotoData, DEFAULT_CATEGORIES, LayoutMode } from '../types';

interface PhotoCardProps {
  photo: PhotoData;
  index: number;
  onUpdateCategory: (id: string, category: string, isCustom: boolean) => void;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  layoutMode: LayoutMode;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  index,
  onUpdateCategory,
  onRemove,
  onDragStart,
  onDragEnter,
  onDragEnd,
  layoutMode
}) => {
  // Determine aspect ratio class based on mode
  const aspectRatioClass = layoutMode === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]';

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()} // Necessary to allow dropping
    >
      {/* Changed aspect ratio based on mode and ensure object-fill */}
      <div className={`relative ${aspectRatioClass} bg-slate-100 border-b border-slate-100 flex items-center justify-center`}>
        <img
          src={photo.previewUrl}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-fill"
        />

        {/* Drag Handle Indicator */}
        <div className="absolute top-3 left-3 p-2 bg-black/30 text-white rounded-md backdrop-blur-sm pointer-events-none z-10">
          <GripHorizontal size={24} />
        </div>

        {/* Index Badge (Right side now to avoid overlap with Grip) */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 text-white text-base rounded-md backdrop-blur-sm z-10">
          #{index + 1}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag start when clicking remove
            onRemove(photo.id);
          }}
          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:opacity-100 z-10"
          title="移除照片"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-5 space-y-4 cursor-default" onMouseDown={(e) => e.stopPropagation()} draggable={false}>
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <Type size={18} />
            空間類別
          </label>
        </div>

        {photo.isCustomCategory ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={photo.category}
              onChange={(e) => onUpdateCategory(photo.id, e.target.value, true)}
              placeholder="輸入空間名稱"
              className="flex-1 px-4 py-3 text-lg border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B7AA] focus:border-transparent bg-white"
            />
            <button
              onClick={() => onUpdateCategory(photo.id, DEFAULT_CATEGORIES[0], false)}
              className="px-3 py-1 text-base text-slate-500 hover:text-[#A9B7AA] underline whitespace-nowrap"
            >
              選單
            </button>
          </div>
        ) : (
          <div className="relative">
            <select
              value={photo.category}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  onUpdateCategory(photo.id, '', true);
                } else {
                  onUpdateCategory(photo.id, e.target.value, false);
                }
              }}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-lg rounded-lg focus:ring-[#A9B7AA] focus:border-[#A9B7AA] block p-3 pr-10"
            >
              <option value="" disabled>請選擇類別</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom" className="font-semibold text-[#A9B7AA]">
                + 自訂輸入...
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronDown size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};