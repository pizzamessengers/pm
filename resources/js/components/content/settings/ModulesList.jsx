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

  return (
    <div className="modules-list">
      {modules.map((module, i) => (
        <Link
          className={i > 0 ? "ml-1" : null}
          key={i}
          to={
            module === "user" ||
            module === "payment" ||
            setting === "messenger"
              ? "/app/settings/" + setting + "/" + module
              : "/app/settings/" + setting + "/crm/" + module
          }
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
            {translate("modules." + module)}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ModulesList;
