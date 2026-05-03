// Curated fallback list. Used when ORCID is unreachable / unconfigured, and
// merged into ORCID results so editorial notes (e.g. "Best Paper") are preserved.
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
    authors: "Bhattacharjee, A., <b>Zeng, Y.</b>, Xu, S. Y., et al.",
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
  if (!name) return "";
  for (const target of HIGHLIGHT_NAMES) {
    if (name.toLowerCase().includes(target.toLowerCase())) {
      return `<b>${name}</b>`;
    }
  }
  return name;
}

function formatAuthors(names) {
  if (!names || names.length === 0) return "";
  const styled = names.map(highlightAuthor);
  if (styled.length <= 6) return styled.join(", ");
  return styled.slice(0, 5).join(", ") + ", et al.";
}

const ORCID_API = "https://pub.orcid.org/v3.0";

function pickLink(work) {
  if (work.url && work.url.value) return work.url.value;
  const exts = (work["external-ids"] && work["external-ids"]["external-id"]) || [];
  const findType = (t) =>
    exts.find(
      (e) =>
        (e["external-id-type"] || "").toLowerCase() === t &&
        (e["external-id-value"] || e["external-id-url"])
    );
  const doi = findType("doi");
  if (doi) {
    if (doi["external-id-url"] && doi["external-id-url"].value)
      return doi["external-id-url"].value;
    return `https://doi.org/${doi["external-id-value"]}`;
  }
  const arxiv = findType("arxiv");
  if (arxiv) {
    if (arxiv["external-id-url"] && arxiv["external-id-url"].value)
      return arxiv["external-id-url"].value;
    return `https://arxiv.org/abs/${arxiv["external-id-value"]}`;
  }
  const url = findType("uri") || findType("url");
  if (url && url["external-id-value"]) return url["external-id-value"];
  return "";
}

function normalizeOrcidWork(work) {
  if (!work) return null;
  const title = work.title && work.title.title && work.title.title.value;
  if (!title) return null;

  const yearStr =
    work["publication-date"] &&
    work["publication-date"].year &&
    work["publication-date"].year.value;
  const year = yearStr ? Number(yearStr) : undefined;

  const venue =
    (work["journal-title"] && work["journal-title"].value) ||
    "";

  const contribs =
    (work.contributors && work.contributors.contributor) || [];
  const authorNames = contribs
    .map((c) => c["credit-name"] && c["credit-name"].value)
    .filter(Boolean);

  return {
    title,
    year,
    venue,
    link: pickLink(work),
    authors: formatAuthors(authorNames),
  };
}

async function fetchOrcid(path) {
  const res = await fetch(`${ORCID_API}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`ORCID ${path} failed: ${res.status}`);
  return res.json();
}

function mergeFallbackNotes(items) {
  // Bring editorial notes (and authors when ORCID has none) from the fallback list.
  const byTitle = new Map(
    fallbackPublications.map((p) => [p.title.toLowerCase().trim(), p])
  );
  return items.map((p) => {
    const f = byTitle.get((p.title || "").toLowerCase().trim());
    if (!f) return p;
    return {
      ...p,
      authors: p.authors || f.authors || "",
      venue: p.venue || f.venue || "",
      link: p.link || f.link || "",
      note: f.note,
    };
  });
}

export async function fetchPublications() {
  const orcidId = process.env.ORCID_ID;
  if (!orcidId) return fallbackPublications;

  try {
    // Step 1: list works (summaries) and collect put-codes.
    const works = await fetchOrcid(`/${orcidId}/works`);
    const putCodes = [];
    for (const group of works.group || []) {
      const summary = (group["work-summary"] || [])[0];
      if (summary && summary["put-code"]) putCodes.push(summary["put-code"]);
    }
    if (putCodes.length === 0) return fallbackPublications;

    // Step 2: fetch full work details (in batches of 50, ORCID's limit).
    const all = [];
    for (let i = 0; i < putCodes.length; i += 50) {
      const batch = putCodes.slice(i, i + 50).join(",");
      try {
        const data = await fetchOrcid(`/${orcidId}/works/${batch}`);
        for (const item of data.bulk || []) {
          if (item.work) all.push(item.work);
        }
      } catch (err) {
        console.warn(`[publications] batch ${i} fetch failed:`, err.message);
      }
    }

    const normalized = all
      .map(normalizeOrcidWork)
      .filter((p) => p && p.title)
      .sort((a, b) => (b.year || 0) - (a.year || 0));

    if (normalized.length === 0) return fallbackPublications;
    return mergeFallbackNotes(normalized);
  } catch (err) {
    console.warn("[publications] ORCID fetch failed:", err.message);
    return fallbackPublications;
  }
}
