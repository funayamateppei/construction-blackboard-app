/**
 * 工事日時入力コンポーネント
 * @fileoverview 工事日時を入力するための専用コンポーネント
 */

import {memo} from "react"
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
  ({ constructionDate, onConstructionDateChange, isDateFromExif }: ConstructionDateInputProps) => {
    return (
      <div className="construction-inputs">
        <div className="input-group">
          <label htmlFor="constructionDate">
            {UI_SETTINGS.LABELS.DATE}: {isDateFromExif && <span className="exif-label">(Exif情報から自動設定)</span>}
          </label>
          <input
            type="datetime-local"
            id="constructionDate"
            value={formatDateForInput(constructionDate)}
            onChange={(e) => {
              if (e.target.value) {
                onConstructionDateChange(new Date(e.target.value))
              } else {
                onConstructionDateChange(null)
              }
            }}
            disabled={isDateFromExif}
            style={{
              backgroundColor: isDateFromExif ? UI_SETTINGS.COLORS.DISABLED_BACKGROUND : UI_SETTINGS.COLORS.INPUT_BACKGROUND,
              cursor: isDateFromExif ? "not-allowed" : "text",
            }}
          />
          {isDateFromExif && <small className="exif-note">{UI_SETTINGS.LABELS.EXIF_DATE_NOTE}</small>}
        </div>
      </div>
    )
  }
)

ConstructionDateInput.displayName = "ConstructionDateInput"
