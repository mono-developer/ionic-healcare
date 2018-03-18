import { Injectable } from '@angular/core';

@Injectable()
export class BaseMedicineService {
  public forms: any = [
    {id: 1, name: "pill", file: "tablet-icon/icon-pill.png"},
    {id: 2, name: "bubbles", file: "tablet-icon/icon-bubbles.png"},
    {id: 3, name: "shape", file: "tablet-icon/icon-shape.png"},
    {id: 4, name: "tube", file: "tablet-icon/icon-tube.png"},
    {id: 5, name: "round", file: "tablet-icon/icon-round.png"},
    {id: 6, name: "drop", file: "tablet-icon/icon-drop.png"},
    {id: 7, name: "notch", file: "tablet-icon/icon-notch.png"},
    {id: 8, name: "bar", file: "tablet-icon/icon-bar.png"},
    {id: 9, name: "pentagon", file: "tablet-icon/icon-pentagon.png"},
    {id: 10, name: "inhaler", file: "tablet-icon/icon-Inhaler.png"},
    {id: 11, name: "injection", file: "tablet-icon/icon-Injection.png"},
    {id: 12, name: "3-sided", file: "tablet-icon/icon-3sided.png"},
    {id: 13, name: "foam", file: "tablet-icon/icon-foam.png"},
    {id: 14, name: "granules", file: "tablet-icon/icon-granules.png"},
    {id: 15, name: "patch", file: "tablet-icon/icon-patch.png"},
    {id: 17, name: "rectangle", file: "tablet-icon/icon-rectangle.png"},
    {id: 18, name: "ring", file: "tablet-icon/icon-ring.png"},
    {id: 19, name: "spoon", file: "tablet-icon/icon-spoon.png"},
    {id: 20, name: "spray", file: "tablet-icon/icon-spray.png"},
    {id: 21, name: "square", file: "tablet-icon/icon-square.png"},
    {id: 22, name: "strip", file: "tablet-icon/icon-strip.png"},
    {id: 23, name: "swab", file: "tablet-icon/icon-swab.png"},
    {id: 24, name: "liquid", file: "tablet-icon/icon-Liquid.png"},
    {id: 25, name: "barrel", file: "tablet-icon/icon-barrel.png"},
    {id: 26, name: "drops", file: "tablet-icon/icon-drops.png"},
    {id: 27, name: "elixir", file: "tablet-icon/icon-elixir.png"},
    {id: 28, name: "enima", file: "tablet-icon/icon-enima.png"},
    {id: 29, name: "figure8", file: "tablet-icon/icon-figure8.png"},
    {id: 30, name: "foam", file: "tablet-icon/icon-foam.png"},
    {id: 31, name: "gear", file: "tablet-icon/icon-gear.png"},
    {id: 32, name: "gel", file: "tablet-icon/icon-gel.png"},
    {id: 33, name: "halfcircle", file: "tablet-icon/icon-halfcircle.png"},
    {id: 34, name: "heart", file: "tablet-icon/icon-heart.png"},
    {id: 35, name: "kidney", file: "tablet-icon/icon-kidney.png"},
    {id: 36, name: "kit", file: "tablet-icon/icon-kit.png"},
    {id: 37, name: "powder", file: "tablet-icon/icon-powder.png"},
    {id: 38, name: "shampoo", file: "tablet-icon/icon-shampoo.png"},
    {id: 39, name: "stick", file: "tablet-icon/icon-stick.png"},
    {id: 40, name: "suppository", file: "tablet-icon/icon-suppository.png"},
    {id: 41, name: "swab", file: "tablet-icon/icon-swab.png"},
    {id: 42, name: "tape", file: "tablet-icon/icon-tape.png"},
    {id: 43, name: "tube", file: "tablet-icon/icon-tube.png"},

  ];

  public colors: any = [
    {id: 1, name: "White", color: "white"},
    {id: 2, name: "Tan", color: "tan"},
    {id: 3, name: "Brown", color: "brown"},
    {id: 4, name: "Red", color: "red"},
    {id: 5, name: "Pink", color: "pink"},
    {id: 6, name: "Peach", color: "peachpuff"},
    {id: 7, name: "Orange", color: "orange"},
    {id: 8, name: "Yellow", color: "yellow"},
    {id: 9, name: "Green", color: "green"},
    {id: 10, name: "Turquoise", color: "turquoise"},
    {id: 11, name: "Blue", color: "blue"},
    {id: 12, name: "Purple", color: "purple"},
  ];

  public defaultItem = {id: -1, name: '–', file: ''};

  constructor() {
  }

  getForms() {
    return this.forms;
  }

  getColors() {
    return this.colors;
  }

  getColor(id) {
    return new Promise((resolve, reject) => {
      try {
        let items = this.colors.filter(item => item.id === id);
        resolve(this.getFirstOrDefaultItem(items));
      } catch(e) {
        reject(e);
      }
    });
  }

  getValue(val) {
    return new Promise((resolve, reject) => {
      try {
        let items = this.colors.filter(item => item.color === val);
        resolve(this.getFirstOrDefaultItem(items));
      } catch(e) {
        reject(e);
      }
    });
  }

  getNewForm(val) {
    return new Promise((resolve, reject) => {
      try {
        let items = this.forms.filter(item => item.name === val);
        resolve(this.getFirstOrDefaultItem(items))
      } catch(e) {
        reject(e);
      }
    });
  }

  getForm(id) {
    return new Promise((resolve, reject) => {
      try {
        let items = this.forms.filter(item => item.id === id);
        resolve(this.getFirstOrDefaultItem(items));
      } catch(e) {
        reject(e);
      }
    });
  }

  getFirstOrDefaultItem(items) {
    if (items.length > 0) {
      return items[0];
    }
    return this.defaultItem;
  }
}
