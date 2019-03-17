import React from "react";
import MessengersMenu from './MessengersMenu';
import SettingsMenu from './SettingsMenu';

const SubMenu = ({ item, opened }) => {
  return (
    <div className={!opened ? "menu-line" : "menu-line open"}>
      {item === 'messengers' ? <MessengersMenu /> : <SettingsMenu />}
    </div>
  );
};

export default SubMenu;
