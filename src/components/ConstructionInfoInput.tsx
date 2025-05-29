/**
 * 工事情報入力コンポーネント
 * @fileoverview 工事名と動的フィールドを統合した入力コンポーネント
 */

import {memo, useState, useCallback} from "react"
import {MUI, MuiIcons} from "../ui"
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
      <MUI.Paper elevation={2} sx={{p: 3, mb: 2}}>
        <MUI.Stack spacing={2}>
          {/* 工事名入力 */}
          <MUI.TextField
            fullWidth
            required
            label="🏗️ 工事名"
            value={constructionName}
            onChange={(e) => onConstructionNameChange(e.target.value)}
            placeholder="工事名を入力してください（必須）"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <MUI.InputAdornment position="start">
                  <MuiIcons.Construction color="primary" />
                </MUI.InputAdornment>
              ),
            }}
          />

          {/* 動的フィールドリスト */}
          {dynamicFields.map((field) => (
            <MUI.Box key={field.id} sx={{ml: 2, pl: 2, borderLeft: "3px solid", borderColor: "primary.light"}}>
              <MUI.Stack direction="row" spacing={1} alignItems="center">
                <MUI.TextField
                  size="small"
                  value={field.key}
                  onChange={(e) => onUpdateField(field.id, e.target.value, field.value)}
                  placeholder="項目名"
                  variant="outlined"
                  sx={{flex: 1}}
                />
                <MUI.Typography variant="body2" color="text.secondary">
                  :
                </MUI.Typography>
                <MUI.TextField
                  size="small"
                  value={field.value}
                  onChange={(e) => onUpdateField(field.id, field.key, e.target.value)}
                  placeholder="値"
                  variant="outlined"
                  sx={{flex: 1}}
                />
                <MUI.IconButton
                  onClick={() => onRemoveField(field.id)}
                  color="error"
                  size="small"
                  aria-label={`${field.key}を削除`}
                >
                  <MuiIcons.Close />
                </MUI.IconButton>
              </MUI.Stack>
            </MUI.Box>
          ))}

          {/* 新しいフィールド追加フォーム */}
          {showAddForm && (
            <MUI.Box sx={{ml: 2, pl: 2, borderLeft: "3px solid", borderColor: "success.main", bgcolor: "success.50"}}>
              <MUI.Stack spacing={1}>
                <MUI.Stack direction="row" spacing={1} alignItems="center">
                  <MUI.TextField
                    size="small"
                    value={newKey}
                    onChange={(e) => {
                      setNewKey(e.target.value)
                      setError(null)
                    }}
                    placeholder="項目名 (例: 施工者)"
                    variant="outlined"
                    sx={{flex: 1}}
                  />
                  <MUI.Typography variant="body2" color="text.secondary">
                    :
                  </MUI.Typography>
                  <MUI.TextField
                    size="small"
                    value={newValue}
                    onChange={(e) => {
                      setNewValue(e.target.value)
                      setError(null)
                    }}
                    placeholder="内容 (例: 建設太郎)"
                    variant="outlined"
                    sx={{flex: 1}}
                  />
                  <MUI.Stack direction="row" spacing={0.5}>
                    <MUI.IconButton
                      onClick={handleAddField}
                      disabled={!newKey.trim() || !newValue.trim()}
                      color="success"
                      size="small"
                    >
                      <MuiIcons.Check />
                    </MUI.IconButton>
                    <MUI.IconButton onClick={handleCancel} color="error" size="small">
                      <MuiIcons.Close />
                    </MUI.IconButton>
                  </MUI.Stack>
                </MUI.Stack>
                {error && (
                  <MUI.Alert severity="error" sx={{mt: 1}}>
                    {error}
                  </MUI.Alert>
                )}
              </MUI.Stack>
            </MUI.Box>
          )}

          {/* プラスボタン */}
          {!showAddForm && (
            <MUI.Box sx={{textAlign: "center", mt: 1}}>
              <MUI.Button
                onClick={() => setShowAddForm(true)}
                variant="outlined"
                color="info"
                startIcon={<MuiIcons.Add />}
                sx={{borderRadius: 20}}
              >
                項目を追加
              </MUI.Button>
            </MUI.Box>
          )}
        </MUI.Stack>
      </MUI.Paper>
    )
  },
)

ConstructionInfoInput.displayName = "ConstructionInfoInput"
