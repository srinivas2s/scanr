import {
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
  GlobalHistogramBinarizer,
  BinaryBitmap,
  MultiFormatReader,
  DecodeHintType,
  BarcodeFormat as ZXingBarcodeFormat,
} from '@zxing/library';
import type { ScanResult } from '@/types/barcode';

// BarcodeDetector global type declaration for browsers that support it natively
declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats: string[] }): {
        detect(image: ImageBitmapSource): Promise<Array<{
          rawValue: string;
          format: string;
          boundingBox?: DOMRectReadOnly;
          cornerPoints?: Array<{ x: number; y: number }>;
        }>>;
      };
      getSupportedFormats(): Promise<string[]>;
    };
  }
}

export class ScannerService {
  private nativeDetector: InstanceType<NonNullable<typeof window.BarcodeDetector>> | null = null;
  private multiFormatReader: MultiFormatReader;
  private nativeSupported: boolean = false;
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;
  private cropCanvas: HTMLCanvasElement | null = null;
  private cropCtx: CanvasRenderingContext2D | null = null;

  constructor() {
    const hints = new Map();
    const formats = [
      ZXingBarcodeFormat.QR_CODE,
      ZXingBarcodeFormat.DATA_MATRIX,
      ZXingBarcodeFormat.AZTEC,
      ZXingBarcodeFormat.PDF_417,
      ZXingBarcodeFormat.EAN_13,
      ZXingBarcodeFormat.EAN_8,
      ZXingBarcodeFormat.UPC_A,
      ZXingBarcodeFormat.UPC_E,
      ZXingBarcodeFormat.CODE_128,
      ZXingBarcodeFormat.CODE_39,
      ZXingBarcodeFormat.CODE_93,
      ZXingBarcodeFormat.ITF,
      ZXingBarcodeFormat.CODABAR,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    this.multiFormatReader = new MultiFormatReader();
    this.multiFormatReader.setHints(hints);

    if (typeof document !== 'undefined') {
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
      this.cropCanvas = document.createElement('canvas');
      this.cropCtx = this.cropCanvas.getContext('2d', { willReadFrequently: true });
    }

    this.initNativeDetector();
  }

  private async initNativeDetector() {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window && window.BarcodeDetector) {
      try {
        const supported = await window.BarcodeDetector.getSupportedFormats();
        if (supported && supported.length > 0) {
          this.nativeDetector = new window.BarcodeDetector({ formats: supported });
          this.nativeSupported = true;
        }
      } catch {
        this.nativeSupported = false;
      }
    }
  }

  public isNativeSupported(): boolean {
    return this.nativeSupported;
  }

  /**
   * Parse decoded string to detect URL, Wi-Fi, Contact, GTIN product, etc.
   */
  public parseDecodedValue(raw: string, format: string, boundingBox?: { x: number; y: number; width: number; height: number }): ScanResult {
    const trimmed = raw.trim();
    let detectedType: ScanResult['detectedType'] = 'TEXT';
    const parsedData: Record<string, string> = {};

    if (/^https?:\/\//i.test(trimmed) || /^(www\.)[a-z0-9-]+(\.[a-z]{2,})+/i.test(trimmed)) {
      detectedType = 'URL';
      parsedData.url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    } else if (/^mailto:/i.test(trimmed) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      detectedType = 'EMAIL';
      parsedData.email = trimmed.replace(/^mailto:/i, '');
    } else if (/^tel:/i.test(trimmed) || /^\+?[0-9\s\-()]{7,20}$/.test(trimmed)) {
      detectedType = 'PHONE';
      parsedData.phone = trimmed.replace(/^tel:/i, '');
    } else if (/^WIFI:/i.test(trimmed)) {
      detectedType = 'WIFI';
      const ssidMatch = trimmed.match(/S:([^;]+)/i);
      const passMatch = trimmed.match(/P:([^;]+)/i);
      const typeMatch = trimmed.match(/T:([^;]+)/i);
      if (ssidMatch) parsedData.ssid = ssidMatch[1];
      if (passMatch) parsedData.password = passMatch[1];
      if (typeMatch) parsedData.security = typeMatch[1];
    } else if (/^(ean_13|ean_8|upc_a|upc_e|EAN13|EAN8|UPCA|UPCE|EAN_13|UPC_A|UPC_E|EAN_8)$/i.test(format) || /^\d{8,14}$/.test(trimmed)) {
      detectedType = 'EAN_PRODUCT';
      parsedData.gtin = trimmed;
    }

    return {
      id: 'SCAN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      rawText: raw,
      format: this.normalizeFormatName(format),
      timestamp: Date.now(),
      detectedType,
      parsedData,
      boundingBox,
    };
  }

  private normalizeFormatName(fmt: string): string {
    const map: Record<string, string> = {
      'qr_code': 'QR CODE',
      'qr': 'QR CODE',
      'data_matrix': 'DATA MATRIX',
      'code_128': 'CODE 128',
      'code_39': 'CODE 39',
      'code_93': 'CODE 93',
      'ean_13': 'EAN-13',
      'ean_8': 'EAN-8',
      'upc_a': 'UPC-A',
      'upc_e': 'UPC-E',
      'itf': 'ITF-14',
      'aztec': 'AZTEC',
      'pdf417': 'PDF417',
      'pdf_417': 'PDF417',
      'codabar': 'CODABAR',
    };
    return map[fmt.toLowerCase()] || fmt.toUpperCase();
  }

