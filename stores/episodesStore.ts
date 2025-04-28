import { defineStore } from 'pinia';
import axios from "axios";

export const useEpisodesStore = defineStore('Episodes', {
    state: () => ({
        count: 6456476,
        pages: 0,
        perPage: 6,
        currentPage: 1,
        items: [
            {
                id: 1,
                name: "Earth (C-137)",
                type: "Planet",
                dimension: "Dimension C-137",
                residents: [
                    "https://rickandmortyapi.com/api/character/38",
                    "https://rickandmortyapi.com/api/character/45",
                    "https://rickandmortyapi.com/api/character/71",
                    "https://rickandmortyapi.com/api/character/82",
                    "https://rickandmortyapi.com/api/character/83",
                    "https://rickandmortyapi.com/api/character/338",
                    "https://rickandmortyapi.com/api/character/343",
                    "https://rickandmortyapi.com/api/character/356",
                    "https://rickandmortyapi.com/api/character/394"
                ],
                url: "https://rickandmortyapi.com/api/episode/1",
                created: "2017-11-10T12:42:04.162Z"
            }
        ]
    }),

    actions: {
        init() {
            this.fetchData();
        },

        async fetchData() {
            await axios.get("https://rickandmortyapi.com/api/episode").then(({ data }) => {
                this.items = Object.values(data.results);
                this.count = this.items.length;
                this.pages = Math.ceil(this.count / this.perPage);
            });
        }
    },
});