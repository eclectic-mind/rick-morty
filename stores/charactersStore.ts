import { defineStore } from "pinia";

export const useCharactersStore = defineStore('Characters', {
    state: () => ({
        count: 0,
        pages: 0,
        perPage: 6,
        currentPage: 1,
        items: []
    }),

    actions: {
        init() {
            this.fetchData();
        },

        fetchData() {
            $fetch('https://rickandmortyapi.com/api/character')
                .then(response => {
                    this.items = Object.values(response?.results);
                    this.count = this.items.length;
                    this.pages = Math.ceil(this.count / this.perPage);
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
        }
    },
});
