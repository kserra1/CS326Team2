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
    makeField(key, value){
        const div = document.createElement('div')
        div.classList.add(key)
        div.key = key
        if(Array.isArray(value)){
            div.classList.add('list')
            const input = this.makeField(key, value[0])
            const list = document.createElement("div")
            list.classList.add('list')
            list.data = []
            const add = (index)=>{
                const button = document.createElement("input")
                button.type = 'button'
                button.value = "Add"
                button.addEventListener("click", ()=>{
                    if(input.data){
                        list.data.splice(index, 0, input.data)
                        div.data = list.data
                        list.innerHTML = ''
                        list.append(
                            add(0),
                            ...list.data.flatMap((e, i)=>
                                [this.displayObj(null, e), add(i+1)]
                            )
                        )
                        div.dispatchEvent(new Event('change'))
                    }
                    console.log('list listener: key:', key, 'data:', div.data)

                })
                return button
            }
            list.appendChild(add(0))
            div.append(input, list)
        } else if (typeof value === 'object'){
            div.classList.add('obj')

            const inputName = (key+" input")
            const label = document.createElement("label")
            label.textContent = this.makeLabel(key)
            label.setAttribute("for", inputName)
            div.append(label)

            for(const field in value){
                div.appendChild(this.makeField(field, value[field]))
            }
            
            div.addEventListener('change', e=>{
                const data = Array.from(div.children).filter(c=>c.hasOwnProperty("data"))
                if(data.every(c=>c.data))
                    div.data = Object.fromEntries(data.map(c=>[c.key, c.data]))
                else
                    div.data = null
                console.log('obj listener: key:', key, 'data:', div.data)
            })
        } else{
            div.classList.add('field')

            const inputName = (key+" input")
            const label = document.createElement("label")
            label.textContent = this.makeLabel(key)
            label.setAttribute("for", inputName)

            const input = document.createElement("input")
            input.id = inputName
            if(typeof value === 'boolean')
                input.type = 'checkbox'
            else if(typeof value === 'string')
                input.type = 'text'
            else if(typeof value === 'number'){
                input.type = 'number'
                input.min = '0'
            }
            else throw new TypeError()

            div.append(label, input)

            div.addEventListener('change', e=>{
                if(e.target.value){
                    div.data = e.target.value
                    if(e.target.type === 'checkbox')
                        div.data = e.target.checked
                    if(e.target.type === 'number')
                        div.data = Number.parseFloat(e.target.value)
                }
                else
                    div.data = null
                console.log('Field listener: key:', key, 'data', div.data)
            })
        }
        return div
    }
    render(){
        this.innerHTML = document.createElement('div')
        this.innerHTML.id = "form"
        for(const [key, value, update] of this.recipe){
            if(this.fields.includes(key)){
                const div = this.makeField(key, value)
                div.addEventListener('change', e=>{
                    console.log(key, ':', div.data)
                    update(div.data)
                })
                this.innerHTML.appendChild(div)
            }
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
        return this.fields.every(f=>!this.recipe.isUnd(f))
    }
}