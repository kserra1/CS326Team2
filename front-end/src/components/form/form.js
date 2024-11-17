import { Recipe } from '../../recipe.js';
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class Form extends BaseComponent {
    constructor(eventHub, author){
        super();
        this.eventHub = eventHub
        this.loadCSS('form');
        this.component.id = "form"

        this.author = author

        this.fields = ['title', 'cookTime', 'prepTime', 'description', 
            'breakfast', 'lunch', 'dinner', 'snack', 'categories', 
            'image', 'ingredients', 'cookware', 'instructions']
    }
    makeField(key, value){
        const div = document.createElement('div')
        div.classList.add(key)
        div.key = key

        if(value.constructor === Array){//code for input arrays
            div.classList.add('array')
            const input = this.makeField(key, value[0])
            const list = document.createElement("ul")
            list.data = []
            const button = document.createElement("input")
            button.type = 'button'
            button.value = "Add"
            button.addEventListener("click", ()=>{
                if(input.data){
                    list.data.push(input.data)
                    div.data = list.data
                    list.innerHTML = ''
                    list.append(...list.data.map(e=>{
                        const li = document.createElement("li")
                        li.innerHTML = this.displayObj(null, e).innerHTML
                        return li
                    }))
                    div.dispatchEvent(new Event('change'))
                }
            })
            div.append(input, button, list)
        } else if (value.constructor === Object){ // code for inputting objects
            div.classList.add('obj')

            const label = document.createElement("p")
            label.textContent = this.makeLabel(key)
            
            div.append(label)
            const obj = document.createElement("div")
            obj.classList.add('list')
            for(const field in value){
                obj.appendChild(this.makeField(field, value[field]))
            }
            div.append(obj)
            
            div.addEventListener('change', e=>{
                const data = Array.from(obj.children)
                if(data.every(c=>c.data))
                    div.data = Object.fromEntries(data.map(c=>[c.key, c.data]))
                else
                    div.data = null
            })
        } else{// code for inputting string, number, bool fields
            div.classList.add('field')

            const inputName = (key+" input")
            const label = document.createElement("label")
            label.textContent = this.makeLabel(key)
            label.setAttribute("for", inputName)

            const input = document.createElement("input")
            input.id = inputName
            if(value.constructor === Boolean)
                input.type = 'checkbox'
            else if(value.constructor === String)
                input.type = 'text'
            else if(value.constructor === Number){
                input.type = 'number'
                input.min = '0'
            } else if (value.constructor === File){
                input.type = 'file'
                input.accept = '.png,.jpeg'
            }
            else throw new TypeError()

            div.append(label, input)

            div.addEventListener('change', e=>{
                if(e.target.value && e.target.type === 'text')
                    div.data = e.target.value
                else if(e.target.value && e.target.type === 'checkbox')
                    div.data = e.target.checked
                else if(e.target.value && e.target.type === 'number')
                    div.data = Number.parseFloat(e.target.value)
                else if(e.target.value && e.target.type === 'file')
                    div.data = e.target.files[0]
                else
                    div.data = null
            })
        }
        return div
    }
    render(){
        this.recipe = new Recipe()
        this.recipe.author = this.author

        this.component.innerHTML = ''

        const notFilledField = document.createElement("p")
        
        for(const [key, value, update] of this.recipe){
            if(this.fields.includes(key)){
                const div = this.makeField(key, value)
                div.addEventListener('change', e=>{
                    update(div.data)
                    notFilledField.innerHTML = ''
                })
                this.component.append(div)
            }
        }
              
        const submit = document.createElement("input")
        submit.type = 'button'
        submit.value = "Submit"
        submit.addEventListener("click", async()=>{
            if(this.notFilled().length === 0)
                this.eventHub.emit('RecipeAdded', await this.recipe.getData());
            else
                notFilledField.innerHTML = 
                'Your recipe needs these fields to be filled: '+
                this.notFilled().map(f=>this.makeLabel(f)).join(", ")
        })
        this.component.appendChild(submit)
        this.component.append(notFilledField)
        
        return this.component
    }
    notFilled(){
        return this.fields.filter(f=>this.recipe.isUnd(this.recipe[f]))
    }
}