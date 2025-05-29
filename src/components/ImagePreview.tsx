import {memo} from "react"

interface ImagePreviewProps {
  src: string | null
  alt: string
  title: string
  className?: string
  type?: string | null
}

/**
 * 画像プレビューコンポーネント
 * メモ化により、画像が変わらない限り再レンダリングしない
 */
export const ImagePreview = memo(({src, alt, title, className = "preview-image", type}: ImagePreviewProps) => {
  return (
    <div className="column">
      <h2>{title}</h2>
      {src ? (
        <>
          <img src={src} alt={alt} className={className} />
          {type && <p>タイプ: {type}</p>}
        </>
      ) : (
        <p>画像が選択されていません</p>
      )}
    </div>
  )
})

ImagePreview.displayName = "ImagePreview"
