import { makeAutoObservable } from "mobx";
class Lang {
  selectedLang = {
    key: "TraditionalChinese",
    value: "繁體中文",
  }; // cn en
  tabs = [
    {
      key: "English",
      TraditionalChinese: "英文",
      SimplifiedChinese: "英文",
      English: "English",
    },
    {
      key: "TraditionalChinese",
      TraditionalChinese: "繁體中文",
      SimplifiedChinese: "繁体中文",
      English: "Traditional Chinese",
    },
    {
      key: "SimplifiedChinese",
      TraditionalChinese: "簡體中文",
      SimplifiedChinese: "简体中文",
      English: "Simplified Chinese",
    },
  ];

  networkErrorTips = {
    English: "network error",
    TraditionalChinese: "網絡異常",
    SimplifiedChinese: "网络异常",
  };

  open = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  get networkError() {
    return this.networkErrorTips[this.selectedLang.key];
  }

  init() {
    let langKey = localStorage.getItem("langKey");
    let langValue = localStorage.getItem("langValue");
    if (
      ["English", "TraditionalChinese", "SimplifiedChinese"].includes(langKey)
    ) {
      this.selectedLang = {
        key: langKey,
        value: langValue,
      };
    }
  }

  changeLang(key, value) {
    this.selectedLang = {
      key,
      value,
    };
    localStorage.setItem("langKey", key);
    localStorage.setItem("langValue", value);
  }

  openModal() {
    // console.log('openModal')
    this.open = true;
  }

  closeModal() {
    this.open = false;
  }
}

export default new Lang();
