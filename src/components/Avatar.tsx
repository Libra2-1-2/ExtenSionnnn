import React from "react";
import { ChatType } from "./Advise";
import "../css/Avatar.css";

interface AvatarProps {
  type: ChatType;
}

const Avatar: React.FC<AvatarProps> = ({ type }) => {
  const url =
    type === "question" ? "/img/default-avatar.png" : "/img/icon_128.png";
  const title = type === "question" ? "You" : "VirusGuard";

  return (
    <div className="avatar">
      <img src={url} alt={title} />
      <p>{title}</p>
    </div>
  );
};
export default Avatar;
