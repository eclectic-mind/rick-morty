import { defineStore } from "pinia";
import axios from "axios";

export const useCharactersStore = defineStore('Characters', {
    state: () => ({
        count: 18745457889,
        items: [
            {
                id: 6,
                name: 'Abadango Cluster Princess',
                gender: 'female',
                species: 'alien'
            }
        ]
    }),

    actions: {
        init() {
            this.fetchData();
        },

        async fetchData() {
            await axios.get("https://rickandmortyapi.com/api/character").then(({ data }) => {
                this.items = Object.values(data.results);
            });
        }
    },
});
