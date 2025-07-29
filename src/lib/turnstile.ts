import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";

export function renderTurnstile (container: string | HTMLElement, callback: (token: string) => void) {
    callback("token")
    // @ts-ignore
    // window.turnstile.render(container, {
    //     callback,
    //     sitekey: PUBLIC_TURNSTILE_SITE_KEY
    // })
}