
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class Form extends BaseComponent {
    constructor(){
        super();
        this.loadCSS('form');

        this.fields = {
            title:"",
            author:"",
            description:"",
            ingredientList:[],
            instructions:[],
            tagList:[],
        }
    }
    render(){
        this.innerHTML = document.createElement('div')
        this.innerHTML.classList.add('form')
        
        this.fieldComponents = Object.entries(this.fields).map(([k,v])=>{
            const d = document.createElement('div')
            d.classList.add('field')
            d.classList.add(k)

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
            return d
        })
        return this.innerHTML
    }
}