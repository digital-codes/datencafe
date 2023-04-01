// store for source node items

import { defineStore } from 'pinia'


export interface PoolItem {
    id: string // the url
    meta?: string // json string, optional
}


export const PoolStore = defineStore({
    id: 'poolstore',
    state: () => ({
        items: [] as PoolItem[]
    }),
    actions: {
        init(itemString:string) {
            if (this.items.length > 0) {
                throw (new Error("Can only init empty store!"))
            }
            this.items = JSON.parse(itemString) as PoolItem[]
        },
        add(id?: string, meta="") {
            if (id === undefined) {
                throw (new Error("Missing id on add()"))
            }
            console.log("Add:", id)
            const item = {
                id: id,
                meta: meta
            }
            this.items.push(item as PoolItem)
            console.log("pool size:", this.items.length)
        },
        remove(id?: string) {
            if (id === undefined) {
                throw (new Error("Missing id on remove()"))
            }
            console.log("Remove:", id)
            const sidx = this.items.findIndex((item: PoolItem) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            this.items.splice(sidx, 1)
            console.log("Removed")
            console.log("sources:", this.items.length)
        },
    },
    getters: {
        get: state => () => { return state.items },
    }
})

