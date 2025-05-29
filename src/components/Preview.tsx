import {memo} from "react"

interface RotatedPreviewProps {
  processedImage: string | null
  onDownload: () => void
}

/**
 * 回転プレビューとダウンロードコンポーネント
 * メモ化により、必要な時だけ再レンダリング
 */
export const Preview = memo(({processedImage, onDownload}: RotatedPreviewProps) => {
  return (
    <div className="column">
      <h2>工事黒板付きJPEG画像</h2>
      {processedImage ? (
        <>
          <div className="preview-container">
            <img src={processedImage} alt="Construction board with EXIF" className="preview-image" />
          </div>

          <div className="download-section">
            <button onClick={onDownload} className="download-button">
              工事黒板付き画像をダウンロード (.jpg)
            </button>
          </div>
        </>
      ) : (
        <p>工事黒板付き画像がここに表示されます</p>
      )}
    </div>
  )
})

Preview.displayName = "Preview"
