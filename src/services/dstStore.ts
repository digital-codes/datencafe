// store for destination node items

import { defineStore } from 'pinia'

export interface Subscriber {
    id: string
    src: string
    type: string
    update: number
}

export const subscriberStore = defineStore({
    id: 'subscriber',
    state: () => ({
        items: [] as Subscriber[]
    }),
    actions: {
        addDst(id:string, type: string) {
            console.log("DST Add:",id,type)
            const item = {id: id, type:type,src:"",update:0} as Subscriber
            this.items.push(item)
            console.log("DSTs:",this.items.length)
        },
        removeDst(id:string, type: string)  {
            console.log("Rm dst:",id,type)
            // find item
            const idx = this.items.findIndex(item => ((item.id === id) && (item.type == type)))
            if (idx !== -1) {
              this.items.splice(idx, 1)
              console.log("DSTS:",this.items.length)
            } else {
              throw new Error("DST item not found:" + id + " " + type)
            }
        },
        updateDst(id: string, type: string) {
            console.log("Update dst:",id,type)
            // find item
            const idx = this.items.findIndex(item => ((item.id === id) && (item.type == type)))
            if (idx !== -1) {
              this.items[idx].update++
              console.log("update:",this.items[idx].update)
            } else {
              throw new Error("DST item not found:" + id + " " + type)
            }
        },
        invalidateDst(id: string, type: string) {
            console.log("Update dst:",id,type)
            // find item
            const idx = this.items.findIndex(item => ((item.id === id) && (item.type == type)))
            if (idx !== -1) {
              this.items[idx].update = 0
              console.log("update:",this.items[idx].update)
            } else {
              throw new Error("DST item not found:" + id + " " + type)
            }
        },
    },
    getters: {
        isValid: state => (id: string, type:string) => {
            console.log("IsValid:",id,type)
            // find item
            const idx = state.items.findIndex(item => ((item.id === id) && (item.type == type)))
            if (idx !== -1) {
                const valid = state.items[idx].update == 0
                console.log("valid:",valid)
                return valid
            } else {
              throw new Error("DST item not found:" + id + " " + type)
            }
        },
        isConnected: state => (id: string, type:string) => {
          console.log("IsConnected:",id,type)
          // find item
          const idx = state.items.findIndex(item => ((item.id === id) && (item.type == type)))
          if (idx !== -1) {
              const connected = state.items[idx].src != ""
              console.log("valid:",connected)
              return connected
          } else {
            throw new Error("DST item not found:" + id + " " + type)
          }
      }
  }
})

