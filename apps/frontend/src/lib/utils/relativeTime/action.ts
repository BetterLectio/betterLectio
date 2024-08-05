import type { Callback } from "./render"
import { register, unregister } from "./state"

export function relativeTime(node: HTMLElement, date: Date) {
    const callback: Callback = (value: string) => node.textContent = value

    function init(date: Date) {
        register(node, date, callback)
    }

    init(date)

    return {
        update(date: Date) {
            init(date)
        },
        destroy() {
            unregister(node)
        }
    }
}
