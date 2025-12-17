// Glossary configuration
// Define your areas and topics here

export interface Topic {
  slug: string;
  title: string;
  description: string;
  order: number;
}

export interface Area {
  slug: string;
  title: string;
  description: string;
  order: number;
  topics: Topic[];
}

export interface GlossaryConfig {
  areas: Area[];
}

export const glossaryConfig: GlossaryConfig = {
  areas: [
    {
      slug: "web-development",
      title: "Web Development",
      description: "Terms related to building websites and web applications.",
      order: 1,
      topics: [
        {
          slug: "frontend",
          title: "Frontend",
          description:
            "Client-side technologies, frameworks, and UI development.",
          order: 1,
        },
        {
          slug: "backend",
          title: "Backend",
          description: "Server-side technologies, APIs, and data processing.",
          order: 2,
        },
      ],
    },
    {
      slug: "devops",
      title: "DevOps",
      description: "Development operations, infrastructure, and deployment.",
      order: 2,
      topics: [
        {
          slug: "containers",
          title: "Containers",
          description: "Container technologies like Docker and orchestration.",
          order: 1,
        },
        {
          slug: "ci-cd",
          title: "CI/CD",
          description:
            "Continuous integration and continuous deployment pipelines.",
          order: 2,
        },
      ],
    },
  ],
};

// Helper functions for lookups and validation

export function getArea(areaSlug: string): Area | undefined {
  return glossaryConfig.areas.find((a) => a.slug === areaSlug);
}

export function getTopic(
  areaSlug: string,
  topicSlug: string,
): Topic | undefined {
  const area = getArea(areaSlug);
  return area?.topics.find((t) => t.slug === topicSlug);
}

export function isValidPlacement(areaSlug: string, topicSlug: string): boolean {
  return getTopic(areaSlug, topicSlug) !== undefined;
}

// Get all valid area slugs (for Zod enum validation)
export function getAreaSlugs(): string[] {
  return glossaryConfig.areas.map((a) => a.slug);
}

// Get all valid topic slugs across all areas
export function getTopicSlugs(): string[] {
  return glossaryConfig.areas.flatMap((a) => a.topics.map((t) => t.slug));
}

// Get sorted areas
export function getSortedAreas(): Area[] {
  return [...glossaryConfig.areas].sort((a, b) => a.order - b.order);
}

// Get sorted topics for an area
export function getSortedTopics(areaSlug: string): Topic[] {
  const area = getArea(areaSlug);
  if (!area) return [];
  return [...area.topics].sort((a, b) => a.order - b.order);
}
