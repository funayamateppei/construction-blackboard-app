import {memo} from "react"
import {MUI, MuiIcons} from "../ui"
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
    <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
      <MUI.Stack spacing={2} alignItems="center">
        <MUI.Typography variant="h6" color="text.primary" sx={{fontWeight: 700}}>
          {UI_SETTINGS.LABELS.ORIGINAL_IMAGE}
        </MUI.Typography>
        {src ? (
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
                src={src}
                alt={UI_SETTINGS.ALT_TEXTS.ORIGINAL_IMAGE}
                style={{width: "100%", height: "100%", objectFit: "contain"}}
              />
            </MUI.Box>
            {type && (
              <MUI.Chip
                icon={<MuiIcons.Image />}
                label={`${UI_SETTINGS.LABELS.IMAGE_TYPE}: ${type.split("/")[1].toUpperCase()}`}
                color="primary"
                size="small"
                sx={{mt: 1}}
              />
            )}
          </>
        ) : (
          <MUI.Typography variant="body2" color="text.secondary">
            {UI_SETTINGS.PLACEHOLDERS.NO_IMAGE_SELECTED}
          </MUI.Typography>
        )}
      </MUI.Stack>
    </MUI.Paper>
  )
})
