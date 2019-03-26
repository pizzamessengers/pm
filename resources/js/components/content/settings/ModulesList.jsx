import React, { Component } from "react";
import { Link } from "react-router-dom";

const ModulesList = ({
  modules,
  setting,
  currentModule,
  changeCurrentModule
}) => {
  let onClickHandler = e => {
    if (!$(e.target).hasClass("active")) {
      changeCurrentModule($(e.target).attr("module"));
    }
  };

  let modulesNames = {
    vk: "ВКонтакте",
    inst: "Инстаграм",
    wapp: "Вотсапп",
    user: "Пользователь",
    payment: "Оплата"
  };

  return (
    <div className="modules-list">
      {modules.length === 0 ? (
        <div>нет ни одного подключенного мессенджера</div>
      ) : (
        modules.map((module, i) => (
          <Link
            className={i > 0 ? "ml-1" : null}
            key={i}
            to={"/app/settings/" + setting + "/" + module}
          >
            <div
              className={
                module === currentModule
                  ? "modules-list-item active " + module
                  : "modules-list-item " + module
              }
              onClick={e => onClickHandler(e)}
              module={module}
            >
              {modulesNames[module]}
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ModulesList;
