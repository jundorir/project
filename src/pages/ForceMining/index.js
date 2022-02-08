import React from "react";
import Header from "./module/Header";
// import Gain from './module/Gain'
import OldPeriod from "./module/OldPeriod";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import NewPeriod from "./module/NewPeriod";

function ForceMining(props) {
  const { chain, server, computationalPower, forceMining } = props;
  const { view: round } = computationalPower;

  // React.useEffect(() => {
  //   forceMining.init(round);
  // }, [forceMining, round]);

  function renderPeriod() {
    if (round < 5) {
      return <OldPeriod showRound={round} />;
    }
    return <NewPeriod showRound={round} />;
  }

  console.log('round', round)
  if (!round) {
    return null;
  }

  return (
    <div className={css.contain}>
      <Header />
      {/* <Gain /> */}
      {renderPeriod()}
    </div>
  );
}

export default inject(
  "chain",
  "server",
  "computationalPower",
  "forceMining"
)(observer(ForceMining));
