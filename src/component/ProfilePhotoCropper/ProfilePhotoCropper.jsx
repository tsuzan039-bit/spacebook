import React, { useRef, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'flowbite-react'

const FRAME_SIZE = 250
const OUTPUT_SIZE = 500

export default function ProfilePhotoCropper({file, onCancel, onCropped}) {

  const [imgSrc, setImgSrc] = useState(null)
  const [naturalSize, setNaturalSize] = useState({w:0,h:0})
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({x:0,y:0})
  const dragState = useRef(null)
  const imgRef = useRef(null)

  React.useEffect(()=>{
    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)
  },[file])

  function handleImageLoad(e){
    const w = e.target.naturalWidth
    const h = e.target.naturalHeight
    setNaturalSize({w,h})
    const coverScale = Math.max(FRAME_SIZE/w, FRAME_SIZE/h)
    const dispW = w*coverScale
    const dispH = h*coverScale
    setOffset({x:(FRAME_SIZE-dispW)/2, y:(FRAME_SIZE-dispH)/2})
  }

  const coverScale = naturalSize.w ? Math.max(FRAME_SIZE/naturalSize.w, FRAME_SIZE/naturalSize.h) : 1
  const effectiveScale = coverScale * zoom
  const dispW = naturalSize.w * effectiveScale
  const dispH = naturalSize.h * effectiveScale

  function clampOffset(x,y,dW,dH){
    const minX = Math.min(0, FRAME_SIZE - dW)
    const minY = Math.min(0, FRAME_SIZE - dH)
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y))
    }
  }

  function handleMouseDown(e){
    dragState.current = {startX:e.clientX, startY:e.clientY, offsetX:offset.x, offsetY:offset.y}
  }
  function handleMouseMove(e){
    if(!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    const newOffset = clampOffset(dragState.current.offsetX+dx, dragState.current.offsetY+dy, dispW, dispH)
    setOffset(newOffset)
  }
  function handleMouseUp(){
    dragState.current = null
  }

  function handleZoomChange(e){
    const newZoom = Number(e.target.value)
    setZoom(newZoom)
    const newCoverScale = Math.max(FRAME_SIZE/naturalSize.w, FRAME_SIZE/naturalSize.h)
    const newDispW = naturalSize.w*newCoverScale*newZoom
    const newDispH = naturalSize.h*newCoverScale*newZoom
    setOffset(prev => clampOffset(prev.x, prev.y, newDispW, newDispH))
  }

  function handleConfirm(){
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const ctx = canvas.getContext('2d')

    const outputScale = OUTPUT_SIZE / FRAME_SIZE
    const sx = -offset.x / effectiveScale
    const sy = -offset.y / effectiveScale
    const sSize = FRAME_SIZE / effectiveScale

    ctx.drawImage(imgRef.current, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

    canvas.toBlob((blob)=>{
      const croppedFile = new File([blob], file.name, {type:'image/jpeg'})
      onCropped(croppedFile)
    }, 'image/jpeg', 0.9)
  }

  return (
    <Modal show={true} onClose={onCancel} size='md'>
      <ModalHeader>Adjust your photo</ModalHeader>
      <ModalBody>
        <div className='flex flex-col items-center gap-4'>

          <div 
            className='relative overflow-hidden rounded-full border-2 border-gray-300 cursor-move select-none'
            style={{width:FRAME_SIZE, height:FRAME_SIZE}}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imgSrc &&
              <img 
                ref={imgRef}
                src={imgSrc}
                onLoad={handleImageLoad}
                draggable={false}
                style={{
                  position:'absolute',
                  left:offset.x,
                  top:offset.y,
                  width:dispW,
                  height:dispH,
                  maxWidth:'none'
                }}
                alt=""
                crossOrigin='anonymous'
              />
            }
          </div>

          <div className='w-full flex items-center gap-2'>
            <span className='text-xs'>Zoom</span>
            <input 
              type='range' 
              min='1' 
              max='3' 
              step='0.1'
              value={zoom}
              onChange={handleZoomChange}
              className='flex-1'
            />
          </div>

          <div className='flex gap-2 w-full'>
            <Button className='flex-1' onClick={handleConfirm}>Save</Button>
            <Button color='gray' className='flex-1' onClick={onCancel}>Cancel</Button>
          </div>

        </div>
      </ModalBody>
    </Modal>
  )
}