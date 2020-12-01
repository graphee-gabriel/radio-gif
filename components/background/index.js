import styles from "./index.module.css"
import Image from "next/image"
import { getGifMetaDataFromFileName } from "../../utils"

export default function Background({ url, className }) {
  const isVideo = url && url.includes(".mp4")
  const metaData = getGifMetaDataFromFileName(url)
  const { fit } = metaData
  return (
    <div className={`${styles.container} ${className}`}>
      {isVideo ? (
        <video autoPlay={true} loop muted className={styles.video} src={`/gifs/${url}`} />
      ) : (
        <Image
          className={styles.gif}
          src={`/gifs/${url}`}
          layout="fill"
          objectFit={fit || "cover"}
        />
      )}
    </div>
  )
}
