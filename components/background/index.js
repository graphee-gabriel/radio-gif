import styles from "./index.module.css"
import Image from "next/image"
import { getGifMetaDataFromFileName } from "../../utils"

export default function Background({ url, className }) {
  const isVideo = url && url.includes(".mp4")
  const metaData = getGifMetaDataFromFileName(url)
  const { author, fit } = metaData
  return (
    <div className={`${styles.container} ${className}`}>
      {author && <h3 className={styles.author}>{author}</h3>}
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
