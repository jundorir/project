import css from "./index.module.less";
import React from "react";
import DisplayMobility from "./DisplayMobility";
import AddMobility from "./AddMobility";
import RemoveMobility from "./RemoveMobility";
import { inject, observer } from "mobx-react";

const languageContext = {
  English: {
    tips: "Mobility Pool",
  },
  TraditionalChinese: {
    tips: "流動性池",
  },
  SimplifiedChinese: {
    tips: "流动性池",
  },
};
function MobilityPool(props) {
  const {
    lang: { selectedLang },
    mobility,
  } = props;
  const language = languageContext[selectedLang.key];



  function renderView() {
    switch (mobility.showView) {
      case 0:
        return <DisplayMobility />;
      case 1:
        return <AddMobility />;
      case 2:
        return <RemoveMobility />;
      default:
        return null;
    }
  }
  return (
    <div className={css.mobilityPool}>
      <div className={css.banner}>
        <div className={css.box}>
          <div className={css.logo}>{language.tips}</div>
          <div className={css.explain}>MMR/USDT</div>
        </div>
      </div>
      {renderView()}
    </div>
  );
}

export default inject("lang", "mobility")(observer(MobilityPool));
