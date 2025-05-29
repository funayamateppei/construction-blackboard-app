import {memo, useCallback} from "react"
import {UI_SETTINGS, FILE_CONFIG} from "../constants"

/**
 * プレビューコンポーネントのプロパティ
 */
interface PreviewProps {
  /** 処理済み画像のデータURL */
  processedImage: string | null
}

/**
 * プレビューとダウンロードコンポーネント
 *
 * @description 工事黒板付きの最終画像を表示し、ダウンロード機能を提供するコンポーネント
 * 画像がない場合は適切なプレースホルダーメッセージを表示
 * メモ化により、必要な時だけ再レンダリングしてパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - 最終画像プレビューとダウンロードボタンを含むコンポーネント
 *
 * @example
 * ```tsx
 * <Preview processedImage={state.processedImage} />
 * ```
 */
export const Preview = memo(({processedImage}: PreviewProps) => {
  /**
   * 画像ダウンロード処理
   *
   * @description 処理済み画像をJPEGファイルとしてダウンロードする
   * デフォルトのファイル名は設定から取得
   */
  const handleDownload = useCallback(() => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = FILE_CONFIG.DEFAULT_DOWNLOAD_FILENAME
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [processedImage])

  return (
    <div className="column">
      <h2>{UI_SETTINGS.LABELS.PROCESSED_IMAGE}</h2>
      {processedImage ? (
        <>
          <div className="preview-container">
            <img src={processedImage} alt={UI_SETTINGS.ALT_TEXTS.PROCESSED_IMAGE} className="preview-image" />
          </div>

          <div className="download-section">
            <button onClick={handleDownload} className="download-button">
              {UI_SETTINGS.LABELS.DOWNLOAD_BUTTON}
            </button>
          </div>
        </>
      ) : (
        <p>{UI_SETTINGS.PLACEHOLDERS.PROCESSED_IMAGE}</p>
      )}
    </div>
  )
})
