import ndarray from 'ndarray';
import * as ort from 'onnxruntime-node';
import { join } from 'path';
import sharp from 'sharp';

import { Model, MODELS } from '../../common/models';
import { RESOURCES_PATH } from '../util';

const WIDTH = 512;
const HEIGHT = 384;
const CHANNELS = 3;

function modelPath(model: Model) {
  return join(RESOURCES_PATH, 'assets', 'models', MODELS[model].file);
}

async function readPhoto(path: string) {
  const raw = await sharp(path).resize(WIDTH, HEIGHT, { fit: 'fill' }).raw().toBuffer();

  // Reshape and normalize to match model input shape.
  const srcShape = [HEIGHT, WIDTH, CHANNELS];
  const dstShape = [CHANNELS, HEIGHT, WIDTH];
  const src = ndarray(raw, srcShape);
  const dst = ndarray(new Float32Array(raw.length), dstShape);
  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      for (let k = 0; k < CHANNELS; k += 1) {
        dst.set(k, i, j, src.get(i, j, k) / 255);
      }
    }
  }
  return dst;
}

function attachLabels(model: Model, output: ort.Tensor) {
  const entries = MODELS[model].labels.map((label, idx) => [label, output.data[idx]]);
  return Object.fromEntries(entries);
}

export default async function runInference(model: Model, photoPaths: string[]) {
  const session = await ort.InferenceSession.create(modelPath(model));
  const results = [];
  // Intentionally await in loop: attempting to process
  // all photos at once would consume too much resources.
  /* eslint-disable no-await-in-loop */
  for (const path of photoPaths) {
    const photo = await readPhoto(path);
    // The first dimension of the tensor is the photo index (used for batch processing).
    // TODO: Process photos in batches to improve performance.
    const input = new ort.Tensor('float32', photo.data, [1, ...photo.shape]);
    const { output } = await session.run({ input });
    results.push(attachLabels(model, output));
  }
  /* eslint-enable no-await-in-loop */
  return results;
}
