import css from "./index.module.less";
import more from "@assets/images/icon/more.png";
// import logo from "@assets/images/logo.png";
import { inject, observer } from "mobx-react";
import { useLocation } from "react-router-dom";
import classNames from "classnames";

function Header(props) {
  let { pathname } = useLocation();
  const {
    view,
    chain,
    lang: { selectedLang },
  } = props;

  let showLogin = {
    English: {
      login: "Connect",
    },
    TraditionalChinese: {
      login: "Connect",
    },
    SimplifiedChinese: {
      login: "Connect",
    },
  };
  function login() {
    if (chain.address === "") {
      chain.login();
    }
  }
  // console.log('---------------->', pathname)
  return (
    <div
      className={classNames(
        css.header,
        pathname === "/boardroom" && css.roomHeader,
        pathname === "/forceMining" && css.roomHeader,
        (pathname === "/home" ||
          pathname === "/mobilityMining" ||
          pathname === "/mobilityPool" ||
          pathname === "/mining" ||
          pathname === "/swap" ||
          pathname === "/plan" ||
          pathname === "/computationalMining" ||
          pathname === "/daoProposal") &&
          css.imageBg,
        pathname === "/forceMining" && css.forceMiningBg,
        pathname === "/lottery" && css.lottery,
        pathname === "/computationalMining" && css.computationalBg
      )}
    >
      <div className={css.content}>
        <div className={css.box}>
          <div className={css.left}>
            <div className={css.bar}>
              <img
                src={more}
                alt="more"
                className={css.image}
                onClick={() => {
                  view.changeCollapsed();
                }}
              />
            </div>
          </div>
          <div className={css.right}>
            <div
              className={css.wallet}
              onClick={() => {
                login();
              }}
            >
              {chain.address === ""
                ? showLogin[selectedLang.key].login
                : chain.quiteAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("view", "chain", "lang")(observer(Header));
