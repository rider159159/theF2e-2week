<template>
  <div>
    <ul class="flex">
      <li>
        <button class="border-[#fe24b5] bg-[#fe24b5] p-2 mr-2 text-white" @click="back()">Undo</button>
      </li>
      <li>
        <button class="border-[#fe24b5] bg-[#fe24b5] p-2 text-white" @click="forward()">Redo</button>
      </li>
    </ul>
    <div class="flex">
      <canvas ref="canvas"
      id="canvas"
      width="500"
      height="300"
      style="border: 1px solid #000"
      @mousedown="startPosition"
      @mouseup="finishedPosition('up')"
      @mouseleave="finishedPosition"
      @mousemove="draw"

      :style="`background-color:#dfdfdf; `"
      ></canvas>
      <img v-if="showImage" :src="showImage" class="show-img" width="250" height="150" style="border: 1px solid" />
    </div>
    <div class="flex">
      <button @click="reset" class="border-[#fe24b5] bg-[#fe24b5] p-2 mr-2 text-white">Clear</button>
      <button @click="saveImage" class="border-[#fe24b5] bg-[#fe24b5] p-2 mr-2 text-white">Save</button>
      <router-link v-if="showImage" to="/pdf" class="border-[#fe24b5] bg-[#fe24b5] p-2 mr-2 text-white inline-block">下一步</router-link>
    </div>
  </div>
</template>

<script setup>
let isPainting = ref(false)
let showImage = ref('')
let canvas = ref(null)
let ctx = ref(null)

// 取得滑鼠 / 手指在畫布上的位置
function getPaintPosition(e) {
  const canvasSize = canvas.value.getBoundingClientRect();

  if (e.type === "mousemove") {
    return {
      x: e.clientX - canvasSize.left,
      y: e.clientY - canvasSize.top,
    };
  } else {
    return {
      x: e.touches[0].clientX - canvasSize.left,
      y: e.touches[0].clientY - canvasSize.top,
    };
  }
}

// 開始繪圖時，將狀態開啟
function startPosition(e) {
  e.preventDefault();
  isPainting.value = true;
}

// 結束繪圖時，將狀態關閉，並產生新路徑
function finishedPosition(action) {
  isPainting.value = false;
  ctx.beginPath();
  if(action === 'up'){
    let tempCanvas = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
    window.history.pushState(tempCanvas, null);
  }
}

// 繪圖過程
function draw(e) {
  // 滑鼠移動過程中，若非繪圖狀態，則跳出
  if (!isPainting.value) return;

  // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
  const paintPosition = getPaintPosition(e);

  // 移動滑鼠位置並產生圖案
  ctx.lineTo(paintPosition.x, paintPosition.y);
  ctx.stroke();
}

// 重新設定畫布
function reset() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

// 按下儲存按鈕
function saveImage() {
  // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
  const newImg = canvas.value.toDataURL("image/png");
  showImage.value = newImg;
  localStorage.setItem('signImage', newImg)
}
function back (){
  window.history.back()
}
function forward (){
  window.history.forward()
}

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  console.log('test0')
  window.addEventListener('popstate',(e)=>{
    ctx.putImageData(e.state, 0, 0);
  })

onBeforeUnmount(() => {
  window.removeeventlistener('popstate',(e)=>{
    ctx.putImageData(e.state, 0, 0);
  })
  
  })

  // event listener 手機板
  // canvas.addEventListener("touchstart", startPosition);
  // canvas.addEventListener("touchend", finishedPosition);
  // canvas.addEventListener("touchcancel", finishedPosition);
  // canvas.addEventListener("touchmove", draw);
})
</script>

<style>

</style>