import {memo, forwardRef} from "react"

interface CanvasPreviewProps {
  hasImage: boolean
}

/**
 * Canvas プレビューコンポーネント
 * forwardRefでcanvasの参照を親コンポーネントに渡す
 * メモ化により不要な再レンダリングを防止
 */
export const CanvasPreview = memo(
  forwardRef<HTMLCanvasElement, CanvasPreviewProps>(({hasImage}, ref) => {
    return (
      <div className="column">
        <h2>工事黒板プレビュー (Canvas)</h2>
        <canvas ref={ref} className="canvas-preview" />
        {!hasImage && <p>ここに工事黒板付きプレビューが表示されます</p>}
      </div>
    )
  }),
)

CanvasPreview.displayName = "CanvasPreview"
