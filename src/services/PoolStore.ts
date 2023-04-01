// store for source node items

import { defineStore } from 'pinia'


export interface PoolItem {
    url: string // the url
    name: string // human readable
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
        add(url?: string, name="", meta="") {
            if (url === undefined) {
                throw (new Error("Missing url on add()"))
            }
            console.log("Add:", url)
            const item = {
                url: url,
                name: name,
                meta: meta
            }
            this.items.push(item as PoolItem)
            console.log("pool size:", this.items.length)
        },
        remove(url?: string) {
            if (url === undefined) {
                throw (new Error("Missing url on remove()"))
            }
            console.log("Remove:", url)
            const sidx = this.items.findIndex((item: PoolItem) => item.url === url)
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

