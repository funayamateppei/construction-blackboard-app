import {memo} from "react"

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

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: inline ? "flex-start" : "center",
    gap: "8px",
    padding: inline ? "8px 0" : "16px",
    fontSize: "14px",
    color: "#6c757d",
  }

  const spinnerStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    border: `2px solid #f8f9fa`,
    borderTop: `2px solid #007bff`,
    borderRadius: "50%",
    animation: `spinner-rotate 1s linear infinite`,
  }

  return (
    <>
      {/* CSS アニメーション定義 */}
      <style>
        {`
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={spinnerStyle} aria-hidden="true" />
        <span>{message}</span>
      </div>
    </>
  )
})

LoadingSpinner.displayName = "LoadingSpinner"
