/**
 * 工事黒板アプリケーションのメインコンポーネント
 * @fileoverview 画像に工事情報を追加するアプリケーションのエントリーポイント
 */

import React, {useCallback, useEffect} from "react"

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

// MUIコンポーネントのインポート
import {MUI} from "./ui"

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
    <MUI.Stack sx={{p: 4}}>
      <MUI.Paper elevation={3} sx={{p: {xs: 2, sm: 4}, mb: 4}}>
        <MUI.Typography variant="h4" component="h1" color="primary" fontWeight={700} align="center" gutterBottom>
          {APP_INFO.NAME} - {APP_INFO.DESCRIPTION}{" "}
          <span role="img" aria-label="clipboard">
            📋
          </span>
          <span role="img" aria-label="sparkles">
            ✨
          </span>
        </MUI.Typography>
      </MUI.Paper>

      <MUI.Stack spacing={3}>
        <MUI.Paper elevation={1} sx={{p: {xs: 2, sm: 3}}}>
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

              <MUI.Button
                onClick={handleImageProcess}
                disabled={!state.originalImage || isProcessing}
                variant="contained"
                color="primary"
                sx={{mt: 2, borderRadius: 20, fontWeight: 700}}
                fullWidth
              >
                {isProcessing ? "処理中..." : "工事黒板付きJPEG画像を生成 (Exif付与)"}
              </MUI.Button>
            </>
          )}
        </MUI.Paper>

        <ErrorDisplay error={state.error} uploadError={uploadError} processError={processError} />

        <img ref={imageLoaderRef} alt="Image loader for canvas" style={{display: "none"}} />

        <MUI.Grid container spacing={3}>
          <MUI.Grid size={{xs: 12, md: 3}}>
            <ImagePreview
              src={state.originalImage?.dataUrl || null}
              type={(state.originalImage?.type as "image/jpeg" | null) || null}
            />
          </MUI.Grid>
          <MUI.Grid size={{xs: 12, md: 3}}>
            <ExifDisplay exifData={state.exifDetails.displayString} />
          </MUI.Grid>
          <MUI.Grid size={{xs: 12, md: 3}}>
            <CanvasPreview ref={canvasRef} hasImage={!!state.originalImage} />
          </MUI.Grid>
          <MUI.Grid size={{xs: 12, md: 3}}>
            <Preview processedImage={state.processedImage} />
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Stack>
    </MUI.Stack>
  )
}

export default App
