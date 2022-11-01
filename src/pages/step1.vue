<template>
  <section class="md:px-8 md:mx-auto">
    <h1 class="w-full text-center text-[40px] text-[#293845] mb-4">極速簽名 LOGO</h1>
    <div class="w-full flex justify-center items-center">
      <router-link to="/step1" :class="{'text-[#6558F5]':route.fullPath==='/step1'}" class="text] text-[28px] mr-6">開始簽名</router-link>
      <router-link to="/createSign" :class="{'text-[#6558F5]':route.fullPath==='/createSign'}" class="text-[28px]">建立簽名</router-link>
    </div>
    <div class="w-full flex justify-around items-center py-[50px]">
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center b text-[40px] w-[80px] h-[80px] rounded-full bg-[#E0DEFD]">1</span>
        <p class="text-[40px]">上傳簽署檔案</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-[40px] w-[80px] h-[80px] rounded-full bg-[#D1EFEC]">2</span>
        <p class="text-[40px]">進行簽署</p>
      </div>
      <div class="flex flex-col items-center">
        <span class="flex justify-center items-center text-[40px] w-[80px] h-[80px] rounded-full bg-[#D1EFEC]">3</span>
        <p class="text-[40px]">簽署完成</p>
      </div>
    </div>

    <div class="flex mb-8 justify-center">
      <div class="h-full">
        <span class="block text-[24px] py-2 px-4 mr-2 bg-[#f4f4f4] border-2 rounded-lg border-slate-400 text-slate-400">{{ fileName.length > 0 ? fileName : '請選擇簽署檔案' }}</span>
        <p v-if="errorText.length > 0" class="text-[24px] text-[#D3455B]">{{ errorText }}</p>
      </div>
      <label for="choseFile" class="text-[28px] bg-[#D3455B] text-white py-2 px-4 rounded-lg border-0 self-start" type="button">
        選擇檔案
        <input @change="checkFile" type="file" id="choseFile" class="hidden">
      </label>
    </div>
    <div class="w-full flex justify-center pt-[50px]">
      <router-link v-if="fileName.length > 0" to="/step2" class="bg-blue text-white text-[28px] bg-[#6558F5] decoration-none py-4 px-6 rounded-lg">前往簽署</router-link>
    </div>

  </section>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
  let dataURI = ref('')
  let errorText = ref('')
  let fileName = ref('')

  function checkFile(e){
    const { name, size, type } = e.target.files[0]
    const [file] = e.target.files

    size >= 10485760 ? errorText.value = '檔案不可超過 10MB' : errorText.value = ''
    type.substr(-3,3)!=='pdf' ? errorText.value = '檔案格式錯誤' : errorText.value = ''
    if ( errorText.value.length === 0){
      fileName.value = name
      const fileReader = new FileReader(); 
      // 將檔案轉成 Base 64
      fileReader.readAsDataURL(file);
      fileReader.onload = (event => {
        // dataURI.value = event.target.result;
        
        // 下面方法和上面結果一樣，可以替換
        dataURI.value = fileReader.result;
        localStorage.setItem('step1', dataURI.value)
      })
    }
  }

</script>