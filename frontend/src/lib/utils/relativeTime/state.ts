import { getFormatter } from "./formatter"
import { render } from "./render"
import type { Callback, RenderState } from "./render"

interface UpdateState extends RenderState {
    update: number
}

// keep track of each instance
const instances = new Map<HTMLElement, UpdateState>()

// we use a single timer for efficiency and to keep updates in sync
let updateInterval: number | NodeJS.Timeout

// register or update instance
export function register(instance: HTMLElement, date: Date, callback: Callback) {
    // get the formatter for the given locale, we do this here so we don't keep having to look it up on each tick
    const formatter = getFormatter()

    // create state to render
    const state = { date, callback, formatter }

    // initial render is immediate, so works for SSR
    const update = render(state, Date.now())

    instances.set(instance, { ...state, update })

    // start the clock ticking if there are any live instances
    if (instances.size) {
        updateInterval = updateInterval || setInterval(() => {
            const now = Date.now()
            for (const state of instances.values()) {
                if (state.update <= now) {
                    state.update = render(state, now)
                }
            }
        }, 1000)
    }
}

export function unregister(instance: HTMLElement) {
    instances.delete(instance)
    if (instances.size === 0) {
        clearInterval(updateInterval)
        updateInterval = 0
    }
}