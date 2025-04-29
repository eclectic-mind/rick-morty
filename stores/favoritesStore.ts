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
            console.log('add', this.characters);
        },

        removeFavCharacter(item: any): void {
            this.characters.splice(this.characters.indexOf(item), 1);
            console.log('remove', this.characters);
        }
    },
});
