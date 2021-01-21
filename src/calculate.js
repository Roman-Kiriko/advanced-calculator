import {
    PRICE_DELIVERY, PRICE_DELIVERY_KM, PRICE_ZIPPER, form, door as checkDoor, priceProductField,  deliveryField, mountField, fillingApertureVal, materialEdgingVal, color, topMountVal, leftMountVal, rightMountVal, beltsSelectVal, bottomMountVal, fillingDoorVal, mounting, delivery, deliveryKm, zipper, doorWidth, areaOutput,perimeterOutput, mountTopOutput, mountLeftOutput, mountRightOutput, mountBottomOutput, areaDoorOutput, lengthZipperOutput, areaFill, perimeterEdging,mountTopPrice, mountRightPrice, mountLeftPrice, mountBottomPrice, beltsPriceVal, zipperPrice, areaDoorPrice, priceDoorVal, discountVal, inputTop, inputBottom,inputLeft, inputRight, d1 as dLeft, d2 as dRight
} from './variables.js'
import { getMountPrice } from './mount-price/MountPrice.js';
import { data } from './data/data.js';
import { distanceMount, formulaBretshnaidera, getValSelect } from './utills.js'


let price = null;

export default async function calculate() {
    const discount = 1 - (discountVal.value / 100);
    price = 0;

    let perimetr,
        area,
        aperture,
        topMountPosition = 0,
        leftMountPosition = 0,
        rightMountPosition = 0,
        bottomMountPosition = 0,
        priceMount,
        edging,
        beltsPrice,
        priceDoor = 0,
        fillingDoor,
        widthDoor,
        areaDoor = 0,
        price_mount = 0,
        priceDelivery = 0



    let width = form.querySelector('#width').value;
    let height = form.querySelector('#height').value;




    let fillingAperture = data.fill[fillingApertureVal.value].price;

    let materialEdging = data.edging[materialEdgingVal.value].price;

    let colorEdging = color.value;

    let topMount = data.mount[topMountVal.value].price;

    let leftMount = data.mount[leftMountVal.value].price;
    let rightMount = data.mount[rightMountVal.value].price;

    let bottomMount = data.mount[bottomMountVal.value].price;

    let stepMount = form.querySelector('#stepInput').value || 400;

    let belts = form.querySelector('#beltsInput').value;

    let beltsSelect = data.belts[beltsSelectVal.value].price

    beltsPrice = belts * beltsSelect;

    let price_mounting;
    let resultPriceMount = await getMountPrice('Moscow')


    if (resultPriceMount >= 10) {
        price_mounting = 650;
    } else if (resultPriceMount >= -15) {
        price_mounting = 950;
    } else {
        price_mounting = 1100;
    }



    if (topMount > 0) {
        topMountPosition = inputTop.value || Math.ceil(distanceMount(data.mount[topMountVal.value].diametr, stepMount, width) + 1);
    }
    if (leftMount > 0) {
        leftMountPosition = inputLeft.value || Math.ceil(distanceMount(data.mount[leftMountVal.value].diametr, stepMount, height) - 1);
    }
    if (rightMount > 0) {
        rightMountPosition = inputRight.value || Math.ceil(distanceMount(data.mount[rightMountVal.value].diametr, stepMount, height) - 1);
    }
    if (bottomMount > 0) {
        bottomMountPosition = inputBottom.value || Math.ceil(distanceMount(data.mount[bottomMountVal.value].diametr, stepMount, width) + 1);
    }


    perimetr = ((width * 2) + (height * 2)) / 1000;
    
    // Расчет площади изделия
    if(dLeft.value && dRight.value) {
        area = formulaBretshnaidera(dLeft.value, dRight.value, width, height)
    } else {
        area = (width * height / 1000000).toFixed(2);
    }
    

    let zipperLength = 0
    if (checkDoor.checked) {
        zipperLength = zipper.value * height / 1000;
        let door = 0;

        fillingDoor = data.fill[fillingDoorVal.value].price;
        widthDoor = doorWidth.value;
        areaDoor = (widthDoor * height) / 1000000;
        if (zipper.value == 2) {
            door = fillingDoor * areaDoor
            area = (area - areaDoor).toFixed(2)
        }
        zipperPrice
        priceDoor = door + (zipperLength * PRICE_ZIPPER);
        zipperPrice.textContent = (zipperLength * PRICE_ZIPPER * discount).toFixed();
        areaDoorPrice.textContent = (door.toFixed() * discount).toFixed();
        priceDoorVal.textContent = (priceDoor * discount).toFixed();
        lengthZipperOutput.textContent = zipperLength;
    }
    
    let topPricePosition = topMount * topMountPosition
    let rightPricePosition = rightMount * rightMountPosition
    let leftPricePosition = leftMount * leftMountPosition
    let bottomPricePosition = bottomMount * bottomMountPosition

    

    let tempMaterial = 0
    if(topMountVal.value === 'd-10m') {
        let priceTopMount = (width /1000) * data.mount[topMountVal.value].cable
        topPricePosition += priceTopMount
    } else if(topMountVal.value === 'rr-r') {
       let priceTopMount = (width /1000) * data.mount[topMountVal.value].trunk
       topPricePosition += priceTopMount
    }
    if(bottomMountVal.value === 'ky') {
        let mWidth = width / 1000
        let priceBottomMount = mWidth * data.mount[bottomMountVal.value].trunk
        if(materialEdgingVal.value.includes('BRZ')) {
            perimetr -= mWidth
            tempMaterial = mWidth * data.edging['BRZ150'].price 
        } else if(materialEdgingVal.value.includes('OKCF')) {
            perimetr -= mWidth
            tempMaterial = mWidth * data.edging['OKCF150'].price 
        } else if(materialEdgingVal.value.includes('PVH')) {
            perimetr -= mWidth
            tempMaterial = mWidth * data.edging['PVH150'].price 
        }
        bottomPricePosition += (priceBottomMount  + tempMaterial)
    }

    
    
    
    priceMount = Math.floor(topPricePosition + rightPricePosition + leftPricePosition + bottomPricePosition + priceDoor);

    edging = perimetr * materialEdging;
    aperture = area * Number(fillingAperture);


    let priceProduct = Math.round(+aperture + Number(edging) + priceMount + beltsPrice);
    priceProduct = Math.round(priceProduct * discount);

    if (priceProduct > 0 && priceProduct != Infinity) {
        if (mounting.checked) {
            price_mount = price_mounting * (+area + areaDoor)
            price += price_mount;
            mountField.textContent = price_mount.toFixed();
        }

        let priceDeliveryKm = 0;
        if (delivery.checked) {
            price += PRICE_DELIVERY;
            if (deliveryKm.value) { 
                priceDeliveryKm = deliveryKm.value * PRICE_DELIVERY_KM;
                price += priceDeliveryKm;
            }
            deliveryField.textContent = (PRICE_DELIVERY + priceDeliveryKm).toFixed();
        }

        priceProductField.textContent = priceProduct;
        areaOutput.textContent = +area;
        perimeterOutput.textContent = perimetr;
        mountTopOutput.textContent = topMountPosition || 0;
        mountLeftOutput.textContent = leftMountPosition || 0;
        mountRightOutput.textContent = rightMountPosition || 0;
        mountBottomOutput.textContent = bottomMountPosition || 0;
        areaDoorOutput.textContent = (height * widthDoor) / 1000000 || 0;

        areaFill.textContent = Math.round(area * fillingAperture * discount);
        perimeterEdging.textContent = (edging * discount).toFixed();
        mountTopPrice.textContent = Math.floor(topPricePosition * discount);
        mountBottomPrice.textContent = Math.floor(bottomPricePosition * discount);
        mountLeftPrice.textContent = Math.floor(leftPricePosition * discount);
        mountRightPrice.textContent = Math.floor(rightPricePosition * discount);
        beltsPriceVal.textContent = (beltsPrice * discount).toFixed();


           return {
               width,
               height,
               area: getValSelect(fillingApertureVal),
               top: getValSelect(topMountVal),
               amountMountTop: topMountPosition,
               colorMountTop: '',
               priceMountTop: topMount,
               coastMountTop: (topPricePosition * discount).toFixed(),
               bottom: getValSelect(bottomMountVal),
               amountMountBottom: bottomMountPosition,
               colorMountBottom: '',
               priceMountBottom: bottomMount,
               coastMountBottom: (bottomPricePosition * discount).toFixed(),
               left: getValSelect(leftMountVal),
               amountMountLeft: leftMountPosition,
               colorMountLeft: '',
               priceMountLeft: leftMount,
               coastMountLeft: (leftPricePosition * discount).toFixed(),
               right: getValSelect(rightMountVal),
               amountMountRight: rightMountPosition,
               colorMountRight: '',
               priceMountRight: rightMount,
               coastMountRight: (rightPricePosition * discount).toFixed(),
               priceArea: fillingAperture ,
               coastArea: (aperture * discount).toFixed(1),
               price: priceProduct,
               lengthZipper: zipperLength,
               priceZipper: PRICE_ZIPPER,
               coastZipper: (zipperLength * PRICE_ZIPPER * discount).toFixed(),
               fillingDoor: checkDoor.checked ? zipper.value == 2 ? getValSelect(fillingDoorVal) : '' : '',
               priceFillingDoor: checkDoor.checked ? zipper.value == 2 ? fillingDoor : '' : '',
               widthDoor,
               areaDoor,
               priceDoor: checkDoor.checked ? zipper.value == 2 ? (fillingDoor * areaDoor * discount).toFixed() : '' : '',
               materialEdging: getValSelect(materialEdgingVal),
               widthEdging: '',
               amountEdging: perimetr,
               colorEnging: getValSelect(color),
               priceEdging: materialEdging,
               coastEdging: (edging * discount).toFixed(),
               materialBelts: getValSelect(beltsSelectVal),
               amountBelts: belts,
               colorBelts: beltsSelectVal.value === 'belts-pr' ? 'серый' : beltsSelectVal.value === 'belts-pvh' ? 'прозрачный' : '',
               priceBelts: beltsSelect,
               coastBelts: (beltsPrice * discount).toFixed(),
               discount: discountVal.value,
               mounting: price_mount.toFixed(),
               deliveryCoast: delivery.checked ? priceDelivery : '',
               deliveryCoastKm: delivery.checked ? priceDeliveryKm : '',
               deliveryAmountKm: delivery.checked ? deliveryKm.value : '',
               delivery: delivery.checked ? (priceDelivery + priceDeliveryKm).toFixed() : 0
           }

    } else {
        tata.error('Ошибка', 'Введите корректные значения', {
            duration: 5000,
            position: 'mm'
        })
    }
}