  /**
   * Decode an HTMLCanvasElement using multi-pass strategies
   */
  private decodeCanvas(canvas: HTMLCanvasElement): ScanResult | null {
    // Strategy 1: ZXing HybridBinarizer (standard)
    try {
      const lumSource = new HTMLCanvasElementLuminanceSource(canvas, false);
      const bitmap = new BinaryBitmap(new HybridBinarizer(lumSource));
      const result = this.multiFormatReader.decodeWithState(bitmap);
      if (result) {
        return this.parseDecodedValue(result.getText(), ZXingBarcodeFormat[result.getBarcodeFormat()]);
      }
    } catch {
      // Continue to next pass
    }

    // Strategy 2: ZXing Auto-Invert HybridBinarizer (for white-on-black inverted codes)
    try {
      const lumSourceInvert = new HTMLCanvasElementLuminanceSource(canvas, true);
      const bitmapInvert = new BinaryBitmap(new HybridBinarizer(lumSourceInvert));
      const result = this.multiFormatReader.decodeWithState(bitmapInvert);
      if (result) {
        return this.parseDecodedValue(result.getText(), ZXingBarcodeFormat[result.getBarcodeFormat()]);
      }
    } catch {
      // Continue to next pass
    }

    // Strategy 3: ZXing GlobalHistogramBinarizer (ideal for 1D linear retail barcodes)
    try {
      const lumSourceHist = new HTMLCanvasElementLuminanceSource(canvas, false);
      const bitmapHist = new BinaryBitmap(new GlobalHistogramBinarizer(lumSourceHist));
      const result = this.multiFormatReader.decodeWithState(bitmapHist);
      if (result) {
        return this.parseDecodedValue(result.getText(), ZXingBarcodeFormat[result.getBarcodeFormat()]);
      }
    } catch {
      // No match
    }

    return null;
  }

  /**
   * Scan frame directly from an HTMLVideoElement
   */
  public async scanVideoFrame(video: HTMLVideoElement): Promise<ScanResult | null> {
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    // 1. Try Native BarcodeDetector first on video element (hardware accelerated)
    if (this.nativeDetector) {
      try {
        const barcodes = await this.nativeDetector.detect(video);
        if (barcodes && barcodes.length > 0) {
          const b = barcodes[0];
          let bb;
          if (b.boundingBox) {
            bb = {
              x: b.boundingBox.x,
              y: b.boundingBox.y,
              width: b.boundingBox.width,
              height: b.boundingBox.height,
            };
          }
          return this.parseDecodedValue(b.rawValue, b.format, bb);
        }
      } catch {
        // Fallback to ZXing canvas pipeline
      }
    }

    if (!this.offscreenCanvas || !this.offscreenCtx) {
      return null;
    }

    // 2. Draw full frame to offscreen canvas
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    this.offscreenCanvas.width = vw;
    this.offscreenCanvas.height = vh;
    this.offscreenCtx.drawImage(video, 0, 0, vw, vh);

    // Run multi-strategy decode on full frame
    const fullResult = this.decodeCanvas(this.offscreenCanvas);
    if (fullResult) {
      return fullResult;
    }

    // 3. Center Reticle Zoom Pass (focuses on central 60% viewfinder for small or distant barcodes)
    if (this.cropCanvas && this.cropCtx && vw >= 480 && vh >= 480) {
      const cropW = Math.round(vw * 0.65);
      const cropH = Math.round(vh * 0.65);
      const startX = Math.round((vw - cropW) / 2);
      const startY = Math.round((vh - cropH) / 2);

      this.cropCanvas.width = cropW;
      this.cropCanvas.height = cropH;
      this.cropCtx.drawImage(video, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

      const cropResult = this.decodeCanvas(this.cropCanvas);
      if (cropResult) {
        return cropResult;
      }
    }

    return null;
  }

  /**
   * Decode a static Image file or Blob (drag-and-drop / file upload / paste)
   */
  public async scanImageFile(file: File | Blob): Promise<ScanResult> {
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image file'));
        img.src = objectUrl;
      });

      // 1. Try native BarcodeDetector on image
      if (this.nativeDetector) {
        try {
          const barcodes = await this.nativeDetector.detect(img);
          if (barcodes && barcodes.length > 0) {
            const b = barcodes[0];
            return this.parseDecodedValue(b.rawValue, b.format);
          }
        } catch {
          // Fall through to Canvas ZXing
        }
      }

      // 2. Multi-Pass Canvas Decoding
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = iw;
      canvas.height = ih;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Could not create canvas context');

      ctx.drawImage(img, 0, 0);

      // Pass 1: Original orientation
      const res0 = this.decodeCanvas(canvas);
      if (res0) return res0;

      // Pass 2: Rotations (90deg, 180deg, 270deg for packaging or vertical scans)
      const rotCanvas = document.createElement('canvas');
      const rotCtx = rotCanvas.getContext('2d', { willReadFrequently: true });
      if (rotCtx) {
        const angles = [90, 180, 270];
        for (const angle of angles) {
          if (angle === 90 || angle === 270) {
            rotCanvas.width = ih;
            rotCanvas.height = iw;
          } else {
            rotCanvas.width = iw;
            rotCanvas.height = ih;
          }
          rotCtx.save();
          rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
          rotCtx.rotate((angle * Math.PI) / 180);
          rotCtx.drawImage(img, -iw / 2, -ih / 2);
          rotCtx.restore();

          const rotRes = this.decodeCanvas(rotCanvas);
          if (rotRes) return rotRes;
        }
      }

      throw new Error('NO_BARCODE_DETECTED');
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

export const scannerService = new ScannerService();
