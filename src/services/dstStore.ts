// store for destination node items

import { defineStore } from 'pinia'

import { EP } from "./EndPoints"

export interface Subscriber {
  id: string
  src: string
  ep: EP
  valid: boolean
}

export const subscriberStore = defineStore({
  id: 'subscriber',
  state: () => ({
    items: [] as Subscriber[]
  }),
  actions: {
    add(id: string, ep?: EP) {
      console.log("DST Add:", id, ep)
      let item: Subscriber
      if (ep === undefined) {
        item = { id: id, ep: EP.DATA, src: "", valid: false } as Subscriber
      } else {
        item = { id: id, ep: ep, src: "", valid: false } as Subscriber
      }
      this.items.push(item)
      console.log("DSTs:", this.items.length)
    },
    remove(id: string, ep?: EP) {
      console.log("Rm dst:", id, ep)
      // maybe disconnect all sources first
      // find item(s)
      const items = this._getById(id, ep)
      if (items.length == 0) {
        throw new Error("DST item not found")
      }
      // remove all selected
      items.forEach((item: Subscriber) => {
        const idx = this.items.findIndex((item1: Subscriber) => ((item1.id === item.id) && (item1.ep == item.ep)))
        this.items.splice(idx, 1)
        console.log("DSTS:", this.items.length)
      })
    },
    update(id: string, ep?: EP) {
      console.log("Update dst:", id, ep)
      // find item(s)
      const items = this._getById(id, ep)
      if (items.length == 0) {
        throw new Error("DST item not found")
      }
      items.forEach((item: Subscriber) => {
        console.log("Updating item:",item.id)
        item.valid = true
        }
      )
    },
    /*
    connect(id: string, src: string, ep: EP) {
      console.log("Connect dst:", id, ep, src)
      // find item
      const idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.ep == ep)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items[idx].src = src
      console.log("connected to:", src)
    },
    disconnect(id: string, src: string, ep?: EP) {
      console.log("Disconnet dst:", id, src, ep)
      // find items
      const items = this._getById(id, ep).filter((item) => (item.src == src))
      console.log("Disconnecting:",items)      
      if (items.length == 0) {
        throw new Error("DST item not found")
      }
      // remove all selected
      items.forEach((item: Subscriber) => {
        const idx = this.items.findIndex((item1: Subscriber) => ((item1.src === item.src) && (item1.id === item.id) && (item1.ep == item.ep)))
        if (idx === -1) {
          throw new Error("DST item not found")
        }
        this.items[idx].src = ""
        console.log("Disconnected from :", src)
      })
    },
    */
    invalidate(id: string, ep: EP) {
      console.log("invalidate dst:", id, ep)
      // find item
      const idx = this.items.findIndex((item: Subscriber) => ((item.id === id) && (item.ep == ep)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      this.items[idx].valid = false
      console.log("invlaidate:", this.items[idx].valid)
    },
  },
  getters: {
    json: state => () => { return state.items},
    _getById: state => (id: string, ep?: EP) => {
      // find item(s)
      let items: Subscriber[]
      if (ep !== undefined) {
        items = state.items.filter((item:Subscriber) =>  ((item.id === id) && (item.ep == ep)))
      } else {
        items = state.items.filter((item:Subscriber) =>  item.id === id)
      }
      return items
    },
    exists: state => (id: string) => {
      console.log("exists?:", id)
      // find destination item 
      const idx = state.items.findIndex((item: Subscriber) => (item.id === id))
      return (idx === -1) ? false : true
    },
    isValid: state => (id: string, ep?: EP) => {
      console.log("IsValid:", id, ep)
      // find item(s)
      let items: Subscriber[]
      if (ep !== undefined) {
        items = state.items.filter((item:Subscriber) =>  ((item.id === id) && (item.ep == ep)))
      } else {
        items = state.items.filter((item:Subscriber) =>  item.id === id)
      }
      if (items.length == 0) {
        throw new Error("DST item not found")
      }
      let valid = true // preset
      items.forEach((item) => {
        if (!item.valid) {
          valid = false
        }
      })
      /*
      const idx = state.items.findIndex((item: Subscriber) => ((item.id === id) && (item.ep == ep)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      const valid = state.items[idx].update == 0
      */
      console.log("valid:", valid)
      return valid
    },
    isConnected: state => (id: string, ep: EP) => {
      console.log("IsConnected:", id, ep)
      // find item
      const idx = state.items.findIndex((item: Subscriber) => ((item.id === id) && (item.ep == ep)))
      if (idx === -1) {
        throw new Error("DST item not found")
      }
      const connected = state.items[idx].src != ""
      console.log("connected:", connected)
      return connected
    },

  }
})

