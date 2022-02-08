// import SubMenu from "./SubMenu";
import MenuItem from "./MenuItem";
import css from "./index.module.less";
import { useLocation } from "react-router-dom";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import routes from "@common/const/routes";
import React, { Fragment } from "react";
import home from "@assets/images/menu/home.png";
import swap from "@assets/images/menu/swap.png";
import block from "@assets/images/menu/block.png";
import calculator from "@assets/images/menu/calculator.png";
import boardroom from "@assets/images/menu/boardroom.png";
import vip from "@assets/images/menu/vip.png";
import community from "@assets/images/menu/community.png";
import invitation from "@assets/images/menu/invitation.png";
import notice from "@assets/images/menu/notice.png";
import copyIcon from "@assets/images/menu/copy.png";
import viewIcon from "@assets/images/menu/location.png";
import audit from "@assets/images/menu/audit.png";
import loop from "@assets/images/menu/loop.png";
import mobility from "@assets/images/menu/mobility.png";
import whitePaper from "@assets/images/menu/whitePaper.png";
import lottery from "@assets/images/menu/lottery.png";
import slwk from "@assets/images/menu/slwk.png";
import dao from "@assets/images/menu/dao.png";
import slrg from "@assets/images/menu/slrg.png";
import dr from "@assets/images/menu/dr.png";
import mmrsct from "@assets/images/menu/mmrsct.png";

import homeActive from "@assets/images/menu/home_active.png";
import swapActive from "@assets/images/menu/swap_active.png";
import blockActive from "@assets/images/menu/block_active.png";
import calculatorActive from "@assets/images/menu/calculator_active.png";
import boardroomActive from "@assets/images/menu/boardroom_active.png";
import vipActive from "@assets/images/menu/vip_active.png";
import communityActive from "@assets/images/menu/community_active.png";
import invitationActive from "@assets/images/menu/invitation_active.png";
import noticeActive from "@assets/images/menu/notice_active.png";
import auditActive from "@assets/images/menu/audit_active.png";
import loopActive from "@assets/images/menu/loop_active.png";
import mobilityActive from "@assets/images/menu/mobility_active.png";
import lotteryActive from "@assets/images/menu/lottery_active.png";
import slwkActive from "@assets/images/menu/slwk_active.png";
import daoActive from "@assets/images/menu/dao_active.png";
import drActive from "@assets/images/menu/dr_active.png";
import mmrsctActive from "@assets/images/menu/mmrsct_active.png";

import slrgActive from "@assets/images/menu/slrg_active.png";
import { inject, observer } from "mobx-react";
import LangChange from "./LangChange";
import Activate from "@components/Activate";

