import {formatDateTimeForDisplay} from "./helpers"

export const drawConstructionBoard = (
  ctx: CanvasRenderingContext2D | null,
  canvasWidth: number,
  canvasHeight: number,
  constructionName: string,
  constructionDate: Date | null,
) => {
  if (!ctx) return

  if (!constructionName.trim() && !constructionDate) return

  const fontSize = Math.max(18, Math.min(canvasWidth / 25, canvasHeight / 25))
  const padding = 20
  const cellPadding = 12
  const rowHeight = fontSize + 20
  const totalHeight = rowHeight * 2 + padding * 2

  ctx.font = `bold ${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
  const formattedDate = formatDateTimeForDisplay(constructionDate)

  const labelWorkWidth = ctx.measureText("工事名").width
  const labelDateWidth = ctx.measureText("日時").width
  const maxLabelWidth = Math.max(labelWorkWidth, labelDateWidth)
  const labelWidth = maxLabelWidth + cellPadding * 2

  const constructionNameWidth = constructionName ? ctx.measureText(constructionName).width : 0
  const constructionDateWidth = formattedDate ? ctx.measureText(formattedDate).width : 0
  const maxContentWidth = Math.max(constructionNameWidth, constructionDateWidth)

  const contentWidth = Math.max(maxContentWidth + cellPadding * 2, 200)
  const totalWidth = labelWidth + contentWidth + padding * 2

  const boardX = padding
  const boardY = canvasHeight - totalHeight - padding

  const gradient = ctx.createLinearGradient(boardX, boardY, boardX, boardY + totalHeight)
  gradient.addColorStop(0, "#2d5a3d")
  gradient.addColorStop(1, "#4a7c59")
  ctx.fillStyle = gradient
  ctx.fillRect(boardX, boardY, totalWidth, totalHeight)

  ctx.strokeStyle = "#1a3b26"
  ctx.lineWidth = 3
  ctx.strokeRect(boardX, boardY, totalWidth, totalHeight)

  const rowY1 = boardY
  const rowY2 = rowY1 + rowHeight
  const colX = boardX + labelWidth

  ctx.beginPath()
  ctx.moveTo(boardX, rowY2)
  ctx.lineTo(boardX + totalWidth, rowY2)
  ctx.strokeStyle = "#1a3b26"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(colX, boardY)
  ctx.lineTo(colX, boardY + totalHeight)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.font = `bold ${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"

  ctx.fillText("工事名", boardX + cellPadding, rowY1 + rowHeight / 2)
  if (constructionName) {
    ctx.font = `${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
    ctx.fillText(constructionName, colX + cellPadding, rowY1 + rowHeight / 2)
  }

  ctx.fillText("日時", boardX + cellPadding, rowY2 + rowHeight / 2)
  if (constructionDate) {
    ctx.fillText(formattedDate, colX + cellPadding, rowY2 + rowHeight / 2)
  }
}
