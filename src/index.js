import { body, img, color, icons, outputs, form, deliveryKm, doorWidth, fillingDoorVal, productAddBtn, priceAll, fillingApertureVal, materialEdgingVal} from './variables.js'
import productAdd from './product/product-add.js'
import calculate from './calculate.js'
import { Popup } from './popup/popup.js';
import { data } from './data/data.js'
import {generateUniqId} from './utills.js'


export let productArray = []
const inputs = document.querySelectorAll('input')
const target = document.querySelector('#add-product-output')
const config = {
    attributes: true,
    childList: true
}

window.onload = function () {
    document.body.classList.add('loaded_hiding')
    window.setTimeout(function () {
        document.body.classList.add('loaded')
        document.body.classList.remove('loaded_hiding')
    }, 500)
}

for (let input of inputs) {
    if (input.type != "checkbox" && input.type != "button" && input.type != "submit" && input.type != "radio") {
        input.classList.add('form-control')
    }
    if (input.type == 'number') {
        input.addEventListener('input', (e) => {
            if (input.value == 1) {
                doorWidth.disabled = true
                fillingDoorVal.disabled = true
            } else {
                doorWidth.disabled = false
                fillingDoorVal.disabled = false
            }
        })
    }

}

color.onchange = function (e) {
    let value = color.value;
    let url = `./img/calculator/window-${value}.jpg`;
    img.setAttribute('src', url)

}
deliveryKm.oninput = function () {
    document.querySelector('.delivery-output').innerHTML = this.value
}

productAddBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    const dataCalculate = await calculate()
    const id = generateUniqId()
    
    if (dataCalculate) {
        dataCalculate.id = id
        productArray.push(dataCalculate)
        productAdd(dataCalculate)
    }
})

const observer = new MutationObserver(() => {
    setTimeout(() => {
        if (productArray.length < 10) {
            productAddBtn.disabled = false
        } else {
            productAddBtn.disabled = true
        }
    }, 0)
    let price = 0
    let delivery = 0
    productArray.forEach(obj => {
        if(obj.delivery) delivery = obj.delivery
        price = price + +obj.price + +obj.mounting
    })
    priceAll.textContent = price + Number(delivery)
})
observer.observe(target, config)

icons.forEach(icon => {
    icon.addEventListener('click', (event) => {
        if (icon.dataset.icon == 'fill') {
            const filling = document.querySelector('#fillingAperture').value;
            const popup = new Popup(body, {
                img: data.fill[filling].img,
                alt: data.fill[filling].alt,
                text: data.fill[filling].text
            })
            popup.render();
        } else if (icon.dataset.icon == 'edging') {
            const edg = document.querySelector('#material-edging').value;
            const popup = new Popup(body, {
                img: data.edging[edg].img,
                alt: data.edging[edg].alt,
                text: data.edging[edg].text
            })
            popup.render();
        } else if (icon.dataset.icon == 'color') {
            console.log('color');
        } else if (icon.dataset.icon == 'mount') {
            const mount = event.target.previousElementSibling.value;
            const popup = new Popup(body, {
                img: data.mount[mount].img,
                alt: data.mount[mount].alt,
                text: data.mount[mount].text
            })
            popup.render();
        }
    });

});

// change select
fillingApertureVal.addEventListener('change', function () {
    if(this.value === "PVH650") {
        materialEdgingVal.innerHTML = `
            <option value="PVH50">Ткань ПВХ 50мм</option>
            <option value="PVH80">Ткань ПВХ 51-80мм</option>
            <option value="PVH150">Ткань ПВХ 81-150мм</option>
        `
    } else if(this.value === "BRZ") {
        materialEdgingVal.innerHTML = `        
            <option value="BRZ50">Брезент 50мм</option>
            <option value="BRZ80">Брезент 51-80мм</option>
            <option value="BRZ150">Брезент 80-150мм</option>
        `
    } else {
        materialEdgingVal.innerHTML = `
            <option value="PVH50">Ткань ПВХ 50мм</option>
            <option value="PVH80">Ткань ПВХ 51-80мм</option>
            <option value="PVH150">Ткань ПВХ 81-150мм</option>
            <option value="OKCF50">Оксфорд 50мм</option>
            <option value="OKCF80">Оксфорд 51-80мм</option>
            <option value="OKCF150">Оксфорд 81-150мм</option>
            <option value="BRZ50">Брезент 50мм</option>
            <option value="BRZ80">Брезент 51-80мм</option>
            <option value="BRZ150">Брезент 80-150мм</option>
        `
    }
})


form.addEventListener('input', function () {
    outputs.forEach((output) => {
        output.textContent = 0;
    })
    setTimeout(calculate, 0)
})
export function filterArr(id) {
    productArray = productArray.filter(obj => obj.id !==id)
}