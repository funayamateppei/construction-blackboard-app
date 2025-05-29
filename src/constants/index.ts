/**
 * アプリケーション全体で使用される定数定義
 * @fileoverview 工事黒板アプリケーションの定数管理ファイル
 */

import type {ConstructionBoardConfig, SupportedImageType} from "../types"

/**
 * アプリケーション情報
 */
export const APP_INFO = {
  NAME: "工事黒板アプリ",
  DESCRIPTION: "画像に工事情報を追加するためのツール",
} as const

/**
 * サポートされるファイル形式
 */
export const FILE_CONFIG = {
  SUPPORTED_TYPES: ["image/jpeg"] as SupportedImageType[],
  ACCEPT_ATTRIBUTE: "image/jpeg,.jpg,.jpeg",
  DEFAULT_DOWNLOAD_FILENAME: "construction_board_image.jpg",
} as const

/**
 * 工事黒板の描画設定
 */
export const CONSTRUCTION_BOARD_CONFIG: ConstructionBoardConfig = {
  fontSize: 18,
  padding: 20,
  cellPadding: 12,
  rowHeight: 38, // fontSize + 20
  backgroundGradient: {
    start: "#2d5a3d",
    end: "#4a7c59",
  },
  borderColor: "#1a3b26",
  textColor: "#ffffff",
} as const

/**
 * Canvas設定
 */
export const CANVAS_CONFIG = {
  QUALITY: 0.9,
  OUTPUT_FORMAT: "image/jpeg",
} as const

/**
 * UI文言設定
 */
export const UI_SETTINGS = {
  LABELS: {
    CONSTRUCTION_NAME: "工事名",
    DATE: "日時",
    ORIGINAL_IMAGE: "元画像",
    CANVAS_PREVIEW: "工事黒板プレビュー (Canvas)",
    PROCESSED_IMAGE: "工事黒板付きJPEG画像",
    EXIF_INFO: "読み取られたExif情報",
    IMAGE_TYPE: "タイプ",
    DOWNLOAD_BUTTON: "工事黒板付き画像をダウンロード (.jpg)",
    EXIF_DATE_NOTE: "※ 撮影日時がExif情報から自動で設定されています",
  },
  PLACEHOLDERS: {
    CONSTRUCTION_NAME: "例: 道路舗装工事",
    NO_IMAGE_SELECTED: "画像が選択されていません",
    CANVAS_PREVIEW: "ここに工事黒板付きプレビューが表示されます",
    PROCESSED_IMAGE: "工事黒板付き画像がここに表示されます",
    NO_EXIF_DATA: "Exif情報はありません",
  },
  ALT_TEXTS: {
    ORIGINAL_IMAGE: "Original",
    PROCESSED_IMAGE: "Construction board with EXIF",
  },
  COLORS: {
    DISABLED_BACKGROUND: "#f0f0f0",
    INPUT_BACKGROUND: "white",
  },
} as const

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES = {
  FILE_UPLOAD: {
    READ_ERROR: "ファイルの読み込みに失敗しました。",
  },
  IMAGE_PROCESSING: {
    NO_CANVAS: "Canvasに画像が描画されていません。画像が正しくロードされたか確認してください。",
    PROCESSING_FAILED: "画像の処理に失敗しました。",
  },
} as const

/**
 * フォント設定
 */
export const FONT_CONFIG = {
  FONT_FAMILY: '"MS Gothic", "Hiragino Sans", sans-serif',
  BOLD_WEIGHT: "bold",
  MIN_FONT_SIZE: 14,
  MAX_FONT_SIZE: 48,
  FONT_SIZE_RATIO: 25, // canvas size / ratio = font size
} as const
