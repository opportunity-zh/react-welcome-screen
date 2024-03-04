import React, { useState, useEffect } from "react";
import "./App.css";
import stadt_seb_logo from "./assets/STZH_SEB_Logo.png";
import opportunity_logo from "./assets/Opportunity.png";
import sag_logo from "./assets/SAG_Logo_De.png";

const App = () => {
  const [title, setTitle] = useState("Welcome to Opportunity");
  const sheet_id = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const api_token = import.meta.env.VITE_GOOGLE_API_KEY;
  const [entries, setEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [timeInterval, setTimeInterval] = useState("");

  const gsheet_url = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values:batchGet?ranges=A2%3AE100&valueRenderOption=FORMATTED_VALUE&key=${api_token}`;

  const getData = async () => {
    const response = await fetch(gsheet_url);
    const data = await response.json();
    setEntries(data.valueRanges[0].values);
  };

  const updateCurrentDate = () => {
    let today = new Date();
    const currentDate = `${today.getDate()}.${
      today.getMonth() + 1
    }.${today.getFullYear()}`;
    setCurrentDate(currentDate);
  };

  const refreshData = () => {
    updateCurrentDate();
    getData();
    setTimeInterval(
      setInterval(() => {
        updateCurrentDate();
        getData();
      }, 1000 * 60 * 30)
    ); // wait 30mins for next update (1000 * 60 * 30)
  };

  useEffect(() => {
    refreshData(); // get first initial data and then wait for the next update
    return () => {
      clearInterval(timeInterval); // clear the interval when the component is destroyed
    };
  }, []);

  return (
    <>
      <h1 className="site-title">{title}</h1>
      <span className="site-description">{currentDate}</span>
      <ul className="entry-list">
        {entries &&
          entries.map((entry, index) => (
            <li
              key={index}
              className={
                entry[4]?.toLowerCase() === "highlight"
                  ? "entry-item-highlight"
                  : "entry-item"
              }
            >
              <span className="entry-daytime">
                {entry[0]} Uhr, {entry[1].replaceAll("/", ".")}
              </span>
              <br />
              <h3 className="entry-title">{entry[2]}</h3>
              <span className="entry-description">{entry[3]}</span>
              <br />
            </li>
          ))}
      </ul>
      {!entries && <h1>Keine Events zur Zeit vorhanden!</h1>}
      <footer className="footer">
        <img src={stadt_seb_logo} alt="Stadt Zürich Soziale Betriebe Logo" />
        <img src={opportunity_logo} alt="Opportunity Zürich Logo" />
        <img src={sag_logo} alt="Stiftung Arbeitsgestaltung Logo" />
      </footer>
    </>
  );
};

export default App;
