import React from "react";
import css from "./index.module.less";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";

const languageContext = {
  English: {
    noData: "No announcement",
  },
  TraditionalChinese: {
    noData: "暫無公告",
  },
  SimplifiedChinese: {
    noData: "暂无公告",
  },
};

function Notice(props) {
  const history = useHistory();
  const {
    server,
    lang: { selectedLang },
  } = props;
  const language = languageContext[selectedLang.key];

  React.useEffect(() => {
    server.queryNotice();
  }, []);

  return (
    <div className={css.notice}>
      {server.noticeList.length === 0 && (
        <div className={css.emptyBox}>
          <div className={css.empty} />
          <div className={css.text}>{language.noData}</div>
        </div>
      )}
      {server.noticeList.length > 0 &&
        server.noticeList.map((item) => {
          return (
            <div
              className={css.item}
              key={item.id}
              onClick={() => {
                server.read(item.id);
                history.push(`/noticeDetail/${item.id}`);
              }}
            >
              <div className={css.titleBox}>
                <div className={css.title}>
                  {item.title}
                  {!server.noticeReadList.includes(item.id.toString()) && (
                    <span className={css.notRead}></span>
                  )}
                </div>
                <div className={css.time}>{item.create_time_friendly}</div>
              </div>
              <div className={css.outline}>{item.subtitle}</div>
            </div>
          );
        })}
    </div>
  );
}

export default inject("server", "lang")(observer(Notice));
