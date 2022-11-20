<template>
  <section>
    <div class="w-full bg-primary py-8px pl-24px">
      <img class="w-99px h-56px" src="@/assets/image/index/logo.png" alt="">
    </div>
    <div class="w-full flex flex-col items-center pt-45px">
      <Step></Step>
      <div class="w-full py-124px px-20%">
        <!-- 托跩區塊 -->
        <input id="fileUploader" @change="checkFile" type="file" class="hidden">
        <div @drop.prevent="drop" @dragenter.prevent @dragover.prevent class="flex justify-center items-center w-full h-621px bg-#F2EFEF  border-dashed border-5px border-#000 mb-6">
          <div class="flex relative">
            <img class="absolute top--30px right-30px z-0" src="@/assets/image/index/PDF.png" alt="">
            <div @click.prevent="clickUpDate" class="relative w-67px h-67px flex justify-center items-center bg-secondary1 z-2 rounded-full shadow-[1px_2px_0px_#000] hover:shadow-[5px_4px_0px_#000] duration-300 cursor-pointer">
              <span class="w-33px h8px bg-white absolute"></span>
              <span class="w-33px h8px bg-white rotate-90"></span>
            </div>
          </div>
        </div>
        <div v-if="fileName.length > 0" class="w-full flex flex-col items-center justify-center text-5 mb-6">
          <p class="mb-4"> {{ fileName }} 檔案以上傳成功，可點選下一步</p>
          <router-link to="/step2" class="font-bold laFont text-24px mr-2 bg-secondary1 w210px h50px flex justify-center items-center rounded-4px border-1px border-#000 hover:shadow-[4px_4px_0px_#000] duration-300" > 下一步</router-link> 
        </div>
        <p v-if="errorText.length > 0" class="text-[24px] text-[#D3455B]">{{ errorText }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
  let dataURI = ref('')
  let errorText = ref('')
  let fileName = ref('')


  function clickUpDate(e){
    const fileUploader = document.getElementById("fileUploader");
    fileUploader.click();
  }

  function drop(e,type='drop'){
    fileHandler(e.dataTransfer.files,type)
  }
  function checkFile(e){
    console.log('test0',e)
    fileHandler(e.target.files)
  }

  function fileHandler(files){
    const { name, size, type } = files[0]
    const [file] = files
    size >= 10485760 ? errorText.value = '檔案不可超過 10MB' : errorText.value = ''
    type.substr(-3,3)!=='pdf' ? errorText.value = '檔案格式錯誤' : errorText.value = ''
    if ( errorText.value.length === 0) {
      fileName.value = name
      const fileReader = new FileReader(); 
      // 將檔案轉成 Base 64
      fileReader.readAsDataURL(file);
      fileReader.onload = (event => {
        dataURI.value = fileReader.result;
        localStorage.setItem('step1', dataURI.value)
      })
    }
  }
</script>