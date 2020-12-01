import { useState, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/index.module.css"
import { getRandomElement } from "../utils/arrays"
import BackgroundSwitcher from "../components/background-switcher"

const IMAGE_CHANGE_INTERVAL = 15
const STREAM = "https://s2.voscast.com:8969/stream.ogg"

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const gifs = require
    .context("../public/gifs", true)
    .keys()
    .map((dirty) => dirty.replace("./", ""))
  //.filter(x => x.includes('.mp4')) for test purposes
  return { props: { gifs } }
}

export default function Home({ gifs }) {
  const [gifUrl, setGifURl] = useState(getRandomElement(gifs))
  const [audioStatus, setAudioStatus] = useState("paused")
  const player = () => document.getElementById("player")
  const onPlaying = () => setAudioStatus("playing")
  const onPause = () => setAudioStatus("paused")
  const onWaiting = () => setAudioStatus("loading")
  const onClickPlay = () => player().play()
  const onClickPause = () => player().pause()

  useEffect(() => {
    setInterval(() => {
      setGifURl(getRandomElement(gifs))
    }, 1000 * IMAGE_CHANGE_INTERVAL)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Radio Gif</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Yellowtail&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={`${styles.main} hoverable-to-show`}>
        <div style={{ zIndex: 999 }}>
          <h1 className="hide-on-hover">RadioGif</h1>
          <a
            className={styles.createYourOwn}
            href="mailto:contact.gabriel.morin@gmail.com"
          >
            Create your own
          </a>
          <div className="grayscreen" />
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
          {audioStatus === "paused" && (
            <button className="show-on-hover" onClick={onClickPlay}>
              Play
            </button>
          )}
          {audioStatus === "playing" && (
            <button className="show-on-hover" onClick={onClickPause}>
              Pause
            </button>
          )}
        </div>
        <BackgroundSwitcher url={gifUrl} />
      </main>
    </div>
  )
}
