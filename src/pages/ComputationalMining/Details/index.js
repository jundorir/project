import React, { useState } from "react";
import css from "./index.module.less";
import TopInfo from "./TopInfo";
import BottomInfo from "./BottomInfo";
// import BottomInfoNew from "./BottomInfoNew";
import Gain from "./Gain";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import Introduce from "./Introduce";
import NewInfo from "./NewInfo";

function Details(props) {
  const { lang, computationalPower } = props;
  const { view: round } = computationalPower;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  const [tab, setTab] = React.useState(0);
  const [showMing, setShowMing] = useState(false);

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage([
        `status  `,
        "  introduce",
        "Product Picture",
        "computational mining",
      ]);
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage(["狀態", "簡介", "產品圖片", "算力挖礦"]);
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage(["状态", "简介", "产品图片", "算力挖矿"]);
    }
  }, [selectedLang.key]);

  React.useEffect(() => {
    let interval = null;

    computationalPower.queryMarketPrice(round);
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      computationalPower.queryMarketPrice(round);
    }, 3 * 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  function renderTabs() {
    if (tab === 0) {
      return <NewInfo round={round} />;
    }
    if (tab === 1) {
      return <Introduce />;
    }

    return null;
  }

  function renderView() {
    if (showMing) {
      return (
        <div className={css.detailOuterBox}>
          <div className={css.detailBox}>
            <TopInfo round={round} />
          </div>
          <div className={css.detailBox}>
            <BottomInfo round={round} />
          </div>
          <Gain round={round} />
        </div>
      );
    }
    return (
      <div className={css.detailOuterBox}>
        <div className={css.detailBox}>
          <div className={css.head}>
            <div
              className={classNames(css.state, tab === 0 && css.checked)}
              onClick={() => {
                if (tab !== 0) setTab(0);
              }}
            >
              {language[0]}
              <div className={css.line} />
            </div>
            <div
              className={classNames(css.introduce, tab === 1 && css.checked)}
              onClick={() => {
                if (tab !== 1) setTab(1);
              }}
            >
              {language[1]}
              <div className={css.line} />
            </div>
          </div>
          {renderTabs()}
        </div>
        <div
          className={css.jumpButton}
          onClick={() => {
            setShowMing(true);
          }}
        >
          {language[3]}
        </div>
      </div>
    );
  }

  if (round === 0) {
    return null;
  }

  return (
    <div className={css.detail}>
      {/* <div className={css.banner}>
        <div className={css.alt}>{language[2]}</div>
        <div className={css.englishAlt}>PRODUCT</div>
      </div> */}

      {renderView()}
    </div>
  );
}

export default inject("lang", "computationalPower")(observer(Details));
