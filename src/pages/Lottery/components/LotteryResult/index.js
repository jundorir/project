import classNames from "classnames";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
function LotteryResult(props) {
  let {
    period,
    showHead = true,
    lottery,
    lang: { selectedLang },
  } = props;
  const { finalNumber = "1000000" } = lottery.lotteryPeriod.get(period) ?? {};
  const tips = {
    English: "Winning Numbers",
    TraditionalChinese: "中獎號碼",
    SimplifiedChinese: "中奖号码",
  };

  const luckNumber = finalNumber.slice(-6).split("");
  const isPreviousPeriod = lottery.lastOpenLotteryPeroid === period;
  return (
    // <>
    // {/* {showTime && <div className={css.time}>已开奖于{2021年9月14日 上午 8: 00}</div>} */}

    <div className={classNames(css.lotteryResultBox, !showHead && css.small)}>
      <div className={css.lotteryResult}>
        {showHead && (
          <div className={css.head}>
            <div className={css.tips}>{tips[selectedLang.key]}</div>
            {isPreviousPeriod && <div className={css.icon} />}
          </div>
        )}
        <div className={css.lotteryBallBox}>
          {luckNumber.map((item, index) => (
            <div
              className={classNames(css.ball, css[`ball${index}`])}
              key={index}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
    // </>
  );
}

export default inject("lottery", "lang")(observer(LotteryResult));
