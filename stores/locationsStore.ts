import { defineStore } from "pinia";

export const useLocationsStore = defineStore('Locations', {
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
            $fetch('https://rickandmortyapi.com/api/location')
                .then(response => {
                    this.items = Object.values(response?.results);
                    this.count = this.items.length;
                    this.pages = Math.ceil(this.count / this.perPage);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        async fetchLocationById(id: number) {
            const currentItem = this.items.find(item => item.id === id);

            if (currentItem) {
                return currentItem;
            }

            return await $fetch(`https://rickandmortyapi.com/api/location/${id}`);
        }
    },
});
