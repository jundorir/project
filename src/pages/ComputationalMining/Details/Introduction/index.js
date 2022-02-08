import { inject, observer } from "mobx-react";
import css from "./index.module.less";
import Step from "./Step";

const languageContext = {
  English: {
    0: "Subscription Power",
    1: "Power Subscription",
    2: "Purchase Power",
    3: "Click ‘purchase’ to obtain the corresponding calculation force after payment",
    4: "Pledge Power",
    5: "Computational Mining",
    6: "Click ‘pledge’ ",
    7: "Enter the pledge calculation force quantity and confirm",
    8: "Receive income",
    9: "Click ‘receive’ to receive the income",
  },
  TraditionalChinese: {
    0: "認購算力",
    1: "算力認購",
    2: "購買算力",
    3: "點擊‘購買’付款完成後獲得相應算力",
    4: "質押算力",
    5: "算力挖礦",
    6: "點擊‘質押’",
    7: "輸入質押算力數量，並確定",
    8: "領取收益",
    9: "點擊‘收獲’，領取收益",
  },
  SimplifiedChinese: {
    0: "认购算力",
    1: "算力认购",
    2: "购买算力",
    3: "点击‘购买’付款完成后获得相应算力",
    4: "质押算力",
    5: "算力挖矿",
    6: "点击‘质押’",
    7: "输入质押算力数量，并确定",
    8: "领取收益",
    9: "点击‘收获’，领取收益",
  },
};
function Introducation(props) {
  const {
    lang: { selectedLang },
  } = props;
  const language = languageContext[selectedLang.key];

  const list = [
    {
      id: 1,
      title: language[0],
      jumpTitle: language[1],
      jumpPath: "/forceMining",
      tips: [
        {
          text: "",
          index: 0,
        },
      ],
    },
    {
      id: 2,
      title: language[2],
      jumpTitle: language[1],
      jumpPath: "/forceMining",
      tips: [
        {
          text: language[3],
          index: 0,
        },
      ],
    },
    {
      id: 3,
      title: language[4],
      jumpTitle: language[5],
      jumpPath: "/computationalMining",
      tips: [
        {
          text: language[6],
          index: 0,
        },
        {
          text: language[7],
          index: 1,
        },
      ],
    },
    {
      id: 4,
      title: language[8],
      jumpTitle: language[5],
      jumpPath: "/computationalMining",
      tips: [
        {
          text: language[9],
          index: 0,
        },
      ],
    },
  ];

  return (
    <div className={css.introducation}>
      <div className={css.introducationBox}>
        <div className={css.head}>算力挖矿攻略</div>
        <div className={css.list}>
          {list.map((item) => {
            return <Step {...item} key={item.id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default inject("lang")(observer(Introducation));
