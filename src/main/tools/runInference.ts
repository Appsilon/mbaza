import * as ort from 'onnxruntime-node';
import { join } from 'path';
import sharp from 'sharp';

import { Model, MODELS } from '../../common/models';
import { RESOURCES_PATH } from '../util';

const BATCH_SIZE = 1;
const CHANNELS = 3;

function modelPath(model: Model) {
  return join(RESOURCES_PATH, 'assets', 'models', MODELS[model].file);
}

async function readPhoto(path: string, shape: { width: number; height: number }) {
  const raw = await sharp(path)
    .resize({ ...shape, fit: 'fill' })
    .raw()
    .toBuffer();
  const photo = new Float32Array(raw);
  for (let i = 0; i < photo.length; i += 1) photo[i] /= 255;
  return photo;
}

// If output is not provided, build an empty result.
function buildResult(model: Model, output?: ort.Tensor) {
  const entries = MODELS[model].labels.map((label, idx) => [
    label,
    output ? output.data[idx] : undefined,
  ]);
  return Object.fromEntries(entries);
}

export default async function runInference(model: Model, photoPaths: string[]) {
  const session = await ort.InferenceSession.create(modelPath(model));
  const results = [];
  // Intentionally await in loop: attempting to process
  // all photos at once would consume too much resources.
  /* eslint-disable no-await-in-loop */
  for (const path of photoPaths) {
    try {
      const { photoShape } = MODELS[model];
      const photo = await readPhoto(path, photoShape);
      // TODO: Process multiple photos per batch to improve performance.
      const inputShape = [BATCH_SIZE, photoShape.height, photoShape.width, CHANNELS];
      const input = new ort.Tensor('float32', photo, inputShape);
      const { output } = await session.run({ input });
      results.push(buildResult(model, output));
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      results.push(buildResult(model));
    }
  }
  /* eslint-enable no-await-in-loop */
  return results;
}
