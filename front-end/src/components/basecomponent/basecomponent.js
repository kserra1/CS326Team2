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
    displayObj(key=null, value, elementType = 'div'){
      const ele = document.createElement(elementType)
      if(key){
        const label = document.createElement('p')
        label.textContent = this.makeLabel(key)
        label.classList.add(key)
        label.classList.add("key")
        ele.appendChild(label)
      }
      if(Array.isArray(value)){
        const list = document.createElement(elementType)
        list.classList.add("list")
        list.append(...value.map(([k,v])=>this.displayObj(k, v, 'li')))
      } else if(typeof value === 'object'){
        ele.append(
          ...Object.entries(value)
          .map(([k,v])=> this.displayObj(k,v,'div'))
        )
      } else {
        const v = document.createElement(elementType)
        v.classList.add("value")
        v.textContent = value
        ele.append(v)
      }
      ele.data = value
      return ele
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
  