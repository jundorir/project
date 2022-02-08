import React from "react";
import css from "./index.module.less";
import classNames from "classnames";
import MFIL_ICON from "@assets/images/swap/MFIL.png";
import HFIL_ICON from "@assets/images/swap/HFIL.png";
import USDT_ICON from "@assets/images/mobilityMining/usdt.png";
import MMR_ICON from "@assets/images/mobilityMining/mmr.png";
import MMRS_ICON from "@assets/images/mobilityPool/MMRS.png";
import MMR_T1_ICON from "@assets/images/swap/T1.png";
import MMR_T2_ICON from "@assets/images/swap/T2.png";
import MMR_T3_ICON from "@assets/images/swap/T3.png";
import MMR_T4_ICON from "@assets/images/swap/T4.png";
import MMR_T5_ICON from "@assets/images/swap/T5.png";
import MMR_T6_ICON from "@assets/images/swap/T6.png";
import MMR_T7_ICON from "@assets/images/swap/T7.png";
import MMR_T8_ICON from "@assets/images/swap/T8.png";
import MMR_T9_ICON from "@assets/images/swap/T9.png";
import MMR_T10_ICON from "@assets/images/swap/T10.png";
import T_ICON from "@assets/images/mobilityPool/T.png";
const COINS_MAP = {
  AFIL: {
    icon: HFIL_ICON,
    title: "FIL",
  },
  WFIL: {
    icon: MFIL_ICON,
    title: "WFIL",
  },
  USDT: {
    icon: USDT_ICON,
    title: "USDT",
  },
  MMR: {
    icon: MMR_ICON,
    title: "MMR",
  },
  MMRS: {
    icon: MMRS_ICON,
    title: "MMRS",
  },
  T: {
    icon: T_ICON,
    title: "T",
  },
  T1: {
    icon: MMR_T1_ICON,
    title: "MMRT1",
  },
  T2: {
    icon: MMR_T2_ICON,
    title: "MMRT2",
  },
  T3: {
    icon: MMR_T3_ICON,
    title: "MMRT3",
  },
  T4: {
    icon: MMR_T4_ICON,
    title: "MMRT4",
  },
  T5: {
    icon: MMR_T5_ICON,
    title: "MMRT5",
  },
  T6: {
    icon: MMR_T6_ICON,
    title: "MMRT6",
  },
  T7: {
    icon: MMR_T7_ICON,
    title: "MMRT7",
  },
  T8: {
    icon: MMR_T8_ICON,
    title: "MMRT8",
  },
  T9: {
    icon: MMR_T9_ICON,
    title: "MMRT9",
  },
  T10: {
    icon: MMR_T10_ICON,
    title: "MMRT10",
  },
};
function DropDown(props) {
  let { list, selected, style, onSelected, canDrop } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  // console.log("selected ==>", selected);
  function renderDropItem() {
    if (!canDrop) return null;
    return (
      <>
        <input
          className={css.input}
          readOnly
          onBlur={() => {
            setIsOpen(false);
          }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          // onFocus={(e) => {
          //   console.log("focus");
          //   e.stopPropagation();
          //   setIsOpen(true);
          // }}
        />
        <div className={classNames(css.dropDownBox, isOpen && css.open)}>
          <ul className={css.ul}>
            {list.map((item, index) => {
              return (
                <li
                  className={classNames(
                    css.li,
                    selected === item && css.active,
                    index + 1 === list.length && css.last
                  )}
                  key={item}
                  onClick={() => {
                    onSelected(item);
                  }}
                  style={style}
                >
                  <div className={css.item}>
                    <img
                      src={COINS_MAP[item].icon}
                      alt=""
                      className={css.icon}
                    />
                    {COINS_MAP[item].title}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }

  return (
    <div className={css.dropDown} style={style}>
      <div className={css.selected}>
        {/* {showSelected} */}
        <img src={COINS_MAP[selected].icon} alt="" className={css.icon} />
        {COINS_MAP[selected].title}
        {canDrop && (
          <div className={classNames(css.right, isOpen && css.up)}></div>
        )}
      </div>
      {renderDropItem()}
    </div>
  );
}

export default DropDown;
