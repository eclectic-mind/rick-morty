import { defineStore } from "pinia";

export const useCharactersStore = defineStore('Characters', {
    state: () => ({
        count: 0,
        pages: 0,
        prev: null,
        next: null,
        currentPage: 1,
        items: []
    }),

    actions: {
        init() {
            this.fetchData();
        },

        fetchData() {
            $fetch(`https://rickandmortyapi.com/api/character/?page=${this.currentPage}`)
                .then(response => {
                    this.items = Object.values(response?.results);
                    const info = response?.info;
                    this.count = info.count;
                    this.pages = info.pages;
                    this.prev = info.prev;
                    this.next = info.next;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        async fetchCharacterById(id: number) {
            const currentItem = this.items.find(item => item.id === id);

            if (currentItem) {
                return currentItem;
            }

            return await $fetch(`https://rickandmortyapi.com/api/character/${id}`);
        },

        setCurrentPage(value: number) {
            if (this.currentPage !== value) {
                this.currentPage = value;
                this.fetchData();
            }
        },
    },
});
