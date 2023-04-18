// store for source node items

import { defineStore } from "pinia";

// -------- language
enum Langs {
  DE = "de",
  EN = "en",
}

export interface Language {
  lang: Langs;
}

// -------- theme
export enum Modes {
  Dark = 1,
  Light = 0,
}

export interface Theme {
  theme: Modes;
}

// all together 
export interface UserInfo {
  token: string; // token
  dark?: Modes;
  lang?: Langs;
  title?: string;
  author?: string;
  email?: string;
  link?: string;
  date?: string;
  tags?: string[];
  category?: string;
  text?: string;
}

const clr = {
  token: "",
  dark: Modes.Light,
  lang: Langs.DE,
  title: "",
  author: "",
  email: "",
  link: "",
  date: "",
  tags: [] as string[],
  category: "",
  text: "",
};

export const UserStore = defineStore({
  id: "userstore",
  state: () => JSON.parse(JSON.stringify(clr)),
  actions: {
    clear() {
      console.log("clear user");
      this.token = clr.token;
      this.dark = clr.dark;
      this.lang = clr.lang;
      this.clearStory()
    },
    clearStory() {
      console.log("clear story");
      this.title = clr.title;
      this.author = clr.author;
      this.email = clr.email;
      this.link = clr.link;
      this.date = clr.date;
      this.category = clr.category;
      this.tags = clr.tags;
      this.text = clr.text;

    },
    setToken(tok?: string) {
      if (tok === undefined) {
        throw new Error("Missing token on add()");
      }
      this.token = tok;
    },
    setLang(lang = clr.lang) {
      this.lang = lang;
    },
    setDark(dark = clr.dark) {
      this.dark = dark;
    },
    setCategory(cat = "") {
      this.category = cat;
    },
    setTags(tags: string[] = []) {
      this.tags = tags;
    },
    setText(text = "") {
      this.text = text;
    },
    setTitle(title = "") {
      this.title = title;
    },
    setAuthor(author = "") {
      this.author = author;
    },
    setEmail(email = "") {
      this.email = email;
    },
    setLink(link = "") {
      this.link = link;
    },
    setDate(dt = "") {
      this.date = dt;
    },
  },
  getters: {
    getToken: (state) => () => {
      return state.token;
    },
    getDark: (state) => () => {
      return state.dark;
    },
    getLang: (state) => () => {
      return state.lang;
    },
    getStory: (state) => () => {
      return {
        title: state.title,
        author: state.author,
        date: state.date,
        email: state.email,
        link: state.link,
        tags: state.tags,
        category: state.category,
        text: state.text,
      };
    },
    exists: (state) => () => {
      return state.token !== "";
    },
  },
});

