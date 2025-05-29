import {memo} from "react"
import type {AppError} from "../types"

/**
 * エラー表示コンポーネントのプロパティ
 */
interface ErrorDisplayProps {
  /** アプリケーションエラー */
  error?: string | null
  /** アップロードエラー */
  uploadError?: AppError | null
  /** 処理エラー */
  processError?: AppError | null
  /** エラー表示時のコールバック関数 */
  onDismiss?: () => void
}

/**
 * エラー表示コンポーネント
 *
 * @description アプリケーション内で発生した各種エラーを統一的に表示するコンポーネント
 * エラーの種類に応じて適切なメッセージと視覚的フィードバックを提供
 * メモ化により、エラー状態が変更されない限り再レンダリングを回避
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element | null - エラー表示要素またはnull
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={state.error}
 *   uploadError={uploadError}
 *   processError={processError}
 *   onDismiss={clearErrors}
 * />
 * ```
 */
export const ErrorDisplay = memo(({error, uploadError, processError, onDismiss}: ErrorDisplayProps) => {
  // エラーメッセージを優先順位に従って決定
  const displayError = error || uploadError?.message || processError?.message

  // 詳細情報があるかどうかを確認
  const hasDetails = Boolean(uploadError?.details || processError?.details)
  const detailsText = uploadError?.details || processError?.details

  if (!displayError) {
    return null
  }

  return (
    <div
      className="error-display"
      style={{
        backgroundColor: "#dc3545",
        color: "#ffffff",
        padding: "12px 16px",
        borderRadius: "6px",
        marginBottom: "16px",
        position: "relative",
        fontSize: "14px",
        lineHeight: "1.4",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
        <div style={{flex: 1, paddingRight: onDismiss ? "12px" : "0"}}>
          <strong>エラー:</strong> {displayError}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: "transparent",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: "1",
              padding: "0",
              minWidth: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="エラーメッセージを閉じる"
            title="エラーメッセージを閉じる"
          >
            ×
          </button>
        )}
      </div>

      {hasDetails && (
        <details style={{marginTop: "8px"}}>
          <summary style={{cursor: "pointer", fontSize: "12px", opacity: 0.9}}>詳細情報</summary>
          <pre
            style={{
              fontSize: "11px",
              margin: "8px 0 0 0",
              whiteSpace: "pre-wrap",
              opacity: 0.8,
            }}
          >
            {String(detailsText)}
          </pre>
        </details>
      )}
    </div>
  )
})

ErrorDisplay.displayName = "ErrorDisplay"
