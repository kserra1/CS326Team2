export class BaseComponent {
    constructor() {
      this.cssLoaded = false;
      this.component = document.createElement('div')
    }
  
    /**
     * This is an abstract method that must be implemented by child classes.
     * It must return an HTMLElement object.
     * @abstract
     * @returns {HTMLElement}
     */
    render() {
      throw new Error('render method not implemented');
    }

    makeLabel(varName){
      varName = varName.replace(/([A-Z])/g, ' $1').toLowerCase()
      return varName.charAt(0).toUpperCase() + varName.slice(1)
    } 
    displayObj(key=null, value){
      const div = document.createElement('div')
      if(key){
        const label = document.createElement("div")
        label.textContent = this.makeLabel(key)
        label.classList.add(key)
        label.classList.add("label")
        div.appendChild(label)
      }
      if(Array.isArray(value)){
        const list = document.createElement('div')
        list.classList.add("list")
        list.append(...value.map(([k,v])=>this.displayObj(k, v)))
      } else if(typeof value === 'object'){
        div.append(
          ...Object.entries(value)
          .map(([k,v])=> this.displayObj(k,v))
        )
      } else {
        const v = document.createElement('div')
        v.classList.add("value")
        v.innerText = value
        div.append(v)
      }
      return div
    }

  
    loadCSS(fileName) {
      if (this.cssLoaded) return;
  
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Dynamically load CSS from the same directory as the JS file
      link.href = `./components/${fileName}/${fileName}.css`;
      document.head.appendChild(link);
      this.cssLoaded = true;
    }
  
    dispatchCustomEvent(eventName, detail = {}) {
      const event = new CustomEvent(eventName, { detail });
      this.innerHTML.dispatchEvent(event);
    }
  
    listenToEvent(eventName, callback) {
      this.innerHTML.addEventListener(eventName, callback);
    }
  }
  