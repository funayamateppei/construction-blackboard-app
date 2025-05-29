import {memo} from "react"

interface ImagePreviewProps {
  src: string | null
  type?: string | null
}

/**
 * 画像プレビューコンポーネント
 * メモ化により、画像が変わらない限り再レンダリングしない
 */
export const ImagePreview = memo(({src, type}: ImagePreviewProps) => {
  return (
    <div className="column">
      <h2>元画像</h2>
      {src ? (
        <>
          <img src={src} alt={"Original"} className={"preview-image"} />
          {type && <p>タイプ: {type}</p>}
        </>
      ) : (
        <p>画像が選択されていません</p>
      )}
    </div>
  )
})

ImagePreview.displayName = "ImagePreview"
