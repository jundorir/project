import React, { Fragment, useCallback, useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import classNames from "classnames";

function Items(props) {
  const { lang, chain, daoProposal } = props;
  const { DaoList, round } = daoProposal;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        discuss: "Proposal discussion",
        endTime: "deadline",
        proposal: "proposal",
        opposition: "opposition",
        favor: "favor",
        ticket: "ticket",
        share: "share",
        noTicket: "No vote",
        Ongoing: "Ongoing",
        Onend: "Has ended",
        already: "Already cast",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        discuss: "提案討論",
        endTime: "截止時間",
        proposal: "提案",
        opposition: "反對",
        favor: "贊成",
        ticket: "票",
        share: "份",
        noTicket: "未投票",
        Ongoing: "進行中",
        Onend: "已結束",
        already: "已投",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        discuss: "提案讨论",
        endTime: "截止时间",
        proposal: "提案",
        opposition: "反对",
        favor: "赞成",
        ticket: "票",
        share: "份",
        noTicket: "未投票",
        Ongoing: "进行中",
        Onend: "已结束",
        already: "已投",
      });
    }
  }, [selectedLang.key]);

  useEffect(() => {
    daoProposal.getDaoList();
  }, []);
  useEffect(() => {
    if (DaoList.length > 0 && chain.address) {
      DaoList.filter((item) => {
        daoProposal.init(item.daoId);
        daoProposal.DAO_beClaimed(item.daoId);
        daoProposal.DAO_getAllCanWithDraw(item.daoId);
        daoProposal.DAO_userVoteInfo(item.daoId);
        daoProposal.DAO_voteResultInfo(item.daoId);
        daoProposal.DAO_periodDeadline(item.daoId);
        daoProposal.periodLockEndTime(item.daoId);
      });
    }
  }, [DaoList, chain.address]);
  function getDetail(item) {
    props.changeView(item);
  }
  function renderBar(positive, against) {
    if (positive - 0 === 0 && against - 0 === 0) {
      return <div className={css.noBar}>{language.noTicket}0%</div>;
    } else if (positive - 0 > 0 && against - 0 > 0) {
      return (
        <div className={css.progressBar}>
          <div
            className={css.favor}
            style={{
              width: `${(positive * 100) / (positive - 0 + (against - 0))}%`,
            }}
          >
            {`${((positive * 100) / (positive - 0 + (against - 0))).toFixed(
              2
            )}%`}
          </div>
          <div
            className={css.opposition}
            style={{
              width: `${(against * 100) / (positive - 0 + (against - 0))}%`,
            }}
          >
            {`${((against * 100) / (positive - 0 + (against - 0))).toFixed(
              2
            )}%`}
          </div>
        </div>
      );
    } else if (positive - 0 === 0 && against - 0 > 0) {
      return <div className={css.onlyopposition}>100%</div>;
    } else if (positive - 0 > 0 && against - 0 === 0) {
      return <div className={css.onlyafavor}>100%</div>;
    }
  }
  function renderTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }
  function renderItems() {
    return DaoList.map((item, index) => {
      return (
        <div
          className={css.contain}
          key={item.daoId}
          onClick={() => {
            getDetail(item);
          }}
        >
          <div className={css.top}>
            <div className={css.num}>DAO#{item.daoId}</div>
            <div
              className={classNames(
                css.continue,
                new Date().getTime() - round.get(item.daoId)?.deadline * 1000 >
                  0 && css.end
              )}
            >
              {new Date().getTime() - round.get(item.daoId)?.deadline * 1000 > 0
                ? `${language.Onend}(${
                    round.get(item.daoId)?.isVote > 0
                      ? language.already +
                        round.get(item.daoId)?.isVote +
                        language.ticket
                      : language.noTicket
                  })`
                : `${language.Ongoing}(${
                    round.get(item.daoId)?.isVote > 0
                      ? language.already +
                        round.get(item.daoId)?.isVote +
                        language.ticket
                      : language.noTicket
                  })`}
            </div>
          </div>
          <div className={css.content}>
            <div className={css.title}>{item.title}</div>
            <div className={css.item}>
              <span className={css.itemTitle}>{language.endTime}：</span>
              <span>{renderTime(round.get(item.daoId)?.deadline)}</span>
            </div>
            <div className={css.item}>
              <span className={css.itemTitle}>{language.proposal}：</span>
              <span>50000 MMRS/{language.share}</span>
            </div>
            {renderBar(
              round.get(item.daoId)?.positive,
              round.get(item.daoId)?.against
            )}
            <div className={css.vote}>
              <div>
                {language.favor}：{round.get(item.daoId)?.positive}
                {language.ticket}
              </div>
              <div>
                {language.opposition}：{round.get(item.daoId)?.against}
                {language.ticket}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }
  return <Fragment>{renderItems()}</Fragment>;
}

export default inject("lang", "chain", "daoProposal")(observer(Items));
