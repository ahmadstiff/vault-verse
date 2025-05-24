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
    github: "https://github.com/ahmadstiff/vault-verse",
    twitter: "https://twitter.com/",
    docs: "/docs",
    discord: "https://discord.gg/",
    sponsor: "https://github.com/",
  },
};
