import React, { Component, Fragment } from "react";
import USFlag from "./flags/USFlag";
import RUFlag from "./flags/RUFlag";

export default class LangChoosing extends Component {
  constructor(props) {
    super(props);
    this.languagesId = {
      en: 0,
      ru: 1
    };
    this.languages = [
      {
        lang: "en",
        item: (
          <Fragment>
            <div className="flag">
              <USFlag />
            </div>
            <div className="lang-name">EN</div>
          </Fragment>
        )
      },
      {
        lang: "ru",
        item: (
          <Fragment>
            <div className="flag">
              <RUFlag />
            </div>
            <div className="lang-name">RU</div>
          </Fragment>
        )
      }
    ];
    this.state = {
      lang: lang
    };
  }

  handleClick = e => {
    let el =
      $(e.target)[0].nodeName === "A" ? $(e.target) : $(e.target).parents("a");
    lang = el.attr("lang");
    this.setState({ lang });
    this.props.refresh();

    let data = {
      lang: lang
    };
    axios.post("api/v1/users/language?api_token=" + apiToken, data);
  };

  render() {
    let { lang } = this.state;
    return (
      <div className="lang-panel-wrapper">
        <div className="dropdown">
          <button
            className="dropdown-toggle d-flex align-items-center"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.languages[this.languagesId[lang]].item}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {this.languages.map(language => (
              <a
                key={language.lang}
                className="dropdown-item d-flex align-items-center"
                lang={language.lang}
                onClick={e => this.handleClick(e)}
              >
                {language.item}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
