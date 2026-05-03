// Fallback list, also used for any publications missing from Scholar/Semantic Scholar.
// Edit this file to add notes (like "Best Paper Honorable Mention"); these are merged
// into matching API entries by title.
export const fallbackPublications = [
  {
    authors:
      "Gamage, O., Ranathunga, S., Lee, A., Sun, X., Singh, A., <b>Zeng, Y.</b>, et al.",
    year: 2025,
    title:
      "A Multilingual Dataset (MultiMWP) and Benchmark for Math Word Problem Generation",
    link: "https://ieeexplore.ieee.org/abstract/document/10933586",
    venue: "IEEE Transactions on Audio, Speech, and Language Processing.",
  },
  {
    authors:
      "Bhattacharjee, A., <b>Zeng, Y.</b>, Xu, S. Y., et al.",
    year: 2024,
    title:
      "Understanding the Role of Large Language Models in Personalizing and Scaffolding Strategies to Combat Academic Procrastination.",
    link: "https://dl.acm.org/doi/10.1145/3613904.3642081",
    venue:
      "In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems.",
    note: "Best Paper Honorable Mention.",
  },
  {
    authors: "Rao, P., Xu, S., Bhattacharjee, A., <b>Zeng, Y.</b>, et al.",
    year: 2024,
    title:
      "Integrating Digital Calendars with Large Language Models for Stress Management Interventions.",
    link: "https://ceur-ws.org/Vol-3728/paper4.pdf",
    venue: "ALBECS-2024: Workshop on Algorithmic Behavior Change Support.",
  },
  {
    authors: "Bhattacharjee, A., Xu, S., Rao, P., <b>Zeng, Y.</b>, et al.",
    year: 2024,
    title:
      '"It Explains What I am Currently Going Through Perfectly to a Tee": Understanding User Perceptions on LLM-Enhanced Narrative Interventions',
    link: "https://arxiv.org/pdf/2409.16732",
    venue: "Preprint.",
  },
];

const HIGHLIGHT_NAMES = ["Yuchen Zeng", "Y. Zeng", "Rachel Zeng", "Zeng, Y."];

function highlightAuthor(name) {
  for (const target of HIGHLIGHT_NAMES) {
    if (name.toLowerCase().includes(target.toLowerCase())) {
      return `<b>${name}</b>`;
    }
  }
  return name;
}

function formatAuthors(authors) {
  if (!authors || authors.length === 0) return "";
  const names = authors.map((a) => highlightAuthor(a.name));
  if (names.length <= 6) return names.join(", ");
  return names.slice(0, 5).join(", ") + ", et al.";
}

function normalizeApiPaper(p) {
  return {
    title: p.title,
    year: p.year,
    venue: p.venue || (p.publicationVenue && p.publicationVenue.name) || "",
    authors: formatAuthors(p.authors || []),
    link:
      p.url ||
      (p.externalIds && p.externalIds.DOI
        ? `https://doi.org/${p.externalIds.DOI}`
        : null) ||
      (p.externalIds && p.externalIds.ArXiv
        ? `https://arxiv.org/abs/${p.externalIds.ArXiv}`
        : ""),
  };
}

function mergeNotes(items) {
  // Pull notes from fallback into matching API entries by case-insensitive title match.
  const notesByTitle = new Map(
    fallbackPublications
      .filter((p) => p.note)
      .map((p) => [p.title.toLowerCase().trim(), p.note])
  );
  return items.map((p) => {
    const note = notesByTitle.get((p.title || "").toLowerCase().trim());
    return note ? { ...p, note } : p;
  });
}

export async function fetchPublications() {
  const authorId = process.env.SEMANTIC_SCHOLAR_AUTHOR_ID;
  const fields = "title,year,venue,authors,externalIds,url,publicationVenue";

  try {
    let papers = [];

    if (authorId) {
      const res = await fetch(
        `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=${fields}&limit=100`,
        { next: { revalidate: 86400 } }
      );
      if (res.ok) {
        const json = await res.json();
        papers = (json.data || []).map(normalizeApiPaper);
      }
    }

    if (papers.length === 0) return fallbackPublications;

    const sorted = papers
      .filter((p) => p.title)
      .sort((a, b) => (b.year || 0) - (a.year || 0));

    return mergeNotes(sorted);
  } catch (err) {
    console.warn("[publications] Semantic Scholar fetch failed:", err);
    return fallbackPublications;
  }
}
