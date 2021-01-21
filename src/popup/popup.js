export class Popup {
    constructor($el, data) {
        this.$el = $el;
        this.data = data;
        this.base = '';
    }


    build() {
        this.base = document.createElement('div');
        this.base.classList.add('popup');
        const close = document.createElement('div');
        close.classList.add('close-popup');
        close.innerHTML = '\u274C';
        
        const template = `<img src="${this.data.img}" alt="${this.data.alt}"><div class="text">${this.data.text}</div>`;
        this.base.innerHTML = template;
        this.base.appendChild(close);
        return this.base;
    }



    overlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.appendChild(this.build())
        overlay.addEventListener('click', (event)=> {
            if(event.target.className == 'overlay' || event.target.className == 'close-popup') {
                this.destroy(overlay)
            }
        })
        return overlay
    }

    render() {
        const overlay = this.overlay()
        this.$el.appendChild(overlay)
    }

    destroy(element) {
        element.remove();
    }
} 
