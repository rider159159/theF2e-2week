import { defineStore } from "pinia"

export const loadingStore = defineStore('loadingStore', () => {
  const isLoading = ref(false)

  const isLoadingGetter = computed(() => isLoading.value)

  const changeLoading = (bool) => {
    isLoading.value = bool
  }

  return {
    isLoading,
    isLoadingGetter,
    changeLoading
  }
})