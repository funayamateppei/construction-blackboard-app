import {memo} from "react"
import type {ChangeEvent} from "react"

interface FileUploadProps {
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
  hasImage: boolean
}

/**
 * 画像ファイルアップロードコンポーネント
 * メモ化により、propsが変わらない限り再レンダリングを回避
 */
export const FileUpload = memo(({onImageUpload, hasImage}: FileUploadProps) => {
  return (
    <div className="file-upload-section">
      <label htmlFor="imageUpload" className="file-label">
        {hasImage ? "画像を変更 (JPEG, PNG)" : "画像を選択 (JPEG, PNG)"}
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        onChange={onImageUpload}
        style={{display: "none"}}
      />
    </div>
  )
})

FileUpload.displayName = "FileUpload"
