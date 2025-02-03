import {Bomb} from "./src/bomb.js";

export const menu = () => {
    let flame = 1
    window.addEventListener("click", (e) => {
        const bomb = new Bomb(e.clientX, e.clientY, flame)
        bomb.dropBomb()
        flame++
    })
}

menu()