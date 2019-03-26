import React from "react";
import MenuLink from "./MenuLink";

const SettingsMenu = ({ opened }) => {
  let settings = [
    {
      icon: ["fas", "tools"],
      link: "settings/messenger",
      tooltip: {
        direction: "left",
        title: "Messengers Settings"
      }
    },
    {
      icon: ["fas", "user"],
      link: "settings/profile/user",
      tooltip: {
        direction: "left",
        title: "Profile Settings"
      }
    },
    {
      icon: ["fas", "question"],
      link: "settings/support",
      tooltip: {
        direction: "left",
        title: "Support"
      }
    }
  ];

  return settings.map((setting, i) => (
    <MenuLink
      key={i}
      icon={setting.icon}
      link={setting.link}
      tooltip={setting.tooltip}
    />
  ));
};

export default SettingsMenu;
