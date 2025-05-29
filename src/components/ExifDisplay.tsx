import {memo} from "react"
import {MUI} from "../ui"
import {UI_SETTINGS} from "../constants"

/**
 * Exif情報表示コンポーネントのプロパティ
 */
interface ExifDisplayProps {
  /** 表示用にフォーマットされたExif情報文字列 */
  exifData: string
}

/**
 * Exif情報表示コンポーネント
 *
 * @description アップロードされた画像から読み取ったExif情報を整形して表示するコンポーネント
 * 情報がない場合は適切なメッセージを表示
 * メモ化により、Exifデータが変わらない限り再レンダリングを回避してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - Exif情報表示コンポーネント
 *
 * @example
 * ```tsx
 * <ExifDisplay exifData={state.exifDetails.displayString} />
 * ```
 */
export const ExifDisplay = memo(({exifData}: ExifDisplayProps) => {
  return (
    <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
      <MUI.Stack spacing={2}>
        <MUI.Typography variant="h6" color="text.primary" sx={{fontWeight: 700}}>
          {UI_SETTINGS.LABELS.EXIF_INFO}
        </MUI.Typography>
        <MUI.Box
          sx={{
            bgcolor: "grey.100",
            borderRadius: 1,
            p: 2,
            fontFamily: "monospace",
            fontSize: 14,
            whiteSpace: "pre-wrap",
            minHeight: 64,
            maxHeight: 500,
            overflowY: "auto",
          }}
        >
          {exifData || UI_SETTINGS.PLACEHOLDERS.NO_EXIF_DATA}
        </MUI.Box>
      </MUI.Stack>
    </MUI.Paper>
  )
})
