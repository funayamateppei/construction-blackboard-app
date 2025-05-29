import {memo, useCallback} from "react"

interface RotatedPreviewProps {
  processedImage: string | null
}

/**
 * プレビューとダウンロードコンポーネント
 * メモ化により、必要な時だけ再レンダリング
 */
export const Preview = memo(({processedImage}: RotatedPreviewProps) => {
  // 画像ダウンロード処理
  const handleDownload = useCallback(() => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = `construction_board_image.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [processedImage])

  return (
    <div className="column">
      <h2>工事黒板付きJPEG画像</h2>
      {processedImage ? (
        <>
          <div className="preview-container">
            <img src={processedImage} alt="Construction board with EXIF" className="preview-image" />
          </div>

          <div className="download-section">
            <button onClick={handleDownload} className="download-button">
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
