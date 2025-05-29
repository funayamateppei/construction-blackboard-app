import {memo} from "react"
import {UI_SETTINGS} from "../constants"
import type {SupportedImageType} from "../types"

/**
 * 画像プレビューコンポーネントのプロパティ
 */
interface ImagePreviewProps {
  /** 画像のデータURL */
  src: string | null
  /** 画像のMIMEタイプ */
  type?: SupportedImageType | null
}

/**
 * 画像プレビューコンポーネント
 *
 * @description アップロードされた元画像を表示するためのコンポーネント
 * 画像タイプも併せて表示し、ユーザーにファイル情報を提供
 * メモ化により、画像が変わらない限り再レンダリングを回避してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - 画像プレビュー表示コンポーネント
 *
 * @example
 * ```tsx
 * <ImagePreview
 *   src={state.originalImage?.dataUrl || null}
 *   type={state.originalImage?.type || null}
 * />
 * ```
 */
export const ImagePreview = memo(({src, type}: ImagePreviewProps) => {
  return (
    <div className="column">
      <h2>{UI_SETTINGS.LABELS.ORIGINAL_IMAGE}</h2>
      {src ? (
        <>
          <img src={src} alt={UI_SETTINGS.ALT_TEXTS.ORIGINAL_IMAGE} className="preview-image" />
          {type && (
            <p>
              {UI_SETTINGS.LABELS.IMAGE_TYPE}: {type.split("/")[1].toUpperCase()}
            </p>
          )}
        </>
      ) : (
        <p>{UI_SETTINGS.PLACEHOLDERS.NO_IMAGE_SELECTED}</p>
      )}
    </div>
  )
})
