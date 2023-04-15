// store for source node items

import { defineStore } from 'pinia'

export interface UserInfo {
  "token": string // token
  "dark"?: boolean
  "lang"?: string
  "title"?: string
  "author"?: string
  "email"?: string
  "date"?: string
  "tags"?: string[]
  "category"?: string
  "text"?: string
}

const clr = {
  "token": "",
  "dark": false,
  "lang": "de",
  "title":"",
  "author":"",
  "email":"",
  "date":"",
  "tags": [] as string[],
  "category": "",
  "text": ""
} 

export const UserStore = defineStore({
  id: 'userstore',
  state: () => (clr),
  actions: {
    clear() {
      console.log("clear user")
      this.token = clr.token
      this.dark = clr.dark
      this.lang = clr.lang
      this.title = clr.title
      this.author = clr.author
      this.email = clr.email
      this.date = clr.date
      this.category = clr.category
      this.tags = clr.tags
      this.text = clr.text
    },
    
    setToken(tok?: string) {
      if (tok === undefined) {
        throw (new Error("Missing token on add()"))
      }
      this.token = tok
    },
    setDark(dark = false) {
      this.dark = dark
    },
    setCategory(cat = "") {
      this.category = cat
    },
    setTags(tags: string [] = []) {
      this.tags = tags
    },
    setText(text = "") {
      this.text = text
    },
    setTitle(title = "") {
      this.title = title
    },
    setAuthor(author = "") {
      this.author = author
    },
    setEmail(email = "") {
      this.email = email
    },
    setDate(dt = "") {
      this.date = dt
    },
  },
  getters: {
    getToken: state => () => { 
      return state.token
    },
    getDark: state => () => { return state.dark },
    getStory: state => () => { 
      return {
        title:state.title,
        author:state.author,
        date:state.date,
        email:state.email,
        tags: state.tags,
        category: state.category,
        text: state.text 
      }
    },
    exists: state => () => {
      return (state.token !== "")
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

export const LangStore = defineStore({
  id: 'language',
  state: () => ({
    lang: Langs.DE
  }),
  actions: {
    set(lang: Langs) {
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

export const ThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    theme: Modes.Light
  }),
  actions: {
    set(theme: Modes) {
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

