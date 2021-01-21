import {CallPrint, getObjProduct} from '../utills.js'
import { filterArr } from '../index.js';
export default async function productAdd(data) {

    const template = document.querySelector('#add-product')
    const templateClone = document.importNode(template.content, true)
        if(data) {
            templateClone.querySelector('.product-area-output').textContent = data.area
            templateClone.querySelector('.product-size-output').textContent = `${data.height} X ${data.width}`
            templateClone.querySelector('.product-color-output').textContent = data.colorEnging
            templateClone.querySelector('.product-edging-output').textContent = data.materialEdging
            templateClone.querySelector('.product-price-output').textContent = data.price
            templateClone.querySelector('.id-product').textContent = data.id
        }

    templateClone.querySelector('.product-btn-remove').addEventListener('click', (e) => {
        let parent = e.target.parentNode
        let id = Number(parent.querySelector('.id-product').textContent)
        filterArr(id)
        parent.remove()
    })
    templateClone.querySelector('.product-send-print').addEventListener('click', (e) => {
        let parent = e.target.parentNode
        let id = Number(parent.querySelector('.id-product').textContent)
        const obj = getObjProduct(id)
        CallPrint(obj)
    })

    document.querySelector('#add-product-output').appendChild(templateClone)
}