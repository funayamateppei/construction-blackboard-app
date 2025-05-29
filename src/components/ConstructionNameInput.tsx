/**
 * 工事名入力コンポーネント
 * @fileoverview 工事名を入力するための専用コンポーネント
 */

import {memo} from "react"
import {UI_SETTINGS} from "../constants"

/**
 * 工事名入力コンポーネントのプロパティ
 */
interface ConstructionNameInputProps {
  /** 工事名 */
  constructionName: string
  /** 工事名変更時のコールバック関数 */
  onConstructionNameChange: (value: string) => void
}

/**
 * 工事名入力コンポーネント
 *
 * @description 工事名を入力するための専用フォームコンポーネント
 * メモ化により不要な再レンダリングを防止してパフォーマンスを最適化
 *
 * @param props - コンポーネントのプロパティ
 * @returns JSX.Element - 工事名入力フォーム
 *
 * @example
 * ```tsx
 * <ConstructionNameInput
 *   constructionName={state.constructionInfo.name}
 *   onConstructionNameChange={setConstructionName}
 * />
 * ```
 */
export const ConstructionNameInput = memo(({constructionName, onConstructionNameChange}: ConstructionNameInputProps) => {
  return (
    <div className="construction-inputs">
      <div className="input-group">
        <label htmlFor="constructionName">{UI_SETTINGS.LABELS.CONSTRUCTION_NAME}:</label>
        <input
          type="text"
          id="constructionName"
          value={constructionName}
          onChange={(e) => onConstructionNameChange(e.target.value)}
          placeholder={UI_SETTINGS.PLACEHOLDERS.CONSTRUCTION_NAME}
        />
      </div>
    </div>
  )
})

ConstructionNameInput.displayName = "ConstructionNameInput"
