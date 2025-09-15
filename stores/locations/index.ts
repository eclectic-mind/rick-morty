import { defineStore } from "pinia";

export const useLocationsStore = defineStore('Locations', {
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
            $fetch(`https://rickandmortyapi.com/api/location/?page=${this.currentPage}`)
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

        async fetchLocationById(id: number) {
            const currentItem = this.items.find(item => item.id === id);

            if (currentItem) {
                return currentItem;
            }

            return await $fetch(`https://rickandmortyapi.com/api/location/${id}`);
        },

        setCurrentPage(value: number) {
            this.currentPage = value;
        },
    },
});
