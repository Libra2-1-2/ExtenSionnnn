import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressIndicator = ({ value, total }: any) => {
  const percentage = (value / total) * 100;

  return (
    <CircularProgressbar
      value={percentage}
      text={`${value}/${total}`}
      styles={buildStyles({
        textSize: "16px",
        pathColor: percentage === 100 ? "green" : "red",
        textColor: "#3d4a69",
      })}
    />
  );
};

export default ProgressIndicator;
