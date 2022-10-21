<template>
  <div>
    <canvas ref="sketchpad" 
      @mousedown="onCanvasMouseDown"
      @mouseup="onCanvasMouseUp"
      :style="`background-color:#dfdfdf; `"
      ></canvas>
  </div>
</template>

<script setup>
let isCanvasMouseDown = ref(false)
let canvasContext = ref(null)
let tempCanvas = ref(null)
let isSizing = ref(false)
let tempPosition = ref(null)
const sketchpad = ref(null)
const color = ref(
  [
    { name:'white', code:'white'},
    { name:'black', code:'black'},
    { name:'lightgr een',code:'#9BFFCD'},
    { name:'green', code:'#00CC99'},
    { name:'darkgre en',code:'#01936F'}
  ]
    )
let currentSize = ref('10')

function onCanvasMouseDown(){ 
  isCanvasMouseDown = true
  setTempCanvas()
}

function onCanvasMouseUp(){ 
  saveCanvasToHistory()
  resetToolState()
}

function setTempCanvas(){ 
    let ctx = canvasContext
    let canvas = ctx.canvas 
    let tempCanva = ctx.getImageData(0, 0, canvas.width, canvas.height);
    tempCanvas = tempCanva
}

function saveCanvasToHistory(){
  let ctx = canvasContext
  let canvas = ctx.canvas 
  let tempCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
  window.history.pushState(tempCanvas, null);
}

// function resetToolState(){
//   isSizing = false
//   tempPosition = null
//   isCanvasMouseDown = false
// }

function setCanvas(){
  sketchpad.value.width  = window.innerWidth
  sketchpad.value.height  = window.innerHeight - 60
  let ctx =  sketchpad.value.getContext('2d')
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  canvasContext.value = ctx
}

function setWindowEvent(){
  window.addEventListener('mousemove',(event)=>{
    let currentPos = getCanvasMousePosition(event.clientX,event.clientY)

    if(isSizing && tempPosition ){
      let dragValue= currentPos.y- tempPosition.y 
      checkSizeDrag(dragValue)
    }

    if(isCanvasMouseDown && this.tempPosition){
      let pos = this.getCanvasMousePosition(event.clientX,event.clientY)
      switch(this.currentTool){
        case 'paint-brush' : 
          this.draw((ctx)=>{
              ctx.strokeStyle =  this.currentColor.code
              ctx.moveTo(this.tempPosition.x,this.tempPosition.y)
              ctx.lineTo(pos.x,pos.y)
          })
          break;
      }
    }

    setCanvasTempPosition(currentPos.x,currentPos.y)

  })
  window.addEventListener('popstate',(e)=>{
    canvasContext.putImageData(e.state, 0, 0);
  })
}

function draw(action){
  canvasContext.beginPath()
  canvasContext.lineWidth = this.currentSize*2;        
  action(canvasContext)
  canvasContext.stroke()
}

function checkSizeDrag(dragValue){
  if(dragValue<0){ 
    currentSize =  parseInt(currentSize)+1
  }else if(dragValue>0 && currentSize>=1){
    currentSize = parseInt(currentSize)-1
  }
}

function getCanvasMousePosition(clientX,clientY){
  let canvasPosition = canvasContext.value.canvas.getBoundingClientRect()
  let x = clientX-canvasPosition.x
  let y = clientY-canvasPosition.y
  return {x,y}
}

function setCanvasTempPosition(x,y){
  tempPosition={x,y}
}

onMounted(() => {
  setCanvas()
  // setWindowEvent()
})
</script>
