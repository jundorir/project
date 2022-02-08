import React, { Fragment, useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { interception, checkFloatNumber } from "@utils/common";
import AuthorizationModal from "./AuthorizationModal";

function Details(props) {
  const { lang, daoProposal, data, chain } = props;
  const { MMRSBalance } = daoProposal;
  const {
    MMR_beClaimed = 0, //待领取MMR
    MMRS_beClaimed = 0, //待领取MMRS
    MMRS_Info = {}, //锁仓信息
    isVote = false, //是否投票
    positive = 0, //赞成票
    against = 0, //反对票
    deadline = 0, //截止时间
  } = daoProposal.round.get(data.daoId) || {};
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState([]);
  const [inputNum, setinputNum] = React.useState(0);
  const [isPositive, setisPositive] = React.useState(1);
  const [MMRS_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [inpower, setinpower] = React.useState(false);
  // console.log(data);
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        discuss: "Proposal discussion",
        endTime: "deadline",
        proposal: "proposal",
        opposition: "opposition",
        favor: "favor",
        ticket: "ticket",
        share: "ticket",
        say: "Proposal description",
        need: "need",
        balance: "balance",
        back: "back",
        submit: "submit",
        has: "select",
        noTicket: "No vote",
        Ongoing: "Ongoing",
        Onend: "Has ended",
        already: "Already cast",
        over: "Has ended",
        tickets: "votes",
        type: "voting Type:",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        discuss: "提案討論",
        endTime: "截止時間",
        proposal: "提案",
        opposition: "反對",
        favor: "贊成",
        ticket: "票",
        share: "票",
        say: "提案說明",
        need: "需要",
        balance: "余額",
        back: "返回",
        submit: "提交",
        has: "已選",
        noTicket: "未投票",
        Ongoing: "進行中",
        Onend: "已結束",
        already: "已投",
        over: "已结束",
        tickets: "投票票數",
        type: "投票類型:",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        discuss: "提案讨论",
        endTime: "截止时间",
        proposal: "提案",
        opposition: "反对",
        favor: "赞成",
        ticket: "票",
        share: "票",
        say: "提案说明",
        need: "需要",
        balance: "余额",
        back: "返回",
        submit: "提交",
        has: "已选",
        noTicket: "未投票",
        Ongoing: "进行中",
        Onend: "已结束",
        already: "已投",
        over: "已结束",
        tickets: "投票票数",
        type: "投票类型:",
      });
    }
  }, [selectedLang.key]);
  async function queryAllowanceAll() {
    const WFILAllowance = await chain.queryAllowanceAsync({
      type: "DaoCommit",
      symbol: "MMRS",
    });
    setApprove(WFILAllowance);
  }
  useEffect(() => {
    if (chain.address) {
      queryAllowanceAll();
      daoProposal.queryBalanceAsync();
      daoProposal.initData(data.daoId);
    }
  }, [chain.address]);
  async function toApprove() {
    let symbol = "MMRS";
    let { status, approveAmount } = await chain.toApprove({
      type: "DaoCommit",
      symbol,
    });
    setinpower(false);
    setApprove(approveAmount);
  }
  async function commitVote() {
    if (MMRS_APPROVE_AMOUNT - inputNum * 50000 < 0) {
      // toApprove();
      setinpower(true);
      return;
    }
    const result = await daoProposal.DAO_commitVote(
      data.daoId,
      inputNum,
      isPositive > 0 ? true : false
    );
    daoProposal.reFreshData(data.daoId);
  }
  function renderBar() {
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
  function renderTime() {
    var date = new Date(deadline * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
  function renderModal() {
    if (inpower) {
      return (
        <AuthorizationModal
          closeModal={() => {
            setinpower(false);
          }}
          toprove={toApprove}
        />
      );
    }
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.top}>
          <div className={css.num}>DAO#{data.daoId}</div>
          <div
            className={classNames(
              css.continue,
              new Date().getTime() - deadline * 1000 > 0 && css.end
            )}
          >
            {new Date().getTime() - deadline * 1000 > 0
              ? `${language.Onend}(${
                  isVote > 0
                    ? language.already + isVote + language.ticket
                    : language.noTicket
                })`
              : `${language.Ongoing}(${
                  isVote > 0
                    ? language.already + isVote + language.ticket
                    : language.noTicket
                })`}
          </div>
        </div>
        <div className={css.content}>
          <div className={css.title}>{data.title}</div>
          <div className={css.info}>{data.detail}</div>
          <div className={css.itemBox}>
            <div className={css.item}>
              <span className={css.itemTitle}>{language.endTime}：</span>
              <span>{renderTime()}</span>
            </div>
            <div className={css.item}>
              <span className={css.itemTitle}>{language.proposal}：</span>
              <span>50000 MMRS/{language.share}</span>
            </div>
          </div>
          <div className={css.describe}>
            <div className={css.describeTitle}>{language.say}：</div>
            <div
              dangerouslySetInnerHTML={{ __html: data.explain_content }}
            ></div>
          </div>
          {renderBar()}
          <div className={css.vote}>
            <div>
              {language.favor}：{positive}
              {language.ticket}
            </div>
            <div>
              {language.opposition}：{against}
              {language.ticket}
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.check}>
            {/* <div
              className={css.checkLeft}
              onClick={() => {
                isPositive ? setisPositive(0) : setisPositive(1);
              }}
            >
              <div
                className={classNames(css.left, isPositive <= 0 && css.none)}
              >
                {isPositive <= 0 && language.opposition}
              </div>
              <div
                className={classNames(css.right, isPositive > 0 && css.none)}
              >
                {isPositive > 0 && language.favor}
              </div>
            </div> */}
            <div>{language.type}</div>
            <div className={css.choose}>
              <div
                className={css.left}
                onClick={() => {
                  setisPositive(1);
                }}
              >
                <div className={css.yes}>
                  <div
                    className={classNames(
                      css.yesInner,
                      isPositive <= 0 && css.nochoose
                    )}
                  ></div>
                </div>
                <span>{language.favor}</span>
              </div>
              <div
                className={css.right}
                onClick={() => {
                  setisPositive(0);
                }}
              >
                <div className={css.no}>
                  <div
                    className={classNames(
                      css.noInner,
                      isPositive > 0 && css.nochoose
                    )}
                  ></div>
                </div>
                <span>{language.opposition}</span>
              </div>
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.toVote}>
            <div className={css.tickets}>{language.tickets}</div>
            <div className={css.checkRight}>
              <div
                className={css.reduce}
                onClick={() => {
                  if (inputNum > 0) {
                    setinputNum(inputNum - 1);
                    return;
                  }
                }}
              >
                -
              </div>
              <input
                className={css.input}
                type="number"
                value={inputNum}
                onChange={(e) => {
                  // setinputNum(e.target.value);
                  if (e.target.value === "") {
                    setinputNum("");
                  } else {
                    if (checkFloatNumber(e.target.value)) {
                      let number = e.target.value;
                      // if (number - 100 > 0) {
                      //   number = 100
                      // }
                      if (number.length > 1 && number.startsWith("0")) {
                        number = number.replace(/^[0]+/, "");
                        if (number === "") number = "0";
                        if (number.startsWith(".")) number = "0" + number;
                      }
                      if (number.length > 1 && number.includes(".")) {
                        number = number.substring(0, number.length - 2);
                        // number = number <= 100 ? number : 100
                      }
                      setinputNum(number);
                    }
                  }
                }}
              />
              <div
                className={css.add}
                onClick={() => {
                  setinputNum(inputNum - 0 + 1);
                }}
              >
                +
              </div>
            </div>
          </div>
          <div className={css.itemBox}>
            <div className={css.item}>
              <span className={css.itemTitle}> {language.need} MMRS：</span>
              <span>{50000 * inputNum}</span>
            </div>
            <div className={css.item}>
              <span className={css.itemTitle}>MMRS {language.balance}：</span>
              <span>{MMRSBalance} </span>
            </div>
          </div>
          <div className={css.buttonBox}>
            <div
              className={css.button}
              onClick={() => {
                props.changeView("home");
              }}
            >
              {language.back}
            </div>
            <div
              className={classNames(
                css.button,
                (inputNum <= 0 ||
                  50000 * inputNum - MMRSBalance > 0 ||
                  new Date().getTime() - deadline * 1000 > 0) &&
                  css.disabled
              )}
              onClick={() => {
                inputNum > 0 &&
                  50000 * inputNum - MMRSBalance <= 0 &&
                  new Date().getTime() - deadline * 1000 <= 0 &&
                  commitVote();
              }}
            >
              {new Date().getTime() - deadline * 1000 > 0
                ? language.over
                : language.submit}
            </div>
          </div>
          <p className={classNames(css.nowCheck, inputNum <= 0 && css.no)}>
            {language.has +
              `${
                isPositive > 0 ? language.favor : language.opposition
              }+ ${inputNum} `}
          </p>
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject("lang", "daoProposal", "chain")(observer(Details));
