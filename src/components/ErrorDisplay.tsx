import {memo} from "react"
import type {AppError} from "../types"
import {MUI, MuiIcons} from "../ui"

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
    <MUI.Alert
      severity="error"
      sx={{mb: 2, fontSize: 14, alignItems: "flex-start"}}
      action={
        onDismiss && (
          <MUI.IconButton
            onClick={onDismiss}
            color="inherit"
            size="small"
            aria-label="エラーメッセージを閉じる"
            title="エラーメッセージを閉じる"
          >
            <MuiIcons.Close fontSize="inherit" />
          </MUI.IconButton>
        )
      }
    >
      <MUI.Typography component="span" fontWeight={700} sx={{mr: 1}}>
        エラー:
      </MUI.Typography>
      {displayError}
      {hasDetails && (
        <MUI.Accordion sx={{mt: 1, bgcolor: "error.50"}}>
          <MUI.AccordionSummary expandIcon={<MuiIcons.ExpandMore />}>
            <MUI.Typography fontSize={13} color="error.main">
              詳細情報
            </MUI.Typography>
          </MUI.AccordionSummary>
          <MUI.AccordionDetails>
            <MUI.Box component="pre" sx={{fontSize: 12, whiteSpace: "pre-wrap", opacity: 0.8, m: 0}}>
              {String(detailsText)}
            </MUI.Box>
          </MUI.AccordionDetails>
        </MUI.Accordion>
      )}
    </MUI.Alert>
  )
})

ErrorDisplay.displayName = "ErrorDisplay"
