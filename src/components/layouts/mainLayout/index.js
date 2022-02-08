import React from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import SecondaryHeader from "./SecondaryHeader";
import css from "./index.module.less";
import { SecondaryRoutes } from "@common/const/routes";
import ChangeLanguage from "../../changeLanguage";

const SecondaryRoutesMap = new Map();
SecondaryRoutes.forEach((element) => {
  SecondaryRoutesMap.set(element.mapPath, element.label);
});

const MainLayout = ({ children, location, ...o }) => {
  // 选中的路由，及其夫路由集合，
  // 没有选中的route 则默认选中第一个

  function renderHeader() {
    let pathname = location.pathname;
    if (pathname.includes("/pledgeDetail/")) {
      pathname = "/pledgeDetail/";
    }
    if (pathname.includes("/noticeDetail/")) {
      pathname = "/noticeDetail/";
    }
    if (pathname.includes("/boardroomPledge")) {
      pathname = "/boardroomPledge";
    }

    if (SecondaryRoutesMap.has(pathname)) {
      return <SecondaryHeader title={SecondaryRoutesMap.get(pathname)} />;
    }

    if (pathname.includes("/miningDetail/")) {
      return (
        <SecondaryHeader
          title={SecondaryRoutesMap.get("/miningDetail/")}
          type="period"
        />
      );
    }

    if (pathname.includes("/forceMining/")) {
      return (
        <SecondaryHeader
          title={SecondaryRoutesMap.get("/forceMining/")}
          type="period"
        />
      );
    }

    return <Header />;
  }
  return (
    <div className={css.layout}>
      {renderHeader()}
      <ChangeLanguage />
      <Main>{children}</Main>
    </div>
  );
};

export default withRouter(MainLayout);
