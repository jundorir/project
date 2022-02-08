import css from "./index.module.less";
import EditWrap from "../EditWrap";
import React from "react";

function EditNumberBox(props) {
  const { ticket = "", id, canEdit = true, winNumber = 0 } = props;
  console.log("ticket =====>", ticket);
  // const tickets = ticket.split("");
  const [tickets, setTickets] = React.useState(ticket.split(""));
  const showId = "#" + id.toString().padStart(3, "0");
  const [cache, setCache] = React.useState(null);
  function changeTicketNumber(value, index) {
    // if (tickets.includes(value)) return;
    let tempTickets = [...tickets];
    if (tempTickets[index] !== "") {
      let cache = tempTickets[index];
      setCache(cache);
    }
    tempTickets[index] = value;
    setTickets(tempTickets);
  }

  function checkTicket(flag, index) {
    let tempTickets = [...tickets];
    if (flag) {
      tempTickets[index] = cache;
      setTickets(tempTickets);
    }
    props.onChange(tempTickets.join(""));
  }

  return (
    <div className={css.randomBox}>
      <div className={css.randomId}>{showId}</div>
      <div className={css.randomItem}>
        {tickets.map((item, index) => {
          if (index === 0) return null;
          return (
            <EditWrap
              value={item}
              key={index}
              isWinNumber={winNumber >= index}
              canEdit={canEdit}
              onChange={(value) => {
                changeTicketNumber(value, index);
              }}
              checkTicket={(flag) => {
                checkTicket(flag, index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
export default EditNumberBox;
