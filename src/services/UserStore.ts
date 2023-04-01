// store for source node items

import { defineStore } from 'pinia'

export const UerStore = defineStore({
    id: 'userstore',
    state: () => ({
        token: "" 
    }),
    actions: {
        clear() {
            this.token = String("")
        },
        set(tok?: string) {
            if (tok === undefined) {
                throw (new Error("Missing token on add()"))
            }
            this.token = tok 
        },
    },
    getters: {
        token: state => () => { return state.token },
        exists: state => () => {
            return state.token != ""
        },
    }
})

