/**
 * 工事黒板アプリケーションのメインコンポーネント
 * @fileoverview 画像に工事情報を追加するアプリケーションのエントリーポイント
 */

import React, {useCallback, useEffect} from "react"
import "./App.css"

// 型定義のインポート
import type {ChangeEvent} from "react"

// カスタムフックのインポート
import {useConstructionBoardApp, useFileUpload, useImageProcessor} from "./hooks"

// コンポーネントのインポート
import {
  FileUpload,
  ConstructionInfoInput,
  ConstructionDateInput,
  ImagePreview,
  ExifDisplay,
  CanvasPreview,
  Preview,
  ErrorDisplay,
  LoadingSpinner,
} from "./components"

// 定数のインポート
import {APP_INFO} from "./constants"
import {drawConstructionBoard, validateRequiredFields} from "./utils"

/**
 * 工事黒板アプリケーションのメインコンポーネント
 */
function App(): React.JSX.Element {
  // アプリケーション状態管理
  const {
    state,
    setConstructionName,
    setConstructionDate,
    addDynamicField,
    updateDynamicField,
    removeDynamicField,
    handleImageUploadSuccess,
    handleImageProcessSuccess,
    handleError,
    resetState,
  } = useConstructionBoardApp()

  // ファイルアップロード機能
  const {uploadFile, uploadError} = useFileUpload()

  // 画像処理機能
  const {canvasRef, imageLoaderRef, processImage, clearCanvas, isProcessing, processError} = useImageProcessor()

  /**
   * ファイルアップロード処理
   */
  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // 既存の状態をリセット
      resetState()
      clearCanvas()

      try {
        const result = await uploadFile(file)
        if (result.success && result.imageInfo && result.exifDetails) {
          handleImageUploadSuccess(result.imageInfo, result.exifDetails)
        } else {
          handleError(result.error || "ファイルアップロードに失敗しました")
        }
      } catch {
        handleError("予期しないエラーが発生しました")
      }

      // input要素をリセット
      event.target.value = ""
    },
    [uploadFile, resetState, clearCanvas, handleImageUploadSuccess, handleError],
  )

  /**
   * 画像処理実行
   */
  const handleImageProcess = useCallback(async () => {
    if (!state.originalImage) return

    // 必須フィールドのバリデーション
    const validation = validateRequiredFields(state.constructionInfo.name, state.constructionInfo.date)
    if (!validation.isValid) {
      handleError(validation.errors.join(", "))
      return
    }

    try {
      const result = await processImage(
        state.originalImage.dataUrl,
        state.originalImage.type,
        state.exifDetails,
        state.constructionInfo,
      )

      if (result.success && result.processedImageUrl) {
        handleImageProcessSuccess(result.processedImageUrl)
      } else {
        handleError(result.error || "画像処理に失敗しました")
      }
    } catch {
      handleError("画像処理中にエラーが発生しました")
    }
  }, [state.originalImage, state.exifDetails, state.constructionInfo, processImage, handleImageProcessSuccess, handleError])

  /**
   * Canvas描画の副作用処理
   */
  useEffect(() => {
    if (state.originalImage && canvasRef.current && imageLoaderRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const imgLoader = imageLoaderRef.current

      imgLoader.onload = () => {
        canvas.width = imgLoader.naturalWidth
        canvas.height = imgLoader.naturalHeight

        if (ctx) {
          ctx.drawImage(imgLoader, 0, 0, imgLoader.naturalWidth, imgLoader.naturalHeight)
          // 工事黒板の文字を描画（動的フィールドも含む）
          drawConstructionBoard(
            ctx,
            canvas.width,
            canvas.height,
            state.constructionInfo.name,
            state.constructionInfo.date,
            state.constructionInfo.dynamicFields,
          )
        }
      }

      imgLoader.onerror = () => {
        console.error("Error loading image into imageLoader for canvas drawing")
        handleError("画像の読み込みに失敗しました")
      }

      imgLoader.src = state.originalImage.dataUrl
    } else if (!state.originalImage && canvasRef.current) {
      clearCanvas()
    }
  }, [
    state.originalImage,
    state.constructionInfo.name,
    state.constructionInfo.date,
    state.constructionInfo.dynamicFields,
    canvasRef,
    imageLoaderRef,
    clearCanvas,
    handleError,
  ])

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          {APP_INFO.NAME} - {APP_INFO.DESCRIPTION} 📋✨
        </h1>
      </header>

      <main>
        <section className="controls">
          <FileUpload onImageUpload={handleFileUpload} hasImage={!!state.originalImage} />

          {state.originalImage && (
            <>
              <ConstructionInfoInput
                constructionName={state.constructionInfo.name}
                onConstructionNameChange={setConstructionName}
                dynamicFields={state.constructionInfo.dynamicFields}
                onAddField={addDynamicField}
                onUpdateField={updateDynamicField}
                onRemoveField={removeDynamicField}
              />

              <ConstructionDateInput
                constructionDate={state.constructionInfo.date}
                onConstructionDateChange={setConstructionDate}
                isDateFromExif={state.constructionInfo.isDateFromExif}
              />

              <LoadingSpinner isLoading={isProcessing} message="工事黒板を生成中..." inline />

              <button onClick={handleImageProcess} disabled={!state.originalImage || isProcessing}>
                {isProcessing ? "処理中..." : "工事黒板付きJPEG画像を生成 (Exif付与)"}
              </button>
            </>
          )}
        </section>

        {/* エラー表示 */}
        <ErrorDisplay error={state.error} uploadError={uploadError} processError={processError} />

        {/* 非表示の画像ローダー */}
        <img ref={imageLoaderRef} alt="Image loader for canvas" style={{display: "none"}} />

        <div className="content-layout">
          <ImagePreview
            src={state.originalImage?.dataUrl || null}
            type={(state.originalImage?.type as "image/jpeg" | null) || null}
          />

          <ExifDisplay exifData={state.exifDetails.displayString} />

          <CanvasPreview ref={canvasRef} hasImage={!!state.originalImage} />

          <Preview processedImage={state.processedImage} />
        </div>
      </main>
    </div>
  )
}

export default App
