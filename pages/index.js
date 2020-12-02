import { useEffect, useState } from "react"
import Head from "next/head"
import styles from "../styles/index.module.css"
import { getRandomElement } from "../utils/arrays"
import BackgroundSwitcher from "../components/background-switcher"
import { GIFS } from "../constants/gifs"
import { getLastSplitSegment } from "../utils/strings"

const IMAGE_CHANGE_INTERVAL = 15 * 1000
const SONG_UPDATE_INTERVAL = 15 * 1000
const STREAM = "https://s2.voscast.com:8969/stream.ogg"

const fetchSongMetaData = async (stream) => {
  try {
    const res = await fetch(`https://nicecream.fm/api/currentsong?streamUrl=${stream}`)
    const currentSong = await res.json()
    const { song } = currentSong || {}
    if (song) {
      const [author, name] = song.split(" - ") || [null, null]
      return { author, name }
    }
  } catch (err) {
    console.error("could not fetch song name", err)
  }
  return { name: null, author: null }
}

// noinspection JSUnusedGlobalSymbols
export async function getServerSideProps(ctx) {
  const { query } = ctx
  return {
    props: {
      stream: query.stream || STREAM,
      gifs: query.gifs
        ? query.gifs
            .split(",")
            .map((url) => getLastSplitSegment(getLastSplitSegment(url, "/"), "-")) // get /slug-UUID, and split to keep UUID
            .map((uuid) => `https://i.giphy.com/media/${uuid}/giphy.mp4`)
        : GIFS,
    },
  }
}

export default function Home({ gifs, stream }) {
  const [gifUrl, setGifURl] = useState(getRandomElement(gifs))
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
    const { name, author } = await fetchSongMetaData(stream)
    setSongName(name)
    setSongAuthor(author)
  }
  const searchSongUrl = `https://open.spotify.com/search/${encodeURIComponent(
    `${songAuthor} ${songName}`
  )}`

  useEffect(async () => {
    const updateGif = () => setGifURl(getRandomElement(gifs))
    let intervalImageId = setInterval(updateGif, IMAGE_CHANGE_INTERVAL)
    let intervalSongId = setInterval(updateSongName, SONG_UPDATE_INTERVAL)
    await updateSongName()
    return () => {
      clearInterval(intervalImageId)
      clearInterval(intervalSongId)
    }
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
            <source src={stream} type="audio/ogg" />
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
          {audioStatus === "loading" && (
            <img
              className={`show-on-hover ${styles.loading}`}
              src="https://media2.giphy.com/media/f8QYZDGybNNTO4GZIX/giphy.gif"
            />
          )}
        </div>
        <BackgroundSwitcher url={gifUrl} />
      </main>
    </div>
  )
}
