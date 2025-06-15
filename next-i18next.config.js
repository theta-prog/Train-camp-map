const path = require('path')

module.exports = {
  i18n: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja',
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
}
