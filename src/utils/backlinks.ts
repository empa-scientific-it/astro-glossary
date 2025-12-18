import { getCollection } from 'astro:content';

export interface BacklinkEntry {
  title: string;
  path: string;
}

export type BacklinksMap = Map<string, BacklinkEntry[]>;

const TERM_PATTERN = /:term\[([^\]]+)\]/g;

/**
 * Scans all docs entries for :term[...] directives and builds a map
 * of term slug -> array of documents that reference it.
 */
export async function buildBacklinks(): Promise<BacklinksMap> {
  const docEntries = await getCollection('docs');
  const backlinks: BacklinksMap = new Map();

  for (const doc of docEntries) {
    // Get the raw body content (before Markdown processing)
    const body = doc.body || '';

    // Track seen terms to avoid duplicates within the same doc
    const seenInDoc = new Set<string>();

    // Find all :term[...] matches
    let match;
    while ((match = TERM_PATTERN.exec(body)) !== null) {
      const termName = match[1];
      const termSlug = termName.toLowerCase().replace(/\s+/g, '-');

      // Skip if we've already recorded this term for this doc
      if (seenInDoc.has(termSlug)) continue;
      seenInDoc.add(termSlug);

      if (!backlinks.has(termSlug)) {
        backlinks.set(termSlug, []);
      }

      // Build the document path from the entry ID
      // Starlight docs have IDs like "guides/example" or "reference/example"
      const docPath = `/${doc.id}/`;
      const docTitle = doc.data.title || doc.id;

      backlinks.get(termSlug)!.push({
        title: docTitle,
        path: docPath,
      });
    }

    // Reset regex lastIndex for next iteration
    TERM_PATTERN.lastIndex = 0;
  }

  return backlinks;
}
