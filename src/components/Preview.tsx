import {memo, useCallback} from "react"
import {UI_SETTINGS, FILE_CONFIG} from "../constants"
import {MUI, MuiIcons} from "../ui"

/**
 * プレビューコンポーネントのプロパティ
 */
interface PreviewProps {
  /** 処理済み画像のデータURL */
  processedImage: string | null
}

/**
 * プレビューとダウンロードコンポーネント
 *
 * @description 工事黒板付きの最終画像を表示し、ダウンロード機能を提供するコンポーネント
 * 画像がない場合は適切なプレースホルダーメッセージを表示
 * メモ化により、必要な時だけ再レンダリングしてパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - 最終画像プレビューとダウンロードボタンを含むコンポーネント
 *
 * @example
 * ```tsx
 * <Preview processedImage={state.processedImage} />
 * ```
 */
export const Preview = memo(({processedImage}: PreviewProps) => {
  /**
   * 画像ダウンロード処理
   *
   * @description 処理済み画像をJPEGファイルとしてダウンロードする
   * デフォルトのファイル名は設定から取得
   */
  const handleDownload = useCallback(() => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = FILE_CONFIG.DEFAULT_DOWNLOAD_FILENAME
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [processedImage])

  return (
    <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
      <MUI.Stack spacing={2} alignItems="center">
        <MUI.Typography variant="h6" color="text.primary" sx={{fontWeight: 700}}>
          {UI_SETTINGS.LABELS.PROCESSED_IMAGE}
        </MUI.Typography>
        {processedImage ? (
          <>
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
              <img
                src={processedImage}
                alt={UI_SETTINGS.ALT_TEXTS.PROCESSED_IMAGE}
                style={{width: "100%", height: "auto", objectFit: "contain"}}
              />
            </MUI.Box>
            <MUI.Button
              onClick={handleDownload}
              variant="contained"
              color="success"
              startIcon={<MuiIcons.Download />}
              sx={{mt: 2, borderRadius: 20, fontWeight: 700}}
            >
              {UI_SETTINGS.LABELS.DOWNLOAD_BUTTON}
            </MUI.Button>
          </>
        ) : (
          <MUI.Typography variant="body2" color="text.secondary">
            {UI_SETTINGS.PLACEHOLDERS.PROCESSED_IMAGE}
          </MUI.Typography>
        )}
      </MUI.Stack>
    </MUI.Paper>
  )
})
