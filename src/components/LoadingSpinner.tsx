import {memo} from "react"
import {MUI} from "../ui"

/**
 * ローディングスピナーコンポーネントのプロパティ
 */
interface LoadingSpinnerProps {
  /** ローディング状態かどうか */
  isLoading: boolean
  /** 表示するメッセージ */
  message?: string
  /** インライン表示するかどうか */
  inline?: boolean
}

/**
 * ローディングスピナーコンポーネント
 *
 * @description 処理中状態を視覚的に表示するためのスピナーコンポーネント
 * カスタマイズ可能なメッセージとレイアウトオプションを提供
 * メモ化により、プロパティが変更されない限り再レンダリングを回避
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element | null - ローディングスピナー要素またはnull
 *
 * @example
 * ```tsx
 * <LoadingSpinner
 *   isLoading={isProcessing}
 *   message="画像を処理中..."
 * />
 * ```
 */
export const LoadingSpinner = memo(({isLoading, message = "読み込み中...", inline = false}: LoadingSpinnerProps) => {
  if (!isLoading) {
    return null
  }

  return (
    <MUI.Stack
      direction="row"
      alignItems="center"
      justifyContent={inline ? "flex-start" : "center"}
      spacing={2}
      sx={{py: inline ? 1 : 2, color: "text.secondary", fontSize: 14}}
    >
      <MUI.CircularProgress size={20} color="primary" thickness={5} />
      <span>{message}</span>
    </MUI.Stack>
  )
})

LoadingSpinner.displayName = "LoadingSpinner"
