import { useState, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/index.module.css"
import { getRandomElement } from "../utils/arrays"
import BackgroundSwitcher from "../components/background-switcher"

const IMAGE_CHANGE_INTERVAL = 30
const STREAM = "https://s2.voscast.com:8969/stream.ogg"

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const gifs = require
    .context("../public/gifs", true)
    .keys()
    .map((dirty) => dirty.replace("./", ""))
  return { props: { gifs } }
}

export default function Home({ gifs }) {
  const [gifUrl, setGifURl] = useState(getRandomElement(gifs))
  const [audioStatus, setAudioStatus] = useState("paused")
  const player = () => document.getElementById("player")
  const onPlaying = () => setAudioStatus("playing")
  const onPause = () => setAudioStatus("paused")
  const onWaiting = () => setAudioStatus("loading")

  useEffect(() => {
    setInterval(() => {
      setGifURl(getRandomElement(gifs))
    }, 1000 * IMAGE_CHANGE_INTERVAL)
  }, [])

  const onClickPlay = () => player().play()
  const onClickPause = () => player().pause()
  return (
    <div className={styles.container}>
      <Head>
        <title>Radio Gif</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ zIndex: 999 }}>
          <audio
            id="player"
            preload="auto"
            onPause={onPause}
            onWaiting={onWaiting}
            onPlaying={onPlaying}
            autoPlay={true}
          >
            <source src={STREAM} type="audio/ogg" />
          </audio>
          {audioStatus === "paused" && <button onClick={onClickPlay}>Play</button>}
          {audioStatus === "playing" && <button onClick={onClickPause}>Pause</button>}
        </div>
        <BackgroundSwitcher url={gifUrl} />
      </main>
    </div>
  )
}
