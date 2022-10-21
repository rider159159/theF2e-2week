<template>
  <div>
    <!-- <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName">
        <component :is="Component" />
      </transition>
    </router-view> -->
    <router-view v-slot="{ Component, route }">
      <transition name="delayFade" mode="out-in">
        <component :is="Component" :key="route" />
      </transition>
    </router-view>
  </div>
</template>