/**
 * 工事黒板アプリケーション用ヘルパー関数集
 * @fileoverview 画像処理、Exif操作、日時フォーマット等のユーティリティ関数
 */

import piexif from "piexifjs"
import type {ExifDict} from "piexifjs"
import type {DynamicField} from "../types"

/**
 * Exifデータが実質的な情報を含むかチェックするヘルパー関数
 * @param exifData - チェック対象のExif辞書オブジェクト
 * @returns 意味のあるExifデータが含まれている場合はtrue
 */
export function hasMeaningfulExif(exifData: ExifDict | null): boolean {
  if (!exifData) return false

  // より効率的なアクセス方法：プロパティを直接参照
  const zeroIfd = exifData["0th"]
  const exifIfd = exifData["Exif"]
  const gpsIfd = exifData["GPS"]
  const interopIfd = exifData["Interop"]
  const firstIfd = exifData["1st"]
  const thumbnail = exifData.thumbnail

  return (
    (zeroIfd && Object.keys(zeroIfd).length > 0) ||
    (exifIfd && Object.keys(exifIfd).length > 0) ||
    (gpsIfd && Object.keys(gpsIfd).length > 0) ||
    (interopIfd && Object.keys(interopIfd).length > 0) ||
    (firstIfd && Object.keys(firstIfd).length > 0) ||
    (!!thumbnail && typeof thumbnail === "string" && thumbnail.length > 0) ||
    (!!thumbnail && typeof thumbnail !== "string" && (thumbnail as Uint8Array).length > 0)
  )
}

/**
 * 日時を日本語形式に変換するヘルパー関数
 * @param date - 変換対象の日時オブジェクト
 * @returns 日本語形式の日時文字列（例: "2023年5月15日 14:30"）
 * @example
 * formatDateTimeForDisplay(new Date('2023-05-15T14:30:45'))
 * // => "2023年5月15日 14:30"
 */
