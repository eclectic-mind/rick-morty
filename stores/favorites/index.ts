import { defineStore } from "pinia";

export const useFavoritesStore = defineStore('Favorites', {
    state: () => ({
        characters: [],
        locations: [],
        episodes: []
    }),

    actions: {
        addFavCharacter(item: any): void {
            this.characters.push(item);
        },

        removeFavCharacter(item: any): void {
            this.characters.splice(this.characters.indexOf(item), 1);
        },

        addFavEpisode(item: any): void {
            this.episodes.push(item);
        },

        removeFavEpisode(item: any): void {
            this.episodes.splice(this.episodes.indexOf(item), 1);
        },

        addFavLocation(item: any): void {
            this.locations.push(item);
        },

        removeFavLocation(item: any): void {
            this.locations.splice(this.locations.indexOf(item), 1);
        }
    },
});
