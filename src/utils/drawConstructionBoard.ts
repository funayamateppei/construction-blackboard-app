/**
 * 工事黒板描画関数
 * @fileoverview Canvas上に工事黒板を描画するユーティリティ関数
 */

import {formatDateTimeForDisplay} from "./helpers"
import {CONSTRUCTION_BOARD_CONFIG, FONT_CONFIG} from "../constants"
import type {DynamicField} from "../types"

/**
 * Canvas上に工事黒板を描画する
 * @param ctx - Canvas描画コンテキスト
 * @param canvasWidth - Canvasの幅
 * @param canvasHeight - Canvasの高さ
 * @param constructionName - 工事名
 * @param constructionDate - 工事日時
 * @param dynamicFields - 動的フィールドの配列
 * @description
 * 画像の右下隅に工事黒板風のテーブルを描画します。
 * 工事名と日時の両方が空の場合は描画を行いません。
 * 動的フィールドも含めて描画します。
 */
export const drawConstructionBoard = (
  ctx: CanvasRenderingContext2D | null,
  canvasWidth: number,
  canvasHeight: number,
  constructionName: string,
  constructionDate: Date | null,
  dynamicFields: DynamicField[] = [],
): void => {
  if (!ctx) return

  // 工事名と日時の両方が空の場合は描画しない
  if (!constructionName.trim() && !constructionDate) return

  // 基本の2行（工事名、日時）+ 動的フィールドの行数を計算
  const baseRows = 2
  const totalRows = baseRows + dynamicFields.length

  // フォントサイズを計算（キャンバスサイズに応じて調整）
  const fontSize = Math.max(
    FONT_CONFIG.MIN_FONT_SIZE,
    Math.min(canvasWidth / FONT_CONFIG.FONT_SIZE_RATIO, canvasHeight / FONT_CONFIG.FONT_SIZE_RATIO),
  )

  const {padding, cellPadding, backgroundGradient, borderColor, textColor} = CONSTRUCTION_BOARD_CONFIG
  const rowHeight = fontSize + 20
  const totalHeight = rowHeight * totalRows + padding * 2

  // フォント設定
  ctx.font = `${FONT_CONFIG.BOLD_WEIGHT} ${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
  const formattedDate = formatDateTimeForDisplay(constructionDate)

  // ラベル幅を計算
  const labelWorkWidth = ctx.measureText("工事名").width
  const labelDateWidth = ctx.measureText("日時").width
  const maxLabelWidth = Math.max(labelWorkWidth, labelDateWidth)
  const labelWidth = maxLabelWidth + cellPadding * 2

  // コンテンツ幅を計算
  const constructionNameWidth = constructionName ? ctx.measureText(constructionName).width : 0
  const constructionDateWidth = formattedDate ? ctx.measureText(formattedDate).width : 0
  const maxContentWidth = Math.max(constructionNameWidth, constructionDateWidth)

  const contentWidth = Math.max(maxContentWidth + cellPadding * 2, 200)
  const totalWidth = labelWidth + contentWidth + padding * 2

  // 描画位置を計算（右下隅）
  const boardX = padding
  const boardY = canvasHeight - totalHeight - padding

  // 背景のグラデーション描画
  const gradient = ctx.createLinearGradient(boardX, boardY, boardX, boardY + totalHeight)
  gradient.addColorStop(0, backgroundGradient.start)
  gradient.addColorStop(1, backgroundGradient.end)
  ctx.fillStyle = gradient
  ctx.fillRect(boardX, boardY, totalWidth, totalHeight)

  // 外枠描画
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 3
  ctx.strokeRect(boardX, boardY, totalWidth, totalHeight)

  // セル間の境界線描画
  const colX = boardX + labelWidth

  // 水平線（行の境界）
  ctx.beginPath()
  for (let i = 1; i < totalRows; i++) {
    const rowY = boardY + i * rowHeight
    ctx.moveTo(boardX, rowY)
    ctx.lineTo(boardX + totalWidth, rowY)
  }
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 2
  ctx.stroke()

  // 垂直線（列の境界）
  ctx.beginPath()
  ctx.moveTo(colX, boardY)
  ctx.lineTo(colX, boardY + totalHeight)
  ctx.strokeStyle = textColor
  ctx.lineWidth = 3
  ctx.stroke()

  // テキスト描画設定
  ctx.font = `${FONT_CONFIG.BOLD_WEIGHT} ${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
  ctx.fillStyle = textColor
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"

  // 基本フィールドを描画
  let currentRow = 0

  // 工事名（最初の行）
  const rowY1 = boardY + currentRow * rowHeight
  ctx.fillText("工事名", boardX + cellPadding, rowY1 + rowHeight / 2)
  if (constructionName) {
    ctx.font = `${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
    ctx.fillText(constructionName, colX + cellPadding, rowY1 + rowHeight / 2)
  }
  currentRow++

  // 動的フィールドを描画（工事名の後、日時の前）
  dynamicFields.forEach((field) => {
    if (field.key.trim() && field.value.trim()) {
      const rowY = boardY + currentRow * rowHeight

      // キー（ラベル）を描画
      ctx.font = `${FONT_CONFIG.BOLD_WEIGHT} ${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
      ctx.fillText(field.key, boardX + cellPadding, rowY + rowHeight / 2)

      // 値を描画
      ctx.font = `${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
      ctx.fillText(field.value, colX + cellPadding, rowY + rowHeight / 2)

      currentRow++
    }
  })

  // 日時（最後の行 - 一番下）
  const rowY2 = boardY + currentRow * rowHeight
  ctx.font = `${FONT_CONFIG.BOLD_WEIGHT} ${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
  ctx.fillText("日時", boardX + cellPadding, rowY2 + rowHeight / 2)
  if (constructionDate) {
    const formattedDate = formatDateTimeForDisplay(constructionDate)
    ctx.font = `${fontSize}px ${FONT_CONFIG.FONT_FAMILY}`
    ctx.fillText(formattedDate, colX + cellPadding, rowY2 + rowHeight / 2)
  }
}
