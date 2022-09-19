import { globby } from 'globby';

export default function listPhotos(dir: string) {
  // Formats supported by `sharp`: https://sharp.pixelplumbing.com/#formats
  // File extensions: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
  const pattern = '**/*.(jpg|jpeg|jfif|pjpeg|pjp|png|webp|gif|avif|tif|tiff)';
  return globby(pattern, { cwd: dir, caseSensitiveMatch: false, onlyFiles: true });
}
