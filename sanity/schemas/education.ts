import { defineField, defineType } from "sanity";

export const educationSchema = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "qualification",
      title: "Qualification",
      description: 'e.g. "BMus in Music Production"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startYear",
      title: "Start year",
      type: "number",
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "endYear",
      title: "End year",
      description: "Leave empty if ongoing.",
      type: "number",
      validation: (rule) => rule.min(1900).max(2100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "order",
      title: "Order",
      description:
        "Tie-breaker when two entries share the same start year. Lower numbers show first.",
      type: "number",
    }),
  ],
  preview: {
    select: {
      institution: "institution",
      qualification: "qualification",
      startYear: "startYear",
      endYear: "endYear",
    },
    prepare({ institution, qualification, startYear, endYear }) {
      const range = `${startYear ?? "?"} – ${endYear ?? "Present"}`;
      return {
        title: `${institution} — ${qualification}`,
        subtitle: range,
      };
    },
  },
});
