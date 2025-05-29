import piexif from "piexifjs"
import {hasMeaningfulExif, extractDateTimeFromExif} from "./helpers"

export const handleImageUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  resetState: () => void,
  setOriginalImage: (image: string | null) => void,
  setOriginalImageType: (type: string | null) => void,
  setOriginalExifObj: (exifObj: piexif.ExifDict | null) => void,
  setOriginalExifStr: (exifStr: string) => void,
  setConstructionDate: (date: Date | null) => void,
  setIsDateFromExif: (isFromExif: boolean) => void,
) => {
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
            const exifObject = piexif.load(dataUrl)
            if (hasMeaningfulExif(exifObject)) {
              setOriginalExifObj(exifObject)

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
