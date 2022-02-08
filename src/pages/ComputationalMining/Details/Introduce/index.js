import { inject, observer } from "mobx-react";
import React from "react";
import css from "./index.module.less";
function Introduce(props) {
  const {
    lang: { selectedLang },
  } = props;
  const [language, setLanguage] = React.useState([]);
  React.useEffect(() => {
    if (selectedLang.key === "English") {
      setLanguage({
        productIMG: "Product pictures",
        total: "current-period quantity",
        prcie: "unit price",
        title: "FIL power",
        period: "period",
        content1: "Legal notices",
        content2:
          "Mill Shared services in the following countries or regions are forbidden to: the United States, mainland China and Hong Kong, the Balkans, belarus, Burma, the ivory coast (ivory coast), Crimea, Ukraine, Cuba, democratic republic of Congo, Iran, Iraq, Liberia, north Korea, Sudan, Syria, venezuela and Zimbabwe. Please confirm that the mining machine sharing service is legal in your country or region. Otherwise, you will bear all legal consequences.",
        content3: `Can't refund`,
        content4:
          "As per the agreement, once your purchase is complete, there will be no replacement or refund.",
        content5: "Pricing rules",
        content6: `Pricing of MMR mining machine sharing package will be adjusted according to digital currency price and other factors. The actual purchase price is subject to the user's payment. MMR will not compensate for the price difference of this order even if the price changes later.`,
        content7: "Calculation force fluctuation description",
        content8:
          "The packages provided by MMR correspond to real computing power, which may fluctuate due to unstable factors such as network and mining machine power, and MMR does not promise 100% stable operation.",
        content9: "Uncontrolled risk statement",
        content10:
          "MMR shall not be liable for losses caused by the following uncontrollable risks: Not unforeseeable, unavoidable and insurmountable objective events, including natural disasters such as floods, volcanoes, earthquakes, landslides, fires, assessment by the Chinese government department for the worst level above the storm and bad weather, the government behavior and government instructions, city level of accident of power supply, as well as social abnormal events such as war, strike, riot, etc.",
      });
    } else if (selectedLang.key === "TraditionalChinese") {
      setLanguage({
        productIMG: "產品圖片",
        total: "發行總量",
        prcie: "單價",
        title: "FIL算力",
        period: "期",
        content1: "法律聲明",
        content2:
          "礦機共享服務在以下國家或地區被禁止：美國、中國大陸及香港地區、巴爾幹半島、白俄羅斯、緬甸、科特迪瓦(象牙海岸)，克裏米亞-烏克蘭、古巴、剛果民主共和國、伊朗、伊拉克、利比裏亞、朝鮮、蘇丹、敘利亞、委內瑞拉、津巴布韋。請確認礦機共享服務在您的國家或地區是合法的。否則，您將承擔一切法律後果。",
        content3: "無法退款",
        content4: "按照協議規定，一旦您購買完成，將不支持更換或退款。",
        content5: "定價規則",
        content6:
          "MMR礦機共享套餐的定價會根據數字貨幣價格等多因素調整。實際購買價格以用戶付款時為準，後續即使價格發生變化，MMR也不會對這個訂單進行差價補償。",
        content7: "算力波動說明",
        content8:
          "MMR提供的套餐對應的為真實算力，真實算力由於網絡、礦機功率等不穩定因素會導致波動，MMR不承諾100%穩定運行。",
        content9: "不可控風險聲明",
        content10:
          "MMR不對以下不可控風險所造成的損失負責：不能預見、不能避免或不能克服的客觀事件，包括自然災害如洪水、火山爆發、地震、山崩、火災、被中國政府部門評定為百年不遇級別以上的風暴和惡劣氣候等，政府行為和政府指令，城市級別的電網供電事故，以及社會異常事件如戰爭、罷工、動亂等。",
      });
    } else if (selectedLang.key === "SimplifiedChinese") {
      setLanguage({
        productIMG: "产品图片",
        total: "发行总量",
        price: "单价",
        title: "FIL算力",
        period: "期",
        content1: "法律声明",
        content2:
          "矿机共享服务在以下国家或地区被禁止：美国、中国大陆及香港地区、巴尔干半岛、白俄罗斯、缅甸、科特迪瓦(象牙海岸)，克里米亚-乌克兰、古巴、刚果民主共和国、伊朗、伊拉克、利比里亚、朝鲜、苏丹、叙利亚、委内瑞拉、津巴布韦。请确认矿机共享服务在您的国家或地区是合法的。否则，您将承担一切法律后果。",
        content3: "无法退款",
        content4: "按照协议规定，一旦您购买完成，将不支持更换或退款。",
        content5: "定价规则",
        content6:
          "MMR矿机共享套餐的定价会根据数字货币价格等多因素调整。实际购买价格以用户付款时为准，后续即使价格发生变化，MMR也不会对这个订单进行差价补偿。",
        content7: "算力波动说明",
        content8:
          "MMR提供的套餐对应的为真实算力，真实算力由于网络、矿机功率等不稳定因素会导致波动，MMR不承诺100%稳定运行。",
        content9: "不可控风险声明",
        content10:
          "MMR不对以下不可控风险所造成的损失负责：不能预见、不能避免或不能克服的客观事件，包括自然灾害如洪水、火山爆发、地震、山崩、火灾、被中国政府部门评定为百年不遇级别以上的风暴和恶劣气候等，政府行为和政府指令，城市级别的电网供电事故，以及社会异常事件如战争、罢工、动乱等。",
      });
    }
  }, [selectedLang.key]);

  return (
    <div className={css.introduce}>
      <div className={css.content}>
        <h6>{language.content1}</h6>
        <p>{language.content2}</p>
        <h6>{language.content3}</h6>
        <p>{language.content4}</p>
        <h6>{language.content5}</h6>
        <p>{language.content6}</p>
        <h6>{language.content7}</h6>
        <p>{language.content8}</p>
        <h6>{language.content9}</h6>
        <p>{language.content10}</p>
      </div>
    </div>
  );
}

export default inject("lang")(observer(Introduce));
