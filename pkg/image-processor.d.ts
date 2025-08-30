/* tslint:disable */
/* eslint-disable */
export function main(): void;
export function get_version(): string;
export function get_supported_formats(): any[];
/**
 * Chroma subsampling format
 */
export enum ChromaSampling {
  /**
   * Both vertically and horizontally subsampled.
   */
  Cs420 = 0,
  /**
   * Horizontally subsampled.
   */
  Cs422 = 1,
  /**
   * Not subsampled.
   */
  Cs444 = 2,
  /**
   * Monochrome.
   */
  Cs400 = 3,
}
export class ImageProcessor {
  free(): void;
  constructor();
  /**
   * Main processing function: converts any supported image to WebP
   */
  process_image(input_data: Uint8Array): Uint8Array;
  /**
   * Get image information without processing
   */
  get_image_info(input_data: Uint8Array): any;
  /**
   * Batch process multiple images
   */
  process_batch(images: Uint8Array[]): Array<any>;
  set quality(value: number);
  set max_dimensions(value: number | null);
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly main: () => void;
  readonly __wbg_imageprocessor_free: (a: number, b: number) => void;
  readonly imageprocessor_new: () => number;
  readonly imageprocessor_set_quality: (a: number, b: number) => void;
  readonly imageprocessor_set_max_dimensions: (a: number, b: number, c: number) => void;
  readonly imageprocessor_process_image: (a: number, b: number, c: number) => [number, number, number];
  readonly imageprocessor_get_image_info: (a: number, b: number, c: number) => [number, number, number];
  readonly imageprocessor_process_batch: (a: number, b: number, c: number) => [number, number, number];
  readonly get_version: () => [number, number];
  readonly get_supported_formats: () => [number, number];
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
