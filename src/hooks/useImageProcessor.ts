/**
 * 画像処理機能のカスタムフック
 * @fileoverview Canvas描画、工事黒板生成、Exif情報付与機能を提供
 */

import {useCallback, useState, useRef} from "react"
import piexif from "piexifjs"
import type {ImageProcessResult, ConstructionInfo, ExifDetails, AppError} from "../types"
import {CANVAS_CONFIG, ERROR_MESSAGES} from "../constants"
import {drawConstructionBoard} from "../utils/drawConstructionBoard"
import {hasMeaningfulExif} from "../utils/helpers"

/**
 * 画像処理機能を提供するカスタムフック
 */
export const useImageProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processError, setProcessError] = useState<AppError | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageLoaderRef = useRef<HTMLImageElement>(null)

  /**
   * Canvasに元画像を描画する
   */
  const drawImageToCanvas = useCallback((imageDataUrl: string, constructionInfo: ConstructionInfo): Promise<void> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const imageLoader = imageLoaderRef.current

      if (!canvas || !imageLoader) {
        reject(new Error("Canvas or image loader is not available"))
        return
      }

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      imageLoader.onload = () => {
        try {
          // Canvasサイズを画像に合わせる
          canvas.width = imageLoader.naturalWidth
          canvas.height = imageLoader.naturalHeight

          // 元画像を描画
          ctx.drawImage(imageLoader, 0, 0, imageLoader.naturalWidth, imageLoader.naturalHeight)

          // 工事黒板を描画
          drawConstructionBoard(
            ctx,
            canvas.width,
            canvas.height,
            constructionInfo.name,
            constructionInfo.date,
            constructionInfo.dynamicFields,
          )

          resolve()
        } catch (error) {
          reject(error)
        }
      }

      imageLoader.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      imageLoader.src = imageDataUrl
    })
  }, [])

  /**
   * Canvasから画像データを取得する
   */
  const getCanvasImageData = useCallback((): string | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    if (canvas.width === 0 || canvas.height === 0) {
      setProcessError({
        type: "CANVAS_DRAWING",
        message: ERROR_MESSAGES.IMAGE_PROCESSING.NO_CANVAS,
        timestamp: new Date(),
      })
      return null
    }

    try {
      return canvas.toDataURL(CANVAS_CONFIG.OUTPUT_FORMAT, CANVAS_CONFIG.QUALITY)
    } catch (error) {
      setProcessError({
        type: "CANVAS_DRAWING",
        message: ERROR_MESSAGES.IMAGE_PROCESSING.PROCESSING_FAILED,
        details: error,
        timestamp: new Date(),
      })
      return null
    }
  }, [])

  /**
   * Exif情報を画像に付与する
   */
  const addExifToImage = useCallback((imageDataUrl: string, exifDetails: ExifDetails, originalImageType: string): string => {
    // JPEG以外またはExif情報がない場合はそのまま返す
    if (originalImageType !== "image/jpeg" || !exifDetails.originalExifObj || !hasMeaningfulExif(exifDetails.originalExifObj)) {
      return imageDataUrl
    }

    try {
      // Exif情報をコピーして更新
      const updatedExif = {...exifDetails.originalExifObj}

      // Orientation情報を正常値（1）に設定
      if (updatedExif["0th"] && updatedExif["0th"][piexif.ImageIFD.Orientation]) {
        updatedExif["0th"][piexif.ImageIFD.Orientation] = 1
      }

      // Exif情報を画像に付与
      const exifStr = piexif.dump(updatedExif)
      return piexif.insert(exifStr, imageDataUrl)
    } catch (error) {
      console.error("Failed to add EXIF data to image:", error)
      // Exif付与に失敗しても元の画像を返す
      return imageDataUrl
    }
  }, [])

  /**
   * 画像を処理して工事黒板付きの画像を生成する
   */
  const processImage = useCallback(
    async (
      imageDataUrl: string,
      imageType: string,
      exifDetails: ExifDetails,
      constructionInfo: ConstructionInfo,
    ): Promise<ImageProcessResult> => {
      setIsProcessing(true)
      setProcessError(null)

      try {
        // Canvasに画像と工事黒板を描画
        await drawImageToCanvas(imageDataUrl, constructionInfo)

        // Canvas内容を画像データとして取得
        const processedImageData = getCanvasImageData()
        if (!processedImageData) {
          return {
            success: false,
            error: ERROR_MESSAGES.IMAGE_PROCESSING.PROCESSING_FAILED,
          }
        }

        // Exif情報を付与
        const finalImageData = addExifToImage(processedImageData, exifDetails, imageType)

        return {
          success: true,
          processedImageUrl: finalImageData,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.IMAGE_PROCESSING.PROCESSING_FAILED

        setProcessError({
          type: "IMAGE_PROCESSING",
          message: errorMessage,
          details: error,
          timestamp: new Date(),
        })

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [drawImageToCanvas, getCanvasImageData, addExifToImage],
  )

  /**
   * Canvasをクリアする
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  /**
   * エラー状態をクリアする
   */
  const clearError = useCallback(() => {
    setProcessError(null)
  }, [])

  return {
    canvasRef,
    imageLoaderRef,
    processImage,
    clearCanvas,
    isProcessing,
    processError,
    clearError,
  }
}
