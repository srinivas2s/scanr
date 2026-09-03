export type BarcodeFormat =
  | 'CODE128'
  | 'CODE39'
  | 'EAN13'
  | 'EAN8'
  | 'UPCA'
  | 'UPCE'
  | 'ITF14'
  | 'ITF'
  | 'CODABAR'
  | 'PHARMACODE'
  | 'QR'
  | 'DATAMATRIX'
  | 'AZTEC'
  | 'PDF417';

export interface FormatDefinition {
  id: BarcodeFormat;
  name: string;
  category: '1D' | '2D';
  standard: string;
  description: string;
  placeholder: string;
  defaultVal: string;
  pattern: RegExp;
  minLen?: number;
  maxLen?: number;
  bwipBcId: string; // identifier in bwip-js
  nativeFormat?: string; // identifier in browser BarcodeDetector API
  supportsChecksum?: boolean;
}

export interface ScanResult {
  id: string;
  rawText: string;
  format: string;
  timestamp: number;
  detectedType: 'URL' | 'EMAIL' | 'PHONE' | 'WIFI' | 'EAN_PRODUCT' | 'TEXT';
  parsedData?: Record<string, string>;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface GeneratorOptions {
  format: BarcodeFormat;
  value: string;
  scale: number;
  height: number;
  includeText: boolean;
  colorScheme: 'bw' | 'invert' | 'hazard' | 'acid' | 'cyan';
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'; // For QR
}

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
  facingMode?: 'environment' | 'user' | string;
}

export interface ScannerStats {
  fps: number;
  resolution: string;
  activeCamera: string;
  engine: 'NATIVE_OPTICAL' | 'ZXING_MULTI_PASS' | 'ZXING_FALLBACK' | 'IDLE';
  torchSupported: boolean;
  torchActive: boolean;
}
