import React from "react";
import MenuLink from "./MenuLink";

const MessengersMenu = ({ opened }) => {
  let messengers = [
    {
      icon: ["fab", "vk"],
      link: "socials/vk",
      tooltip: {
        direction: "right",
        title: "VKontakte"
      }
    },
    {
      icon: ["fab", "whatsapp"],
      link: "socials/wapp",
      tooltip: {
        direction: "right",
        title: "Instagram"
      }
    },
    {
      icon: ["fab", "instagram"],
      link: "socials/inst",
      tooltip: {
        direction: "right",
        title: "WhatsApp"
      }
    },
    {
      icon: ["fab", "telegram-plane"],
      link: "socials/tlgrm",
      tooltip: {
        direction: "right",
        title: "Telegram"
      }
    }
  ];

  return messengers.map((messenger, i) => (
    <MenuLink
      key={i}
      icon={messenger.icon}
      link={messenger.link}
      tooltip={messenger.tooltip}
    />
  ));
};

export default MessengersMenu;
