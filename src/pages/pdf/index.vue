<template>
  <div class="w-full mx-auto overflow-x-hidden min-h-[calc(100vh-80px)] bg-[#f4f4f4]">
    <div>
      <input ref="input" type="file" accept="application/pdf" placeholder="選擇PDF檔案" />
    </div>
    <canvas ref="refCanvas" id="canvas" style="border: 1px solid #000"> </canvas>
    
    <p>選擇簽名</p>
    <img @click="addSignImage" :src="signSrc" class="sign" style="border: 1px solid #000" width="250" height="150" />
    
    <button @click="downloadPDF" class="download">download PDF</button>
  </div>
</template>

<script setup>
import { fabric } from 'fabric'
import { jsPDF } from "jspdf";

const Base64Prefix = "data:application/pdf;base64,"
const input = ref(null)
let signSrc = ref('')

let canvas 
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

// 使用原生 FileReader 轉檔
function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}

async function printPDF(pdfData) {
  // 將檔案處理成 base64
  pdfData = await readBlob(pdfData);

  // 將 base64 中的前綴刪去，並進行解碼
  const data = atob(pdfData.substring(Base64Prefix.length));

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
  renderTask.promise.then(()=>{
  })
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

function addSignImage(){
  if (!signSrc.value) return;
  console.log(signSrc)
  fabric.Image.fromURL(signSrc.value, function (image) {
    // 設定簽名出現的位置及大小，後續可調整
    image.top = 400;
    image.scaleX = 0.5;
    image.scaleY = 0.5;
    canvas.add(image);
  });
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
  // 此處 canvas 套用 fabric.js
  canvas = new fabric.Canvas("canvas");
  input.value.addEventListener("change", async (e) => {
    canvas.requestRenderAll();
    const pdfData = await printPDF(e.target.files[0]);
    const pdfImage = await pdfToImage(pdfData);
    // 透過比例設定 canvas 尺寸
    canvas.setWidth(pdfImage.width / window.devicePixelRatio);
    canvas.setHeight(pdfImage.height / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
  });
  if (localStorage.getItem("signImage")) {
    signSrc.value = localStorage.getItem("signImage");
  }
})
</script>
