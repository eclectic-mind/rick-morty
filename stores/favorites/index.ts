import { defineStore } from "pinia";

export const useFavoritesStore = defineStore('Favorites', {
    state: () => ({
        characters: [],
        locations: [],
        episodes: [],
        sum: 0
    }),

    actions: {
        addFavCharacter(item: any): void {
            this.characters.push(item);
            this.countSum();
        },

        removeFavCharacter(item: any): void {
            this.characters.splice(this.characters.indexOf(item), 1);
            this.countSum();
        },

        addFavEpisode(item: any): void {
            this.episodes.push(item);
            this.countSum();
        },

        removeFavEpisode(item: any): void {
            this.episodes.splice(this.episodes.indexOf(item), 1);
            this.countSum();
        },

        addFavLocation(item: any): void {
            this.locations.push(item);
            this.countSum();
        },

        removeFavLocation(item: any): void {
            this.locations.splice(this.locations.indexOf(item), 1);
            this.countSum();
        },

        countSum(): number {
            return this.characters.length + this.locations.length + this.episodes.length;
        }
    },
});
