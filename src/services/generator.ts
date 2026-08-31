import bwipjs from 'bwip-js';
import type { GeneratorOptions } from '@/types/barcode';
import { FORMAT_DEFINITIONS } from './formats';

export interface RenderResult {
  svg: string;
  dataUrl: string;
  width: number;
  height: number;
}

export class GeneratorService {
  /**
   * Render barcode to HTML Canvas element
   */
  public renderToCanvas(canvas: HTMLCanvasElement, options: GeneratorOptions): { width: number; height: number } {
    const def = FORMAT_DEFINITIONS[options.format];
    if (!def) throw new Error('Unsupported format');

    let barcolor = '000000';
    let backgroundcolor = 'ffffff';

    switch (options.colorScheme) {
      case 'invert':
        barcolor = 'ffffff';
        backgroundcolor = '101216';
        break;
      case 'hazard':
        barcolor = 'ff2a00';
        backgroundcolor = 'ffffff';
        break;
      case 'acid':
        barcolor = '090a0c';
        backgroundcolor = 'e4ff1a';
        break;
      case 'cyan':
        barcolor = '00f0ff';
        backgroundcolor = '090a0c';
        break;
      case 'bw':
      default:
        barcolor = '000000';
        backgroundcolor = 'ffffff';
        break;
    }

    const scale = options.scale || 3;
    const height = options.height || (def.category === '2D' ? 40 : 25);

    try {
      bwipjs.toCanvas(canvas, {
        bcid: def.bwipBcId,
        text: options.value,
        scale: scale,
        height: height,
        includetext: options.includeText && def.category === '1D',
        textxalign: 'center',
        barcolor: barcolor,
        backgroundcolor: backgroundcolor,
        paddingwidth: 10,
        paddingheight: 10,
      });

      return {
        width: canvas.width,
        height: canvas.height,
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(error?.message || 'Failed to render barcode');
    }
  }

  /**
   * Render barcode to pure SVG vector XML string
   */
  public renderToSVG(options: GeneratorOptions): string {
    const def = FORMAT_DEFINITIONS[options.format];
    if (!def) throw new Error('Unsupported format');

    let barcolor = '000000';
    let backgroundcolor = 'ffffff';

    switch (options.colorScheme) {
      case 'invert':
        barcolor = 'ffffff';
        backgroundcolor = '101216';
        break;
      case 'hazard':
        barcolor = 'ff2a00';
        backgroundcolor = 'ffffff';
        break;
      case 'acid':
        barcolor = '090a0c';
        backgroundcolor = 'e4ff1a';
        break;
      case 'cyan':
        barcolor = '00f0ff';
        backgroundcolor = '090a0c';
        break;
      case 'bw':
      default:
        barcolor = '000000';
        backgroundcolor = 'ffffff';
        break;
    }

    try {
      const bwipAny = bwipjs as unknown as {
        toSVG: (opts: Record<string, unknown>) => string;
      };

      if (typeof bwipAny.toSVG === 'function') {
        return bwipAny.toSVG({
          bcid: def.bwipBcId,
          text: options.value,
          scale: options.scale || 3,
          height: options.height || (def.category === '2D' ? 40 : 25),
          includetext: options.includeText && def.category === '1D',
          textxalign: 'center',
          barcolor: barcolor,
          backgroundcolor: backgroundcolor,
          paddingwidth: 10,
          paddingheight: 10,
        });
      }

      // Fallback SVG generator if toSVG not present in runtime environment
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100"><rect width="300" height="100" fill="#${backgroundcolor}"/><text x="150" y="55" fill="#${barcolor}" font-family="monospace" font-size="14" text-anchor="middle">${options.value}</text></svg>`;
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(error?.message || 'Failed to generate SVG vector');
    }
  }

  /**
   * Download SVG file
   */
  public downloadSVG(svgContent: string, filename: string = 'SCANR-SPECIMEN.svg') {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Download high-res PNG file with optional specimen technical frame
   */
  public downloadPNG(
    canvas: HTMLCanvasElement,
    filename: string = 'SCANR-SPECIMEN.png',
    includeSpecimenFrame: boolean = false,
    options?: GeneratorOptions
  ) {
    if (!includeSpecimenFrame || !options) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Compose with industrial specimen metadata frame
    const exportCanvas = document.createElement('canvas');
    const padding = 40;
    const headerHeight = 70;
    const footerHeight = 50;

    exportCanvas.width = canvas.width + padding * 2;
    exportCanvas.height = canvas.height + headerHeight + footerHeight + padding;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#090a0c';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Frame border
    ctx.strokeStyle = '#2b2f3d';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, exportCanvas.width - 20, exportCanvas.height - 20);

    // Header metadata
    ctx.fillStyle = '#e4ff1a';
    ctx.font = 'bold 16px "IBM Plex Mono", monospace';
    ctx.fillText(`SCANR SPECIMEN // ${options.format}`, 24, 38);

    ctx.fillStyle = '#7e8494';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText(`ENCODED: ${new Date().toISOString()}`, 24, 56);

    // Draw Barcode Canvas
    ctx.drawImage(canvas, padding, headerHeight);

    // Footer info
    ctx.fillStyle = '#f5f4f0';
    ctx.font = '12px "IBM Plex Mono", monospace';
    const textVal = `PAYLOAD: ${options.value.length > 40 ? options.value.slice(0, 37) + '...' : options.value}`;
    ctx.fillText(textVal, 24, exportCanvas.height - 24);

    const url = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export const generatorService = new GeneratorService();
