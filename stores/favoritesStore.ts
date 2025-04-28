import { defineStore } from "pinia";

export const useFavoritesStore = defineStore('Favorites', {
    state: () => ({
        characters: [
            {
                id: 6,
                name: 'Abadango Cluster Princess',
                gender: 'female',
                species: 'alien'
            }
        ],
        locations: [
            {
                id: 8,
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
        ],
        episodes: [
            {
                id: 20,
                name: "Look Who's Purging Now",
                air_date: "September 27, 2015",
                episode: "S02E09",
                characters: ["https://rickandmortyapi.com/api/character/1","https://rickandmortyapi.com/api/character/2","https://rickandmortyapi.com/api/character/3","https://rickandmortyapi.com/api/character/4","https://rickandmortyapi.com/api/character/5","https://rickandmortyapi.com/api/character/26","https://rickandmortyapi.com/api/character/139","https://rickandmortyapi.com/api/character/202","https://rickandmortyapi.com/api/character/273","https://rickandmortyapi.com/api/character/341"],
                url: "https://rickandmortyapi.com/api/episode/20",
                created: "2017-11-10T12:56:35.772Z"
            }
        ]
    }),

    actions: {
        init() {
            console.log('init fav store');
        }
    },
});
