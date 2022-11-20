<template>
  <div class="fixed z-5 top-72px w-130px flex flex-col">
    <div @click="choseId = 1" :class="{'bg-#F2EFEF': choseId === 1}" class="flex w-full justify-evenly py-20px cursor-pointer">
      <div class="flex flex-col justify-center items-center">
        <img class="pb-10px w-20px" src="@/assets/image/index/sign.png" alt="">
        <p class="laFont text-#8B8B8B">Sign</p>
      </div>
      <img src="@/assets/image/index/leftIcon.svg" alt="">
    </div>
    <div @click="choseId = 2" :class="{'bg-#F2EFEF': choseId === 2}" class="flex w-full justify-evenly py-20px cursor-pointer">
      <div class="flex flex-col justify-center items-center">
        <img class="pb-10px w-20px" src="@/assets/image/index/date.png" alt="">
        <p class="laFont text-#8B8B8B">Date</p>
      </div>
      <img src="@/assets/image/index/leftIcon.svg" alt="">
    </div>
  </div>
  
  <div v-if="choseId > 0" class="sidebar fixed z-5 top-72px left-130px bg-#F2EFEF w-368px flex flex-col items-center">
    <div @click="choseId = 0" class="w-full flex justify-end mt-10px mr-10px cursor-pointer">
      <img class="py-10px px-20px" src="@/assets/image/index/right.png" alt="">
    </div>
    <div v-if="choseId === 1" class="mt-80px">
      <div v-if="!signImgStatus1" @click="openModal(1)" class="cursor-pointer text-[24px] flex items-center justify-center rounded-xl border bg-white w-[300px] h-150px text-center mb-70px">創建簽名</div>
      <div v-else class="relative">
        <img @click="addImage(signImgSrc1)" :src="signImgSrc1" :class="{'bg-[#C5E1FD] border-[#586AF2]': focusImageStatus === 1 }" class="text-[24px] rounded-xl bg-white w-[300px] h-150px text-center mb-14" alt="">
        <div @click="deleteImage(1)" v-if="focusImageStatus === 1" class="absolute w-[24px] h-[24px] flex cursor-pointer rounded-full justify-center items-center text-white bg-[#586AF2] top-[-8px] left-[-8px] ">X</div>
      </div>
      <div v-if="!signImgStatus2" @click="openModal(2)" class="cursor-pointer text-[24px] flex items-center justify-center rounded-xl border bg-white w-[300px] h-150px text-center mb-14">創建簽名縮寫</div>
      <div v-else class="relative">
        <img @click="addImage(signImgSrc2)" :src="signImgSrc2" :class="{'bg-[#C5E1FD] border-[#586AF2]': focusImageStatus === 2 }" class="text-[24px] rounded-xl bg-white w-[300px] h-150px text-center mb-14" alt="">
        <div @click="deleteImage(2)" v-if="focusImageStatus === 2" class="absolute w-[24px] h-[24px] flex cursor-pointer rounded-full justify-center items-center text-white bg-[#586AF2] top-[-8px] left-[-8px] ">X</div>
      </div>
    </div>
    <div v-if="choseId === 2">
      <div class="flex flex-col">
        <Datepicker class="mb-10 text-20px rounded-10px py-3 px-2" v-model="dateValue" />
        <button @click="addDate" class="font-bold laFont text-24px mr-2 !bg-secondary1 w210px h50px flex justify-center items-center rounded-4px hover:shadow-[4px_4px_0px_#000] duration-300 mb-6" type="button">Confirm</button>
      </div>
    </div>
  </div>
  
  <Modal @closeModal="closeModal" :modalController="modalController.status" width="w-700px">
    <div class="flex flex-col items-center justify-center">
      <canvas 
        ref="signCanvas"
        width="500"
        height="300"
        style="border: 1px solid #D1D5DB; border-radius: 25px; background-color:#F5F5F5;"

        @mousedown="startPosition"
        @mouseup="finishedPosition"
        @mouseleave="finishedPosition"
        @mousemove="draw"

        @touchstart="startPosition"
        @touchend="finishedPosition"
        @touchcancel="finishedPosition"
        @touchmove="draw"
      ></canvas>
      <img v-if="showImage" :src="showImage" class="show-img" width="250" height="150" style="border: 1px solid" />
      <div class="flex flex-col mt-10">
        <div class="flex items-center mb-4">
          <div v-for="color in colorArray" :key="color">
            <div @click="colorMain = color.value" :class="[colorMain===color.value ? '!border-[#F57601]' : '' ,`bg-${color.text}`]" class="w-[30px] h-[30px] rounded-full mr-4 border-2 border-transparent"></div>
          </div>
        </div>
        <div class="flex">
          <button @click="saveImage" class="font-bold laFont text-24px mr-2 bg-secondary1 w210px h50px flex justify-center items-center rounded-4px border-1px border-#000 hover:shadow-[4px_4px_0px_#000] duration-300">Save</button>
          <button @click="reset" class="font-bold laFont text-24px mr-2 bg-secondary1 w210px h50px flex justify-center items-center rounded-4px border-1px border-#000 hover:shadow-[4px_4px_0px_#000] duration-300">Clear</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
  import Datepicker from 'vue3-datepicker'

  // canvas 相關操作
  const isPainting = ref(false)
  const showImage = ref('')
  const signCanvas = ref(null) // 直接指 canvas DOM
  const signCtx = ref(null) // canvas 設定模式後的物件
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

  const emit = defineEmits(['getSignImage'])

  // 開始繪圖時，將狀態開啟
  function startPosition(e) {
    e.preventDefault();
    isPainting.value = true;
  }

  // 結束繪圖時，將狀態關閉，並產生新路徑
  function finishedPosition() {
    isPainting.value = false;
    signCtx.value.beginPath();
  }

  // 繪圖過程
  function draw(e) {
    // 滑鼠移動過程中，若非繪圖狀態，則跳出
    if (!isPainting.value) return;

    // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
    const paintPosition = getPaintPosition(e);
    
    // 選擇顏色
    signCtx.value.strokeStyle = colorMain.value
    // 移動滑鼠位置並產生圖案
    signCtx.value.lineTo(paintPosition.x, paintPosition.y);
    signCtx.value.stroke();
  }

  // 取得滑鼠 / 手指在畫布上的位置
  function getPaintPosition(e) {
    const canvasSize = signCanvas.value.getBoundingClientRect();

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
    signCtx.value.clearRect(0, 0, signCanvas.value.width, signCanvas.value.height);
  }

  function addImage(image){
    choseId.value = 0
    emit('getSignImage', image)
  }

  function addDate(){
    choseId.value = 0
    const date = dateValue.value.toISOString().split('T')[0]
    emit('getDate', date)
  }
  
  // canvas 外其餘畫面操作
  const signImgStatus1 = ref(false)
  const signImgSrc1 = ref('')
  const signImgStatus2 = ref(false)
  const signImgSrc2 = ref('')
  const choseId = ref(0)
  const focusImageStatus = ref(0)

  const modalController = ref({
    status: false,
    item: 1
  })
  const dateValue = ref(new Date())

  function closeModal() {
    modalController.value.status = false
    reset()
  }

  function openModal(action) {
    modalController.value.status = true
    modalController.value.action = action
    signCtx.value.clearRect(0, 0, signCanvas.value.width, signCanvas.value.height)
  }

    // 彈窗儲存按鈕
  function saveImage() {
    // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
    const newImg = signCanvas.value.toDataURL("image/png");
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

  onMounted(() => {
    signCtx.value = signCanvas.value.getContext("2d");
    signCtx.value.lineWidth = 4;
    signCtx.value.lineCap = "round";
    reset()
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