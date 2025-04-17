// src/locales/index.ts
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  zh: {
    message: {
      hello: '你好，世界'
    }
  }
}

const i18n = createI18n({
  locale: 'en',
  messages
})

export default i18n
