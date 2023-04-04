// store for source node items

import { defineStore } from 'pinia'

export interface UserInfo {
    token: string // token
}

export const UserStore = defineStore({
    id: 'userstore',
    state: () => ({
        info: {} as UserInfo
    }),
    actions: {
        clear() {
            this.info = {token:""} as UserInfo
        },
        set(tok?: string) {
            if (tok === undefined) {
                throw (new Error("Missing token on add()"))
            }
            this.info = {token:tok} 
        },
    },
    getters: {
        token: state => () => { return state.info.token },
        exists: state => () => {
            return ((state.info.token !== undefined) && (state.info.token !== ""))
        },
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
  
  