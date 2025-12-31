import heic2any from 'heic2any';

export const processImageFile = async (file: File): Promise<File> => {
  // Check for HEIC file types
  const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';
  
  if (isHeic) {
    try {
      console.log('Converting HEIC file:', file.name);
      // Convert to JPEG
      const result = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });

      // Handle both single blob and array of blobs (we take the first one)
      const blob = Array.isArray(result) ? result[0] : result;
      
      // Create a new File object
      const newFileName = file.name.replace(/\.heic$/i, '.jpg');
      return new File([blob], newFileName, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error converting HEIC:', error);
      throw new Error(`無法轉換 HEIC 檔案: ${file.name}`);
    }
  }

  return file;
};