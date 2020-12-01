import React, { useEffect, useState } from "react"
import Background from "../background"

const FADE_IN = "opacity-visible"
const FADE_OUT = "opacity-hidden"

export default function BackgroundSwitcher({ url }) {
  const [urlA, setUrlA] = useState(url)
  const [urlB, setUrlB] = useState(null)
  const [urlShowState, setUrlShowState] = useState("A")
  const getUrlToShow = (state) => {
    return state === "A" ? urlA : urlB
  }
  const switchState = (oldState) => {
    return oldState === "A" ? "B" : "A"
  }
  const isUrlToShow = (url) => getUrlToShow(urlShowState) === url
  const getVisibilityFromUrl = (url) => (isUrlToShow(url) ? FADE_IN : FADE_OUT)
  useEffect(() => {
    const urlToShow = getUrlToShow(urlShowState)
    if (urlToShow !== url) {
      if (urlShowState === "A") {
        setUrlB(url)
      } else {
        setUrlA(url)
      }
      setUrlShowState(switchState(urlShowState))
    }
  }, [url])
  // console.log("urlA", urlA)
  // console.log("urlB", urlB)
  // console.log("urlShowState", urlShowState)
  // console.log("visibility", getVisibilityFromUrl(urlA))
  return (
    <>
      {urlA && <Background url={urlA} className={`animate-opacity ${getVisibilityFromUrl(urlA)}`} />}
      {urlB && <Background url={urlB} className={`animate-opacity ${getVisibilityFromUrl(urlB)}`} />}
    </>
  )
}
