import { ref, computed, watch } from 'vue';
import type { BarcodeFormat, GeneratorOptions } from '@/types/barcode';
import { FORMAT_DEFINITIONS, validateBarcodeValue, calculateEan13Checksum, calculateUpcAChecksum } from '@/services/formats';
import { generatorService } from '@/services/generator';
import { audioService } from '@/services/audio';

export interface SpecimenPreset {
  id: string;
  name: string;
  category: string;
  format: BarcodeFormat;
  value: string;
  description: string;
}

export const SPECIMEN_PRESETS: SpecimenPreset[] = [
  {
    id: 'retail-ean13',
    name: 'EAN-13 Retail Specimen',
    category: 'Retail / Packaging',
    format: 'EAN13',
    value: '5901234123457',
    description: 'Standard GS1 international commercial retail product code',
  },
  {
    id: 'logistics-code128',
    name: 'Code 128 Logistics Tag',
    category: 'Logistics / Supply',
    format: 'CODE128',
    value: 'SCANR-PKG-9824-AX',
    description: 'High-density alphanumeric shipping & inventory tracking unit',
  },
  {
    id: 'qr-url',
    name: 'QR Code URL Payload',
    category: 'Digital / Web',
    format: 'QR',
    value: 'https://scanr.app',
    description: '2D matrix barcode with high error correction for mobile optical devices',
  },
  {
    id: 'datamatrix-part',
    name: 'Data Matrix Component ID',
    category: 'Aerospace / Tech',
    format: 'DATAMATRIX',
    value: 'SCANR-PART-098273-MK2',
    description: 'Compact 2D high-density mark for micro-electronics & laser etching',
  },
  {
    id: 'pdf417-manifest',
    name: 'PDF417 Travel Manifest',
    category: 'Transit / ID',
    format: 'PDF417',
    value: 'SCANR-FLIGHT-TK882-SEAT12A',
    description: 'Stacked 2D barcode for boarding passes and government identity credentials',
  },
  {
    id: 'upca-grocery',
    name: 'UPC-A Supermarket Unit',
    category: 'North America POS',
    format: 'UPCA',
    value: '012345678905',
    description: '12-digit point-of-sale retail barcode for North American markets',
  },
];

export function useBarcodeGenerator() {
  const selectedFormat = ref<BarcodeFormat>('CODE128');
  const barcodeValue = ref<string>('SCANR-2026-X01');
  const scale = ref<number>(3);
  const height = ref<number>(25);
  const includeText = ref<boolean>(true);
  const colorScheme = ref<GeneratorOptions['colorScheme']>('bw');
  const canvasRef = ref<HTMLCanvasElement | null>(null);

  const error = ref<string | null>(null);
  const isGenerating = ref(false);
  const svgVector = ref<string>('');
  const lastGeneratedTime = ref<number>(Date.now());
  const dimensions = ref<{ width: number; height: number }>({ width: 0, height: 0 });

  const currentDefinition = computed(() => FORMAT_DEFINITIONS[selectedFormat.value]);

  const validationResult = computed(() => {
    return validateBarcodeValue(selectedFormat.value, barcodeValue.value);
  });

  /**
   * Apply a specimen preset
   */
  const applyPreset = (preset: SpecimenPreset) => {
    selectedFormat.value = preset.format;
    barcodeValue.value = preset.value;
    audioService.playClick();
  };

  /**
   * Auto-fix or calculate check digit for EAN-13 / UPC-A
   */
  const autoCalculateChecksum = () => {
    if (selectedFormat.value === 'EAN13' && barcodeValue.value.length === 12 && /^\d+$/.test(barcodeValue.value)) {
      const check = calculateEan13Checksum(barcodeValue.value);
      barcodeValue.value = barcodeValue.value + check;
      audioService.playClick();
    } else if (selectedFormat.value === 'UPCA' && barcodeValue.value.length === 11 && /^\d+$/.test(barcodeValue.value)) {
      const check = calculateUpcAChecksum(barcodeValue.value);
      barcodeValue.value = barcodeValue.value + check;
      audioService.playClick();
    }
  };

  /**
   * Render the barcode to canvas and extract SVG
   */
  const renderBarcode = () => {
    error.value = null;

    if (!barcodeValue.value || barcodeValue.value.trim() === '') {
      error.value = 'ENTER A VALUE TO ENCODE';
      return;
    }

    const validation = validateBarcodeValue(selectedFormat.value, barcodeValue.value);
    if (!validation.isValid) {
      error.value = validation.error || 'INVALID VALUE FOR SELECTED SYMBOLOGY';
      return;
    }

    isGenerating.value = true;
    try {
      const options: GeneratorOptions = {
        format: selectedFormat.value,
        value: barcodeValue.value,
        scale: scale.value,
        height: height.value,
        includeText: includeText.value,
        colorScheme: colorScheme.value,
      };

      // 1. Render to Canvas if canvas element exists
      if (canvasRef.value) {
        const dim = generatorService.renderToCanvas(canvasRef.value, options);
        dimensions.value = dim;
      }

      // 2. Generate vector SVG
      svgVector.value = generatorService.renderToSVG(options);
      lastGeneratedTime.value = Date.now();
    } catch (err: unknown) {
      const e = err as Error;
      error.value = e.message || 'Generation error';
    } finally {
      isGenerating.value = false;
    }
  };

  /**
   * Set format and default value
   */
  const setFormat = (fmt: BarcodeFormat) => {
    selectedFormat.value = fmt;
    const def = FORMAT_DEFINITIONS[fmt];
    if (def) {
      // Check if current value matches new format; if not, set to default
      const val = validateBarcodeValue(fmt, barcodeValue.value);
      if (!val.isValid) {
        barcodeValue.value = def.defaultVal;
      }
    }
    audioService.playClick();
  };

  /**
   * Download SVG
   */
  const downloadSvgFile = () => {
    if (!svgVector.value) return;
    audioService.playClick();
    generatorService.downloadSVG(svgVector.value, `SCANR_${selectedFormat.value}_${Date.now()}.svg`);
  };

  /**
   * Download PNG
   */
  const downloadPngFile = (includeSpecimenFrame: boolean = false) => {
    if (!canvasRef.value) return;
    audioService.playClick();
    const options: GeneratorOptions = {
      format: selectedFormat.value,
      value: barcodeValue.value,
      scale: scale.value,
      height: height.value,
      includeText: includeText.value,
      colorScheme: colorScheme.value,
    };
    generatorService.downloadPNG(
      canvasRef.value,
      `SCANR_${selectedFormat.value}_${Date.now()}.png`,
      includeSpecimenFrame,
      options
    );
  };

  /**
   * Reset to default
   */
  const resetGenerator = () => {
    selectedFormat.value = 'CODE128';
    barcodeValue.value = 'SCANR-2026-X01';
    scale.value = 3;
    height.value = 25;
    includeText.value = true;
    colorScheme.value = 'bw';
    audioService.playClick();
  };

  // Watch reactive options to trigger live update
  watch(
    [selectedFormat, barcodeValue, scale, height, includeText, colorScheme],
    () => {
      renderBarcode();
    },
    { flush: 'post' }
  );

  return {
    selectedFormat,
    barcodeValue,
    scale,
    height,
    includeText,
    colorScheme,
    canvasRef,
    error,
    isGenerating,
    svgVector,
    lastGeneratedTime,
    dimensions,
    currentDefinition,
    validationResult,
    presets: SPECIMEN_PRESETS,
    setFormat,
    applyPreset,
    autoCalculateChecksum,
    renderBarcode,
    downloadSvgFile,
    downloadPngFile,
    resetGenerator,
  };
}
