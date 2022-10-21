<template>
  <div class="w-full h-screen flex items-center justify-center gap-2">
    <router-link to="/" class="bg-[#feb401] px-5 py-1.5 text-white">Home</router-link>
    <button @click="getRoomList()" class="bg-[#feb401] px-5 py-1.5 text-white">getRoomList</button>
  </div>
</template>

<script setup>

  const query = {
    pageNo: 1,
    pageSize: 3
  }

  const api = inject('$api')

  const getRoomList = () => {
    api.room.getRoomList(query)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }

</script>