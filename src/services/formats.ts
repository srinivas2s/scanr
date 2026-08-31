import type { BarcodeFormat, FormatDefinition } from '@/types/barcode';

export const FORMAT_DEFINITIONS: Record<BarcodeFormat, FormatDefinition> = {
  CODE128: {
    id: 'CODE128',
    name: 'Code 128',
    category: '1D',
    standard: 'ISO/IEC 15417',
    description: 'High-density alphanumeric symbology used in logistics, packaging, and asset management.',
    placeholder: 'SCANR-2026-X01',
    defaultVal: 'SCANR-2026-X01',
    pattern: /^[\x00-\x7F]+$/,
    minLen: 1,
    maxLen: 80,
    bwipBcId: 'code128',
    nativeFormat: 'code_128',
    supportsChecksum: true,
  },
  CODE39: {
    id: 'CODE39',
    name: 'Code 39',
    category: '1D',
    standard: 'ISO/IEC 16388',
    description: 'Standard alphanumeric symbology used in defense, automotive, and industrial inventory.',
    placeholder: 'SCANR-PART-42',
    defaultVal: 'SCANR-PART-42',
    pattern: /^[0-9A-Z\-\.\ \$\/\+\%]+$/,
    minLen: 1,
    maxLen: 43,
    bwipBcId: 'code39',
    nativeFormat: 'code_39',
    supportsChecksum: true,
  },
  EAN13: {
    id: 'EAN13',
    name: 'EAN-13',
    category: '1D',
    standard: 'ISO/IEC 15420 / GS1',
    description: 'International retail product identifier standard (12 data digits + 1 modulo-10 check digit).',
    placeholder: '5901234123457',
    defaultVal: '5901234123457',
    pattern: /^\d{12,13}$/,
    minLen: 12,
    maxLen: 13,
    bwipBcId: 'ean13',
    nativeFormat: 'ean_13',
    supportsChecksum: true,
  },
  EAN8: {
    id: 'EAN8',
    name: 'EAN-8',
    category: '1D',
    standard: 'GS1 Standard',
    description: 'Compact 8-digit retail barcode for small retail packages and confectionery.',
    placeholder: '96385074',
    defaultVal: '96385074',
    pattern: /^\d{7,8}$/,
    minLen: 7,
    maxLen: 8,
    bwipBcId: 'ean8',
    nativeFormat: 'ean_8',
    supportsChecksum: true,
  },
  UPCA: {
    id: 'UPCA',
    name: 'UPC-A',
    category: '1D',
    standard: 'ANSI MH10.8M / GS1',
    description: 'Universal Product Code standard for North American retail items (12 numeric digits).',
    placeholder: '012345678905',
    defaultVal: '012345678905',
    pattern: /^\d{11,12}$/,
    minLen: 11,
    maxLen: 12,
    bwipBcId: 'upca',
    nativeFormat: 'upc_a',
    supportsChecksum: true,
  },
  UPCE: {
    id: 'UPCE',
    name: 'UPC-E',
    category: '1D',
    standard: 'GS1 Zero-Suppressed',
    description: 'Zero-suppressed 8-digit variation of UPC-A for smaller retail packaging.',
    placeholder: '01234565',
    defaultVal: '01234565',
    pattern: /^\d{6,8}$/,
    minLen: 6,
    maxLen: 8,
    bwipBcId: 'upce',
    nativeFormat: 'upc_e',
    supportsChecksum: true,
  },
  ITF14: {
    id: 'ITF14',
    name: 'ITF-14',
    category: '1D',
    standard: 'GS1 Shipping Container',
    description: '14-digit Interleaved 2 of 5 with heavy protective bearer bars for master shipping cartons.',
    placeholder: '10012345678902',
    defaultVal: '10012345678902',
    pattern: /^\d{13,14}$/,
    minLen: 13,
    maxLen: 14,
    bwipBcId: 'itf14',
    nativeFormat: 'itf',
    supportsChecksum: true,
  },
  ITF: {
    id: 'ITF',
    name: 'Interleaved 2 of 5',
    category: '1D',
    standard: 'AIM USS-ITF',
    description: 'Numeric-only high density barcode encoding pairs of digits in bars and spaces.',
    placeholder: '3040506070',
    defaultVal: '3040506070',
    pattern: /^\d+$/,
    minLen: 2,
    maxLen: 50,
    bwipBcId: 'interleaved2of5',
    nativeFormat: 'itf',
    supportsChecksum: false,
  },
  CODABAR: {
    id: 'CODABAR',
    name: 'Codabar',
    category: '1D',
    standard: 'AIM USS-Codabar',
    description: 'Self-checking barcode used in libraries, blood banks, and FedEx shipping manifests.',
    placeholder: 'A123456789B',
    defaultVal: 'A123456789B',
    pattern: /^[A-D][0-9\-\$\:\/\.\+]+[A-D]$/i,
    minLen: 3,
    maxLen: 30,
    bwipBcId: 'rationalizedCodabar',
    nativeFormat: 'codabar',
    supportsChecksum: false,
  },
  PHARMACODE: {
    id: 'PHARMACODE',
    name: 'Pharmacode',
    category: '1D',
    standard: 'Pharmaceutical Binary',
    description: 'One-track binary code used in pharmaceutical packaging quality control systems.',
    placeholder: '12345',
    defaultVal: '12345',
    pattern: /^\d+$/,
    minLen: 1,
    maxLen: 6,
    bwipBcId: 'pharmacode',
    supportsChecksum: false,
  },
  QR: {
    id: 'QR',
    name: 'QR Code',
    category: '2D',
    standard: 'ISO/IEC 18004',
    description: 'High-speed 2D matrix symbology supporting alphanumeric, binary data, and URLs.',
    placeholder: 'https://scanr.app',
    defaultVal: 'https://scanr.app',
    pattern: /^.+$/,
    minLen: 1,
    maxLen: 2048,
    bwipBcId: 'qrcode',
    nativeFormat: 'qr_code',
    supportsChecksum: true,
  },
  DATAMATRIX: {
    id: 'DATAMATRIX',
    name: 'Data Matrix',
    category: '2D',
    standard: 'ISO/IEC 16022',
    description: '2D matrix barcode with high fault tolerance for small electronics and medical devices.',
    placeholder: 'SCANR-DM-2026',
    defaultVal: 'SCANR-DM-2026',
    pattern: /^[\x00-\xFF]+$/,
    minLen: 1,
    maxLen: 1000,
    bwipBcId: 'datamatrix',
    nativeFormat: 'data_matrix',
    supportsChecksum: true,
  },
  AZTEC: {
    id: 'AZTEC',
    name: 'Aztec Code',
    category: '2D',
    standard: 'ISO/IEC 24778',
    description: '2D matrix code featuring a central bullseye target, standard in transport & airline ticketing.',
    placeholder: 'SCANR-TICKET-99',
    defaultVal: 'SCANR-TICKET-99',
    pattern: /^[\x00-\xFF]+$/,
    minLen: 1,
    maxLen: 1500,
    bwipBcId: 'azteccode',
    nativeFormat: 'aztec',
    supportsChecksum: true,
  },
  PDF417: {
    id: 'PDF417',
    name: 'PDF417',
    category: '2D',
    standard: 'ISO/IEC 15438',
    description: 'Stacked 2D barcode format commonly used on government IDs, driver licenses, and shipping.',
    placeholder: 'SCANR-MANIFEST-ID-417',
    defaultVal: 'SCANR-MANIFEST-ID-417',
    pattern: /^[\x00-\xFF]+$/,
    minLen: 1,
    maxLen: 1100,
    bwipBcId: 'pdf417',
    nativeFormat: 'pdf417',
    supportsChecksum: true,
  },
};

