import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("journalPost").title("Journal"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("equipment").title("Equipment"),
      S.documentTypeListItem("software").title("Software"),
    ]);
