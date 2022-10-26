<template>
  <transition name="slide-in-up">
    <div v-show="modalController" class="print:static print:p-0 fixed bottom-0 top-0 left-0 p-6 md:p-10 box-border w-full flex justify-center items-center z-[120]">
      <transition name="opacityTransition">
        <div ref="modalScroll" :class="width" class="print:overflow-visible print:!max-h-full max-h-[75vh] bg-white rounded-md z-[120] pb-2 overflow-y-auto">
          <div class="px-4 pt-2 sticky top-0 z-10 bg-white print:hidden">
            <div class="flex w-full justify-end">
              <span class="cursor-pointer text-2xl" @click="closeModal()">
                x
              </span>
            </div>
          </div>

          <!-- body -->
          <div class="px-4">
            <slot></slot>
          </div>
        </div>
      </transition>

      <transition name="opacityTransition">
        <div class="print:hidden bg-gray-700 opacity-75 fixed top-0 left-0 w-full h-full z-[110]"></div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    modalController: {
      type: Boolean,
      required: true,
      default: false,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "w-1/2",
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
