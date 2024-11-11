import { Recipe } from '../../recipe.js';
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class Form extends BaseComponent {
    constructor(author){
        super();
        this.loadCSS('form');

        this.recipe = new Recipe()
    }
    makeLabel(varName){
        varName = varName.replace(/([A-Z])/g, ' $1').toLowerCase()
        return varName.charAt(0).toUpperCase() + varName.slice(1)
    }
    render(){
        this.innerHTML = document.createElement('div')
        this.innerHTML.id = "form"
        for(const [key, value, update] of this.recipe){
            const div = document.createElement('div')
            div.id = key
            this.innerHTML.appendChild(div)
            
            const inputName = (key+" input")
            const label = document.createElement("label")
            label.textContent = this.makeLabel(key)
            label.for = inputName
            div.appendChild(label);

            const input = document.createElement("input")
            input.type = 'text'
            input.id = inputName
            div.appendChild(input);
            if(value){
                input.value = value
                input.disabled = true
            } else {
                input.addEventListener("change", ()=>{
                    update(input.value)
                })
            }
        }
        const submit = document.createElement("input")
        submit.type = 'button'
        submit.value = "Submit"
        submit.addEventListener("click", ()=>{
            let filled = this.isFilled()
            console.log(this.recipe.recipeData, filled)
            if(this.isFilled())
                this.dispatchCustomEvent("New Recipe Made", this.recipe.recipeData)
        })
        this.innerHTML.appendChild(submit)
        return this.innerHTML
    }
    isFilled(){
        return Array.from(this.recipe[Symbol.iterator]())
        .every(([_,v])=>v !== undefined)
    }
}