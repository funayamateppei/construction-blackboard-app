import {useState, useRef, useEffect} from "react"
import {type ExifDict} from "piexifjs"
import "./App.css"

// コンポーネントのインポート
import {FileUpload, ConstructionInputs, ImagePreview, ExifDisplay, CanvasPreview, Preview} from "./components"
// ヘルパー関数のインポート
import {drawConstructionBoard, handleProcessImage, handleImageUpload} from "./utils"

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [originalImageType, setOriginalImageType] = useState<string | null>(null)
  // originalExifObj の型を IExifElement | null に変更
  const [originalExifObj, setOriginalExifObj] = useState<ExifDict | null>(null)
  const [originalExifStr, setOriginalExifStr] = useState<string>("")
  const [processedImage, setProcessedImage] = useState<string | null>(null)

  // 工事黒板の情報
  const [constructionName, setConstructionName] = useState<string>("")
  const [constructionDate, setConstructionDate] = useState<Date | null>(null)
  const [isDateFromExif, setIsDateFromExif] = useState<boolean>(false) // Exif情報から日時が設定されているかのフラグ

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageLoaderRef = useRef<HTMLImageElement>(null)

  const resetState = () => {
    setOriginalImage(null)
    setOriginalImageType(null)
    setOriginalExifObj(null)
    setOriginalExifStr("")
    setProcessedImage(null)
    setConstructionName("")
    setConstructionDate(null)
    setIsDateFromExif(false)
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  useEffect(() => {
    if (originalImage && canvasRef.current && imageLoaderRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const imgLoader = imageLoaderRef.current

      imgLoader.onload = () => {
        canvas.width = imgLoader.naturalWidth
        canvas.height = imgLoader.naturalHeight

        if (ctx) {
          ctx.drawImage(imgLoader, 0, 0, imgLoader.naturalWidth, imgLoader.naturalHeight)
          // 工事黒板の文字を描画
          drawConstructionBoard(ctx, canvas.width, canvas.height, constructionName, constructionDate)
        }
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
  }, [originalImage, constructionName, constructionDate])

  return (
    <div className="App">
      <header className="App-header">
        <h1>工事黒板アプリ - 画像に工事情報を追加 📋✨</h1>
      </header>
      <main>
        <section className="controls">
          <FileUpload
            onImageUpload={(event) =>
              handleImageUpload(
                event,
                resetState,
                setOriginalImage,
                setOriginalImageType,
                setOriginalExifObj,
                setOriginalExifStr,
                setConstructionDate,
                setIsDateFromExif,
              )
            }
            hasImage={!!originalImage}
          />

          {originalImage && (
            <>
              <ConstructionInputs
                constructionName={constructionName}
                onConstructionNameChange={setConstructionName}
                constructionDate={constructionDate}
                onConstructionDateChange={setConstructionDate}
                isDateFromExif={isDateFromExif}
              />

              <button
                onClick={() =>
                  handleProcessImage(originalImage, originalImageType, originalExifObj, canvasRef, setProcessedImage)
                }
                disabled={!originalImage}
              >
                工事黒板付きJPEG画像を生成 (Exif付与)
              </button>
            </>
          )}
        </section>

        <img ref={imageLoaderRef} alt="Image loader for canvas" style={{display: "none"}} />

        <div className="content-layout">
          <ImagePreview src={originalImage} type={originalImageType} />

          <ExifDisplay exifData={originalExifStr} />

          <CanvasPreview ref={canvasRef} hasImage={!!originalImage} />

          <Preview processedImage={processedImage} />
        </div>
      </main>
    </div>
  )
}

export default App
