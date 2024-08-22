import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import User from "./components/User.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Login },
    { path: "/register", component: Register },
    { path: "/user", component: User },
  ],
});

createApp(App).use(router).mount("#app");
