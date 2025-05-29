/**
 * アプリケーション全体で使用される型定義
 * @fileoverview 工事黒板アプリケーションの共通型定義ファイル
 */

import type {ExifDict} from "piexifjs"

/**
 * 画像の基本情報を表すインターフェース
 */
export interface ImageInfo {
  /** 画像のData URL */
  dataUrl: string
  /** 画像のMIMEタイプ */
  type: string
  /** ファイルサイズ（バイト） */
  size: number
  /** ファイル名 */
  fileName: string
}

/**
 * 工事情報を表すインターフェース
 */
export interface ConstructionInfo {
  /** 工事名 */
  name: string
  /** 工事日時 */
  date: Date | null
  /** 日時がExif情報から自動設定されたかどうか */
  isDateFromExif: boolean
}

/**
 * Exif情報の詳細を表すインターフェース
 */
export interface ExifDetails {
  /** 元のExif辞書オブジェクト */
  originalExifObj: ExifDict | null
  /** 表示用のExif文字列 */
  displayString: string
  /** 撮影日時 */
  dateTime: Date | null
  /** GPS情報 */
  gpsInfo: Record<string, unknown> | null
}

/**
 * アプリケーションの状態を表すインターフェース
 */
export interface AppState {
  /** 元画像の情報 */
  originalImage: ImageInfo | null
  /** Exif情報 */
  exifDetails: ExifDetails
  /** 工事情報 */
  constructionInfo: ConstructionInfo
  /** 処理済み画像のData URL */
  processedImage: string | null
  /** エラーメッセージ */
  error: string | null
  /** ローディング状態 */
  isLoading: boolean
}

/**
 * ファイルアップロードの結果を表すインターフェース
 */
export interface FileUploadResult {
  /** アップロードが成功したかどうか */
  success: boolean
  /** 画像情報（成功時） */
  imageInfo?: ImageInfo
  /** Exif詳細情報（成功時） */
  exifDetails?: ExifDetails
  /** エラーメッセージ（失敗時） */
  error?: string
}

/**
 * 画像処理の結果を表すインターフェース
 */
export interface ImageProcessResult {
  /** 処理が成功したかどうか */
  success: boolean
  /** 処理済み画像のData URL（成功時） */
  processedImageUrl?: string
  /** エラーメッセージ（失敗時） */
  error?: string
}

/**
 * 工事黒板の描画設定を表すインターフェース
 */
export interface ConstructionBoardConfig {
  /** フォントサイズ */
  fontSize: number
  /** パディング */
  padding: number
  /** セル内パディング */
  cellPadding: number
  /** 行の高さ */
  rowHeight: number
  /** 背景色のグラデーション */
  backgroundGradient: {
    start: string
    end: string
  }
  /** 枠線の色 */
  borderColor: string
  /** 文字色 */
  textColor: string
}

/**
 * エラーハンドリング用の型
 */
export type ErrorType = "FILE_UPLOAD" | "IMAGE_PROCESSING" | "EXIF_PARSING" | "CANVAS_DRAWING" | "UNKNOWN"

/**
 * アプリケーションエラーを表すインターフェース
 */
export interface AppError {
  /** エラーの種類 */
  type: ErrorType
  /** エラーメッセージ */
  message: string
  /** 詳細なエラー情報（開発用） */
  details?: unknown
  /** エラーが発生した日時 */
  timestamp: Date
}

/**
 * サポートされる画像形式
 */
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg"] as const
export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number]
