import React from "react";
import "../App.css";

interface Props {
  text: string,
  children: React.ReactNode
}

const Tooltip = ({ text, children }: Props) => {
  return (
    <div className="tooltip">
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
};

export default Tooltip;
