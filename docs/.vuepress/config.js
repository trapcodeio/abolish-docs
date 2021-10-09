module.exports = {
  // bundler: '@vuepress/bundler-vite',
  lang: 'en-US',
  title: 'Abolish',
  description: 'A Javascript object validator for custom validations',
  
  markdown: {
    code: {lineNumbers: false},
  },
  
  head: [
    // [
    //   'link',
    //   {
    //     rel: 'canonical',
    //     href: 'https://abolish.trapcode.io'
    //   },
    // ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@480&family=PT+Sans&family=Roboto+Condensed&display=swap',
      },
    ],
  ],
  
  themeConfig: {
    // logo: 'https://vuejs.org/images/logo.png',
    navbar: [
      {
        text: 'Validation',
        children: [
          {
            text: 'Methods',
            link: '/validation/methods.md',
          },
        ],
      },
      
      {
        text: 'Validators',
        children: [
          {
            text: 'Default Validators',
            link: '/validators/default.md',
          },
        ],
      },
    ],
  },
};