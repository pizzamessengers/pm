const translate = (message, props = {}) => {
  const vocabulary = {
    ru: {
      time: {
        second: "секунд",
        minute: "минут",
        today: "сегодня",
        yesterday: "вчера",
        ago: "назад"
      },
      all: {
        login: "Логин",
        pass: "Пароль",
        url: "URL",
        token: "токен",
        next: "Далее",
        delete: "Удалить",
        query: "Запрос",
        "token-copied": "Токен скопирован",
        info: {
          dialogs: "В это окне будут отображаться диалоги со всех мессенджеров",
          "dialog-list":
            "В этом окне будут отображаться диалоги данного мессенджера"
        },
        error: {
          hack: "FU",
          user: "Пользователь " + props.user + " не существует",
          smth:
            "Что-то пошло не так :( Попробуйте снова или напишите в поддержку"
        }
      },
      connection: {
        all: {
          connection: "Подключение",
          connect: "Подключить",
          "get-token": "Получить токен",
          watching: {
            choosing: "Выберите режим работы для данного мессенджера",
            all: "all Этот режим то-то то-то.. (написать в словаре)",
            dialogs: "dialogs Этот режим то-то то-то.. (написать в словаре)"
          }
        },
        error: {
          watching: "Необходимо выбрать режим работы сервиса"
        },
        vk: {
          "1":
            "ВКонтакте подключается с помощью специального токена. (Вы перейдете на страницу вконтакте)",
          "2": {
            "1":
              "На этой странице вам нужно дать согласие нашему приложению обрабатывать ваши сообщения и вложения",
            "2":
              "Вам нужно скопировать информацию из адресной строки (URL) и вставить в соответствующее поле. Не переживайте насчет предупреждения. Нам вы можете доверять)"
          }
        },
        inst: {
          "1":
            "Вам нужно авторизоваться в аккаунте инстаграм. В качестве логина используйте имя пользователя инстаграм, а не номер телефона"
        },
        wapp: {
          "1":
            "Вотсап подключается с помощью специального токена. (Вы перейдете на страницу вотсапп)",
          "2": {
            "1": "Зарегистрируйте аккаунт WhatsApp Api на этой странице",
            "2": "Следуйте инструкции по настройке WhatsApp Web",
            "3":
              "Так же нужно скопировать эти данные (Api URL, токен) в соответствующие поля"
          }
        }
      },
      settings: {
        updating: "Обновления мессенджера",
        mode: "Режим работы",
        lang: "Язык",
        user: "Имя пользователя",
        "no-messengers": "У вас пока нет ни одного подключенного мессенджера"
      },
      modules: {
        vk: "ВКонтакте",
        inst: "Инстаграм",
        wapp: "Вотсап",
        user: "Профиль",
        payment: "Оплата"
      },
      messenger: {
        watching: {
          all: "all",
          dialogs: "dialogs"
        },
        error: {
          url: "Проверьте ссылку",
          login: "Неверный логин",
          password: "Неверный пароль",
          "login-password": "Неверный логин или пароль",
          "token-url": "Неверный токен или ссылка",
          qr: "Просканируйте QR код",
          "incorrect-vk-url": "Скопируйте и вставьте всю ссылку"
        }
      },
      dialog: {
        connect: "Подключить диалог",
        "choose-dialogs": "Выберите диалоги",
        "choose-dialog": "Выберите нужный диалог",
        error: {
          added: "Диалог уже добавлен",
          users: "Диалога с этими пользователями не существует :(",
          query: "Диалога с таким названием не существует :("
        }
      },
      message: {
        text: "Текст сообщения"
      },
      attachments: {
        file: "Файл",
        "deleted-video": "Удаленное видео",
        error: {
          "invalid-type": "Недопустимый тип файла"
        }
      }
    },
    en: {
      time: {
        second: "second",
        minute: "minute",
        today: "today",
        yesterday: "yesterday",
        ago: "ago"
      },
      all: {
        login: "Login",
        pass: "Password",
        url: "URL",
        token: "token",
        next: "Next",
        delete: "Delete",
        query: "Query",
        "token-copied": "Token copied",
        info: {
          dialogs:
            "Dialogs from all instant messengers will be displayed in this window",
          "dialog-list":
            "The dialogs of this messenger will be displayed in this window"
        },
        error: {
          hack: "FU",
          user: "User " + props.user + " is not found",
          smth: "Something went wrong :( Try again or write in support"
        }
      },
      connection: {
        all: {
          connection: "Connection",
          connect: "Connect",
          "get-token": "Get token",
          watching: {
            choosing: "Select the service mode for this messenger",
            all: "all Этот режим то-то то-то.. (написать в словаре)",
            dialogs: "dialogs Этот режим то-то то-то.. (написать в словаре)"
          }
        },
        error: {
          watching: "You must select the service mode"
        },
        vk: {
          "1":
            "VKontakte connects using a special token. (You will be taken to the VKontakte page)",
          "2": {
            "1":
              "On this page you need to give consent to our application process your messages and attachments",
            "2":
              "You need to copy the information from the address bar (URL) and insert in the appropriate field. Do not worry about warnings. You can trust us)"
          }
        },
        inst: {
          "1":
            "You need to log in to your instagram account. As login use instagram username, not phone number"
        },
        wapp: {
          "1":
            "WhatsApp connects using a special token. (You will be taken to the WhatsApp page)",
          "2": {
            "1": "Register WhatsApp Api account on this page",
            "2": "Follow the instructions for setting up WhatsApp Web",
            "3":
              "You also need to copy this data (Api URL, token) into the appropriate fields"
          }
        }
      },
      settings: {
        updating: "Messenger updating",
        mode: "Service mode",
        lang: "Language",
        user: "User name",
        "no-messengers": "You have no connected messenger yet"
      },
      modules: {
        vk: "VKontakte",
        inst: "Instagram",
        wapp: "WhatsApp",
        user: "User",
        payment: "Payment"
      },
      messenger: {
        watching: {
          all: "all",
          dialogs: "dialogs"
        },
        error: {
          url: "Invalid url",
          login: "Invalid login",
          password: "Invalid password",
          "login-password": "Invalid login or password",
          "token-url": "Invalid token or url",
          qr: "Scan the QR code",
          "incorrect-vk-url": "Copy and paste the entire link"
        }
      },
      dialog: {
        connect: "Connect dialog",
        "choose-dialogs": "Choose dialogs",
        "choose-dialog": "Select the desired dialog",
        error: {
          added: "Dialog has already been added",
          users: "Dialog with these users not found :(",
          query: "There is no dialog with a similar name :("
        }
      },
      message: {
        text: "Message text"
      },
      attachments: {
        file: "File",
        "deleted-video": "Deleted video",
        error: {
          "invalid-type": "Invalid file type"
        }
      }
    }
  };

  let sections = message.split("."),
    currentSection = vocabulary[lang];
  sections.forEach(section => {
    currentSection = currentSection[section];
  });
  return currentSection;
};

export default translate;
