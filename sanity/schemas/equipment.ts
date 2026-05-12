import { defineField, defineType } from "sanity";

export const equipmentSchema = defineType({
  name: "equipment",
  title: "Equipment",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "Full product name, e.g. 'Sony Alpha 7 V'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Camera", value: "camera" },
          { title: "Lens", value: "lens" },
          { title: "Support (tripod / gimbal)", value: "support" },
          { title: "Audio", value: "audio" },
          { title: "Lighting", value: "lighting" },
          { title: "Accessory", value: "accessory" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      type: "string",
      description: "e.g. Sony, Sigma, DJI, K&F Concept",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description:
        "Brief — what you reach for it for. 1–2 sentences works well.",
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({
      name: "quantity",
      type: "number",
      initialValue: 1,
      description: "How many you own (>1 shows as a × badge).",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "order",
      type: "number",
      initialValue: 0,
      description: "Display order within the category (lower first).",
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category",
      brand: "brand",
      qty: "quantity",
      media: "image",
    },
    prepare({ title, category, brand, qty, media }) {
      const sub = [brand, category, qty && qty > 1 ? `×${qty}` : null]
        .filter(Boolean)
        .join(" · ");
      return { title, subtitle: sub, media };
    },
  },
});
