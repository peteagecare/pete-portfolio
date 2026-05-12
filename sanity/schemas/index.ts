import type { SchemaTypeDefinition } from "sanity";
import { projectSchema } from "./project";
import { journalPostSchema } from "./journalPost";
import { serviceSchema } from "./service";
import { siteSettingsSchema } from "./siteSettings";
import { equipmentSchema } from "./equipment";
import { softwareSchema } from "./software";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettingsSchema,
  projectSchema,
  journalPostSchema,
  serviceSchema,
  equipmentSchema,
  softwareSchema,
];
