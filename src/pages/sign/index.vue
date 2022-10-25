<template>
  <div>
    <div>
      <div class="flex items-center">
        <strong class="mr-4 text-xl">color:</strong>
        <div v-for="color in colorArray" :key="color">
          <div @click="colorMain = color.value" :class="`bg-${color.text}` " class="w-[50px] h-[50px] rounded-full mr-4"></div>
        </div>
      </div>
      <canvas ref="canvas"
        id="canvas"
        width="500"
        height="300"
        style="border: 1px solid #000"
        @mousedown="startPosition"
        @mouseup="finishedPosition('up')"
        @mouseleave="finishedPosition"
        @mousemove="draw"
        @touchstart="startPosition"
        @touchend="finishedPosition('up')"
        @touchcancel="finishedPosition"
        @touchmove="draw"
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
  const colorMain = ref('#000')
  const colorArray = [
    {
      text:'blue',
      value:'#0000FF'
    },
    {
      text:'red',
      value:'#FF0000'
    },
    {
      text:'black',
      value:'#000'
    },
    {
      text:'green',
      value:'#01936f'
    }
      ]
  
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
      console.log('end')
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
    ctx.strokeStyle = colorMain.value

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
  })
</script>

<style scoped>
.bg-blue{
  background-color: blue;
}
.bg-red{
  background-color: #FF0000;
}
.bg-black{
  background-color: #000;
}
.bg-green{
  background-color: #01936f;
}
</style>