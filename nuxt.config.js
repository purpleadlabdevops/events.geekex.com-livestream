export default {
  ssr: false,
  head: {
    title: 'GeekEx | Checkout',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, user-scalable=0, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0 user-scalable=0' },
      { hid: 'description', name: 'description', content: 'GeekEx Checkout' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" }
    ]
  },
  css: ['@/assets/scss/styles.scss'],
  modules: [ '@nuxtjs/axios' ],
  components: true,
  router: { base: '/livestream/', mode: 'history' },
  generate: { dir: './dist' },
  build: { target: 'static' },
  env: {
    API: process.env.API,
    crypto_algorithm: process.env.crypto_algorithm,
    crypto_secretKey: process.env.crypto_secretKey,
  },
}
