import piexif from "piexifjs"
import {hasMeaningfulExif} from "./helpers"

export const handleProcessImage = (
  originalImage: string | null,
  originalImageType: string | null,
  originalExifObj: piexif.ExifDict | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  setProcessedImage: (image: string | null) => void,
) => {
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
    const updatedExif = {...originalExifObj}
    if (updatedExif["0th"] && updatedExif["0th"][piexif.ImageIFD.Orientation]) {
      updatedExif["0th"][piexif.ImageIFD.Orientation] = 1
    }

    const exifStr = piexif.dump(updatedExif)
    const newImageWithExif = piexif.insert(exifStr, newImageDataUrl)
    setProcessedImage(newImageWithExif)
  } else {
    setProcessedImage(newImageDataUrl)
  }
}
