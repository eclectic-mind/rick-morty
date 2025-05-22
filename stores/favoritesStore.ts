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
            console.log('add character', this.characters);
        },

        removeFavCharacter(item: any): void {
            this.characters.splice(this.characters.indexOf(item), 1);
            console.log('remove character', this.characters);
        },

        addFavEpisode(item: any): void {
            this.episodes.push(item);
            console.log('add episode', this.episodes);
        },

        removeFavEpisode(item: any): void {
            this.episodes.splice(this.episodes.indexOf(item), 1);
            console.log('remove episode', this.episodes);
        },

        addFavLocation(item: any): void {
            this.locations.push(item);
            console.log('add location', this.locations);
        },

        removeFavLocation(item: any): void {
            this.locations.splice(this.locations.indexOf(item), 1);
            console.log('remove location', this.locations);
        }
    },
});
