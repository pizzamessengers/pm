define([
  "jquery",
  "underscore",
  "https://ege-land.ru/widget/script.js?nocache=" + Math.random()
], function($, _) {
  var KeepInTouch = function() {
    var self = this,
      amojo_id = AMOCRM.constant("account").amojo_id,
      error_message,
      error = _.template(
        '<p class="widget_settings_block__error" style="margin-top: 20px;"><%- error_message %></p>'
      ),
      selectors = {
        switch_block: ".widget_settings_block__switch",
        error_block: ".widget_settings_block__error"
      }; // ключ для работы с онлайн чатами

    this.$body = null;

    this.callbacks = {
      render: _.noop,
      init: _.noop,
      bind_actions: _.noop,
      // инициализация окна настроек в параметры функции
      // приходит Jquery Object
      settings: function($settings_modal) {
        self.$body = $settings_modal;
        error_message = self.i18n("settings.error");

        return true;
      },

      // Функция которая начинает выполнение
      // при нажатии на кнопку "Сохранить" или
      // "Установить"(если это первый запуск виджета)
      onSave: function(form) {
        self.$body.find(selectors.error_block).remove();

        // Вернем Promise и после ответа
        // сохраним или покажем ошибку ввода данных
        self.crm_post(
          "http://dmitrilya.beget.tech/api/v1/users/crm?api_token=" +
            self.get_settings().token,
          {
            crm: "amo",
            crm_user_id: amojo_id,
            token: self.system().amohash
          },
          function(response) {
            if (response.success) self.resolveFunction();
            else self.errorMessage();
          },
          "json"
        );
        return true;
      },

      destroy: function() {
        self.crm_post(
          "http://dmitrilya.beget.tech/api/v1/users/crm/disconnect?api_token=" +
            self.get_settings().token,
          {},
          function(response) {
            if (!response.success) alert(response.message);
          },
          "json"
        );
      }
    };

    // Функция которая будет обрабатывать
    // положительный ответ авторизации
    KeepInTouch.prototype.resolveFunction = function() {
      return true;
    };

    // Функция обработки неверно введенных данных в форме
    // которая вызывается при ошибке ajax запроса
    KeepInTouch.prototype.errorMessage = function() {
      var $body = !_.isNull(self.$body) ? self.$body : $(),
        switch_block = $body.find(selectors.switch_block),
        error_block = $body.find(selectors.error_block);

      if (error_block.length === 0) {
        switch_block.before(
          error({
            error_message: error_message
          })
        );
      }

      return false;
    };

    return this;
  };
  return KeepInTouch;
});
