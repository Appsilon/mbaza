import sharp from 'sharp';

export default async function createThumbnail(
  inputPath: string,
  outputPath: string,
  maxWidthHeight: number
) {
  await sharp(inputPath)
    .resize({
      width: maxWidthHeight,
      height: maxWidthHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .withMetadata()
    .toFile(outputPath);
}
