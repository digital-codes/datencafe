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
                throw (new Error("Can only init empty store!"))
            }
            this.items = JSON.parse(JSON.stringify(items)) as DataSrc[]
        },
        add(id?: string, root = false) {
            if (id === undefined) {
                throw (new Error("Missing id on add()"))
            }
            const item = {
                id: id,
                data: {},
                meta: {},
                root: root,
                loaded: false
            }
            this.items.push(item as DataSrc)
        },
        remove(id?: string) {
            if (id === undefined) {
                throw (new Error("Missing id on remove()"))
            }
            // maybe disconnect all destinations first ...
            const sidx = this.items.findIndex((item: DataSrc) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            this.items.splice(sidx, 1)
        },
        update(id?: string, data?: any, meta?:any) {
            if (id === undefined) {
                throw (new Error("Missing id on update"))
            }
            // find item
            const sidx = this.items.findIndex((item: DataSrc) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            // set data, if provided
            if (data !== undefined) {
                this.items[sidx].data = data
                // also set loaded
                this.items[sidx].loaded = true
            } else {
                // check if data is present by checking loaded
                if (!this.items[sidx].loaded) {
                    throw new Error("Update without loaded data")
                }
                // reuse exisiting data
            }
            if (meta !== undefined) {
                this.items[sidx].meta = meta
            } else {
                this.items[sidx].meta = {}
            }
        },
        setMetaById(id?: string, meta?:any) {
            if (id === undefined) {
                throw (new Error("Missing id on update"))
            }
            // find item
            const sidx = this.items.findIndex((item: DataSrc) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            // set data, if provided
            if (meta !== undefined) {
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
            // find item 
            const idx = state.items.findIndex((item: DataSrc) => (item.id === id))
            return (idx === -1) ? false : true
        },
        hasData: state => (id: string) => {
            // find item 
            const s = state.items.find((item: DataSrc) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            return (s.loaded)
        },
        isLoadedRoot: state => (id: string) => {
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
            return s.data
        },
        getMetaById: state => (id: string) => {
            const s = state.items.find((item: DataSrc) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            const meta = s.meta
            return meta
        },
        getLoadedRoots: state => () => {
            const rts = state.items.filter((item) => (item.root && item.loaded))
            return rts
        }
    }
})

