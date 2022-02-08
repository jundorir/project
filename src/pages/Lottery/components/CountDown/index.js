import React from "react";
import css from "./index.module.less";
import classNames from "classnames";
import { inject, observer } from "mobx-react";

function CountDown(props) {
  const {
    deadline,
    cb = () => {},
    lang: { selectedLang },
  } = props;
  const intervalRef = React.useRef(null);
  const [date, setDate] = React.useState({
    hour: "00",
    minutes: "00",
    seconds: "00",
  });
  const [language, setLanguage] = React.useState({});

  React.useEffect(() => {
    const g_language = {
      English: {
        waiting: "Waiting for the lottery",
        end: "Buy Count Down",
        seconds: "seconds",
        hours: "hours",
        minutes: "minutes",
      },
      TraditionalChinese: {
        waiting: "等待開獎",
        end: "距購買結束還有",
        seconds: "秒",
        hours: "小時",
        minutes: "分鐘",
      },
      SimplifiedChinese: {
        waiting: "等待开奖",
        end: "距购买结束还有",
        seconds: "秒",
        hours: "小时",
        minutes: "分钟",
      },
    };

    setLanguage(g_language[selectedLang.key]);
  }, [selectedLang.key]);
  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
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
    const diffTime = new Date(deadline) - date;
    if (diffTime <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if (cb) cb();
      }
      setDate({
        hour: "00",
        minutes: "00",
        seconds: "00",
      });
      return;
    }

    let hour = ~~(diffTime / 1000 / 60 / 60);
    let minutes = ~~((diffTime / 1000 / 60) % 60);
    let seconds = ~~((diffTime / 1000) % 60);

    setDate({
      hour: hour.toString().padStart(2, 0),
      minutes: minutes.toString().padStart(2, 0),
      seconds: seconds.toString().padStart(2, 0),
    });
  }

  if (date.hour === "00" && date.minutes === "00" && date.seconds === "00") {
    return <div className={css.countDown}>{language.waiting}</div>;
  }

  if (date.hour === "00" && date.minutes === "00") {
    const [ten, bit] = date.seconds.split("");
    return (
      <div className={css.countDown}>
        {language.end}
        <span className={css.time}>{ten}</span>
        <span className={classNames(css.time, css.last)}>{bit}</span>
        {language.seconds}
      </div>
    );
  }
  const [tenHour, bitHour] = date.hour.split("");
  const [tenMinutes, bitMinutes] = date.minutes.split("");

  return (
    <div className={css.countDown}>
      {language.end}

      <span className={css.time}>{tenHour}</span>
      <span className={classNames(css.time, css.last)}>{bitHour}</span>
      {language.hours}

      <span className={css.time}>{tenMinutes}</span>
      <span className={classNames(css.time, css.last)}>{bitMinutes}</span>
      {language.minutes}
    </div>
  );
}

export default inject("lang")(observer(CountDown));
