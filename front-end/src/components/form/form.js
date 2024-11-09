import { Recipe } from '../../recipe.js';
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class Form extends BaseComponent {
    constructor(author){
        super();
        this.loadCSS('form');

        this.recipe = new Recipe()
    }
    render(){
        this.innerHTML = document.createElement('div')
        this.innerHTML.classList.add('form')
        for(const [k,v] of this.recipe[Symbol.iterator]()){
            const d = document.createElement('div')
            d.classList.add('field')
            for(const c of k.split(" "))
                d.classList.add(c)

            const inputName = (k+"input")
            const label = document.createElement("label")
            label.textContent = k
            label.setAttribute("for", inputName)

            const input = document.createElement("input")
            input.setAttribute("type", "text")
            input.setAttribute("id", inputName)
                
            d.appendChild(label);
            d.appendChild(input);
            this.innerHTML.appendChild(d)

        }
        return this.innerHTML
    }
}