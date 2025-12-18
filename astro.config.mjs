// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkTermDirective from "./src/plugins/remark-term-directive";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkTermDirective],
  },
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Glossary",
          link: "/glossary/",
        },
        {
          label: "Guides",
          items: [{ label: "Example Guide", slug: "guides/example" }],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/styles/glossary.css"],
    }),
  ],
});
