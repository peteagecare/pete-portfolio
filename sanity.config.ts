"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Pete Jenkins — Studio",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (input, context) => {
      // Singleton: prevent duplicate/delete on siteSettings.
      if (context.schemaType === "siteSettings") {
        return input.filter(
          ({ action }) =>
            action !== "duplicate" && action !== "delete" && action !== "unpublish"
        );
      }
      return input;
    },
    newDocumentOptions: (prev) =>
      prev.filter((t) => t.templateId !== "siteSettings"),
  },
});
