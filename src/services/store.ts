/*
Sure, here's an example of how to use Vue3's Pinia store service with three components.

First, let's create a simple store service using Pinia:

js

import { defineStore } from 'pinia'

export const counterStore = defineStore({
  id: 'counter',
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})

This store service has a state of count and an action of increment that increments the count.

Next, let's create three components that use this store service:

html

<template>
  <div>
    <h1>Component 1</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useStore } from 'pinia'
import { counterStore } from './counterStore'

export default {
  setup() {
    const store = useStore(counterStore)
    const count = store.count
    const increment = () => store.increment()
    return { count, increment }
  }
}
</script>

html

<template>
  <div>
    <h1>Component 2</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useStore } from 'pinia'
import { counterStore } from './counterStore'

export default {
  setup() {
    const store = useStore(counterStore)
    const count = store.count
    const increment = () => store.increment()
    return { count, increment }
  }
}
</script>

html

<template>
  <div>
    <h1>Component 3</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useStore } from 'pinia'
import { counterStore } from './counterStore'

export default {
  setup() {
    const store = useStore(counterStore)
    const count = store.count
    const increment = () => store.increment()
    return { count, increment }
  }
}
</script>

Each of these components is using the useStore function to get access to the counterStore store service. They're all using the count and increment variables returned by the setup function to display the count and increment the count when the button is clicked.

That's it! Now you have three components using a Pinia store service.
andreas.kugel@ok-lab-karlsruhe.de
pinia store for complex objects

Sure, here's an example of how to create a Pinia store for complex objects:

js

import { defineStore } from 'pinia'

export const userStore = defineStore({
  id: 'user',
  state: () => ({
    users: []
  }),
  actions: {
    addUser(user) {
      this.users.push(user)
    },
    removeUser(id) {
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users.splice(index, 1)
      }
    },
    updateUser(user) {
      const index = this.users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        this.users.splice(index, 1, user)
      }
    }
  },
  getters: {
    getUserById: state => id => {
      return state.users.find(user => user.id === id)
    }
  }
})

This store service has a state of users, which is an array of user objects. 
The store service also has three actions: addUser, removeUser, and updateUser. 
These actions allow you to add, remove, and update users in the store. 
Additionally, there's a getter called getUserById which takes an id as 
an argument and returns the user with that id from the store.

You can then use the useStore hook in your components to access the store's state and actions:

html

<template>
  <div>
    <h1>User Details</h1>
    <p>Name: {{ name }}</p>
    <p>Email: {{ email }}</p>
    <p>Address: {{ address.street }}, {{ address.city }}, {{ address.state }}, {{ address.zip }}</p>
    <p>Phone: {{ phone }}</p>
    <button @click="editUser">Edit User</button>
  </div>
</template>

<script>
import { useStore } from 'pinia'
import { userStore } from './userStore'

export default {
  setup() {
    const store = useStore(userStore)
    const name = store.name
    const email = store.email
    const address = store.address
    const phone = store.phone

    const editUser = () => {
      store.setUser({
        id: '1234',
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        },
        phone: '555-555-1212'
      })
    }

    return { name, email, address, phone, editUser }
  }
}
</script>

In this component, we're using the useStore hook to get access to the userStore. We're using the store's state properties to display the user's details, and the editUser function to update the store's state with a new user object.

That's it! You can use this pattern to create Pinia stores for any complex objects in your application.


script setup for component with the complex store

Here's an example of a component using the script setup syntax and a Pinia store for complex objects:

vue

<template>
  <div>
    <h1>User Details</h1>
    <p>Name: {{ name }}</p>
    <p>Email: {{ email }}</p>
    <p>Address: {{ address.street }}, {{ address.city }}, {{ address.state }}, {{ address.zip }}</p>
    <p>Phone: {{ phone }}</p>
    <button @click="editUser">Edit User</button>
  </div>
</template>

<script setup>
import { useStore } from 'pinia'
import { userStore } from './userStore'

const store = useStore(userStore)

const name = store.name
const email = store.email
const address = store.address
const phone = store.phone

const editUser = () => {
  store.setUser({
    id: '1234',
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    },
    phone: '555-555-1212'
  })
}
</script>

In this example, we're using the useStore hook from Pinia to get access to the userStore in the script setup block. We're then defining reactive name, email, address, and phone variables to display the user's details in the template.

We're also defining an editUser function to update the user's details in the store when the user clicks the "Edit User" button.

Note that because we're using useStore inside the script setup block, we don't need to wrap it inside a setup() function. We can directly use the store and its properties and methods inside the script block.

Also note that the name, email, address, and phone variables defined in script setup are reactive, which means they will automatically update when the store's state changes. This can help to simplify the code and improve the performance of your application.

Sure, here's an updated version of the previous example that includes a getUserById method in the userStore to find a user by ID:

typescript

// userStore.ts
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
    setUser(user: User) {
      const index = this.users.findIndex(u => u.id === user.id)
      if (index >= 0) {
        this.users[index] = user
      } else {
        this.users.push(user)
      }
    },
    removeUser(id: string) {
      const index = this.users.findIndex(u => u.id === id)
      if (index >= 0) {
        this.users.splice(index, 1)
      }
    },
    getUserById(id: string): User | undefined {
      return this.users.find(u => u.id === id)
    }
  }
})

// UserDetail.vue
<template>
  <div v-if="user">
    <h1>User Details</h1>
    <p>Name: {{ user.name }}</p>
    <p>Email: {{ user.email }}</p>
    <p>Address: {{ user.address.street }}, {{ user.address.city }}, {{ user.address.state }}, {{ user.address.zip }}</p>
    <p>Phone: {{ user.phone }}</p>
    <button @click="editUser">Edit User</button>
  </div>
  <div v-else>
    <p>User not found</p>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'pinia'
import { userStore, User } from './userStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const store = useStore(userStore)

const router = useRouter()

const userId = computed(() => router.currentRoute.value.params.id)

const user: User | undefined = computed(() => store.getUserById(userId.value)).value

const editUser = () => {
  if (user) {
    store.setUser({
      id: user.id,
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      phone: '555-555-1212'
    })
  }
}
</script>

In this updated example, we've added a getUserById method to the userStore that takes an ID as an argument and returns the user object with that ID. We've also updated the UserDetail component to use this method to find the user object based on the ID from the router.

We've defined a computed property userId that gets the ID from the router's current route parameters. We've also defined another computed property user that uses the getUserById method to get the user object based on the userId.

In the editUser method, we're checking if user is defined before updating the user object in the store. If the user is not found, we show a "User not found" message in the template.


*/


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


