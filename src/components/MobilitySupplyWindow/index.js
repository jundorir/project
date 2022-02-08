import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { computeWeiToSymbol, interception } from "@utils/common";
import { Toast } from "antd-mobile";

function MobilitySupplyWindow(props) {
  const { lang, mobility } = props;
  const { selectedLang } = lang;
  const { AFILSelected, WFILSelected } = mobility;
  const [language, setLanguage] = React.useState({});
  React.useEffect(() => {
    const globalLanguage = {
      English: {
        willGet: "You will get",
        cancel: "cancel",
        ensure: "ensure",
        instructions: `The output is the valuation, and if the price changes by more than 0.1%, your trade will be withdrawn`,
        supplied: "supplied",
        exchangeRate: "exchange rate",
        share: "Share of bonus pool",
        addSuccess: "add liquidity success",
        addFail: "add liquidity fail",
      },
      TraditionalChinese: {
        willGet: "您將獲得",
        cancel: "取消",
        ensure: "確定",
        instructions: `輸出為估值，如果價格變化超過0.1%，則您的交易將會被撤回。`,
        supplied: "提供的",
        exchangeRate: "匯率",
        share: "獎金池份額",
        addSuccess: "添加流動性成功",
        addFail: "添加流動性失敗",
      },
      SimplifiedChinese: {
        willGet: "您将获得",
        cancel: "取消",
        ensure: "确定",
        instructions: `输出为估值，如果价格变化超过0.1%，则您的交易将会被撤回。`,
        supplied: "提供的",
        exchangeRate: "汇率",
        share: "奖金池份额",
        addSuccess: "添加流动性成功",
        addFail: "添加流动性失败",
      },
    };
    setLanguage(globalLanguage[selectedLang.key]);
  }, [selectedLang.key]);
  const closeWindow = React.useCallback(() => {
    props.closeMobilitySupplyWindow();
  }, [props]);
  // 确定按钮
  async function handleAgree() {
    try {
      const result = await mobility.addLiquidity();
      if (result) {
        Toast.success(language.addSuccess);
      } else {
        Toast.fail(language.addFail);
      }
      props.closeMobilitySupplyWindow(result);
    } catch {
      Toast.fail(language.addFail);
    }
  }

  return (
    <div
      className={css.getbackWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.getbackBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 关闭按钮 */}
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        {/* 标题 */}
        <div className={css.title}>{language.willGet}</div>
        {/* 中间部分 */}
        <div className={css.center}>
          <div className={css.poolToken}>
            <div className={css.poolTokenL}>
              <div className={css.poolTokenLTop}>
                {computeWeiToSymbol(mobility.addLiiquidityLp.liquidity, 4)}
              </div>
              <div className={css.poolTokenLButtom}>
                {AFILSelected}/{WFILSelected} Pool Tokens
              </div>
            </div>
            <div className={css.poolTokenR}>
              <div className={css[`icon_${WFILSelected}`]}></div>
              <div className={css[`icon_${AFILSelected}`]}></div>
            </div>
          </div>
          {/* <div className={css.instructions}>{language.instructions}</div> */}
          <div className={css.supplied}>
            <div>
              {language.supplied} {AFILSelected}:
            </div>
            <div className={css.right}>
              {computeWeiToSymbol(
                mobility.addLiiquidityLp[`${AFILSelected}Cost`],
                4
              )}
              {AFILSelected}
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.supplied}>
            <div>
              {language.supplied} {WFILSelected}:
            </div>
            <div className={css.right}>
              {computeWeiToSymbol(
                mobility.addLiiquidityLp[`${WFILSelected}Cost`],
                4
              )}
              {WFILSelected}
            </div>
          </div>
          <div className={css.line}></div>
          <div className={css.supplied}>
            <div>{language.exchangeRate}:</div>
            <div className={css.right}>
              1{WFILSelected} ≈
              {interception(
                mobility.addLiiquidityLp[`${AFILSelected}Cost`] /
                  mobility.addLiiquidityLp[`${WFILSelected}Cost`],
                4
              )}
              {AFILSelected}
            </div>
          </div>
          <div className={css.share}>
            <div className={css.shareTitle}>{language.share}</div>
            <div className={css.shareNum}>{mobility.exceptPercent}%</div>
          </div>
        </div>
        {/* 按钮行 */}
        <div className={css.button}>
          <div className={css.cancleButton} onClick={closeWindow}>
            {language.cancel}
          </div>
          <div
            className={classNames(css.ensureButton, 0 && css.disabled)}
            onClick={() => {
              handleAgree();
            }}
          >
            {language.ensure}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "mobility")(observer(MobilitySupplyWindow));
