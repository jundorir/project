import classNames from "classnames";
import css from "./index.module.less";
import Countdown from "@components/Countdown/BlueCountDown";
import { inject, observer } from "mobx-react";
import React from "react";

function Stepper(props) {
  const {
    round,
    step,
    deadline,
    lang: { selectedLang },
  } = props;
  const [language, setLanguage] = React.useState({
    subscribeT: "1.认购阶段",
    buyT: "2.购买阶段",
    snapT: "3.抢购阶段",
    finishT: "4.结束",
    title: '期算力认购',
    rank: '第'
  });

  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        subscribeT: "1.subscribe",
        buyT: "2.buy",
        snapT: "3.snap up",
        finishT: "4.ended",
        title: '',
        rank: 'Phase  '
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        subscribeT: "1.認購階段",
        buyT: "2.購買階段",
        snapT: "3.搶購階段",
        finishT: "4.結束",
        title: '期算力認購',
        rank: '第'
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        subscribeT: "1.认购阶段",
        buyT: "2.购买阶段",
        snapT: "3.抢购阶段",
        finishT: "4.结束",
        title: '期算力认购',
        rank: '第'
      });
    }
  }, [selectedLang.key]);

  return (
    <div className={css.Stepper}>
      <div className={css.title}>{language.rank}{round}{language.title}</div>
      <div className={css.stepsBox}>
        <div className={css.steps}>
          {[0, 1, 2, 3].map((item) => {
            const isDone = step > item;
            const isChecked = step === item;
            return (
              <div
                key={item}
                className={classNames(css.step, {
                  [css.done]: isDone,
                  [css.checked]: isChecked,
                })}
              >
                <div className={css.box}>
                  <div className={css.check} />
                </div>
              </div>
            );
          })}
        </div>
        <div className={css.tips}>
          {[
            language.subscribeT,
            language.buyT,
            language.snapT,
            language.finishT,
          ].map((item, index) => {
            const isChecked = step === index;
            return (
              <div
                key={item}
                className={classNames(css.tip, {
                  [css.checked]: isChecked,
                })}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div className={css.countdown}>
          <Countdown deadline={deadline[step]} />
        </div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(Stepper));
