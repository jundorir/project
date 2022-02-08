import React, { useState } from "react";
import Header from "./Home/Header";
import Gain from "./Home/Gain";
import Items from "./Home/Items";
import Details from "./Details";
import { inject, observer } from "mobx-react";
import css from "./index.module.less";

function DAOProposal(props) {
  const { chain, daoProposal } = props;
  const [view, setView] = useState(true);
  const [data, setData] = useState([]);
  function changeView(data) {
    if (data === "home") {
      setView(true);
      return;
    }
    setView(false);
    setData(data);
  }
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        daoProposal.getDaoList();
      }
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className={css.contain}>
      <Header />
      {view ? (
        <>
          <div className={css.top}></div>
          <Items changeView={changeView} />
        </>
      ) : (
        <>
          <Gain data={data} />
          <Details changeView={changeView} data={data} />
        </>
      )}
    </div>
  );
}

export default inject("chain", "daoProposal")(observer(DAOProposal));
