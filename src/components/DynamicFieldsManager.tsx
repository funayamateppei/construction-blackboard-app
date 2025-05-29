/**
 * 動的フィールド管理コンポーネント
 * @fileoverview 工事黒板に動的なkey-valueペアを追加・編集・削除するコンポーネント
 */

import {memo, useState, useCallback} from "react"
import type {DynamicField} from "../types"
import {isDuplicateKey} from "../utils/helpers"

/**
 * 動的フィールド管理コンポーネントのプロパティ
 */
interface DynamicFieldsManagerProps {
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
 * 動的フィールド管理コンポーネント
 */
const DynamicFieldsManager = memo(({dynamicFields, onAddField, onUpdateField, onRemoveField}: DynamicFieldsManagerProps) => {
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
  }, [newKey, newValue, dynamicFields, onAddField])

  return (
    <div className="dynamic-fields-manager">
      <h3>📝 追加情報</h3>

      {/* 新しいフィールド追加フォーム */}
      <div className="add-form">
        <div className="input-row">
          <input
            type="text"
            value={newKey}
            onChange={(e) => {
              setNewKey(e.target.value)
              setError(null)
            }}
            placeholder="項目名 (例: 施工者, 天候)"
            className="key-input"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value)
              setError(null)
            }}
            placeholder="内容 (例: 建設太郎, 晴れ)"
            className="value-input"
          />
          <button onClick={handleAddField} disabled={!newKey.trim() || !newValue.trim()} className="add-button">
            追加
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* 既存フィールドリスト */}
      {dynamicFields.length > 0 && (
        <div className="fields-list">
          <h4>追加済み項目</h4>
          {dynamicFields.map((field) => (
            <div key={field.id} className="field-item">
              <input
                type="text"
                value={field.key}
                onChange={(e) => onUpdateField(field.id, e.target.value, field.value)}
                placeholder="項目名"
                className="field-key"
              />
              <span className="separator">:</span>
              <input
                type="text"
                value={field.value}
                onChange={(e) => onUpdateField(field.id, field.key, e.target.value)}
                placeholder="値"
                className="field-value"
              />
              <button onClick={() => onRemoveField(field.id)} className="remove-button" aria-label={`${field.key}を削除`}>
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

DynamicFieldsManager.displayName = "DynamicFieldsManager"

export {DynamicFieldsManager}
