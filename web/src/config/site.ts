export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "VaultVerse",
  description:
    "A programmable vault for your Sui assets. Create, customize, and share your vaults with friends.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Vaults",
      href: "/vaults",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Vaults",
      href: "/vaults",
    },
  ],
  links: {
    github: "https://github.com/koalaterbang/hackathon/sui/degen",
    twitter: "https://twitter.com/degen_meme_finance",
    docs: "/docs",
    discord: "https://discord.gg/degenmemefinance",
    sponsor: "https://github.com/sponsors/koalaterbang",
  },
};
