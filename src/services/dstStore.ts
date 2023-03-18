// store for destination node items

import { defineStore } from 'pinia'

export interface Subscriber {
    id: string
    type: string
    update: number
}

export const subscriberStore = defineStore({
    id: 'subscriber',
    state: () => ({
        items: [] as Subscriber[]
    }),
    actions: {
        addDst(item: Subscriber) {
            console.log("DST Add:",item.id)
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
        }
    }
})

