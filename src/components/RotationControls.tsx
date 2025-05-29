import {memo} from "react"

interface RotationControlsProps {
  rotation: number
  onRotationChange: (rotation: number) => void
}

/**
 * 回転コントロールコンポーネント
 * メモ化により、回転値が変わらない限り再レンダリングしない
 */
export const RotationControls = memo(({rotation, onRotationChange}: RotationControlsProps) => {
  return (
    <div className="rotation-controls">
      <label>回転とダウンロード:</label>
      <div className="rotation-buttons">
        <button type="button" onClick={() => onRotationChange(0)} className={rotation === 0 ? "active" : ""}>
          0° 🔄
        </button>
        <button type="button" onClick={() => onRotationChange(90)} className={rotation === 90 ? "active" : ""}>
          90° ↻
        </button>
        <button type="button" onClick={() => onRotationChange(180)} className={rotation === 180 ? "active" : ""}>
          180° ↑↓
        </button>
        <button type="button" onClick={() => onRotationChange(270)} className={rotation === 270 ? "active" : ""}>
          270° ↺
        </button>
      </div>
    </div>
  )
})

RotationControls.displayName = "RotationControls"
