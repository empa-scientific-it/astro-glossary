import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { isValidPlacement } from "./config/glossary";

// Placement schema - validates area-topic pairs
const placementSchema = z
  .object({
    area: z.string(),
    topic: z.string(),
  })
  .refine((data) => isValidPlacement(data.area, data.topic), {
    message:
      "Topic must belong to the specified area. Check your glossary config.",
  });

// Glossary term schema
const glossarySchema = z.object({
  title: z.string(),
  description: z.string(),
  placements: z
    .array(placementSchema)
    .min(1, "At least one placement is required"),
  aliases: z.array(z.string()).optional(),
  relatedTerms: z.array(z.string()).optional(),
  externalLinks: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
});

// Content collections
export const collections = {
  // Starlight docs collection (default)
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),

  // Glossary collection with flat file structure
  glossary: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/glossary" }),
    schema: glossarySchema,
  }),
};

// Export the schema type for use in pages
export type GlossaryEntry = z.infer<typeof glossarySchema>;
