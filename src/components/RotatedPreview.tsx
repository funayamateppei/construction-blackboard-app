import {memo} from "react"
import {RotationControls} from "./RotationControls"

interface RotatedPreviewProps {
  processedImage: string | null
  rotatedPreviewImage: string | null
  downloadRotation: number
  onRotationChange: (rotation: number) => void
  onDownload: () => void
}

/**
 * 回転プレビューとダウンロードコンポーネント
 * メモ化により、必要な時だけ再レンダリング
 */
export const RotatedPreview = memo(
  ({processedImage, rotatedPreviewImage, downloadRotation, onRotationChange, onDownload}: RotatedPreviewProps) => {
    return (
      <div className="column">
        <h2>工事黒板付きJPEG画像</h2>
        {processedImage ? (
          <>
            <div className="rotated-preview-container">
              <img
                src={rotatedPreviewImage || processedImage}
                alt="Construction board with EXIF"
                className={`rotated-preview-image rotation-${downloadRotation}`}
              />
            </div>

            <div className="download-section">
              <RotationControls rotation={downloadRotation} onRotationChange={onRotationChange} />

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
  },
)

RotatedPreview.displayName = "RotatedPreview"
