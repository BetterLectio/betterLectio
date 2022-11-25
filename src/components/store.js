import { writable } from "svelte/store";
import { localStore } from "./localStore";
import { get } from "./http.js";

export const brugeren = localStore("svelte-user-mig", await get("/mig"));
