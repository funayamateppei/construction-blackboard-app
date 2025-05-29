import {memo, forwardRef} from "react"
import {MUI} from "../ui"
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
      <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
        <MUI.Stack spacing={2} alignItems="center">
          <MUI.Typography variant="h6" color="text.primary" sx={{fontWeight: 700}}>
            {UI_SETTINGS.LABELS.CANVAS_PREVIEW}
          </MUI.Typography>
          <MUI.Box
            sx={{
              width: "100%",
              maxWidth: 360,
              borderRadius: 0.5,
              overflow: "hidden",
              boxShadow: 2,
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <canvas ref={ref} style={{width: "100%", height: "auto", objectFit: "contain"}} />
          </MUI.Box>
          {!hasImage && (
            <MUI.Typography variant="body2" color="text.secondary">
              {UI_SETTINGS.PLACEHOLDERS.CANVAS_PREVIEW}
            </MUI.Typography>
          )}
        </MUI.Stack>
      </MUI.Paper>
    )
  }),
)
