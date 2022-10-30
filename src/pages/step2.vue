<template>
  <section class="md:px-8 md:mx-auto">
    <h1 class="w-full text-center text-[40px] text-[#293845] mb-4">極速簽名 LOGO</h1>
    <div class="w-full flex justify-center items-center">
      <router-link to="/step1" :class="{'text-[#6558F5]':route.fullPath==='/step1'}" class="text] text-[28px] mr-6">開始簽名</router-link>
      <router-link to="/createSign" :class="{'text-[#6558F5]':route.fullPath==='/createSign'}" class="text-[28px]">建立簽名</router-link>
    </div>
    <div class="w-full flex justify-around items-center pt-[50px]">
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-[40px] w-[80px] h-[80px] rounded-full bg-[#D1EFEC]">1</span>
        <p class="text-[40px]">上傳簽署檔案</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-[40px] w-[80px] h-[80px] rounded-full bg-[#E0DEFD]">2</span>
        <p class="text-[40px]">進行簽署</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-[40px] w-[80px] h-[80px] rounded-full bg-[#D1EFEC]">3</span>
        <p class="text-[40px]">簽署完成</p>
      </div>
    </div>
    <div class="flex justify-center w-full pt-[50px]">
      <button @click="modalController = true" class="bg-blue text-white text-[28px] bg-[#6558F5] decoration-none py-4 px-6 rounded-lg cursor-pointer">選擇簽名檔</button>
    </div>
    <div class="flex mb-8 justify-center pt-[50px]">
      <canvas id="canvas" style="border: 1px solid #000"> </canvas>
    </div>
    <button @click="downloadPDF" class="download">download PDF</button>
  </section>
  <Modal @closeModal="modalController = false" :modalController="modalController" width="w-full md:w-2/3 lg:w-1/2">
    <p class="w-full flex justify-center text-[32px]">選擇簽名</p>
    <div class="flex flex-col justify-center items-center">
      <img v-if="localsignImage1" @click="addSignImage(localsignImage1)" :src="localsignImage1" class="text-[24px] rounded-xl border border-gray-500 w-[300px] text-center mb-14" alt="">
      <img v-if="localsignImage2" @click="addSignImage(localsignImage2)" :src="localsignImage2" class="text-[24px] rounded-xl border border-gray-500 w-[300px] text-center mb-14" alt="">
    </div>
  </Modal>
</template>
<script setup>
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
  import { fabric } from "fabric"
  import { jsPDF } from "jspdf";

  let modalController = ref(false)
  const route = useRoute()
  const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  const Base64Prefix = "data:application/pdf;base64,"
  const localStep1 =  localStorage.getItem('step1')|| false
  const localsignImage1 =  localStorage.getItem('signImage1') || false
  const localsignImage2 =  localStorage.getItem('signImage2') || false
  let img
  let canvas 

  async function getLocalData(){
    const pdfData = await printPDF();
    const pdfImage = await pdfToImage(pdfData);
    // 透過比例設定 canvas 尺寸
    canvas.setWidth(pdfImage.width / window.devicePixelRatio);
    canvas.setHeight(pdfImage.height / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
  }

  async function printPDF() {
    // 將 base64 中的前綴刪去，並進行解碼
    const data = atob(localStep1.substring(Base64Prefix.length));
    // 利用解碼的檔案，載入 PDF 檔及第一頁
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(1);

    // 設定尺寸及產生 canvas
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // 設定 PDF 所要顯示的寬高及渲染
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    const renderTask = pdfPage.render(renderContext);

    // 回傳做好的 PDF canvas
    return renderTask.promise.then(() => canvas);
  }

  async function pdfToImage(pdfData) {
    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;
    // 回傳圖片
    return new fabric.Image(pdfData, {
      id: "renderPDF",
      scaleX: scale,
      scaleY: scale,
    });
  }

  // 設置 abric 介面、設置刪除按鈕
  function fabricInit(){
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';
    // 刪除按鈕
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24
    });
  }
  function deleteObject(eventData, transform) {
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size/2, -size/2, size, size);
    ctx.restore();
  }

  // DOM 操作
  function addSignImage(image){
    if (!image) return;
    fabric.Image.fromURL(image, function (image) {
      // 設定簽名出現的位置及大小，後續可調整
      image.top = 400;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      canvas.add(image);
      canvas.setActiveObject(image);
    });
    modalController.value = false
  }

  function downloadPDF(){
    // 引入套件所提供的物件
    const pdf = new jsPDF();

    // 將 canvas 存為圖片
    const image = canvas.toDataURL("image/png");
    
    // 設定背景在 PDF 中的位置及大小
    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    pdf.addImage(image, "png", 0, 0, width, height);

    // 將檔案取名並下載
    pdf.save("download.pdf");
  }
  onMounted(() => {
    img = document.createElement('img');
    img.src = deleteIcon;
    // 此處 canvas 套用 fabric.js
    canvas = new fabric.Canvas("canvas");

    if(localStep1){
      fabricInit()
      canvas.requestRenderAll();
      getLocalData()
    }
  })
</script>