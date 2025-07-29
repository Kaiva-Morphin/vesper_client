export function oklchToRGB(oklch: string): [number, number, number] {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = oklch;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
}

export function easeOutQuint(x: number): number {
    return 1 - Math.pow(1 - x, 5);
}
export function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
}

export function shakeById(id: string) {
    const el : any = document.getElementById(id);
    if (el) {
      el.classList.remove("shake");
      void el.offsetWidth;
      el.classList.add("shake");
    }
}

export function parseJwt (token : string) : any {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}