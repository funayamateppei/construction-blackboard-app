import {memo} from "react"
import {formatDateForInput} from "../utils/helpers"
import {UI_SETTINGS} from "../constants"
import {MUI} from "../ui"

/**
 * 工事情報入力コンポーネントのプロパティ
 */
interface ConstructionInputsProps {
  /** 工事名 */
  constructionName: string
  /** 工事名変更時のコールバック関数 */
  onConstructionNameChange: (value: string) => void
  /** 工事日時 */
  constructionDate: Date | null
  /** 工事日時変更時のコールバック関数 */
  onConstructionDateChange: (date: Date | null) => void
  /** 日時がExif情報から自動設定されたかどうか */
  isDateFromExif: boolean
}

/**
 * 工事情報入力コンポーネント
 *
 * @description 工事名と工事日時を入力するためのフォームコンポーネント
 * Exif情報から日時が自動設定された場合は、該当フィールドを無効化し視覚的にフィードバックを提供
 * メモ化により不要な再レンダリングを防止してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - 工事情報入力フォーム
 *
 * @example
 * ```tsx
 * <ConstructionInputs
 *   constructionName={state.constructionInfo.name}
 *   onConstructionNameChange={setConstructionName}
 *   constructionDate={state.constructionInfo.date}
 *   onConstructionDateChange={setConstructionDate}
 *   isDateFromExif={state.constructionInfo.isDateFromExif}
 * />
 * ```
 */
export const ConstructionInputs = memo(
  ({
    constructionName,
    onConstructionNameChange,
    constructionDate,
    onConstructionDateChange,
    isDateFromExif,
  }: ConstructionInputsProps) => {
    return (
      <MUI.Box sx={{padding: 2}}>
        <MUI.Box sx={{marginBottom: 2}}>
          <MUI.Typography variant="h6" gutterBottom>
            {UI_SETTINGS.LABELS.CONSTRUCTION_NAME}:
          </MUI.Typography>
          <MUI.TextField
            fullWidth
            value={constructionName}
            onChange={(e) => onConstructionNameChange(e.target.value)}
            placeholder={UI_SETTINGS.PLACEHOLDERS.CONSTRUCTION_NAME}
            variant="outlined"
          />
        </MUI.Box>

        <MUI.Box>
          <MUI.Typography variant="h6" gutterBottom>
            {UI_SETTINGS.LABELS.DATE}:{" "}
            {isDateFromExif && (
              <MUI.Typography component="span" variant="body2" color="textSecondary">
                (Exif情報から自動設定)
              </MUI.Typography>
            )}
          </MUI.Typography>
          <MUI.TextField
            fullWidth
            type="datetime-local"
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
              style: {
                backgroundColor: isDateFromExif ? UI_SETTINGS.COLORS.DISABLED_BACKGROUND : UI_SETTINGS.COLORS.INPUT_BACKGROUND,
                cursor: isDateFromExif ? "not-allowed" : "text",
              },
            }}
          />
          {isDateFromExif && (
            <MUI.Typography variant="body2" color="textSecondary" sx={{marginTop: 1}}>
              {UI_SETTINGS.LABELS.EXIF_DATE_NOTE}
            </MUI.Typography>
          )}
        </MUI.Box>
      </MUI.Box>
    )
  },
)

ConstructionInputs.displayName = "ConstructionInputs"
