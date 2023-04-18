// store for source node items

import { defineStore } from 'pinia'


export const PrintStore = defineStore({
    id: 'printstore',
    state: () => ({
        content: "" as string 
    }),
    actions: {
        set(c:string) {
            this.content = c
        },
    },
    getters: {
        get: state => () => { return state.content },
    }
})

