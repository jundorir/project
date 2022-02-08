import React, { Fragment } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import Nonthing from "@assets/images/icon/nothing.png";
import { quiteAddress } from "@utils/common";

const languageContext = {
  English: {
    title: "Cumulative dynamic rewards have been obtained",
    source: "source",
    depth: "depth",
    reward: "amount of reward",
    time: "time",
    none: "No dynamic reward details are available",
  },
  TraditionalChinese: {
    title: "累計已獲得動態獎勵",
    source: "來源",
    depth: "深度",
    reward: "獎勵金額",
    time: "時間",
    none: "暫無動態獎勵明細",
  },
  SimplifiedChinese: {
    title: "累计已获得动态奖励",
    source: "来源",
    depth: "深度",
    reward: "奖励金额",
    time: "时间",
    none: "暂无动态奖励明细",
  },
};
function DynamicReward(props) {
  const {
    lang: { selectedLang },
    chain,
    dynamicRewardList,
  } = props;
  const { list, page, pagesize, total, accumulatedGain } = dynamicRewardList;
  const language = languageContext[selectedLang.key];
  React.useEffect(() => {
    if (chain.address) {
      dynamicRewardList.init();
    }
  }, [chain.address]);
  React.useEffect(() => {
    if (total > list.length) {
      document.getElementById("content").onscroll = function (e) {
        const loadEle = document.getElementById("loading");
        console.log(loadEle?.getBoundingClientRect().top < window.innerHeight);
        if (loadEle?.getBoundingClientRect().top < window.innerHeight) {
          document.onscroll = null;
          dynamicRewardList.setPage(page + 1);
        }
      };
    } else {
      document.getElementById("content").onscroll = null;
    }
    return () => {
      document.getElementById("content").onscroll = null;
    };
  }, [total, list.length]);
  function renderList() {
    console.log("list.length", list.length);
    if (list.length === 0)
      return (
        <div className={css.nothing}>
          <img className={css.IMG} src={Nonthing} alt="" />
          <div className={css.BTM}>{language.none}</div>
        </div>
      );
    return list.map((info, index) => {
      let item = {
        source: "",
        depth: "0",
        rewardAmount: "0",
        time2: "0",
        ...info,
      };
      return (
        <div className={css.item} key={index}>
          <div className={css.iteminner}>
            <div className={css.top}>
              <div className={css.left}>
                {quiteAddress(item.source)}
                <span className={css.light}>/{item.depth}</span>
              </div>
              <div className={css.right}>
                <span className={css.number}>{item.rewardAmount}</span>
                <span className={classNames(css.unit, css.light)}>USDT</span>
              </div>
            </div>
            <div className={css.bottom}>
              <div className={css.light}>{language.time}：</div>
              <div className={classNames(css.light, css.time)}>{item.time}</div>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.top}>
          <div className={css.info}>
            <div className={css.infoInner}>
              <div className={css.infoTop}>{language.title}</div>
              <div className={css.infoBottom}>
                <span className={css.num}>{accumulatedGain}</span>
                <span className={css.unit}>USDT</span>
              </div>
            </div>
          </div>
        </div>
        <div className={css.title}>
          <div className={css.left}>
            <span>{language.source}</span>
            <span className={css.light}>/{language.depth}</span>
          </div>
          <div className={css.right}>{language.reward}</div>
        </div>
        {renderList()}
        <div className={css.loading} id="loading">
          {total > page * pagesize ? "loading ..." : ""}
        </div>
      </div>
    </Fragment>
  );
}

export default inject(
  "lang",
  "chain",
  "dynamicRewardList"
)(observer(DynamicReward));
