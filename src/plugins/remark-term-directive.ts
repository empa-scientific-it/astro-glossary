import type { Root, Text } from "mdast";
import type { TextDirective } from "mdast-util-directive";
import { visit } from "unist-util-visit";

/**
 * Remark plugin to transform :term[name]{label} directives into glossary links.
 *
 * Usage:
 * - :term[Docker] → links to /glossary/docker/ with text "Docker"
 * - :term[Docker]{label="container platform"} → links to /glossary/docker/ with text "container platform"
 */
export default function remarkTermDirective() {
  return (tree: Root) => {
    visit(tree, "textDirective", (node: TextDirective) => {
      if (node.name !== "term") return;

      // Extract term name from children (the [name] part)
      const termName = node.children
        .filter((child): child is Text => child.type === "text")
        .map((child) => child.value)
        .join("");

      // Generate slug from term name
      const slug = termName.toLowerCase().replace(/\s+/g, "-");

      // Get optional label from attributes, default to term name
      const label = node.attributes?.label || termName;

      // Transform directive into a link element
      node.data = {
        hName: "a",
        hProperties: {
          href: `/glossary/${slug}/`,
          class: "glossary-term",
        },
      };

      // Replace children with the label text
      node.children = [{ type: "text", value: label }];
    });
  };
}
