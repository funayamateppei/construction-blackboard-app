import {memo} from "react"
import type {ChangeEvent} from "react"
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
  // サポートされている画像形式の設定
  const acceptAttribute = FILE_CONFIG.ACCEPT_ATTRIBUTE

  // ラベル文字列を定数から生成
  const supportedTypesText = FILE_CONFIG.SUPPORTED_TYPES.map((type: SupportedImageType) =>
    type.split("/")[1].toUpperCase(),
  ).join(", ")

  return (
    <div className="file-upload-section">
      <label htmlFor="imageUpload" className="file-label">
        {hasImage ? `画像を変更 (${supportedTypesText})` : `画像を選択 (${supportedTypesText})`}
      </label>
      <input type="file" id="imageUpload" accept={acceptAttribute} onChange={onImageUpload} style={{display: "none"}} />
    </div>
  )
})

FileUpload.displayName = "FileUpload"
