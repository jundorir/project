import { makeAutoObservable } from "mobx";
class View {
  collapsed = true;
  constructor() {
    makeAutoObservable(this);
  }

  changeCollapsed(value) {
    if (value) this.collapsed = value;
    else this.collapsed = !this.collapsed;
  }
}

export default new View();
