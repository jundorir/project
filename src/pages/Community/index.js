import classNames from "classnames";
import { inject, observer } from "mobx-react";
import React from "react";
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
    communityMMRPower: "Community MMR Power",
    communityDAOPower: "Community boardroom Power",
    communityLPPower: "Community LP Power",
    communityWFILPower: "Community WFIL Power",
    noData: "No Data",
  },
  TraditionalChinese: {
    headTips: "直推用戶",
    address: "地址",
    personalMMRPower: "個人MMR算力",
    personalDAOPower: "個人董事會算力",
    personalLPPower: "個人LP算力",
    personalWFILPower: "個人WFIL算力",
    communityMMRPower: "團隊MMR算力",
    communityDAOPower: "團隊董事會算力",
    communityLPPower: "團隊LP算力",
    communityWFILPower: "團隊WFIL算力",
    noData: "暫無數據",
  },
  SimplifiedChinese: {
    headTips: "直推用户",
    address: "地址",
    personalMMRPower: "个人MMR算力",
    personalDAOPower: "个人董事会算力",
    personalLPPower: "个人LP算力",
    personalWFILPower: "个人WFIL算力",
    communityMMRPower: "团队MMR算力",
    communityDAOPower: "团队董事会算力",
    communityLPPower: "团队LP算力",
    communityWFILPower: "团队WFIL算力",
    noData: "暂无数据",
  },
};

function Community(props) {
  const {
    lang: { selectedLang },
    community,
    chain,
  } = props;
  const language = languageContext[selectedLang.key];
  const { list, page, pagesize, total } = community;

  React.useEffect(() => {
    if (chain.address) {
      community.init();
    }
  }, [chain.address, community]);

  // React.useEffect(() => {
  React.useEffect(() => {
    if (total > list.length) {
      document.getElementById("content").onscroll = function (e) {
        const loadEle = document.getElementById("loading");

        if (loadEle?.getBoundingClientRect().top < window.innerHeight) {
          // 加载数据
          document.getElementById("content").onscroll = null;
          community.setPage(page + 1);
        }
      };
    } else {
      document.getElementById("content").onscroll = null;
    }
  }, [list.length, total]);

  // console.log("total > page * pagesize ", total, page, pagesize);
  return (
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
          let item = {
            mmr: 0,
            teamMmr: 0,
            dao: 0,
            teamDao: 0,
            lp: 0,
            teamLp: 0,
            ...info,
          };
          console.log("info ==>", info.lp);
          return (
            <div className={css.info} key={item.id}>
              <div className={css.top}>
                <div className={css.tips}>{language.address}</div>
                <div className={css.content}>{quiteAddress(item.user)}</div>
              </div>
              <div className={css.middle}>
                <div className={css.item}>
                  <div className={css.tips}>{language.personalMMRPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.mmr.toString(), 4)}
                  </div>
                </div>
                <div className={classNames(css.item, css.right)}>
                  <div className={css.tips}>{language.communityMMRPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.teamMmr.toString(), 4)}
                  </div>
                </div>
              </div>{" "}
              <div className={css.middle}>
                <div className={css.item}>
                  <div className={css.tips}>{language.personalWFILPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.fil.toString(), 4)}
                  </div>
                </div>
                <div className={classNames(css.item, css.right)}>
                  <div className={css.tips}>{language.communityWFILPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.teamFil.toString(), 4)}
                  </div>
                </div>
              </div>
              <div className={css.middle}>
                <div className={css.item}>
                  <div className={css.tips}>{language.personalDAOPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.dao.toString(), 4)}
                  </div>
                </div>
                <div className={classNames(css.item, css.right)}>
                  <div className={css.tips}>{language.communityDAOPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.teamDao.toString(), 4)}
                  </div>
                </div>
              </div>
              <div className={css.bottom}>
                <div className={css.item}>
                  <div className={css.tips}>{language.personalLPPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.lp.toString(), 4)}
                  </div>
                </div>
                <div className={classNames(css.item, css.right)}>
                  <div className={css.tips}>{language.communityLPPower}</div>
                  <div className={css.content}>
                    {computeWeiToSymbol(item.teamLp.toString(), 4)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div className={css.loading} id="loading">
        {total > page * pagesize ? "loading ..." : ""}
      </div>
    </div>
  );
}

export default inject("lang", "chain", "community")(observer(Community));
