<template>
  <section>
    <div class="w-full bg-primary">
      <img src="@/assets/image/index/logo.png" alt="">
    </div>
    <div class="w-full h-[calc(100vh-194px)] items-center bg bg-center bg-cover grid grid-cols-12">
      <div class="col-span-6 ml-5% mr-10%">
        <img src="@/assets/image/index/topic.png" alt="">
      </div>
      <div class="col-span-6 ml-10% mr-5% flex flex-col gap-y-40px">
        <h3 class="text-white text-40px laFont font-bold">
          Dot.Sign,
          <br>
          Digital signature generator for 
          <br>
          professionalists.
        </h3>
        <h4 class="text-white tex24px laFont font-bold">
          Upload · Sign · Go 
          <br>
          Keep it classy, keep it easy.
        </h4>
        <router-link to="/step1" class="font-bold laFont text-24px mr-2 bg-secondary1 w210px h50px flex justify-center items-center rounded-4px border-1px border-#000 hover:shadow-[4px_4px_0px_#000] duration-300">
          <p class="mr-8px">Start</p>
          <img src="@/assets/image/index/arrow.png" alt="">
        </router-link>
      </div>
    </div>
  </section>
</template>

<style>
.bg{
  background-image: url('@/assets/image/index/bs.svg');
}
</style>