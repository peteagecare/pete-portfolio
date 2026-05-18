export type Role = {
  title: string;
  start: string;
  end: string;
  description?: string;
};

export type Company = {
  id: string;
  name: string;
  cvIds?: string[];
  roles: Role[];
};

export type FlatRole = {
  companyId: string;
  companyName: string;
  title: string;
  start: string;
  end: string;
  startYear: number;
  endLabel: string;
  description?: string;
};

export const COMPANIES: Company[] = [
  {
    id: "age-care-bathrooms",
    name: "Age Care Bathrooms",
    roles: [
      {
        title: "Head of Marketing",
        start: "March 2024",
        end: "Present",
        description:
          "Lead a four-person in-house team across paid media, SEO, content and design, but spend most days hands-on filming & editing content. This includes short-form social cuts, before-and-afters, care home testimonials, brand films. I also helped film our TV adverts (Sky AdSmart and GB News, including a campaign with Brian Blessed). In terms of photography, I have experience shooting on location and in our in-house studio, which I set up from scratch - I chose the Sony kit, set up the studio & lighting, which defined the way we shoot. Alongside this, I design the brochures, flyers, email campaigns and build the websites. I also run paid media reporting across Google, Meta, Bing and Sky AdSmart, and own the HubSpot CRM setup.",
      },
      {
        title: "Freelance Marketing Creative",
        start: "February 2023",
        end: "March 2024",
        description:
          "Brought in to work alongside an outside marketing agency. Hands-on creative from the start: filming, editing, photography, design and copy. The role grew into a full-time job.",
      },
    ],
  },
  {
    id: "musical-businesses",
    name: "The Musical Me & Lime Tree Music Centre",
    cvIds: ["the-musical-me", "lime-tree-music-centre"],
    roles: [
      {
        title: "Co-Founder",
        start: "June 2020",
        end: "February 2023",
        description:
          "Co-founded and co-ran two music businesses. Across both, I built all the creatives. I shot the photography, ran the social channels, wrote and posted the content, designed the print resources for primary schools, and built and maintained the websites. At The Musical Me we launched World Music Day for primary schools across the UK, which meant shooting and editing video campaigns, running paid social, designing the schools' resource packs and managing the brand voice. At Lime Tree we built the local brand and social presence from scratch and I still teach guitar there every week alongside my day job.",
      },
    ],
  },
];

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

export function parseRoleDate(label: string): { year: number; sortable: number } {
  if (label.toLowerCase() === "present") {
    return { year: new Date().getFullYear(), sortable: Number.MAX_SAFE_INTEGER };
  }
  const parts = label.trim().split(/\s+/);
  if (parts.length === 2) {
    const month = MONTHS[parts[0].toLowerCase()] ?? 0;
    const year = Number(parts[1]);
    return { year, sortable: year * 12 + month };
  }
  const year = Number(parts[0]);
  return { year, sortable: year * 12 };
}

export function shortYearRange(start: string, end: string): string {
  const s = parseRoleDate(start).year;
  const e = end.toLowerCase() === "present" ? "Now" : String(parseRoleDate(end).year);
  return s === Number(e) ? `${s}` : `${s} – ${e}`;
}

export function flattenRoles(companies: Company[]): FlatRole[] {
  const flat: FlatRole[] = companies.flatMap((c) =>
    c.roles.map((r) => ({
      companyId: c.id,
      companyName: c.name,
      title: r.title,
      start: r.start,
      end: r.end,
      startYear: parseRoleDate(r.start).year,
      endLabel:
        r.end.toLowerCase() === "present" ? "Now" : String(parseRoleDate(r.end).year),
      description: r.description,
    }))
  );
  return flat.sort(
    (a, b) => parseRoleDate(b.start).sortable - parseRoleDate(a.start).sortable
  );
}

export function yearsOfExperience(companies: Company[]): number {
  const earliest = Math.min(
    ...companies.flatMap((c) =>
      c.roles.map((r) => parseRoleDate(r.start).year)
    )
  );
  return new Date().getFullYear() - earliest;
}

export function companyDateRange(company: Company): string {
  const starts = company.roles.map((r) => parseRoleDate(r.start).year);
  const ends = company.roles.map((r) =>
    r.end.toLowerCase() === "present" ? "Now" : String(parseRoleDate(r.end).year)
  );
  const earliest = Math.min(...starts);
  const latest = ends.includes("Now") ? "Now" : String(Math.max(...ends.map(Number)));
  return earliest === Number(latest) ? `${earliest}` : `${earliest} – ${latest}`;
}
