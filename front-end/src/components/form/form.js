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
        const makeDivFromObj = (obj, element)=>{
            for(const property in obj){
                if(property === "community" || property === "author") break
                const div = document.createElement('div')
                div.id = property
                element.appendChild(div)


                const value = obj[property]
                if(value && Object.getPrototypeOf(value) === Object.prototype){
                    const label = document.createElement("h3")
                    label.textContent = this.makeLabel(property)
                    div.appendChild(label);
                    makeDivFromObj(value, div)
                } else {
                    const inputName = (property+" input")
                    const label = document.createElement("label")
                    label.textContent = this.makeLabel(property)
                    label.for = inputName
                    div.appendChild(label);

                    const input = document.createElement("input")
                    input.type = element.id === 'tags' ? 'radio' : 'text'
                    input.id = inputName
                    if(value){
                        input.value = value
                        input.disabled = true
                    } else {
                        input.addEventListener("change", ()=>{
                            obj[property] = input.value
                        })
                    }
                    div.appendChild(input);
                }
            }
        }
        makeDivFromObj(this.recipe.recipeData, this.innerHTML)
        const submit = document.createElement("input")
        submit.type = 'button'
        submit.value = "Submit"
        submit.addEventListener("click", ()=>{
            let filled = this.isFilled()
            console.log(this.recipe.recipeData, filled)
            //if(this.isFilled())
                //this.dispatchCustomEvent("New Recipe Made", this.recipe.recipeData)
        })
        this.innerHTML.appendChild(submit)
        return this.innerHTML
    }
    isFilled(){
        return Array.from(this.recipe[Symbol.iterator]())
        .every(([_,v])=>v !== undefined)
    }
}