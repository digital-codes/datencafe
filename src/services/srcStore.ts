// store for source node items

import { defineStore } from 'pinia'

export interface Provider {
    id: string
    dsts: [{
      id: string,
      type: string
    }]
    data: Object // dataframe as json
}

export const providerStore = defineStore({
    id: 'provider',
    state: () => ({
        items: [] as Provider[]
    }),
    actions: {
        addSrc(item: Provider) {
            console.log("Add:",item.id)
            this.items.push(item)
            console.log("sources:",this.items.length)
        },
        removeSrc(id:string) {
            console.log("Remove:",id)
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items.splice(index, 1)
                console.log("Removed")
            }
        },
        addDst(id:string, dst: {id: string,type: string})  {
            console.log("Add dst:",id,dst.id,dst.type)
            // find item
            const sidx = this.items.findIndex(item => item.id === id)
            if (sidx !== -1) {
              console.log("Src found:",this.items[sidx].id)
              const didx = this.items[sidx].dsts.findIndex(d => ((d.id == dst.id) && (d.type == dst.type)) )
              if (didx !== -1) {
                  throw new Error("Destination/Type exists")
              }
              this.items[sidx].dsts.push(dst)
              console.log("dsts:",this.items[sidx].dsts)
            } else {
              console.log("Src not found")
            }
        },
        removeDst(id:string, dst: {id: string,type: string})  {
            console.log("Rm dst:",id,dst.id,dst.type)
            // find item
            const sidx = this.items.findIndex(item => item.id === id)
            if (sidx !== -1) {
              console.log("Src found:",this.items[sidx].id)
              const didx = this.items[sidx].dsts.findIndex(d => ((d.id == dst.id) && (d.type == dst.type)) )
              if (didx === -1) {
                  throw new Error("Destination/Type doesn't exists")
              }
              this.items[sidx].dsts.splice(didx, 1)
              console.log("dsts:",this.items[sidx].dsts)
            } else {
              console.log("Src not found")
            }
        }
    },
    getters: {
        getSrcDataById: state => (id: string) => {
            const s = state.items.find(item => item.id === id)
            if (s === undefined) {
              throw new Error("Invalid item id")
            }
            console.log("Getting:",s.id)
            return s.data
        }
    }
})

