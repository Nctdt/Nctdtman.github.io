import { Button } from 'antd'
import { useState, useRef, useEffect } from 'react'

const width = 320

const MediaTakePicture = () => {
  const [imgUrl, setImgUrl] = useState('')
  const saveImg = (canvas: HTMLCanvasElement) => {
    const data = canvas.toDataURL('image/png')
    setImgUrl(data)
  }
  const [height, setHeight] = useState(0)
  const [streaming, setStreaming] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

  const clearPhoto = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')!
    context.fillStyle = '#AAA'
    context.fillRect(0, 0, canvas.width, canvas.height)

    saveImg(canvas)
  }
  useEffect(() => {
    clearPhoto()
  }, [])
  const takePicture = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const context = canvas.getContext('2d')!
    if (width && height) {
      canvas.width = width
      canvas.height = height
      context.drawImage(video, 0, 0, width, height)

      saveImg(canvas)
    } else {
      clearPhoto()
    }
  }
  const startUp = async () => {
    const video = videoRef.current
    if (!video) return
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
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
      <Button onClick={startUp}>start up</Button>
      <Button onClick={stop}>stop</Button>
      <Button onClick={takePicture}>take picture</Button>
      <canvas
        className="none"
        width={width}
        height={height}
        ref={canvasRef}
      ></canvas>
      <div>
        <img alt="The screen capture will appear in this box." src={imgUrl} />
      </div>
    </div>
  )
}

export default MediaTakePicture
