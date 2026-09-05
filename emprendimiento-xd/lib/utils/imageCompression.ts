import imageCompression from 'browser-image-compression';

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export async function compressImage(file: File): Promise<CompressionResult> {
  const originalSize = file.size;
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    initialQuality: 0.75,
    fileType: 'image/webp',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const compressedSize = compressedFile.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    console.log('🖼️ Compresión de imagen:');
    console.log(`   Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Tamaño comprimido: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   Reducción: ${compressionRatio.toFixed(2)}%`);

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('❌ Error al comprimir imagen:', error);
    throw new Error('No se pudo comprimir la imagen');
  }
}

export async function uploadImageToSupabase(
  file: File,
  bucketName: string,
  fileName: string
): Promise<string> {
  const { supabase } = await import('@/lib/supabase/client');

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('❌ Error al subir imagen a Supabase:', error);
    throw new Error('No se pudo subir la imagen a Supabase');
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  console.log('✅ Imagen subida exitosamente:', publicUrl);
  return publicUrl;
}

export async function deleteImageFromSupabase(
  bucketName: string,
  fileName: string
): Promise<void> {
  const { supabase } = await import('@/lib/supabase/client');

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([fileName]);

  if (error) {
    console.error('❌ Error al eliminar imagen de Supabase:', error);
    throw new Error('No se pudo eliminar la imagen de Supabase');
  }

  console.log('✅ Imagen eliminada exitosamente');
}
