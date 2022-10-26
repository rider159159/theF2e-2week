<template>
  <ul class="loop">
    <li>
      <span> Ryder 好師 Ryder 好帥</span
      ><span> Ryder 好師 Ryder 好帥</span>
    </li>
    <li>
      <span> Ryder 好師 Ryder 好帥</span>
      <span> Ryder 好師 Ryder 好帥</span>
    </li>
    <li>
      <span> Ryder 好師 Ryder 好帥</span>
      <span> Ryder 好師 Ryder 好帥</span>
    </li>
  </ul>
  <div class="overflow-x-hidden">

    <header>
      <h1 class="font-bold text-[40px]">ScrollTrigger</h1>
      <h2>Demo</h2>
    </header>

    <section class="demo-text mt-[500px] mb-[5000px]">
      <div class="wrapper text">
        300年的暴政、不明面具、遺失的痛覺與記憶。化身為強大火焰之劍的唯一使用者，與不可碰觸的少女及伙伴們一起挺身對抗壓迫者吧。
      </div>
    </section>
  </div>
</template>

<script setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, TextPlugin)

onMounted(() => {
  gsap.to(".loop", {
    xPercent: "-50", 
    ease: "none",
    duration: 10,
    repeat: -1,
  });

  gsap.fromTo(".wrapper",{ x: '16px' } ,{
    x: -1500,
    scrollTrigger: {
      trigger: document.querySelector('.wrapper'),
      scrub: 0.5
    } 
  })
})
</script>

<style scoped>
.loop {
  display: inline-block;
  font-family: "Dela Gothic One";
  font-size: 5rem;
  color: transparent;
  white-space: nowrap; /*文字必須設為nowrap，否則文字會自動換行*/
  height: 100%;
  -webkit-text-stroke: 1px black;
}
.loop > span {
  display: inline-block;
}
.text{
  font-size: 50px;
  line-height: 1;
  font-weight: 900;
  white-space: nowrap;
}
</style>