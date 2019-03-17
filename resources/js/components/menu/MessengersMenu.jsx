import React from "react";
import MenuLink from "./MenuLink";

const MessengersMenu = ({ item, opened }) => {
  let messengers = [
    {
      icon: ["fab", "vk"],
      link: "socials/vk"
    },
    {
      icon: ["fab", "whatsapp"],
      link: "socials/wapp"
    },
    {
      icon: ["fab", "instagram"],
      link: "socials/inst"
    }
  ];

  return messengers.map((messenger, i) => (
    <MenuLink key={i} icon={messenger.icon} link={messenger.link} />
  ));
};

export default MessengersMenu;