export const FORMAT_LIST = Object.values(FORMAT_DEFINITIONS);

export function calculateEan13Checksum(digits12: string): number {
  if (digits12.length < 12) return 0;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

export function calculateUpcAChecksum(digits11: string): number {
  if (digits11.length < 11) return 0;
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(digits11[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

export function validateBarcodeValue(format: BarcodeFormat, value: string): { isValid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'Value cannot be empty' };
  }

  const def = FORMAT_DEFINITIONS[format];
  if (!def) {
    return { isValid: false, error: 'Unknown format' };
  }

  if (def.minLen && value.length < def.minLen) {
    return { isValid: false, error: `Minimum length is ${def.minLen} characters (current: ${value.length})` };
  }

  if (def.maxLen && value.length > def.maxLen) {
    return { isValid: false, error: `Maximum length is ${def.maxLen} characters (current: ${value.length})` };
  }

  if (format === 'ITF') {
    if (value.length % 2 !== 0) {
      return { isValid: false, error: 'Interleaved 2 of 5 requires an even number of digits' };
    }
  }

  if (format === 'CODABAR') {
    const startEndPattern = /^[A-Da-d].*[A-Da-d]$/;
    if (!startEndPattern.test(value)) {
      return { isValid: false, error: 'Codabar must start and end with A, B, C, or D (e.g. A12345B)' };
    }
  }

  if (!def.pattern.test(value)) {
    switch (format) {
      case 'EAN13':
      case 'EAN8':
      case 'UPCA':
      case 'UPCE':
      case 'ITF14':
      case 'ITF':
      case 'PHARMACODE':
        return { isValid: false, error: 'Only numeric digits (0-9) are allowed for this format' };
      case 'CODE39':
        return { isValid: false, error: 'Only uppercase letters, digits, and - . $ / + % [space] allowed' };
      default:
        return { isValid: false, error: 'Invalid characters for this format' };
    }
  }

  return { isValid: true };
}
