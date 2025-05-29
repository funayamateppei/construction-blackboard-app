/**
 * 工事情報入力コンポーネント
 * @fileoverview 工事名と動的フィールドを統合した入力コンポーネント
 */

import {memo, useState, useCallback} from "react"
import type {DynamicField} from "../types"
import {isDuplicateKey} from "../utils/helpers"

/**
 * 工事情報入力コンポーネントのプロパティ
 */
interface ConstructionInfoInputProps {
  /** 工事名 */
  constructionName: string
  /** 工事名変更時のコールバック関数 */
  onConstructionNameChange: (name: string) => void
  /** 動的フィールドの配列 */
  dynamicFields: DynamicField[]
  /** フィールド追加時のコールバック関数 */
  onAddField: (key: string, value: string) => void
  /** フィールド更新時のコールバック関数 */
  onUpdateField: (id: string, key: string, value: string) => void
  /** フィールド削除時のコールバック関数 */
  onRemoveField: (id: string) => void
}

/**
 * 工事情報入力コンポーネント
 */
export const ConstructionInfoInput = memo(
  ({
    constructionName,
    onConstructionNameChange,
    dynamicFields,
    onAddField,
    onUpdateField,
    onRemoveField,
  }: ConstructionInfoInputProps) => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [newKey, setNewKey] = useState("")
    const [newValue, setNewValue] = useState("")
    const [error, setError] = useState<string | null>(null)

    /**
     * 新しいフィールドを追加する
     */
    const handleAddField = useCallback(() => {
      // バリデーション
      if (!newKey.trim()) {
        setError("項目名は必須です")
        return
      }

      if (!newValue.trim()) {
        setError("項目の値は必須です")
        return
      }

      if (isDuplicateKey(dynamicFields, newKey)) {
        setError("この項目名は既に存在します")
        return
      }

      // フィールドを追加
      onAddField(newKey.trim(), newValue.trim())

      // フォームをリセット
      setNewKey("")
      setNewValue("")
      setError(null)
      setShowAddForm(false)
    }, [newKey, newValue, dynamicFields, onAddField])

    /**
     * 追加フォームをキャンセル
     */
    const handleCancel = useCallback(() => {
      setNewKey("")
      setNewValue("")
      setError(null)
      setShowAddForm(false)
    }, [])

    return (
      <div className="construction-info-input">
        {/* 工事名入力 */}
        <div className="input-group">
          <label htmlFor="constructionName">🏗️ 工事名 *</label>
          <input
            id="constructionName"
            type="text"
            value={constructionName}
            onChange={(e) => onConstructionNameChange(e.target.value)}
            placeholder="工事名を入力してください（必須）"
            required
            className="input-field"
          />
        </div>

        {/* 動的フィールドリスト */}
        {dynamicFields.map((field) => (
          <div key={field.id} className="input-group dynamic-field">
            <div className="field-inputs">
              <input
                type="text"
                value={field.key}
                onChange={(e) => onUpdateField(field.id, e.target.value, field.value)}
                placeholder="項目名"
                className="field-key-input"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => onUpdateField(field.id, field.key, e.target.value)}
                placeholder="値"
                className="field-value-input"
              />
              <button onClick={() => onRemoveField(field.id)} className="remove-button" aria-label={`${field.key}を削除`}>
                ✕
              </button>
            </div>
          </div>
        ))}

        {/* 新しいフィールド追加フォーム */}
        {showAddForm && (
          <div className="input-group add-field-form">
            <div className="field-inputs">
              <input
                type="text"
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value)
                  setError(null)
                }}
                placeholder="項目名 (例: 施工者)"
                className="field-key-input"
              />
              <input
                type="text"
                value={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value)
                  setError(null)
                }}
                placeholder="内容 (例: 建設太郎)"
                className="field-value-input"
              />
              <div className="form-buttons">
                <button onClick={handleAddField} disabled={!newKey.trim() || !newValue.trim()} className="add-button">
                  ✓
                </button>
                <button onClick={handleCancel} className="cancel-button">
                  ✕
                </button>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {/* プラスボタン */}
        {!showAddForm && (
          <div className="add-field-trigger">
            <button onClick={() => setShowAddForm(true)} className="plus-button">
              ➕ 項目を追加
            </button>
          </div>
        )}
      </div>
    )
  },
)

ConstructionInfoInput.displayName = "ConstructionInfoInput"
