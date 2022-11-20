<template>
  <section class="w-600px h-full overflow-hidden relative">
    <div class="w-full flex relative z-5 justify-between ">
      <div class="flex flex-col items-center z-5">
        <div class="flex justify-center items-center bg-primary text-white text-32px font-bold w-60px h-60px rounded-full mb-8px">
          1
        </div>
        <div class="text-primary laFont font-bold">
          Add File
        </div>
      </div>
      <div class="flex flex-col items-center z-5">
        <div :class="{'!bg-primary !text-white':stepNum>=2}" class="border-primary border-5px text-primary flex justify-center items-center text-32px font-bold w-60px h-60px rounded-full mb-8px bg-white">
          2
        </div>
        <div :class="{'opacity-100':stepNum>=2}"  class=" opacity-40 text-primary laFont font-bold">
          Add Signature
        </div>
      </div>
      <div class="flex flex-col items-center z-5">
        <div :class="{'!bg-primary !text-white':stepNum>=3}" class="border-primary border-5px text-primary flex justify-center items-center text-32px font-bold w-60px h-60px rounded-full mb-8px bg-white">
          3
        </div>
        <div :class="{'opacity-100':stepNum>=2}"  class=" opacity-40 text-primary laFont font-bold">
          Done
        </div>
      </div>
      <div class="absolute bg-primary top-30px z-0 h-5px left-5px w-90%"></div>

    </div>
  </section>
</template>


<script setup>
const props = defineProps({
  stepNum:{
    type: Number,
    default: 1,
  }
})
</script>
