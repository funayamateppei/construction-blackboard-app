import {memo} from "react"
import {formatDateForInput} from "../utils/helpers"

interface ConstructionInputsProps {
  constructionName: string
  onConstructionNameChange: (value: string) => void
  constructionDate: Date | null
  onConstructionDateChange: (date: Date | null) => void
  isDateFromExif: boolean
}

/**
 * 工事情報入力コンポーネント
 * メモ化により不要な再レンダリングを防止
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
      <div className="construction-inputs">
        <div className="input-group">
          <label htmlFor="constructionName">工事名:</label>
          <input
            type="text"
            id="constructionName"
            value={constructionName}
            onChange={(e) => onConstructionNameChange(e.target.value)}
            placeholder="例: 道路舗装工事"
          />
        </div>

        <div className="input-group">
          <label htmlFor="constructionDate">
            日時: {isDateFromExif && <span className="exif-label">(Exif情報から自動設定)</span>}
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
              backgroundColor: isDateFromExif ? "#f0f0f0" : "white",
              cursor: isDateFromExif ? "not-allowed" : "text",
            }}
          />
          {isDateFromExif && <small className="exif-note">※ 撮影日時がExif情報から自動で設定されています</small>}
        </div>
      </div>
    )
  },
)

ConstructionInputs.displayName = "ConstructionInputs"
