export const extractPapersFromContent = (content: string) => {
  const papers: any[] = [];

  // Match arXiv URLs (both http and https, with or without version)
  const arxivRegex = /https?:\/\/arxiv\.org\/abs\/([\d.]+)(?:v\d+)?/g;
  const matches = content.matchAll(arxivRegex);

  for (const match of matches) {
    const arxivId = match[1]; // Extract the arXiv ID
    const url = match[0]; // Full URL

    papers.push({
      title: `arXiv:${arxivId}`, // Placeholder title
      url: url,
      pdf_url: `https://arxiv.org/pdf/${arxivId}.pdf`, // ⭐ Convert to PDF URL
      abstract: "Click to view paper details",
    });
  }

  return papers;
};
