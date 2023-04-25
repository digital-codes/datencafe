// store for source node items

import { defineStore } from "pinia";
import * as jose from 'jose'
import { PreFixes } from "@/services/GlobalDefs";

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
  key: string; // public key
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
  consent?: boolean
  fullsize?: boolean
  starter?: string // calling a story
  flowrdy?: boolean // flow has been loaded
}

const clr = {
  token: "",
  key: "",
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
  consent: false,
  fullsize: true,
  starter: "",
  flowrdy: false
};

export const UserStore = defineStore({
  id: "userstore",
  state: () => JSON.parse(JSON.stringify(clr)),
  actions: {
    clear() {
      console.log("clear user");
      this.token = clr.token;
      this.key = clr.key;
      this.dark = clr.dark;
      this.lang = clr.lang;
      this.consent = clr.consent;
      this.fullsize = clr.fullsize;
      this.starter = clr.starter;
      this.flowrdy = clr.flowrdy;
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
    async setToken(tok = clr.token, key = clr.key) {
      console.log("set tok",tok,key)
      const ok = await this.jwtVerify(tok,key)
      if (ok) {
        this.token = tok
        this.key = key
        await localStorage.setItem(PreFixes.LSTOKPREFIX,tok)
        await localStorage.setItem(PreFixes.LSKEYPREFIX,key)
        const loc = window.location.hostname
        await localStorage.setItem(PreFixes.LSLOCPREFIX,loc)
        console.log("LS set")
      }
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
    setConsent(c:boolean) {
      this.consent = c;
    },
    setFullsize(f:boolean) {
      this.fullsize = f;
    },
    setStarter(s:string) {
      this.starter = s;
    },
    setFlowrdy(s = false) {
      this.flowrdy = s
    },
    // jwt verify ...
    async jwtVerify(token:string,key:string) {
      const alg = 'RS256'
      console.log("verify tok,key",token,key)
      if ((token == clr.token) || (key == clr.key) ) {
        console.log("Invalid Token")
        this.token = clr.token
        this.key = clr.key
        await localStorage.removeItem(PreFixes.LSTOKPREFIX)
        await localStorage.removeItem(PreFixes.LSKEYPREFIX)
        await localStorage.removeItem(PreFixes.LSLOCPREFIX)
        console.log("LS clear")
        return false
      }
      let publicKey:any
      try {
        console.log("verify tok,key",token,key)
        publicKey = await jose.importSPKI(key, alg)
        console.log("pubkey",publicKey)
      } catch (e) {
        console.log("spki failes",e)
        await localStorage.removeItem(PreFixes.LSTOKPREFIX)
        await localStorage.removeItem(PreFixes.LSKEYPREFIX)
        await localStorage.removeItem(PreFixes.LSLOCPREFIX)
        console.log("LS clear")
        return false
      }
      try {
        const { payload, protectedHeader } = await jose.jwtVerify(token, publicKey, {
          issuer: 'https://daten.cafe',
          audience: 'https://daten.cafe',
        })
        console.log(protectedHeader)
        console.log(payload)    //
        return true
      } catch (e) {
        // clear the token
        console.log("Token failed",e)
        this.token = clr.token
        this.key = clr.key
        await localStorage.removeItem(PreFixes.LSTOKPREFIX)
        await localStorage.removeItem(PreFixes.LSKEYPREFIX)
        await localStorage.removeItem(PreFixes.LSLOCPREFIX)
        console.log("LS clear")
        return false
      }
    }
    /*
    const alg = 'RS256'
    const spki = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwhYOFK2Ocbbpb/zVypi9
    SeKiNUqKQH0zTKN1+6fpCTu6ZalGI82s7XK3tan4dJt90ptUPKD2zvxqTzFNfx4H
    HHsrYCf2+FMLn1VTJfQazA2BvJqAwcpW1bqRUEty8tS/Yv4hRvWfQPcc2Gc3+/fQ
    OOW57zVy+rNoJc744kb30NjQxdGp03J2S3GLQu7oKtSDDPooQHD38PEMNnITf0pj
    +KgDPjymkMGoJlO3aKppsjfbt/AH6GGdRghYRLOUwQU+h+ofWHR3lbYiKtXPn5dN
    24kiHy61e3VAQ9/YAZlwXC/99GGtw/NpghFAuM4P1JDn0DppJldy3PGFC0GfBCZA
    SwIDAQAB
    -----END PUBLIC KEY-----`
    const publicKey = await jose.importSPKI(spki, alg)
    const jwt =
      'eyJhbGciOiJSUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjY5MDU2NDg4LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.gXrPZ3yM_60dMXGE69dusbpzYASNA-XIOwsb5D5xYnSxyj6_D6OR_uR_1vqhUm4AxZxcrH1_-XJAve9HCw8az_QzHcN-nETt-v6stCsYrn6Bv1YOc-mSJRZ8ll57KVqLbCIbjKwerNX5r2_Qg2TwmJzQdRs-AQDhy-s_DlJd8ql6wR4n-kDZpar-pwIvz4fFIN0Fj57SXpAbLrV6Eo4Byzl0xFD8qEYEpBwjrMMfxCZXTlAVhAq6KCoGlDTwWuExps342-0UErEtyIqDnDGcrfNWiUsoo8j-29IpKd-w9-C388u-ChCxoHz--H8WmMSZzx3zTXsZ5lXLZ9IKfanDKg'
    
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
      issuer: 'urn:example:issuer',
      audience: 'urn:example:audience',
    })
    
    console.log(protectedHeader)
    console.log(payload)    //
    */
  },
  getters: {
    isTokenValid: (state) => async () => {
      const ok = await state.jwtVerify(state.token,state.key)
      console.log("Token valid? ",ok)
      return ok
    },
    getToken: (state) => async () => {
      await state.isTokenValid()
      return state.token;
    },
    getDark: (state) => () => {
      return state.dark;
    },
    getLang: (state) => () => {
      return state.lang;
    },
    getConsent: (state) => () => {
      return state.consent;
    },
    getFullsize: (state) => () => {
      return state.fullsize;
    },
    getStarter: (state) => () => {
      return state.starter;
    },
    hasStarter: (state) => () => {
      return state.starter != "";
    },
    getFlowrdy: (state) => () => {
      return state.flowrdy
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

