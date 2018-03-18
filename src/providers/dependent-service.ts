import { Injectable } from '@angular/core';

@Injectable()
export class DependentService {

  public dependents: any = [
    {id: 1, firstname: "Michael", lastname: "A", thumb: "assets/image/1.png", gender: "Male", birthday: "", city: "", state: "", province: ""},
    {id: 2, firstname: "Johnny", lastname: "B", thumb: "assets/image/4.png", gender: "Male", birthday: "", city: "", state: "", province: ""}
  ];

  constructor() {
  }

  getAll() {
    return this.dependents;
  }

  get(id) {
    let item = this.dependents.filter(dependent => dependent.id === id);
    return item;
  }

  update(id, data) {
    let index = this.dependents.findIndex(dependent => dependent.id === id);
    this.dependents[index] = data;
  }

  delete(id) {
    let index = this.dependents.findIndex(dependent => dependent.id === id);
    this.dependents.splice(index, 1);
  }
}
