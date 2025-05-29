/**
 * 工事黒板アプリのメイン状態管理カスタムフック
 * @fileoverview アプリケーション全体の状態を管理する統合フック
 */

import {useState, useCallback, useEffect} from "react"
import type {AppState, ImageInfo, ExifDetails} from "../types"

/**
 * アプリケーション状態管理の初期値
 */
const initialState: AppState = {
  originalImage: null,
  exifDetails: {
    originalExifObj: null,
    displayString: "",
    dateTime: null,
    gpsInfo: null,
  },
  constructionInfo: {
    name: "",
    date: null,
    isDateFromExif: false,
  },
  processedImage: null,
  error: null,
  isLoading: false,
}

/**
 * アプリケーション全体の状態を管理するカスタムフック
 */
export const useConstructionBoardApp = () => {
  const [state, setState] = useState<AppState>(initialState)

  /**
   * 元画像の情報を設定する
   */
  const setOriginalImage = useCallback((imageInfo: ImageInfo | null) => {
    setState((prev) => ({
      ...prev,
      originalImage: imageInfo,
    }))
  }, [])

  /**
   * Exif詳細情報を設定する
   */
  const setExifDetails = useCallback((exifDetails: ExifDetails) => {
    setState((prev) => ({
      ...prev,
      exifDetails,
      constructionInfo: {
        ...prev.constructionInfo,
        date: exifDetails.dateTime || prev.constructionInfo.date,
        isDateFromExif: !!exifDetails.dateTime,
      },
    }))
  }, [])

  /**
   * 工事名を更新する
   */
  const setConstructionName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      constructionInfo: {
        ...prev.constructionInfo,
        name,
      },
    }))
  }, [])

  /**
   * 工事日時を更新する
   */
  const setConstructionDate = useCallback((date: Date | null) => {
    setState((prev) => ({
      ...prev,
      constructionInfo: {
        ...prev.constructionInfo,
        date,
        // 手動で日時を変更した場合はExifフラグをfalseに
        isDateFromExif: prev.constructionInfo.isDateFromExif && !date,
      },
    }))
  }, [])

  /**
   * 処理済み画像を設定する
   */
  const setProcessedImage = useCallback((processedImageUrl: string | null) => {
    setState((prev) => ({
      ...prev,
      processedImage: processedImageUrl,
    }))
  }, [])

  /**
   * エラー状態を設定する
   */
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }))
  }, [])

  /**
   * ローディング状態を設定する
   */
  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading,
    }))
  }, [])

  /**
   * 状態を完全にリセットする
   */
  const resetState = useCallback(() => {
    setState(initialState)
  }, [])

  /**
   * 画像アップロード成功時の処理
   */
  const handleImageUploadSuccess = useCallback((imageInfo: ImageInfo, exifDetails: ExifDetails) => {
    setState((prev) => ({
      ...prev,
      originalImage: imageInfo,
      exifDetails,
      constructionInfo: {
        ...prev.constructionInfo,
        date: exifDetails.dateTime || null,
        isDateFromExif: !!exifDetails.dateTime,
      },
      processedImage: null, // 新しい画像がアップロードされたら処理済み画像をクリア
      error: null,
    }))
  }, [])

  /**
   * 画像処理成功時の処理
   */
  const handleImageProcessSuccess = useCallback((processedImageUrl: string) => {
    setState((prev) => ({
      ...prev,
      processedImage: processedImageUrl,
      error: null,
    }))
  }, [])

  /**
   * エラーハンドリング
   */
  const handleError = useCallback((errorMessage: string) => {
    setState((prev) => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
    }))
  }, [])

  /**
   * 工事情報が入力されているかチェック
   */
  const hasConstructionInfo = state.constructionInfo.name.trim() !== "" || state.constructionInfo.date !== null

  /**
   * 画像処理が可能かチェック
   */
  const canProcessImage = state.originalImage !== null && hasConstructionInfo

  /**
   * デバッグ情報（開発時のみ）
   */
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("App State Updated:", {
        hasOriginalImage: !!state.originalImage,
        hasExifData: !!state.exifDetails.originalExifObj,
        hasConstructionInfo,
        canProcessImage,
        hasProcessedImage: !!state.processedImage,
        error: state.error,
        isLoading: state.isLoading,
      })
    }
  }, [state, hasConstructionInfo, canProcessImage])

  return {
    // 状態
    state,

    // 計算されたプロパティ
    hasConstructionInfo,
    canProcessImage,

    // 基本的な setter
    setOriginalImage,
    setExifDetails,
    setConstructionName,
    setConstructionDate,
    setProcessedImage,
    setError,
    setLoading,

    // 複合的な処理
    handleImageUploadSuccess,
    handleImageProcessSuccess,
    handleError,
    resetState,
  }
}
