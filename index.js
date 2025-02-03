import {Bomb} from "./src/bomb.js";
//manque la grille dans la bomb element
export const menu = () => {
    let flame = 1
    window.addEventListener("click", (e) => {
        const bomb = new Bomb(e.clientX, e.clientY, flame)
        bomb.dropBomb()
        if (flame > 12) {

        } else {
            flame++
        }
    })
}

menu()