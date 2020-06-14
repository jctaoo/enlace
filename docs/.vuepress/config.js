module.exports = {
  title: "Enlace",
  description: "面向接口的通信框架",
  configureWebpack: {
    resolve: {
      alias: {
        "@alias": "path/to/some/dir",
      },
    },
  },
  head: [
    [
      "link",
      { rel: "shortcut icon", type: "image/x-icon", href: `./favicon.ico` },
    ],
  ],
  themeConfig: {
    logo: "/logo.png",
    lastUpdated: true,
    smoothScroll: true,
    nav: [
      { text: "首页", link: "/" },
      { text: "引导", link: "/guide/" },
      { text: "示例", link: "/demos/" },
      {
        text: "了解更多",
        ariaLabel: "Language Menu",
        items: [
          { text: "API", link: "/api" },
          { text: "F&Q", link: "/F&Q" },
          { text: "设计理念", link: "/design-concepts" },
          { text: "Changelog", link: "/changelog" },
        ],
      },
      {
        text: "GitHub",
        link: "https://github.com/2pown/enlace",
        target: "_blank",
      },
    ],
  },
};
