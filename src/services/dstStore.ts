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
    add(id: string, type: string) {
      console.log("DST Add:", id, type)
      const item = { id: id, type: type, src: "", update: 0 } as Subscriber
      this.items.push(item)
      console.log("DSTs:", this.items.length)
    },
    remove(id: string, type: string) {
      console.log("Rm dst:", id, type)
      // maybe disconnect all sources first
      // find item
      const idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items.splice(idx, 1)
      console.log("DSTS:", this.items.length)
    },
    update(id: string, type: string) {
      console.log("Update dst:", id, type)
      // find item
      const idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items[idx].update++
      console.log("update:", this.items[idx].update)
    },
    connect(id: string, type: string, src: string) {
      console.log("Connect dst:", id, type, src)
      // find item
      const idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items[idx].src = src
      console.log("connected to:", src)
    },
    disconnect(id: string, src: string, type?: string) {
      console.log("Disconnet dst:", id, type, src)
      // find item
      let idx: number
      if (type === undefined) {
        idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.src == src)))
      } else {
        idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type) && (item.src == src)))
      }
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items[idx].src = ""
      console.log("Disconnected from :", src)
    },
    invalidate(id: string, type: string) {
      console.log("Update dst:", id, type)
      // find item
      const idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items[idx].update = 0
      console.log("update:", this.items[idx].update)
    },
  },
  getters: {
    isValid: state => (id: string, type: string) => {
      console.log("IsValid:", id, type)
      // find item
      const idx = state.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      const valid = state.items[idx].update == 0
      console.log("valid:", valid)
      return valid
    },
    isConnected: state => (id: string, type: string) => {
      console.log("IsConnected:", id, type)
      // find item
      const idx = state.items.findIndex((item: Subscriber) => ((item.id === id) && (item.type == type)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      const connected = state.items[idx].src != ""
      console.log("valid:", connected)
      return connected
    }
  }
})

