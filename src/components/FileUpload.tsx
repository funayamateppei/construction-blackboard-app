import {memo, useRef, useState} from "react"
import type {ChangeEvent, DragEvent} from "react"
import {MUI, MuiIcons} from "../ui"
import {FILE_CONFIG} from "../constants"
import type {SupportedImageType} from "../types"

/**
 * ファイルアップロードコンポーネントのプロパティ
 */
interface FileUploadProps {
  /** ファイルアップロード時のコールバック関数 */
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
  /** 既に画像がアップロード済みかどうか */
  hasImage: boolean
}

/**
 * 画像ファイルアップロードコンポーネント
 *
 * @description サポートされている画像形式（JPEG、PNG）のファイルをアップロードするためのコンポーネント
 * メモ化により、propsが変わらない限り再レンダリングを回避し、パフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - ファイルアップロード用の入力要素
 *
 * @example
 * ```tsx
 * <FileUpload
 *   onImageUpload={handleFileUpload}
 *   hasImage={!!state.originalImage}
 * />
 * ```
 */
export const FileUpload = memo(({onImageUpload, hasImage}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // サポートされている画像形式の設定
  const acceptAttribute = FILE_CONFIG.ACCEPT_ATTRIBUTE

  // ラベル文字列を定数から生成
  const supportedTypesText = FILE_CONFIG.SUPPORTED_TYPES.map((type: SupportedImageType) =>
    type.split("/")[1].toUpperCase(),
  ).join(", ")

  // ファイル選択ボタンクリック
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      // FileListをHTMLInputElementのchangeイベントのように処理
      const mockEvent = {
        target: {
          files,
        },
      } as ChangeEvent<HTMLInputElement>
      onImageUpload(mockEvent)
    }
  }

  return (
    <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
      <MUI.Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: isDragOver ? "primary.main" : "grey.300",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          bgcolor: isDragOver ? "primary.50" : "background.paper",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: "primary.light",
            bgcolor: "primary.50",
          },
        }}
        onClick={handleButtonClick}
      >
        <MUI.Stack spacing={1} alignItems="center">
          <MUI.Avatar sx={{bgcolor: "primary.main", width: 56, height: 56}}>
            {hasImage ? <MuiIcons.ImageSearch /> : <MuiIcons.CloudUpload />}
          </MUI.Avatar>

          <MUI.Typography variant="h6" color="text.primary">
            {hasImage ? "画像を変更" : "画像を選択"}
          </MUI.Typography>

          <MUI.Typography variant="body2" color="text.secondary">
            ファイルをドラッグ&ドロップするか、クリックして選択
          </MUI.Typography>

          <MUI.Chip label={`対応形式: ${supportedTypesText}`} color="primary" variant="outlined" size="small" />
        </MUI.Stack>
      </MUI.Box>

      <input ref={fileInputRef} type="file" accept={acceptAttribute} onChange={onImageUpload} style={{display: "none"}} />
    </MUI.Paper>
  )
})

FileUpload.displayName = "FileUpload"
