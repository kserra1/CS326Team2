import { Recipe } from '../../recipe.js';
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class Form extends BaseComponent {
    constructor(author){
        super();
        this.loadCSS('form');

        this.recipe = new Recipe()
        this.recipe.author = author
        this.recipe.data
        this.fields = ['title', 'cookTime', 'prepTime', 'description', 
            'breakfast', 'lunch', 'dinner', 'snack', 'categories', 
            'image', 'ingredients', 'cookware', 'instructions']
    }
    makeLabel(varName){
        varName = varName.replace(/([A-Z])/g, ' $1').toLowerCase()
        return varName.charAt(0).toUpperCase() + varName.slice(1)
    }
    makeField(key, value, update){
        const div = document.createElement('div')
        div.id = key
        if(Array.isArray(value)){
            div.id = key+"-list"
            const input = this.makeField(key, value[0], update)
            const list = document.createElement("div")
            list.classList.add('list')
            const add = ()=>{
                const button = document.createElement("input")
                button.type = 'button'
                button.value = "Add"
                button.addEventListener("click", ()=>{
                    div
                    button.parentNode.insertBefore(add(), button)
                    button.parentNode.insertBefore(this.displayObj(null, value[0]), button)
                })
                return button
            }
            list.appendChild(add())
            div.append(input, list)
        } else if (typeof value === 'object'){
            for(const field in value){
                console.log(field)
                div.appendChild(this.makeField(field, value[field], update))
            }
        } else{
            const inputName = (key+" input")
            const label = document.createElement("label")
            label.textContent = this.makeLabel(key)
            label.setAttribute("for", inputName)

            const input = document.createElement("input")
            if(typeof value === 'boolean')
                input.type = 'radio'
            else
                input.type = 'text'
            input.id = inputName
            div.append(label, input)
        }

        div.addEventListener("change",(e)=>{
            let val = e.target.value
            if(e.target.value ==='on')
                val = true
            else if(e.target.value ==='off')
                val = false

            update(val)
        })
        return div
    }
    render(){
        this.innerHTML = document.createElement('div')
        this.innerHTML.id = "form"
        for(const [key, value, update] of this.recipe){
            if(this.fields.find(f=>f===key))
                this.innerHTML.appendChild(this.makeField(key, value, update))
        }
        const submit = document.createElement("input")
        submit.type = 'button'
        submit.value = "Submit"
        submit.addEventListener("click", ()=>{
            let filled = this.isFilled()
            console.log(this.recipe.data, filled)
        })
        this.innerHTML.appendChild(submit)

        return this.innerHTML
    }
    isFilled(){
        return Array.from(this.recipe[Symbol.iterator]())
        .every(([_,v])=>v !== undefined)
    }
}