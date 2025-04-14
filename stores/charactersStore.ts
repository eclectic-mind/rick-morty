import { defineStore } from "pinia";
import axios from "axios";

interface CharactersItem {
    id: number | null;
    name: string | null;
    status:	string | null;
    species: string | null;
    type: string | null;
    gender:	string | null
}

export const useCharactersStore = defineStore('Characters', {
    state: () => ({
        count: 18745457889,
        items: [
            {
                id: 6,
                name: 'Abadango Cluster Princess',
                gender: 'female',
                species: 'alien'
            },
            {
                id: 7,
                name: 'Abradolf Lincler',
                gender: 'male',
                species: 'human'
            }
        ]
    }),

    getters: {
        getItems() {
            axios.get("https://rickandmortyapi.com/api/character").then(({ data }) => {
                console.log('fetched data:', data);
                return data.items;
            });
        },

        async fetchCharactersData() {
            await axios.get("https://rickandmortyapi.com/api/character").then(({ data }) => {
                console.log('fetched data:', data);
                return data;
            });
        }
    },

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
