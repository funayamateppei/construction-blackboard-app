import piexif from "piexifjs"

/**
 * Exifデータが実質的な情報を含むかチェックするヘルパー関数
 */
export function hasMeaningfulExif(exifData: piexif.ExifDict | null): boolean {
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
  } catch {
    return "" // フォーマットに失敗した場合は空文字を返す
  }
}

/**
 * Dateオブジェクトをdatetime-local形式の文字列に変換するヘルパー関数
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
  } catch {
    return ""
  }
}

/**
 * Exif情報から撮影日時を取得するヘルパー関数
 * 最適化: 一度のアクセスでプロパティを取得してキャッシュ
 */
export function extractDateTimeFromExif(exifData: piexif.ExifDict | null): Date | null {
  if (!exifData) return null

  try {
    // DateTime, DateTimeOriginal, DateTimeDigitized の順で優先的に取得
    // 最適化: プロパティアクセスを一度だけ実行
    const exifIfd = exifData["Exif"]
    const zeroIfd = exifData["0th"]

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