export function formatDateTimeForDisplay(date: Date | null): string {
  if (!date) return ""

  try {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${year}年${month}月${day}日 ${hours}:${minutes}`
  } catch (error) {
    console.error("Failed to format date for display:", error)
    return "" // フォーマットに失敗した場合は空文字を返す
  }
}

/**
 * Dateオブジェクトをdatetime-local形式の文字列に変換するヘルパー関数
 * @param date - 変換対象の日時オブジェクト
 * @returns datetime-local形式の文字列（例: "2023-05-15T14:30"）
 * @example
 * formatDateForInput(new Date('2023-05-15T14:30:45'))
 * // => "2023-05-15T14:30"
 */
export function formatDateForInput(date: Date | null): string {
  if (!date) return ""

  try {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (error) {
    console.error("Failed to format date for input:", error)
    return ""
  }
}

/**
 * Exif情報から撮影日時を取得するヘルパー関数
 * @param exifData - Exif辞書オブジェクト
 * @returns 撮影日時のDateオブジェクト、取得できない場合はnull
 * @description
 * 最適化: 一度のアクセスでプロパティを取得してキャッシュ
 * 優先順位: DateTimeOriginal > DateTimeDigitized > DateTime
 */
export function extractDateTimeFromExif(exifData: ExifDict | null): Date | null {
  if (!exifData) return null

  try {
    // DateTime, DateTimeOriginal, DateTimeDigitized の順で優先的に取得
    // 最適化: プロパティアクセスを一度だけ実行
    const exifIfd = exifData["Exif"]

    const dateTimeString = exifIfd?.[piexif.ExifIFD.DateTimeOriginal] ?? ""

    if (dateTimeString) {
      console.log("Original EXIF DateTime string:", dateTimeString)

      // "YYYY:MM:DD HH:MM:SS" 形式をDateオブジェクトに変換
      // 例: "2023:05:15 14:30:45" → "2023-05-15T14:30:45"
      const parts = dateTimeString.split(" ")
      if (parts.length === 2) {
        const datePart = parts[0].replace(/:/g, "-") // "2023:05:15" → "2023-05-15"
        const timePart = parts[1] // "14:30:45"
        const isoString = `${datePart}T${timePart}`
        console.log("Converted to ISO string:", isoString)

        const date = new Date(isoString)
        if (!isNaN(date.getTime())) {
          console.log("Successfully parsed date:", date)
          return date
        } else {
          console.log("Failed to parse date from ISO string")
        }
      } else {
        console.log("Unexpected EXIF DateTime format:", dateTimeString)
      }
    }
  } catch (error) {
    console.error("Failed to extract DateTime from EXIF:", error)
  }

  return null
}

/**
 * Exif情報から撮影日時とGPS情報を取得するヘルパー関数
 * @param exifData - Exif辞書オブジェクト
 * @returns 撮影日時とGPS情報を含むオブジェクト
 * @description GPS情報を含めて取得するように改良
 */
export function extractExifDetails(exifData: ExifDict | null): {
  dateTime: Date | null
  gpsInfo: Record<string, unknown> | null
} {
  if (!exifData) return {dateTime: null, gpsInfo: null}

  let dateTime: Date | null = null
  let gpsInfo: Record<string, unknown> | null = null

  try {
    // DateTime, DateTimeOriginal, DateTimeDigitized の順で優先的に取得
    const exifIfd = exifData["Exif"]
    const zeroIfd = exifData["0th"]
    const gpsIfd = exifData["GPS"]

    let dateTimeString = ""

    // Exif IFDから DateTimeOriginal を取得 (撮影日時)
    if (exifIfd?.[piexif.ExifIFD.DateTimeOriginal]) {
      dateTimeString = exifIfd[piexif.ExifIFD.DateTimeOriginal] as string
    }
    // Exif IFDから DateTimeDigitized を取得 (デジタル化日時)
    else if (exifIfd?.[piexif.ExifIFD.DateTimeDigitized]) {
      dateTimeString = exifIfd[piexif.ExifIFD.DateTimeDigitized] as string
    }
    // 0th IFDから DateTime を取得 (最終変更日時)
    else if (zeroIfd?.[piexif.ImageIFD.DateTime]) {
      dateTimeString = zeroIfd[piexif.ImageIFD.DateTime] as string
    }

    if (dateTimeString) {
      const parts = dateTimeString.split(" ")
      if (parts.length === 2) {
        const datePart = parts[0].replace(/:/g, "-") // "2023:05:15" → "2023-05-15"
        const timePart = parts[1] // "14:30:45"
        const isoString = `${datePart}T${timePart}`

        const parsedDate = new Date(isoString)
        if (!isNaN(parsedDate.getTime())) {
          dateTime = parsedDate
        }
      }
    }

    // GPS情報を取得
    if (gpsIfd && Object.keys(gpsIfd).length > 0) {
      gpsInfo = gpsIfd
    }
  } catch (error) {
    console.error("Failed to extract Exif details:", error)
  }

  return {dateTime, gpsInfo}
}

/**
 * 必須フィールドのバリデーション関数
 * @param name - 工事名
 * @param date - 工事日時
 * @returns バリデーション結果
 * @description 工事名と日時が両方とも入力されているかチェックします
 */
export function validateRequiredFields(
  name: string,
  date: Date | null,
): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!name.trim()) {
    errors.push("工事名は必須です")
  }

  if (!date) {
    errors.push("工事日時は必須です")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * ユニークIDを生成するヘルパー関数
 * @returns ユニークな文字列ID
 * @description 動的フィールド用のIDを生成します
 */
export function generateUniqueId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 動的フィールドの重複キーをチェックする関数
 * @param fields - 現在のフィールド配列
 * @param newKey - 新しいキー
 * @param excludeId - 除外するフィールドID（編集時に使用）
 * @returns 重複の有無
 */
export function isDuplicateKey(fields: DynamicField[], newKey: string, excludeId?: string): boolean {
  return fields.some((field) => field.key.trim().toLowerCase() === newKey.trim().toLowerCase() && field.id !== excludeId)
}
