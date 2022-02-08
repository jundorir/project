import classNames from "classnames";
import { inject, observer } from "mobx-react";
import React, { Fragment } from "react";
import { quiteAddress, computeWeiToSymbol } from "@utils/common";
import css from "./index.module.less";

const languageContext = {
  English: {
    headTips: "Direct Push User",
    address: "Address",
    personalMMRPower: "Personal MMR Power",
    personalDAOPower: "Personal Boardroom Power",
    personalLPPower: "Personal LP Power",
    personalWFILPower: "Personal WFIL Power",
    personalMMRSPower: "Personal MMRS Power",
    communityMMRPower: "Community MMR Power",
    communityDAOPower: "Community boardroom Power",
    communityLPPower: "Community LP Power",
    communityWFILPower: "Community WFIL Power",
    communityMMRSPower: "Community MMRS Power",
    noData: "No Data",
    time: "Registration Time",
  },
  TraditionalChinese: {
    headTips: "直推用戶",
    address: "地址",
    personalMMRPower: "個人MMR算力",
    personalDAOPower: "個人董事會算力",
    personalLPPower: "個人LP算力",
    personalWFILPower: "個人WFIL算力",
    personalMMRSPower: "個人MMRS算力",
    communityMMRPower: "團隊MMR算力",
    communityDAOPower: "團隊董事會算力",
    communityLPPower: "團隊LP算力",
    communityWFILPower: "團隊WFIL算力",
    communityMMRSPower: "團隊MMRS算力",
    noData: "暫無數據",
    time: "註冊時間",
  },
  SimplifiedChinese: {
    headTips: "直推用户",
    address: "地址",
    personalMMRPower: "个人MMR算力",
    personalDAOPower: "个人董事会算力",
    personalLPPower: "个人LP算力",
    personalWFILPower: "个人WFIL算力",
    personalMMRSPower: "个人MMRS算力",
    communityMMRPower: "团队MMR算力",
    communityDAOPower: "团队董事会算力",
    communityLPPower: "团队LP算力",
    communityWFILPower: "团队WFIL算力",
    communityMMRSPower: "团队MMRS算力",
    noData: "暂无数据",
    time: "注册时间",
  },
};

function MMRSCommunity(props) {
  const {
    lang: { selectedLang },
    mmrsCommunity,
    chain,
  } = props;
  const language = languageContext[selectedLang.key];
  const { list, page, pagesize, total } = mmrsCommunity;
  // const { page, pagesize, total } = mmrsCommunity;

  React.useEffect(() => {
    if (chain.address) {
      mmrsCommunity.init();
    }
  }, [chain.address, mmrsCommunity]);
  // 模拟数据
  // const list = [
  //   {
  //     id: 1,
  //     user: "dsfsdfdsfsdfds",
  //     mmr: "1",
  //     teamMmr: 1,
  //     fil: 1,
  //     teamFil: 1,
  //     mmrs: 2,
  //     teamMmrs: 2,
  //     time: "2020/07/20 10:25",
  //   },
  //   {
  //     id: 2,
  //     user: "abcdefghijk",
  //     mmr: 1,
  //     teamMmr: 1,
  //     fil: 1,
  //     teamFil: 1,
  //     mmrs: 3,
  //     teamMmrs: 3,
  //     time: "2021/07/20 10:22",
  //   },
  // ];
  React.useEffect(() => {
    // console.log("total, page", total, page);
    if (total > list.length) {
      document.getElementById("content").onscroll = function (e) {
        const loadEle = document.getElementById("loading");
        if (loadEle?.getBoundingClientRect().top < window.innerHeight) {
          // 加载数据
          document.onscroll = null;
          mmrsCommunity.setPage(page + 1);
        }
      };
    } else {
      document.onscroll = null;
    }
  }, [list.length, total]);

  // console.log("total > page * pagesize ", total, page, pagesize);
  return (
    <Fragment>
      <div className={css.community}>
        <div className={css.title}>{language.headTips}</div>
        {list.length === 0 && total === 0 && (
          <div className={css.emptyBox}>
            <div className={css.empty} />
            <div className={css.text}>{language.noData}</div>
          </div>
        )}
        {list.length > 0 &&
          list.map((info) => {
            console.log("info", info);
            let item = {
              user: "",
              // mmr: 0,
              // teamMmr: 0,
              // fil: 0,
              // teamFil: 0,
              mmrs: 0,
              teamMmrs: 0,
              ...info,
            };
            return (
              <div className={css.info} key={item.id}>
                <div className={css.top}>
                  <div className={css.tips}>{language.address}</div>
                  <div className={css.content}>{quiteAddress(item.user)}</div>
                </div>
                {/* <div className={css.middle}>
                  <div className={css.item}>
                    <div className={css.tips}>{language.personalMMRPower}</div>
                    <div className={css.content}>{item.mmr}</div>
                  </div>
                  <div className={classNames(css.item, css.right)}>
                    <div className={css.tips}>{language.communityMMRPower}</div>
                    <div className={css.content}>{item.teamMmr}</div>
                  </div>
                </div> */}
                {/* <div className={css.middle}>
                  <div className={css.item}>
                    <div className={css.tips}>{language.personalWFILPower}</div>
                    <div className={css.content}>{item.fil}</div>
                  </div>
                  <div className={classNames(css.item, css.right)}>
                    <div className={css.tips}>
                      {language.communityWFILPower}
                    </div>
                    <div className={css.content}>{item.teamFil}</div>
                  </div>
                </div> */}
                <div className={css.middle}>
                  <div className={css.item}>
                    <div className={css.tips}>{language.personalMMRSPower}</div>
                    <div className={css.content}>{item.mmrs}</div>
                  </div>
                  <div className={classNames(css.item, css.right)}>
                    <div className={css.tips}>
                      {language.communityMMRSPower}
                    </div>
                    <div className={css.content}>{item.teamMmrs}</div>
                  </div>
                </div>
                <div className={css.bottom}>
                  <div className={css.left}>{language.time}</div>
                  <div className={css.right}>{item.time}</div>
                </div>
              </div>
            );
          })}
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
  "mmrsCommunity"
)(observer(MMRSCommunity));
