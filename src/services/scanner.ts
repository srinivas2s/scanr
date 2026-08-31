import {
  BrowserMultiFormatReader,
  BarcodeFormat as ZXingBarcodeFormat,
  DecodeHintType,
  RGBLuminanceSource,
  HybridBinarizer,
  BinaryBitmap,
  MultiFormatReader,
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
  private zxingReader: BrowserMultiFormatReader;
  private pureZxingReader: MultiFormatReader;
  private nativeSupported: boolean = false;

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
      ZXingBarcodeFormat.ITF,
      ZXingBarcodeFormat.CODABAR,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    this.zxingReader = new BrowserMultiFormatReader(hints, 500);
    this.pureZxingReader = new MultiFormatReader();
    this.pureZxingReader.setHints(hints);

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
   * Parse decoded string to detect URL, Wi-Fi, Contact, etc.
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
    } else if (/^(ean_13|ean_8|upc_a|upc_e|EAN13|EAN8|UPCA|UPCE)$/i.test(format) || /^\d{8,14}$/.test(trimmed)) {
      detectedType = 'EAN_PRODUCT';
      parsedData.gtin = trimmed;
    }

    return {
      id: 'SPEC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
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
      'data_matrix': 'DATA MATRIX',
      'code_128': 'CODE 128',
      'code_39': 'CODE 39',
      'ean_13': 'EAN-13',
      'ean_8': 'EAN-8',
      'upc_a': 'UPC-A',
      'upc_e': 'UPC-E',
      'itf': 'ITF',
      'aztec': 'AZTEC',
      'pdf417': 'PDF417',
      'codabar': 'CODABAR',
    };
    return map[fmt.toLowerCase()] || fmt.toUpperCase();
  }

  /**
   * Scan frame directly from an HTMLVideoElement
   */
  public async scanVideoFrame(video: HTMLVideoElement): Promise<ScanResult | null> {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return null;
    }

    // 1. Try Native BarcodeDetector first (extremely fast on supported hardware)
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
        // Fallback to ZXing
      }
    }

    // 2. ZXing Library Fallback
    try {
      const result = this.zxingReader.decode(video);
      if (result) {
        return this.parseDecodedValue(result.getText(), ZXingBarcodeFormat[result.getBarcodeFormat()]);
      }
    } catch {
      // Frame did not contain a readable barcode
    }

    return null;
  }

  /**
   * Decode a static Image file or Blob (drag-and-drop / file upload)
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

      // 2. Canvas extraction for ZXing
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Could not create canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const luminanceSource = new RGBLuminanceSource(
        new Uint8ClampedArray(imageData.data.buffer),
        canvas.width,
        canvas.height
      );
      const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

      const result = this.pureZxingReader.decode(binaryBitmap);
      if (result) {
        return this.parseDecodedValue(result.getText(), ZXingBarcodeFormat[result.getBarcodeFormat()]);
      }

      throw new Error('NO_BARCODE_DETECTED');
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

export const scannerService = new ScannerService();
