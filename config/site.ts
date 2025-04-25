export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Omnipresence",
  description: "my assignment website",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Quotes",
      href: "/myQuotes",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Quotes",
      href: "/myQuotes",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
  },
};
