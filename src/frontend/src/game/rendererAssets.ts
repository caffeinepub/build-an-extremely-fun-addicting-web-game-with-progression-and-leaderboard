// Renderer-focused asset cache/loader for game canvas
import { GENERATED_ASSETS } from '../assets/generatedAssets';

interface RendererAssets {
  background: HTMLImageElement | null;
  token: HTMLImageElement | null;
  hazard: HTMLImageElement | null;
  uiSheet: HTMLImageElement | null;
}

const assets: RendererAssets = {
  background: null,
  token: null,
  hazard: null,
  uiSheet: null,
};

let loadingPromise: Promise<void> | null = null;

export function loadRendererAssets(): Promise<void> {
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve) => {
    const imagesToLoad = [
      { key: 'background' as keyof RendererAssets, src: GENERATED_ASSETS.ingameBackground },
      { key: 'token' as keyof RendererAssets, src: GENERATED_ASSETS.tokenIcon },
      { key: 'hazard' as keyof RendererAssets, src: GENERATED_ASSETS.toadHazardIcon },
      { key: 'uiSheet' as keyof RendererAssets, src: GENERATED_ASSETS.uiIconsSheet },
    ];

    let loadedCount = 0;
    const totalCount = imagesToLoad.length;

    imagesToLoad.forEach(({ key, src }) => {
      const img = new Image();
      img.onload = () => {
        assets[key] = img;
        loadedCount++;
        if (loadedCount === totalCount) {
          resolve();
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load asset: ${src}`);
        loadedCount++;
        if (loadedCount === totalCount) {
          resolve();
        }
      };
      img.src = src;
    });
  });

  return loadingPromise;
}

export function getRendererAssets(): Readonly<RendererAssets> {
  return assets;
}
