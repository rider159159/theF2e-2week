<template>
  <section class="md:px-8 md:mx-auto">
    <h1 class="w-full text-center text-[40px] text-[#293845] mb-4">極速簽名 LOGO</h1>
    <div class="shadow-lg mb-[100px] p-3">
      <div class="border-l border-gray-300">
        <div class="pl-8 py-4 text-[30px] font-bold text-gray-600 bg-gray-300">簽名可直接用在簽署任何文件時</div>
        <div class="pl-8">
          <p class="text-[40px] font-bold my-4">簽名</p>
          <p class="text-[32px] font-bold my-4">手寫</p>
          <div v-if="!signImgStatus1" @click="openModal(1)" class="cursor-pointer text-[24px] rounded-xl border border-gray-500 w-[300px] text-center py-4 mb-8">創建簽名</div>
          <div v-else class="relative">
            <img @click="focusImage(1)" :src="signImgSrc1" :class="{'bg-[#C5E1FD] border-[#586AF2]': focusImageStatus === 1 }" class="text-[24px] rounded-xl border border-gray-500 w-[300px] text-center mb-14" alt="">
            <div @click="deleteImage(1)" v-if="focusImageStatus === 1" class="absolute w-[24px] h-[24px] flex cursor-pointer rounded-full justify-center items-center text-white bg-[#586AF2] top-[-8px] left-[-8px] ">X</div>
          </div>
          <div v-if="!signImgStatus2" @click="openModal(2)" class="cursor-pointer text-[24px] rounded-xl border border-gray-500 w-[300px] text-center py-4 mb-14">創建簽名縮寫</div>
          <div v-else class="relative">
            <img @click="focusImage(2)" :src="signImgSrc2" :class="{'bg-[#C5E1FD] border-[#586AF2]': focusImageStatus === 2 }" class="text-[24px] rounded-xl border border-gray-500 w-[300px] text-center mb-14" alt="">
            <div @click="deleteImage(2)" v-if="focusImageStatus === 2" class="absolute w-[24px] h-[24px] flex cursor-pointer rounded-full justify-center items-center text-white bg-[#586AF2] top-[-8px] left-[-8px] ">X</div>
          </div>
          <div class="flex">
            <p class="text-[32px] font-bold my-4 mr-4">圖片</p>
            <span class="text-gray-300 text-[32px] font-bold my-4">[清除全部]</span>
          </div>
          <label v-if="dataURI==null"  for="inputInput" class="flex justify-center items-center w-[150px] h-[150px] text-blue cursor-pointer text-[24px] rounded-xl border border-gray-500 p-4">
            <input @change="previewImage" class="hidden" type="file" id="inputInput" />
            <span class="text-[#596AF2] font-bold">選擇檔案</span>
          </label>
          <img v-if="dataURI!==null" :src="dataURI" class="max-w-[50vw]" alt="">
          <div class="w-full justify-center py-[50px]">
            <router-link to="/step1" class="bg-blue text-white text-[28px] bg-[#586AF2] decoration-none py-4 px-6 rounded-lg cursor-pointer">進入下一步</router-link>
          </div>
        </div>
      </div>
    </div>
    <Modal @closeModal="modalController.status = false" :modalController="modalController.status" width="w-full md:w-2/3 lg:w-1/2">
      <div class="flex flex-col items-center justify-center">
        <canvas ref="canvas"
          id="canvas"
          width="500"
          height="300"
          style="border: 1px solid #D1D5DB; border-radius: 25px"

          @mousedown="startPosition"
          @mouseup="finishedPosition"
          @mouseleave="finishedPosition"
          @mousemove="draw"

          @touchstart="startPosition"
          @touchend="finishedPosition"
          @touchcancel="finishedPosition"
          @touchmove="draw"
          :style="`background-color:#F5F5F5; `"
        ></canvas>
        <img v-if="showImage" :src="showImage" class="show-img" width="250" height="150" style="border: 1px solid" />
        <div class="flex mt-10">
          <div class="flex items-center">
            <div v-for="color in colorArray" :key="color">
              <div @click="colorMain = color.value" :class="[colorMain===color.value ? '!border-[#F57601]' : '' ,`bg-${color.text}`]" class="w-[30px] h-[30px] rounded-full mr-4 border-2 border-transparent"></div>
            </div>
          </div>
          <button @click="reset" class="border-[#fe24b5] bg-[#fe24b5] p-2 mr-2 text-white">Clear</button>
          <button @click="saveImage" class="border-[#fe24b5] bg-[#fe24b5] p-2 mr-2 text-white">Save</button>
        </div>
      </div>
    </Modal>
  </section>
</template>

<script setup>
  // canvas 相關操作
  let isPainting = ref(false)
  let showImage = ref('')
  let canvas = ref(null) // 直接指 canvas DOM
  let ctx = ref(null) // canvas 設定模式後的物件

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

  // 開始繪圖時，將狀態開啟
  function startPosition(e) {
    e.preventDefault();
    isPainting.value = true;
  }

  // 結束繪圖時，將狀態關閉，並產生新路徑
  function finishedPosition() {
    isPainting.value = false;
    ctx.value.beginPath();
  }

  // 繪圖過程
  function draw(e) {
    // 滑鼠移動過程中，若非繪圖狀態，則跳出
    if (!isPainting.value) return;

    // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
    const paintPosition = getPaintPosition(e);
    
    // 選擇顏色
    ctx.value.strokeStyle = colorMain.value
    // 移動滑鼠位置並產生圖案
    ctx.value.lineTo(paintPosition.x, paintPosition.y);
    ctx.value.stroke();
  }

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

  // 重新設定畫布
  function reset() {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  }


  // canvas 外其餘畫面操作
  let signImgStatus1 = ref(false)
  let signImgSrc1 = ref('')
  let signImgStatus2 = ref(false)
  let signImgSrc2 = ref('')
  let modalController = ref({
    status: false,
    item: 1
  })
  let focusImageStatus = ref(0)
  let dataURI = ref(null)

  // 彈窗儲存按鈕
  function saveImage() {
    // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
    const newImg = canvas.value.toDataURL("image/png");
    switch ( modalController.value.action ) {
      case 1:
        signImgStatus1.value = true
        signImgSrc1.value = newImg;
        localStorage.setItem('signImage1', newImg)
        modalController.value.status = false
        break;
      case 2:
        signImgStatus2.value = true
        signImgSrc2.value = newImg;
        localStorage.setItem('signImage2', newImg)
        modalController.value.status = false
        break;
    }
  }
  // 開啟彈窗
  function openModal(action) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    modalController.value.status = true
    modalController.value.action = action
  }

  // 聚焦簽名圖片
  function focusImage (num){
    focusImageStatus.value = num 
  }

  // 刪除簽名圖片
  function deleteImage (num) {
    switch (num) {
      case 1:
        signImgSrc1.value = ''
        signImgStatus1.value = false
        break;
      case 2:
        signImgSrc2.value = ''
        signImgStatus2.value = false
        break;
    }
  }

  // 上傳圖片
  function previewImage(e) {
    const [file] = e.target.files;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e => {
      dataURI.value = e.target.result;
    })
  }

  onMounted(() => {
    ctx.value = canvas.value.getContext("2d");
    ctx.value.lineWidth = 4;
    ctx.value.lineCap = "round";
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