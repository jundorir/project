import React from "react";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import classNames from "classnames";
function Countdown(props) {
  const { lang, deadline, onEnd = () => {}, current } = props;
  const { selectedLang } = lang;
  const [language, setLanguage] = React.useState({});
  const intervalRef = React.useRef(null);
  const [date, setDate] = React.useState({
    hour: "00",
    minutes: "00",
    seconds: "00",
  });
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        title1: "Remaining time:",
        h: " h ",
        m: " m ",
        s: " s ",
        apply: "apply",
        buy: "trading",
        rush: "rush",
        ended: "ended",
        countdown: "CountDown:",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        title1: "距離",
        title2: "結束還剩：",
        h: "小時",
        m: "分",
        s: "秒",
        apply: "認購",
        buy: "購買",
        rush: "抢購",
        ended: "認購已結束",
        countdown: "結束倒計時：",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        title1: "距离",
        title2: "结束还剩：",
        h: "小时",
        m: "分",
        s: "秒",
        apply: "认购",
        buy: "购买",
        rush: "抢购",
        ended: "认购已结束",
        countdown: "结束倒计时：",
      });
    }
  }, [selectedLang.key]);
  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (deadline === null) return;
    computeDate();
    intervalRef.current = setInterval(() => {
      computeDate();
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [deadline]);

  function computeDate() {
    const date = Date.now();
    const diffTime = new Date(deadline * 1000).getTime() - date;
    if (diffTime <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      onEnd(current);
    }
    let hour = ~~(diffTime / 1000 / 60 / 60);
    let minutes = ~~((diffTime / 1000 / 60) % 60);
    let seconds = ~~((diffTime / 1000) % 60);

    setDate({
      hour: hour.toString(),
      minutes: minutes.toString().padStart(2, 0),
      seconds: seconds.toString().padStart(2, 0),
    });
  }
  if (deadline === null) {
    return (
      <div className={classNames(css.timing, css.end)}>{language.ended}</div>
    );
  }
  return (
    <div className={css.timing}>
      <div className={css.timingL}></div>
      <div className={css.timingR}>
        <div className={css.timingRT}>{language.countdown}</div>
        <div className={css.timingRB}>
          <div className={css.time}>{date.hour}</div>
          <div className={css.tips}>{language.h}</div>
          <div className={css.time}>{date.minutes}</div>
          <div className={css.tips}>{language.m}</div>
          <div className={css.time}>{date.seconds}</div>
          <div className={css.tips}>{language.s}</div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(Countdown));
