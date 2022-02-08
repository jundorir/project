import React from "react";
import css from "./index.module.less";
import { useParams, useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import server from "../../../store/server";

function Detail() {
  const params = useParams();
  const history = useHistory();
  const [detailNotice, setDetailNotice] = React.useState({
    title: "",
    subtitle: "",
    content: "",
    create_time_ymd: "",
  });
  const { id } = params;
  React.useEffect(() => {
    const notice = server.getNoticeById(id);
    if (!notice) {
      history.push("/home");
      return;
    }
    setDetailNotice(notice);
  }, []);
  return (
    <div className={css.detail}>
      <div className={css.context}>
        <div className={css.title}>{detailNotice.title}</div>
        <div className={css.time}>{detailNotice.create_time_ymd}</div>
        <div
          className={css.content}
          dangerouslySetInnerHTML={{ __html: detailNotice.content }}
        ></div>
      </div>
    </div>
  );
}

export default inject("server")(observer(Detail));
