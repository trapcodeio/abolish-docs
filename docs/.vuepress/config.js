module.exports = {
    // bundler: '@vuepress/bundler-vite',
    lang: "en-US",
    title: "Abolish",
    description: "A Javascript object validator for custom validations",

    markdown: {
        code: { lineNumbers: false }
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
            "link",
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@480&family=PT+Sans&family=Roboto+Condensed&display=swap"
            }
        ]
    ],

    themeConfig: {
        // logo: 'https://vuejs.org/images/logo.png',
        navbar: [
            {
                text: "Validation",
                children: [
                    {
                        text: "Methods",
                        link: "/validation/methods.md"
                    },
                    {
                        text: "Rules",
                        link: "/validation/rules.md"
                    }
                ]
            },

            {
                text: "Validators",
                children: [
                    {
                        text: "Create Validator",
                        link: "/validators/create.md"
                    },
                    {
                        text: "Default Validators",
                        link: "/validators/default.md"
                    },
                    {
                        text: "Additional Validators",
                        link: "/validators/additional.md"
                    }
                ]
            },

            {
                text: "PLAYGROUND",
                link: "https://abolish-playground.trapcode.io"
            }
        ]
    }
};
