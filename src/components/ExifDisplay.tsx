import {memo} from "react"

interface ExifDisplayProps {
  exifData: string
}

/**
 * Exif情報表示コンポーネント
 * メモ化により、Exifデータが変わらない限り再レンダリングしない
 */
export const ExifDisplay = memo(({exifData}: ExifDisplayProps) => {
  return (
    <div className="column">
      <h2>読み取られたExif情報</h2>
      <pre className="exif-display">{exifData || "Exif情報はありません"}</pre>
    </div>
  )
})

ExifDisplay.displayName = "ExifDisplay"
