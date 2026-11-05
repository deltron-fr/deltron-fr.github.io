export type Shortlink = {
  slug: string | readonly string[];
  href: string;
};

export const shortlinks = [
  {
    slug: ["gh", "github"],
    href: "https://github.com/deltron-fr",
  },
  {
    slug: ["email", "mail"],
    href: "mailto:kelechiogbonnaya2020@gmail.com",
  },
  {
    slug: "discord",
    href: "https://discord.com/app",
  },
  {
    slug: "systems-cv",
    href: "/cv/KelechiOgbonnaya_CV_Systems.pdf",
  },
  {
    slug: "backend-cv",
    href: "/cv/KelechiOgbonnaya_CV_SWE.pdf",
  },
] as const satisfies readonly Shortlink[];

const toSlugList = (slug: Shortlink["slug"]) =>
  Array.isArray(slug) ? slug : [slug];

export const shortlinkEntries = shortlinks.flatMap((shortlink) =>
  toSlugList(shortlink.slug).map((slug) => ({
    slug,
    href: shortlink.href,
  })),
);

export const shortlinkMap = new Map(
  shortlinkEntries.map((shortlink) => [shortlink.slug, shortlink.href]),
);
