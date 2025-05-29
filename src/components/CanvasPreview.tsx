import {memo, forwardRef} from "react"
import {UI_SETTINGS} from "../constants"

/**
 * Canvasプレビューコンポーネントのプロパティ
 */
interface CanvasPreviewProps {
  /** 画像がアップロード済みかどうか */
  hasImage: boolean
}

/**
 * Canvasプレビューコンポーネント
 *
 * @description 工事黒板付きの画像をCanvas上でプレビュー表示するためのコンポーネント
 * forwardRefを使用してcanvasの参照を親コンポーネントに渡し、直接的な描画操作を可能にする
 * メモ化により不要な再レンダリングを防止してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @param ref - canvas要素への参照
 * @returns JSX.Element - Canvas要素を含むプレビューコンポーネント
 *
 * @example
 * ```tsx
 * <CanvasPreview ref={canvasRef} hasImage={!!state.originalImage} />
 * ```
 */
export const CanvasPreview = memo(
  forwardRef<HTMLCanvasElement, CanvasPreviewProps>(({hasImage}, ref) => {
    return (
      <div className="column">
        <h2>{UI_SETTINGS.LABELS.CANVAS_PREVIEW}</h2>
        <canvas ref={ref} className="canvas-preview" />
        {!hasImage && <p>{UI_SETTINGS.PLACEHOLDERS.CANVAS_PREVIEW}</p>}
      </div>
    )
  }),
)
