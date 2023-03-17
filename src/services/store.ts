

import { defineStore } from 'pinia'

export interface User {
    id: string
    name: string
    email: string
    address: {
        street: string
        city: string
        state: string
        zip: string
    }
    phone: string
}

export const userStore = defineStore({
    id: 'user',
    state: () => ({
        users: [] as User[]
    }),
    actions: {
        addUser(user: User) {
            console.log("Add:",user)
            this.users.push(user)
            console.log("users:",this.users.length)
        },
        removeUser(id:string) {
            const index = this.users.findIndex(user => user.id === id)
            if (index !== -1) {
                this.users.splice(index, 1)
            }
        },
        updateUser(user: User) {
            const index = this.users.findIndex(u => u.id === user.id)
            if (index !== -1) {
                this.users.splice(index, 1, user)
            }
        }
    },
    getters: {
        getUserById: state => (id: string) => {
            const u = state.users.find(user => user.id === id)
            console.log("Getting:",u)
            return u
        }
    }
})

// -------- language
enum Langs {
  DE = "de",
  EN = "en",
} 

export interface Language {
  lang: Langs
}

export const langStore = defineStore({
  id: 'language',
  state: () => ({
    lang: Langs.DE
  }),
  actions: {
    set(lang:Langs) {
      // console.log("set lang:",lang)
      /*
      if (! (typeof lang === 'string' && lang in Langs)) {
        throw new Error ("Lang invalid:" + String(lang))
      }
      */
      this.lang = lang
    }
  },
  getters: {
    get: state => () => {
        return state.lang
    }
  }
})


// -------- theme
export enum Modes {
  Dark = "dark",
  Light = "light",
} 

export interface Theme {
  theme: Modes
}

export const themeStore = defineStore({
  id: 'theme',
  state: () => ({
    theme: Modes.Light
  }),
  actions: {
    set(theme:Modes) {
      // console.log("set theme:",theme)
      /*
      if (! (theme in Modes)) {
        throw new Error ("Mode invalid:" + String(theme))
      }
      */
      this.theme = theme
    },
  },
  getters: {
    get: state => () => {
        return state.theme
    }
  }
})

