import { productArray } from "./index.js";

export function distanceMount(mount, step, width) {
  const indent = 15;
  return (+width - 2 * indent - mount) / step;
}
export function generateUniqId() {
  return Math.floor(Math.random() * 1000);
}
export function getValSelect(node) {
  return node.options[node.selectedIndex].textContent;
}

export function getObjProduct(id) {
  return productArray.find((obj) => {
    if (obj.id === id) return obj;
  });
}

export function CallPrint(obj) {
  let w = window.open("./list.html");
  w.calculateObj = obj;
  w.print();
  setTimeout(() => {
    w.close();
  }, 800);
}

export function formulaBretshnaidera(d1, d2, a, b, c = a, d = b) {
  let s = (a * 2 + b * 2) / 2;
  let formula =
    (s - a) * (s - b) * (s - c) * (s - d) -
    (1 / 4) * (a * c + b * d + d1 * d2) * (a * c + b * d - d1 * d2);
  let result = Math.sqrt(formula);
  return (result / 1000000).toFixed(2)
}
