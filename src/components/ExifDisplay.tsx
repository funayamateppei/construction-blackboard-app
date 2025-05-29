import {memo} from "react"
import {UI_SETTINGS} from "../constants"

/**
 * Exif情報表示コンポーネントのプロパティ
 */
interface ExifDisplayProps {
  /** 表示用にフォーマットされたExif情報文字列 */
  exifData: string
}

/**
 * Exif情報表示コンポーネント
 *
 * @description アップロードされた画像から読み取ったExif情報を整形して表示するコンポーネント
 * 情報がない場合は適切なメッセージを表示
 * メモ化により、Exifデータが変わらない限り再レンダリングを回避してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - Exif情報表示コンポーネント
 *
 * @example
 * ```tsx
 * <ExifDisplay exifData={state.exifDetails.displayString} />
 * ```
 */
export const ExifDisplay = memo(({exifData}: ExifDisplayProps) => {
  return (
    <div className="column">
      <h2>{UI_SETTINGS.LABELS.EXIF_INFO}</h2>
      <pre className="exif-display">{exifData || UI_SETTINGS.PLACEHOLDERS.NO_EXIF_DATA}</pre>
    </div>
  )
})
