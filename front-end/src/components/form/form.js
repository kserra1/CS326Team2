import { Recipe } from '../../recipe.js';
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class Form extends BaseComponent {
    constructor(author){
        super();
        this.loadCSS('form');

        this.recipe = new Recipe()
        this.recipe.author = author
        this.recipe.data
    }
    makeLabel(varName){
        varName = varName.replace(/([A-Z])/g, ' $1').toLowerCase()
        return varName.charAt(0).toUpperCase() + varName.slice(1)
    }
    makeObjField(key, value){
        const newObj = {}
        const div = document.createElement('div')
        div.id = key
        for(const field in value){
            div.appendChild(this.makeTextField(field, (v)=>newObj[field] = v))
        }
        return div
    }      
    makeListField(key, value){

        const inputName = (key+" input")
        const label = document.createElement("label")
        label.textContent = this.makeLabel(key)
        label.for = inputName

        const input = this.makeField(key, value[0])
        
        const list = document.createElement("div")
        list.id = 'list'
        
        const add = ()=>{
            const button = document.createElement("input")
            button.type = 'button'
            button.value = "Add"
            button.addEventListener("click", ()=>{
                button.parentNode.insertBefore(add(), button)
            })
            return button
        }

        const div = document.createElement('div')
        div.id = key
        div.append(label, input, add(), list)
        return div
    }
    makeField(key, value, update){
    //     if(Array.isArray(value)){
    //         return this.makeListField(key, value)
    //     } else if (typeof value){
    //         return this.makeObjField(key, value)
    //     } else{
        const inputName = (key+" input")
        const label = document.createElement("label")
        label.textContent = this.makeLabel(key)
        label.for = inputName

        const input = document.createElement("input")
        if(typeof value === 'boolean')
            input.type = 'radio'
        else
            input.type = 'text'
        input.id = inputName
        
        const div = document.createElement('div')
        div.id = key
        div.append(label, input)

        div.addEventListener("change",()=>{
            update(input.value)
        })
        return div
    }
    render(){
        this.innerHTML = document.createElement('div')
        this.innerHTML.id = "form"
        for(const [key, value, update] of this.recipe)
            this.innerHTML.appendChild(this.makeField(key, value, update))

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