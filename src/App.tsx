import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const width = 320

function App() {
  const [imgUrl, setImgUrl] = useState('')
  const saveImg = (canvas: HTMLCanvasElement) => {
    const data = canvas.toDataURL('image/png')
    setImgUrl(data)
  }
  const [height, setHeight] = useState(0)
  const [streaming, setStreaming] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const handleCanPlay = () => {
    if (!streaming) {
      if (videoRef.current) {
        const h =
          videoRef.current.videoHeight / (videoRef.current.videoWidth / width)
        setHeight(h)
      }
      setStreaming(true)
    }
  }

  const startUp = async () => {
    const video = videoRef.current
    if (!video) return
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    console.log('stream', stream)
    video.srcObject = stream
    video.play()
  }
  const stop = () => {
    const video = videoRef.current
    if (!video) return
    video.srcObject = null
  }
  return (
    <div className="App">
      <video
        width={width}
        height={height}
        onCanPlay={handleCanPlay}
        ref={videoRef}
      ></video>
      <button onClick={startUp}>start up</button>
      <button onClick={stop}>stop</button>
    </div>
  )
}

export default App
