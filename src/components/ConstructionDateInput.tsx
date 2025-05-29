/**
 * 工事日時入力コンポーネント
 * @fileoverview 工事日時を入力するための専用コンポーネント
 */

import {memo} from "react"
import {MUI, MuiIcons} from "../ui"
import {formatDateForInput} from "../utils/helpers"
import {UI_SETTINGS} from "../constants"

/**
 * 工事日時入力コンポーネントのプロパティ
 */
interface ConstructionDateInputProps {
  /** 工事日時 */
  constructionDate: Date | null
  /** 工事日時変更時のコールバック関数 */
  onConstructionDateChange: (date: Date | null) => void
  /** 日時がExif情報から自動設定されたかどうか */
  isDateFromExif: boolean
}

/**
 * 工事日時入力コンポーネント
 *
 * @description 工事日時を入力するための専用フォームコンポーネント
 * Exif情報から日時が自動設定された場合は、該当フィールドを無効化し視覚的にフィードバックを提供
 * メモ化により不要な再レンダリングを防止してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - 工事日時入力フォーム
 *
 * @example
 * ```tsx
 * <ConstructionDateInput
 *   constructionDate={state.constructionInfo.date}
 *   onConstructionDateChange={setConstructionDate}
 *   isDateFromExif={state.constructionInfo.isDateFromExif}
 * />
 * ```
 */
export const ConstructionDateInput = memo(
  ({constructionDate, onConstructionDateChange, isDateFromExif}: ConstructionDateInputProps) => {
    return (
      <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
        <MUI.Stack spacing={2}>
          <MUI.TextField
            fullWidth
            type="datetime-local"
            label={UI_SETTINGS.LABELS.DATE}
            value={formatDateForInput(constructionDate)}
            onChange={(e) => {
              if (e.target.value) {
                onConstructionDateChange(new Date(e.target.value))
              } else {
                onConstructionDateChange(null)
              }
            }}
            disabled={isDateFromExif}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <MUI.InputAdornment position="start">
                  <MuiIcons.DateRange color={isDateFromExif ? "disabled" : "primary"} />
                </MUI.InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-input:disabled": {
                backgroundColor: isDateFromExif ? "action.disabledBackground" : "background.paper",
                cursor: isDateFromExif ? "not-allowed" : "text",
              },
            }}
          />

          {isDateFromExif && (
            <MUI.Alert severity="info" icon={<MuiIcons.Camera />} sx={{mt: 1}}>
              <MUI.AlertTitle>📷 Exif情報から自動設定</MUI.AlertTitle>
              {UI_SETTINGS.LABELS.EXIF_DATE_NOTE}
            </MUI.Alert>
          )}
        </MUI.Stack>
      </MUI.Paper>
    )
  },
)

ConstructionDateInput.displayName = "ConstructionDateInput"
