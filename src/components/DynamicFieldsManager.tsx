/**
 * 動的フィールド管理コンポーネント
 * @fileoverview 工事黒板に動的なkey-valueペアを追加・編集・削除するコンポーネント
 */

import {memo, useState, useCallback} from "react"
import type {DynamicField} from "../types"
import {isDuplicateKey} from "../utils/helpers"
import {MUI} from "../ui"

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
    <MUI.Box sx={{padding: 2}}>
      <MUI.Typography variant="h5" gutterBottom>
        📝 追加情報
      </MUI.Typography>

      {/* 新しいフィールド追加フォーム */}
      <MUI.Box sx={{marginBottom: 2}}>
        <MUI.Grid container spacing={2} alignItems="center">
          <MUI.Grid size={{xs: 5}}>
            <MUI.TextField
              fullWidth
              value={newKey}
              onChange={(e) => {
                setNewKey(e.target.value)
                setError(null)
              }}
              label="項目名"
              placeholder="例: 施工者, 天候"
              variant="outlined"
              error={!!error && error.includes("項目名")}
              helperText={error && error.includes("項目名") ? error : ""}
            />
          </MUI.Grid>
          <MUI.Grid size={{xs: 5}}>
            <MUI.TextField
              fullWidth
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value)
                setError(null)
              }}
              label="内容"
              placeholder="例: 建設太郎, 晴れ"
              variant="outlined"
              error={!!error && error.includes("項目の値")}
              helperText={error && error.includes("項目の値") ? error : ""}
            />
          </MUI.Grid>
          <MUI.Grid size={{xs: 2}}>
            <MUI.Button
              variant="contained"
              color="primary"
              onClick={handleAddField}
              disabled={!newKey.trim() || !newValue.trim()}
            >
              追加
            </MUI.Button>
          </MUI.Grid>
        </MUI.Grid>
        {error && !error.includes("項目名") && !error.includes("項目の値") && (
          <MUI.Typography color="error" sx={{marginTop: 1}}>
            {error}
          </MUI.Typography>
        )}
      </MUI.Box>

      {/* 既存フィールドリスト */}
      {dynamicFields.length > 0 && (
        <MUI.Box>
          <MUI.Typography variant="h6" gutterBottom>
            追加済み項目
          </MUI.Typography>
          {dynamicFields.map((field) => (
            <MUI.Grid container spacing={2} alignItems="center" key={field.id} sx={{marginBottom: 1}}>
              <MUI.Grid size={{xs: 5}}>
                <MUI.TextField
                  fullWidth
                  value={field.key}
                  onChange={(e) => onUpdateField(field.id, e.target.value, field.value)}
                  label="項目名"
                  variant="outlined"
                />
              </MUI.Grid>
              <MUI.Grid size={{xs: 5}}>
                <MUI.TextField
                  fullWidth
                  value={field.value}
                  onChange={(e) => onUpdateField(field.id, field.key, e.target.value)}
                  label="値"
                  variant="outlined"
                />
              </MUI.Grid>
              <MUI.Grid size={{xs: 2}}>
                <MUI.Button variant="outlined" color="secondary" onClick={() => onRemoveField(field.id)}>
                  削除
                </MUI.Button>
              </MUI.Grid>
            </MUI.Grid>
          ))}
        </MUI.Box>
      )}
    </MUI.Box>
  )
})

DynamicFieldsManager.displayName = "DynamicFieldsManager"

export {DynamicFieldsManager}
