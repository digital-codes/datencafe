// store for source node items

import { defineStore } from 'pinia'

export interface Client {
    id: string
    type: string
}


export interface Provider {
    id: string
    /*
    dsts: [{
      id: string,
      type: string
    }]
    */
    dsts: [Client]
    data: any // dataframe as json
    root: boolean // root node, e.g. file input
    loaded: boolean // for root
}


export const providerStore = defineStore({
    id: 'provider',
    state: () => ({
        items: [] as Provider[]
    }),
    actions: {
        add(id: string, data = undefined, root = false) {
            console.log("Add:", id)
            const dt = (data === undefined)?{}:data
            const item = {
                id: id,
                dsts: [] as Client[],
                data: dt,
                root: root,
                loaded: (data !== undefined)
            }
            this.items.push(item as Provider)
            console.log("sources:", this.items.length)
        },
        remove(id: string) {
            console.log("Remove:", id)
            // maybe disconnect all destinations first ...
            const sidx = this.items.findIndex((item: Provider) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            this.items.splice(sidx, 1)
            console.log("Removed")
            console.log("sources:", this.items.length)
        },
        update(id: string, data: any) {
            console.log("Update:", id)
            // find item
            const sidx = this.items.findIndex((item: Provider) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            console.log("Src found:", this.items[sidx].id)
            // set data
            this.items[sidx].data = data
            // set loaded
            this.items[sidx].loaded = true
            // return affected destinations
            // ..
            const dsts = [] as string[]
            this.items[sidx].dsts.forEach((d) => {
                // update all dsts via providerStore.update(id: string, type: string)
                if (!(d.id in dsts)) {
                    dsts.push(d.id)
                }
            })
            return dsts
            // ..
        },
        connect(id: string, dst: Client) {
            console.log("Add dst:", id, dst.id, dst.type)
            // find item
            const sidx = this.items.findIndex((item: Provider) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            console.log("Src found:", this.items[sidx].id)
            const didx = this.items[sidx].dsts.findIndex((d: Client) => ((d.id == dst.id) && (d.type == dst.type)))
            if (didx !== -1) {
                throw new Error("Destination/Type exists")
            }
            this.items[sidx].dsts.push(dst)
            console.log("dsts:", this.items[sidx].dsts)
        },
        disconnect(id: string, dst: Client) {
            console.log("Rm dst:", id, dst.id, dst.type)
            // find item
            const sidx = this.items.findIndex((item: Provider) => item.id === id)
            if (sidx === -1) {
                throw new Error("Source doesn't exist")
            }
            console.log("Src found:", this.items[sidx].id)
            const didx = this.items[sidx].dsts.findIndex((d: Client) => ((d.id == dst.id) && (d.type == dst.type)))
            if (didx === -1) {
                throw new Error("Destination/Type doesn't exists")
            }
            this.items[sidx].dsts.splice(didx, 1)
            console.log("dsts:", this.items[sidx].dsts)
        }
    },
    getters: {
        json: state => () => { return state.items },
        exists: state => (id: string) => {
            console.log("exists?:", id)
            // find item 
            const idx = state.items.findIndex((item: Provider) => (item.id === id))
            return (idx === -1) ? false : true
        },
        getDataById: state => (id: string) => {
            const s = state.items.find((item: Provider) => item.id === id)
            if (s === undefined) {
                throw new Error("Invalid item id")
            }
            console.log("Getting:", s.id)
            return s.data
        },
        getLoadedRoots: state => () => {
            const rts = state.items.filter((item) => (item.root && item.loaded))
            return rts
        }
    }
})

