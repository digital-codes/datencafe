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

