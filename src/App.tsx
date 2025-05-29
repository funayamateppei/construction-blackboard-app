import {useState, useRef, useEffect, useCallback} from "react"
import type {ChangeEvent} from "react"
import piexif from "piexifjs"
import "./App.css"

// コンポーネントのインポート
import {FileUpload, ConstructionInputs, ImagePreview, ExifDisplay, CanvasPreview, RotatedPreview} from "./components"

// ヘルパー関数のインポート
import {hasMeaningfulExif, formatDateTimeForDisplay, extractDateTimeFromExif} from "./utils/helpers"

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [originalImageType, setOriginalImageType] = useState<string | null>(null)
  // originalExifObj の型を IExifElement | null に変更
  const [originalExifObj, setOriginalExifObj] = useState<piexif.ExifDict | null>(null)
  const [originalExifStr, setOriginalExifStr] = useState<string>("")
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [rotatedPreviewImage, setRotatedPreviewImage] = useState<string | null>(null) // 回転プレビュー用画像

  // 工事黒板の情報
  const [constructionName, setConstructionName] = useState<string>("")
  const [constructionDate, setConstructionDate] = useState<Date | null>(null)
  const [isDateFromExif, setIsDateFromExif] = useState<boolean>(false) // Exif情報から日時が設定されているかのフラグ
  const [downloadRotation, setDownloadRotation] = useState<number>(0) // ダウンロード用回転角度（0, 90, 180, 270度）

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageLoaderRef = useRef<HTMLImageElement>(null)

  const resetState = () => {
    setOriginalImage(null)
    setOriginalImageType(null)
    setOriginalExifObj(null)
    setOriginalExifStr("")
    setProcessedImage(null)
    setRotatedPreviewImage(null)
    setConstructionName("")
    setConstructionDate(null)
    setIsDateFromExif(false)
    setDownloadRotation(0)
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  // プレビュー用の回転画像を生成する関数
  const generateRotatedPreview = useCallback((imageDataUrl: string, rotation: number) => {
    if (rotation === 0) {
      setRotatedPreviewImage(imageDataUrl)
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // 回転に基づいてCanvasのサイズを決定
      let canvasWidth = img.width
      let canvasHeight = img.height

      // 90度または270度回転の場合、幅と高さを入れ替える
      if (rotation === 90 || rotation === 270) {
        canvasWidth = img.height
        canvasHeight = img.width
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // 回転に基づいて画像を適切に変換して描画
      ctx.save()

      switch (rotation) {
        case 90:
          // 時計回りに90度回転
          ctx.translate(canvasWidth, 0)
          ctx.rotate(Math.PI / 2)
          break
        case 180:
          // 180度回転
          ctx.translate(canvasWidth, canvasHeight)
          ctx.rotate(Math.PI)
          break
        case 270:
          // 反時計回りに90度回転（時計回りに270度）
          ctx.translate(0, canvasHeight)
          ctx.rotate(-Math.PI / 2)
          break
      }

      ctx.drawImage(img, 0, 0, img.width, img.height)
      ctx.restore()

      // 回転した画像をプレビュー用に設定
      const rotatedImageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setRotatedPreviewImage(rotatedImageDataUrl)
    }
    img.src = imageDataUrl
  }, [])

  // 回転角度が変更された時にプレビューを更新
  useEffect(() => {
    if (processedImage) {
      generateRotatedPreview(processedImage, downloadRotation)
    }
  }, [processedImage, downloadRotation, generateRotatedPreview])

  // 工事黒板を描画する関数（緑の背景でテーブル風）
  const drawConstructionBoard = useCallback(
    (ctx: CanvasRenderingContext2D | null, canvasWidth: number, canvasHeight: number) => {
      if (!ctx) return

      // 工事名と日時が両方とも空の場合は描画しない（どちらか一つでも入力されていれば描画する）
      if (!constructionName.trim() && !constructionDate) return

      // フォントサイズを画像サイズに応じて調整
      const fontSize = Math.max(18, Math.min(canvasWidth / 25, canvasHeight / 25))

      // 工事黒板のスタイル設定
      const padding = 20
      const cellPadding = 12
      const rowHeight = fontSize + 20
      const totalHeight = rowHeight * 2 + padding * 2

      // テキスト測定用の設定
      ctx.font = `bold ${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
      const formattedDate = formatDateTimeForDisplay(constructionDate)

      // ラベルの幅を測定
      const labelFont = `bold ${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
      ctx.font = labelFont
      const labelWorkWidth = ctx.measureText("工事名").width
      const labelDateWidth = ctx.measureText("日時").width
      const maxLabelWidth = Math.max(labelWorkWidth, labelDateWidth)
      const labelWidth = maxLabelWidth + cellPadding * 2 // パディングを考慮

      // コンテンツの幅を測定
      const contentFontStyle = `${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
      ctx.font = contentFontStyle
      const constructionNameWidth = constructionName ? ctx.measureText(constructionName).width : 0
      const constructionDateWidth = formattedDate ? ctx.measureText(formattedDate).width : 0
      const maxContentWidth = Math.max(constructionNameWidth, constructionDateWidth)

      const contentWidth = Math.max(maxContentWidth + cellPadding * 2, 200)
      const totalWidth = labelWidth + contentWidth + padding * 2

      // 左下に配置
      const boardX = padding
      const boardY = canvasHeight - totalHeight - padding

      // 工事黒板のメインボード（緑の背景）
      const gradient = ctx.createLinearGradient(boardX, boardY, boardX, boardY + totalHeight)
      gradient.addColorStop(0, "#2d5a3d") // 濃い緑
      gradient.addColorStop(1, "#4a7c59") // 明るい緑
      ctx.fillStyle = gradient
      ctx.fillRect(boardX, boardY, totalWidth, totalHeight)

      // 黒い枠線を描画
      ctx.strokeStyle = "#1a3b26"
      ctx.lineWidth = 3
      ctx.strokeRect(boardX, boardY, totalWidth, totalHeight)

      // テーブルのセル区切り線
      const rowY1 = boardY
      const rowY2 = rowY1 + rowHeight
      const colX = boardX + labelWidth

      // 横線
      ctx.beginPath()
      ctx.moveTo(boardX, rowY2)
      ctx.lineTo(boardX + totalWidth, rowY2)
      ctx.strokeStyle = "#1a3b26"
      ctx.lineWidth = 2
      ctx.stroke()

      // 縦線（濃い緑）
      ctx.beginPath()
      ctx.moveTo(colX, boardY)
      ctx.lineTo(colX, boardY + totalHeight)
      ctx.strokeStyle = "#1a3b26"
      ctx.lineWidth = 2
      ctx.stroke()

      // 白い縦線（キーとバリューの間）
      ctx.beginPath()
      ctx.moveTo(colX, boardY)
      ctx.lineTo(colX, boardY + totalHeight)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // ラベル部分のスタイル設定
      ctx.font = `bold ${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      // 工事名ラベルと内容
      ctx.fillText("工事名", boardX + cellPadding, rowY1 + rowHeight / 2)
      if (constructionName) {
        ctx.font = contentFontStyle
        ctx.textAlign = "left"
        ctx.fillText(constructionName, colX + cellPadding, rowY1 + rowHeight / 2)
      }

      // 日時ラベルと内容
      ctx.font = `bold ${fontSize}px "MS Gothic", "Hiragino Sans", sans-serif`
      ctx.textAlign = "left"
      ctx.fillText("日時", boardX + cellPadding, rowY2 + rowHeight / 2)
      if (constructionDate) {
        ctx.font = contentFontStyle
        ctx.textAlign = "left"
        ctx.fillText(formattedDate, colX + cellPadding, rowY2 + rowHeight / 2)
      }
    },
    [constructionName, constructionDate],
  )

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    resetState()
    const file = event.target.files?.[0]

    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setOriginalImageType(file.type)
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setOriginalImage(dataUrl)

          if (file.type === "image/jpeg") {
            try {
              const exifObject = piexif.load(dataUrl) // exifObject は piexif.ExifDict 型
              if (hasMeaningfulExif(exifObject)) {
                setOriginalExifObj(exifObject)

                // Exif情報から撮影日時を取得して自動設定
                const exifDateTime = extractDateTimeFromExif(exifObject)
                if (exifDateTime) {
                  setConstructionDate(exifDateTime)
                  setIsDateFromExif(true)
                } else {
                  setIsDateFromExif(false)
                }

                let exifDetails = "--- JPEG EXIF Data ---\n"
                if (exifObject["0th"]) exifDetails += "0th IFD:\n" + JSON.stringify(exifObject["0th"], null, 2) + "\n\n"
                if (exifObject["Exif"]) exifDetails += "Exif IFD:\n" + JSON.stringify(exifObject["Exif"], null, 2) + "\n\n"
                if (exifObject["GPS"]) exifDetails += "GPS IFD:\n" + JSON.stringify(exifObject["GPS"], null, 2) + "\n\n"
                if (exifObject["Interop"])
                  exifDetails += "Interop IFD:\n" + JSON.stringify(exifObject["Interop"], null, 2) + "\n\n"
                if (exifObject["1st"]) exifDetails += "1st IFD:\n" + JSON.stringify(exifObject["1st"], null, 2) + "\n\n"

                if (exifObject.thumbnail) {
                  let thumbLength = 0
                  try {
                    if (typeof exifObject.thumbnail === "string") {
                      thumbLength = exifObject.thumbnail.length
                    } else if (
                      exifObject.thumbnail &&
                      typeof (exifObject.thumbnail as unknown as {length: number}).length === "number"
                    ) {
                      thumbLength = (exifObject.thumbnail as unknown as {length: number}).length
                    }
                  } catch {
                    thumbLength = 0
                  }
                  exifDetails += "Thumbnail: Present (length " + thumbLength + ")\n"
                } else {
                  exifDetails += "Thumbnail: Not present\n"
                }
                setOriginalExifStr(exifDetails)
              } else {
                setOriginalExifStr("No meaningful EXIF data found in this JPEG.")
                setOriginalExifObj(null)
                setIsDateFromExif(false)
              }
            } catch (error) {
              console.error("Failed to load EXIF data from JPEG:", error)
              setOriginalExifStr(
                "EXIF data could not be loaded from this JPEG. It might be corrupted or not a standard JPEG EXIF format.",
              )
              setOriginalExifObj(null)
              setIsDateFromExif(false)
            }
          } else if (file.type === "image/png") {
            setOriginalExifStr(
              "PNG image selected. PNGs typically do not use EXIF data in the same way as JPEGs. No EXIF data will be extracted or copied using piexifjs.",
            )
            setOriginalExifObj(null)
            setIsDateFromExif(false)
          }
        }
        reader.readAsDataURL(file)
      } else {
        alert("JPEG (.jpg, .jpeg) または PNG (.png) 画像を選択してください。")
        event.target.value = ""
      }
    }
  }

  useEffect(() => {
    if (originalImage && canvasRef.current && imageLoaderRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const imgLoader = imageLoaderRef.current

      imgLoader.onload = () => {
        // プレビューでは回転なしで表示
        canvas.width = imgLoader.naturalWidth
        canvas.height = imgLoader.naturalHeight

        if (ctx) {
          ctx.drawImage(imgLoader, 0, 0, imgLoader.naturalWidth, imgLoader.naturalHeight)

          // 工事黒板の文字を描画
          drawConstructionBoard(ctx, canvas.width, canvas.height)
        }

        console.log("Image drawn to canvas")
      }
      imgLoader.onerror = (e) => {
        console.error("Error loading image into imageLoader for canvas drawing:", e)
      }
      imgLoader.src = originalImage
    } else if (!originalImage && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [originalImage, constructionName, constructionDate, drawConstructionBoard])

  const handleProcessImage = () => {
    if (!originalImage || !canvasRef.current || !canvasRef.current.getContext("2d")) {
      alert("まず画像をアップロードして、Canvasに描画されるのをお待ちください。")
      return
    }
    if (canvasRef.current.width === 0 || canvasRef.current.height === 0) {
      alert("Canvasに画像が描画されていません。画像が正しくロードされたか確認してください。")
      return
    }

    const canvas = canvasRef.current
    const newImageDataUrl = canvas.toDataURL("image/jpeg", 0.9)

    if (originalExifObj && originalImageType === "image/jpeg" && hasMeaningfulExif(originalExifObj)) {
      try {
        const exifBytes = piexif.dump(originalExifObj)
        const imageWithExifDataUrl = piexif.insert(exifBytes, newImageDataUrl)
        setProcessedImage(imageWithExifDataUrl)
        generateRotatedPreview(imageWithExifDataUrl, downloadRotation) // プレビューも生成
        alert("工事黒板付きJPEG画像を生成しました！元のExif情報も付与されています。")
      } catch (error) {
        console.error("Failed to insert EXIF data:", error)
        setProcessedImage(newImageDataUrl)
        generateRotatedPreview(newImageDataUrl, downloadRotation) // プレビューも生成
        alert("工事黒板付きJPEG画像を生成しました。ただし、Exif情報の付与に失敗しました。")
      }
    } else {
      setProcessedImage(newImageDataUrl)
      generateRotatedPreview(newImageDataUrl, downloadRotation) // プレビューも生成
      if (originalImageType === "image/png") {
        alert("工事黒板付きJPEG画像を生成しました。元画像がPNGのため、Exif情報は付与されませんでした。")
      } else if (originalImageType === "image/jpeg" && !hasMeaningfulExif(originalExifObj)) {
        alert(
          "工事黒板付きJPEG画像を生成しました。元画像にコピー可能なExif情報が見つからなかったため、Exif情報は付与されませんでした。",
        )
      } else {
        alert("工事黒板付きJPEG画像を生成しました。")
      }
    }
  }

  // 生成された画像を回転させてダウンロードする関数
  const handleRotatedDownload = useCallback(() => {
    if (!processedImage) return

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // 回転に基づいてCanvasのサイズを決定
      let canvasWidth = img.width
      let canvasHeight = img.height

      // 90度または270度回転の場合、幅と高さを入れ替える
      if (downloadRotation === 90 || downloadRotation === 270) {
        canvasWidth = img.height
        canvasHeight = img.width
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // 回転に基づいて画像を適切に変換して描画
      ctx.save()

      switch (downloadRotation) {
        case 0:
          // 回転なし
          break
        case 90:
          // 時計回りに90度回転
          ctx.translate(canvasWidth, 0)
          ctx.rotate(Math.PI / 2)
          break
        case 180:
          // 180度回転
          ctx.translate(canvasWidth, canvasHeight)
          ctx.rotate(Math.PI)
          break
        case 270:
          // 反時計回りに90度回転（時計回りに270度）
          ctx.translate(0, canvasHeight)
          ctx.rotate(-Math.PI / 2)
          break
      }

      ctx.drawImage(img, 0, 0, img.width, img.height)
      ctx.restore()

      // 回転した画像をダウンロード
      const rotatedImageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      const link = document.createElement("a")
      link.href = rotatedImageDataUrl
      link.download = `construction_board_image_${downloadRotation}deg.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    img.src = processedImage
  }, [processedImage, downloadRotation])

  return (
    <div className="App">
      <header className="App-header">
        <h1>工事黒板アプリ - 画像に工事情報を追加 📋✨</h1>
      </header>
      <main>
        <section className="controls">
          <FileUpload onImageUpload={handleImageUpload} hasImage={!!originalImage} />

          {originalImage && (
            <>
              <ConstructionInputs
                constructionName={constructionName}
                onConstructionNameChange={setConstructionName}
                constructionDate={constructionDate}
                onConstructionDateChange={setConstructionDate}
                isDateFromExif={isDateFromExif}
              />

              <button onClick={handleProcessImage} disabled={!originalImage}>
                工事黒板付きJPEG画像を生成 (Exif付与)
              </button>
            </>
          )}
        </section>

        <img ref={imageLoaderRef} alt="Image loader for canvas" style={{display: "none"}} />

        <div className="content-layout">
          <ImagePreview src={originalImage} alt="Original" title="元画像" type={originalImageType} />

          <ExifDisplay exifData={originalExifStr} />

          <CanvasPreview ref={canvasRef} hasImage={!!originalImage} />

          <RotatedPreview
            processedImage={processedImage}
            rotatedPreviewImage={rotatedPreviewImage}
            downloadRotation={downloadRotation}
            onRotationChange={setDownloadRotation}
            onDownload={handleRotatedDownload}
          />
        </div>
      </main>
    </div>
  )
}

export default App
