import { defineStore } from 'pinia';

export const useEpisodesStore = defineStore('Episodes', {
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
            $fetch('https://rickandmortyapi.com/api/episode')
                .then(response => {
                    console.log('response', response);

                    this.items = Object.values(response?.results);
                    this.count = this.items.length;
                    this.pages = Math.ceil(this.count / this.perPage);

                    console.log('episodes', this.items, typeof this.items);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    },
});