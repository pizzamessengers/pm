import React from "react";
import MenuLink from "./MenuLink";

const SettingsMenu = ({ item, opened }) => {
  let settings = [
    {
      icon: ["fas", "tools"],
      link: "settings/messenger"
    },
    {
      icon: ["fas", "user"],
      link: "settings/profile/user"
    },
    {
      icon: ["fas", "question"],
      link: "settings/support"
    }
  ];

  return settings.map((setting, i) => (
    <MenuLink key={i} icon={setting.icon} link={setting.link} />
  ));
};

export default SettingsMenu;
