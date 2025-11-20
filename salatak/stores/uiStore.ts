import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => {
    return {
      theme: "dark",
    }
  },
  actions: {
    toggleTheme() {
      if (this.theme == 'dark') {
        this.theme = 'wireframe'
        return
      }
      this.theme = 'dark'
    }
  },
  persist: true,
})
