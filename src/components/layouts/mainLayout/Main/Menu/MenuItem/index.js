import classNames from "classnames";
import { Link } from "react-router-dom";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function MenuItem({
  path,
  label,
  icon,
  activeIcon,
  pathname,
  right,
  lang,
  server,
  isLast,
  _target,
  _special_path,
}) {
  const active = pathname === path;
  const showIcon = active ? activeIcon : icon;
  right = right || <div className={css.arrow}></div>;
  const { selectedLang } = lang;
  if (_target) {
    return (
      <a
        href={path}
        className={css.menuItem}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img src={showIcon} alt={label} className={css.image} />
        <span className={css.label}>{label[selectedLang.key]}</span>
        <span className={css.right}> {right} </span>
      </a>
    );
  }

  if (
    (!server.is_transfer &&
      (path === "/mobilityMining" ||
        path === "/mobilityPool" ||
        path === "/forceMining")) ||
    path === "/dao" ||
    path === "/lottery"
  ) {
    return (
      <a
        href={"#"}
        className={css.menuItem}
        // target="_blank"
        // rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const languages = {
            English: "comming soon!",
            TraditionalChinese: "即將上線!",
            SimplifiedChinese: "即将上线!",
          };
          Toast.show(languages[selectedLang.key]);
        }}
      >
        <img src={showIcon} alt={label} className={css.image} />
        <span className={css.label}>{label[selectedLang.key]}</span>
        <span className={css.right}> {right} </span>
      </a>
    );
  }

  // if (
  //   path === "/plan"
  // ) {
  //   return (
  //     <a
  //       href={'#'}
  //       className={css.menuItem}
  //       // target="_blank"
  //       // rel="noopener noreferrer"
  //       onClick={e => {
  //         e.preventDefault()
  //         e.stopPropagation()
  //         const languages = {
  //           English: 'under maintenance!',
  //           TraditionalChinese: '维护中!',
  //           SimplifiedChinese: '维护中!'
  //         }
  //         Toast.show(languages[selectedLang.key])
  //       }}
  //     >
  //       <img src={showIcon} alt={label} className={css.image} />
  //       <span className={css.label}>{label[selectedLang.key]}</span>
  //       <span className={css.right}> {right} </span>
  //     </a>
  //   )
  // }

  if (icon) {
    return (
      <Link
        to={path}
        className={classNames(
          css.menuItem,
          active && css.active,
          isLast && css.last
        )}
      >
        <img src={showIcon} alt={label} className={css.image} />
        <span className={css.label}>{label[selectedLang.key]}</span>
        <span className={css.right}> {right} </span>
      </Link>
    );
  }
}

export default inject("chain", "lang", "server")(observer(MenuItem));
