import css from "./index.module.less";
import { useHistory } from "react-router-dom";
function Step(props) {
  const { id, title, jumpTitle, jumpPath, tips } = props;
  console.log("tips", tips);
  const history = useHistory();
  return (
    <div className={css.step}>
      <div className={css.head}>
        <div className={css.stepNumber}>{id}</div>
        <div className={css.context}>
          {title}（
          <div
            className={css.jump}
            onClick={() => {
              if (jumpPath === "/computationalMining") {
                document.getElementById("content").scrollTop = 0;
              } else {
                history.push(jumpPath);
              }
            }}
          >
            {jumpTitle}
          </div>
          ）
        </div>
      </div>

      {tips.length &&
        tips.map((item) => {
          return (
            <div className={css.tips} key={item.index}>
              <div className={css[`introducation_${id}_${item.index}`]}></div>
              {item.text && <div className={css.text}>{item.text}</div>}
            </div>
          );
        })}
    </div>
  );
}

export default Step;
