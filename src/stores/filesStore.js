import { defineStore } from 'pinia';

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [],
  }),
  actions: {
    addFile(file) {
      this.files.push(file);
    },
    removeFile(id) {
      this.files = this.files.filter(file => file.id !== id);
    },
    togglePin(id) {
      const file = this.files.find(file => file.id === id);
      if (file) {
        file.pinned = !file.pinned;
      }
    },
  },
});