const ICON = {
  home,
  swap,
  block,
  calculator,
  boardroom,
  vip,
  community,
  invitation,
  notice,
  audit,
  loop,
  mobility,
  whitePaper,
  lottery,
  slwk,
  slrg,
  dao,
  dr,
  mmrsct
};
const ICON_ACTIVE = {
  home: homeActive,
  swap: swapActive,
  block: blockActive,
  calculator: calculatorActive,
  boardroom: boardroomActive,
  vip: vipActive,
  community: communityActive,
  invitation: invitationActive,
  notice: noticeActive,
  audit: auditActive,
  loop: loopActive,
  mobility: mobilityActive,
  lottery: lotteryActive,
  slwk: slwkActive,
  dao: daoActive,
  slrg: slrgActive,
  dr: drActive,
  mmrsct:mmrsctActive
};
const languageContext = {
  English: {
    copy: "Copy Address",
    view: "View on BscScan",
    status: "status",
    activeBtn: "activate",
    active: "Activated",
    notActive: "not active",
    login: "Connect",
    copySuccess: "copy success",
    copyFail: "copy fail",
  },
  TraditionalChinese: {
    copy: "Copy Address",
    view: "View on BscScan",
    status: "狀態",
    active: "已激活",
    notActive: "未激活",
    activeBtn: "激活",
    login: "Connect",
    copySuccess: "復製成功",
    copyFail: "復製失敗",
  },
  SimplifiedChinese: {
    copy: "Copy Address",
    copySuccess: "复制成功",
    copyFail: "复制失败",
    view: "View on BscScan",
    status: "状态",
    active: "已激活",
    notActive: "未激活",
    activeBtn: "激活",
    login: "Connect",
  },
};
function Menu(props) {
  const location = useLocation();

  const {
    view,
    chain,
    server,
    lang: { selectedLang },
  } = props;
  /**
   * 渲染 menu树
   */
  function renderMenuList(startIndex, endIndex) {
    let array = routes.slice(startIndex, endIndex);
    return array.map((route, index) => {
      let right = null;
      let isLast = array.length === index + 1;
      return (
        <MenuItem
          key={route.path}
          {...route}
          icon={ICON[route.icon]}
          activeIcon={ICON_ACTIVE[route.icon]}
          pathname={location.pathname}
          right={right}
          isLast={isLast}
        />
      );
    });
  }

  function copy() {
    if (chain.address !== "") {
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = chain.address;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      Toast.success(languageContext[selectedLang.key].copySuccess);
    } else {
      Toast.fail(languageContext[selectedLang.key].copyFail);
    }
  }
  // 激活弹窗
  const [display, setDisplay] = React.useState("none");
  const closeActivate = React.useCallback(() => {
    setDisplay("none");
  }, []);
  const toRegister = React.useCallback(() => {
    setDisplay("unset");
  }, []);
  const [language, setLanguage] = React.useState(
    languageContext[selectedLang.key]
  );

  React.useEffect(() => {
    setLanguage(languageContext[selectedLang.key]);
  }, [selectedLang.key]);
  return (
    <Fragment>
      <div style={{ display: display }}>
        <Activate closeActivate={closeActivate} />
      </div>
      <div
        className={classNames(css.siderContent, !view.collapsed && css.active)}
        onClick={() => {
          if (window.innerWidth <= 960) {
            view.changeCollapsed(true);
          }
        }}
      >
        <div className={classNames(css.sider)}>
          <div
            className={css.siderBox}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={css.info}>
              {chain.address === "" ? (
                <div className={css.login} onClick={() => chain.login()}>
                  {language.login}
                </div>
              ) : (
                <>
                  <div className={css.address}>{chain.quiteAddress}</div>
                  <div className={css.operation}>
                    <div
                      className={css.copy}
                      onClick={() => {
                        copy();
                      }}
                    >
                      <img src={copyIcon} alt={""} className={css.image} />
                      {language.copy}
                    </div>
                    {chain.address === "" ? null : (
                      <div
                        className={css.view}
                        onClick={() => {
                          window.open(
                            `https://www.bscscan.com/address/${chain.address}`
                          );
                        }}
                      >
                        <img src={viewIcon} alt={""} className={css.image} />
                        {language.view}
                      </div>
                    )}
                  </div>
                  <div className={css.status}>
                    <div className={css.left}>
                      {language.status}:
                      {chain.isActive ? language.active : language.notActive}
                    </div>
                    {chain.bindParnet ===
                      "0x0000000000000000000000000000000000000000" && (
                      <div className={css.right} onClick={toRegister}>
                        {language.activeBtn}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className={css.price}>
              <div className={css.left}>
                <div className={css.icon} />
              </div>
              <div className={css.right}>${server.mmr_price}</div>
            </div>

            <nav
              className={classNames(css.menu)}
              onClick={() => {
                if (window.innerWidth <= 960) {
                  view.changeCollapsed(true);
                }
              }}
            >
              {renderMenuList(0, 5)}
            </nav>
            <nav
              className={classNames(css.menu)}
              onClick={() => {
                if (window.innerWidth <= 960) {
                  view.changeCollapsed(true);
                }
              }}
            >
              {renderMenuList(5, 10)}
            </nav>
            <nav
              className={classNames(css.menu)}
              onClick={() => {
                if (window.innerWidth <= 960) {
                  view.changeCollapsed(true);
                }
              }}
            >
              {renderMenuList(10, 18)}
            </nav>
            <LangChange />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default inject("view", "chain", "server", "lang")(observer(Menu));
