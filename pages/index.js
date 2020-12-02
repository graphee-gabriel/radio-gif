import { useState, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/index.module.css"
import { getRandomElement } from "../utils/arrays"
import BackgroundSwitcher from "../components/background-switcher"
import { GIFS } from "../constants/gifs"

const IMAGE_CHANGE_INTERVAL = 15 * 1000
const SONG_UPDATE_INTERVAL = 15 * 1000
const STREAM = "https://s2.voscast.com:8969/stream.ogg"

const getRandomGif = () => getRandomElement(GIFS)
const fetchSongMetaData = async () => {
  try {
    const res = await fetch(`https://nicecream.fm/api/currentsong?streamUrl=${STREAM}`)
    const currentSong = await res.json()
    const { song } = currentSong || {}
    if (song) {
      const [author, name] = song.split("-") || [null, null]
      return { author, name }
    }
  } catch (err) {
    console.error("could not fetch song name", err)
  }
  return { name: null, author: null }
}

export default function Home() {
  const [gifUrl, setGifURl] = useState(getRandomGif())
  const [audioStatus, setAudioStatus] = useState("paused")
  const [songName, setSongName] = useState()
  const [songAuthor, setSongAuthor] = useState()
  const player = () => document.getElementById("player")
  const onPlaying = () => setAudioStatus("playing")
  const onPause = () => setAudioStatus("paused")
  const onWaiting = () => setAudioStatus("loading")
  const onClickPlay = () => player().play()
  const onClickPause = () => player().pause()
  const updateSongName = async () => {
    const { name, author } = await fetchSongMetaData()
    setSongName(name)
    setSongAuthor(author)
  }
  const searchSongUrl = `https://open.spotify.com/search/${encodeURIComponent(
    `${songAuthor} ${songName}`
  )}`
  const updateGif = () => setGifURl(getRandomGif())

  useEffect(async () => {
    setInterval(updateGif, IMAGE_CHANGE_INTERVAL)
    setInterval(updateSongName, SONG_UPDATE_INTERVAL)
    await updateSongName()
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
        <div className={styles.content}>
          {songAuthor && (
            <a href={searchSongUrl} target="_blank">
              <div className={styles.songMetaData}>
                <h4>{songAuthor}</h4>
                <h3>{songName}</h3>
              </div>
            </a>
          )}
          <h1 className="hide-on-hover">RadioGif</h1>
          <a className={styles.createYourOwn} href="mailto:contact.gabriel.morin@gmail.com">
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
