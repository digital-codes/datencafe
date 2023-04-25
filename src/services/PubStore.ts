// store for source node items

import { defineStore } from 'pinia'


export interface DataSrc {
    id: string
    data: any // dataframe as json
    root: boolean // root node, e.g. file input
    loaded: boolean // for root
    meta: any
}


export const PubStore = defineStore({
    id: 'pubstore',
    state: () => ({
        items: [] as DataSrc[]
    }),
    actions: {
        clear() {
            this.items = JSON.parse(JSON.stringify([])) as DataSrc[]
        },
        init(items:DataSrc[]) {
            if (this.items.length > 0) {
                console.log("Init store:",this.items)
                throw (new Error("Can only init empty store!"))
            }
            this.items = JSON.parse(JSON.stringify(items)) as DataSrc[]
        },
        add(id?: string, root = false) {
            if (id === undefined) {
                throw (new Error("Missing id on add()"))
            }
            console.log("Add:", id)
            const item = {
                id: id,
                data: {},
                root: root,
                loaded: false
            }
            this.items.push(item as DataSrc)
            console.log("sources:", this.items.length)
        },
        remove(id?: string) {
            if (id === undefined) {
                throw (new Error("Missing id on remove()"))
            }
            console.log("Remove:", id)
            // maybe disconnect all destinations first ...
            const sidx = this.items.findIndex((item: DataSrc) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            this.items.splice(sidx, 1)
            console.log("Removed")
            console.log("sources:", this.items.length)
        },
        update(id?: string, data?: any, meta?:any) {
            if (id === undefined) {
                throw (new Error("Missing id on update"))
            }
            console.log("Update:", id)
            // find item
            const sidx = this.items.findIndex((item: DataSrc) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            console.log("Src found:", sidx, this.items[sidx].id)
            // set data, if provided
            if (data !== undefined) {
                console.log("Setting data")
                this.items[sidx].data = data
                // also set loaded
                this.items[sidx].loaded = true
            } else {
                // check if data is present by checking loaded
                if (!this.items[sidx].loaded) {
                    throw new Error("Update without loaded data")
                }
                console.log("Reusing data")
                // reuse exisiting data
            }
            if (meta !== undefined) {
                console.log("Setting meta")
                this.items[sidx].meta = meta
            } else {
                this.items[sidx].meta = {}
            }
        },
    },
    getters: {
        json: state => () => { return state.items },
        jsonString: state => () => { return JSON.stringify(state.items) },
        exists: state => (id: string) => {
            console.log("exists?:", id)
            // find item 
            const idx = state.items.findIndex((item: DataSrc) => (item.id === id))
            return (idx === -1) ? false : true
        },
        hasData: state => (id: string) => {
            console.log("has data?:", id)
            // find item 
            const s = state.items.find((item: DataSrc) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            return (s.loaded)
        },
        isLoadedRoot: state => (id: string) => {
            console.log("loaded root?:", id)
            const s = state.items.find((item: DataSrc) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            return (s.root && s.loaded)
        },
        getDataById: state => (id: string) => {
            const s = state.items.find((item: DataSrc) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            console.log("Getting data for:", s.id)
            return s.data
        },
        getMetaById: state => (id: string) => {
            const s = state.items.find((item: DataSrc) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            console.log("Getting meta for:", s.id)
            return s.meta
        },
        getLoadedRoots: state => () => {
            const rts = state.items.filter((item) => (item.root && item.loaded))
            return rts
        }
    }
})

