import React from "react";
import Loading from "@components/Loading";
import NetWorkError from "@components/NetWorkError";
import { render, unmountComponentAtNode } from "react-dom";
import "./modal.css";
import lang from "../store/lang";
export default class loading {
  container = null;
  static count = 0;
  static show() {
    this.count++;
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.setAttribute("class", "cover-modal");
      document.body.appendChild(this.container);
      render(
        <div className="loading-box">
          <Loading language={lang.selectedLang.key} />
        </div>,
        this.container
      );
    }
  }
  static hidden() {
    this.count--;
    if (this.count < 0) this.count = 0;
    if (!!this.container) {
      unmountComponentAtNode(this.container);
      this.container.parentElement.removeChild(this.container);
      this.container = null;
    }
  }

  static showNetWorkError() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.setAttribute("class", "cover-modal");
      document.body.appendChild(this.container);
      render(<NetWorkError language={lang.selectedLang.key} />, this.container);
    }
  }
}
