module.exports = {
    // bundler: '@vuepress/bundler-vite',
    lang: "en-US",
    title: "Abolish",
    // heroText: " ",

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
        logo: "/abolish-black.svg",
        logoDark: "abolish-white.svg",
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
            },

            {
                text: "Built With Abolish",
                children: [
                    {
                        text: "abolish-vue",
                        link: "https://npmjs.com/package/abolish-vue"
                    }
                ]
            }
        ]
    },
    plugins: [
        [
            "@vuepress/search",
            {
                searchMaxSuggestions: 10
            }
        ]
    ]
};
