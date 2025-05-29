/**
 * 画像アップロード処理のカスタムフック
 * @fileoverview ファイルアップロード、Exif解析機能を提供
 */

import {useCallback, useState} from "react"
import piexif from "piexifjs"
import type {FileUploadResult, ImageInfo, ExifDetails, AppError} from "../types"
import {ERROR_MESSAGES} from "../constants"
import {hasMeaningfulExif, extractExifDetails} from "../utils/helpers"

/**
 * ファイルアップロード機能を提供するカスタムフック
 */
export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<AppError | null>(null)

  /**
   * ファイルをData URLに変換する
   */
  const readFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === "string") {
          resolve(result)
        } else {
          reject(new Error("Failed to read file as data URL"))
        }
      }

      reader.onerror = () => {
        reject(new Error("FileReader error occurred"))
      }

      reader.readAsDataURL(file)
    })
  }, [])

  /**
   * JPEG画像からExif情報を解析する
   */
  const parseExifData = useCallback((dataUrl: string): ExifDetails => {
    try {
      const exifObject = piexif.load(dataUrl)

      if (!hasMeaningfulExif(exifObject)) {
        return {
          originalExifObj: null,
          displayString: "No meaningful EXIF data found in this JPEG.",
          dateTime: null,
          gpsInfo: null,
        }
      }

      const {dateTime, gpsInfo} = extractExifDetails(exifObject)

      // Exif表示用文字列を構築
      let exifDisplayString = "--- JPEG EXIF Data ---\\n"

      if (exifObject["0th"]) {
        exifDisplayString += "0th IFD:\\n" + JSON.stringify(exifObject["0th"], null, 2) + "\\n\\n"
      }
      if (exifObject["Exif"]) {
        exifDisplayString += "Exif IFD:\\n" + JSON.stringify(exifObject["Exif"], null, 2) + "\\n\\n"
      }
      if (exifObject["GPS"]) {
        exifDisplayString += "GPS IFD:\\n" + JSON.stringify(exifObject["GPS"], null, 2) + "\\n\\n"
      }
      if (exifObject["Interop"]) {
        exifDisplayString += "Interop IFD:\\n" + JSON.stringify(exifObject["Interop"], null, 2) + "\\n\\n"
      }
      if (exifObject["1st"]) {
        exifDisplayString += "1st IFD:\\n" + JSON.stringify(exifObject["1st"], null, 2) + "\\n\\n"
      }

      // サムネイル情報を追加
      if (exifObject.thumbnail) {
        let thumbLength = 0
        try {
          if (typeof exifObject.thumbnail === "string") {
            thumbLength = exifObject.thumbnail.length
          } else if (exifObject.thumbnail && typeof (exifObject.thumbnail as string).length === "number") {
            thumbLength = (exifObject.thumbnail as string).length
          }
        } catch {
          thumbLength = 0
        }
        exifDisplayString += `Thumbnail: Present (length ${thumbLength})\\n`
      } else {
        exifDisplayString += "Thumbnail: Not present\\n"
      }

      return {
        originalExifObj: exifObject,
        displayString: exifDisplayString,
        dateTime,
        gpsInfo,
      }
    } catch (error) {
      console.error("Failed to parse EXIF data:", error)

      return {
        originalExifObj: null,
        displayString:
          "EXIF data could not be loaded from this JPEG. It might be corrupted or not a standard JPEG EXIF format.",
        dateTime: null,
        gpsInfo: null,
      }
    }
  }, [])

  /**
   * ファイルをアップロードして解析する
   */
  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      setIsUploading(true)
      setUploadError(null)

      try {
        // ファイルを読み込み
        const dataUrl = await readFileAsDataURL(file)

        // 画像情報を構築
        const imageInfo: ImageInfo = {
          dataUrl,
          type: file.type,
          size: file.size,
          fileName: file.name,
        }

        // JPEG画像のExif情報を解析
        const exifDetails = parseExifData(dataUrl)

        return {
          success: true,
          imageInfo,
          exifDetails,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FILE_UPLOAD.READ_ERROR

        setUploadError({
          type: "FILE_UPLOAD",
          message: errorMessage,
          details: error,
          timestamp: new Date(),
        })

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsUploading(false)
      }
    },
    [readFileAsDataURL, parseExifData],
  )

  /**
   * エラー状態をクリアする
   */
  const clearError = useCallback(() => {
    setUploadError(null)
  }, [])

  return {
    uploadFile,
    isUploading,
    uploadError,
    clearError,
  }
}
