import { groq } from "next-sanity";

const imageFields = `
  _type,
  asset,
  hotspot,
  crop,
  "alt": coalesce(alt, asset->altText, ""),
  "metadata": asset->metadata { dimensions, lqip }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    name,
    tagline,
    "heroImage": heroImage{ ${imageFields} },
    aboutText,
    "headshot": headshot{ ${imageFields} },
    contactEmail,
    socialLinks,
    currentRoleText
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(year desc, _createdAt desc) [0...6]{
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    "coverImage": coverImage{ ${imageFields} }
  }
`;

const projectCardFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  year,
  thumbnailOrientation,
  "coverImage": coverImage{ ${imageFields} }
`;

export const latestProjectsQuery = groq`
  *[_type == "project"] | order(
    coalesce(featuredOrder, 9999) asc,
    year desc,
    _createdAt desc
  ) [0...24]{
    ${projectCardFields}
  }
`;

export const heroPhotosQuery = groq`
  *[_type == "project" && category == "photo"]
    | order(year desc, _createdAt desc) {
      "cover": coverImage{ ${imageFields} },
      "images": gallery[]{ ${imageFields} }
    }
`;

export const homepageWorkByCategoryQuery = groq`
  {
    "social": *[_type == "project" && category == "social"] | order(year desc, _createdAt desc) [0...20]{ ${projectCardFields} },
    "photo":  *[_type == "project" && category == "photo"]  | order(year desc, _createdAt desc) [0...20]{ ${projectCardFields} },
    "video":  *[_type == "project" && category == "video"]  | order(year desc, _createdAt desc) [0...20]{ ${projectCardFields} },
    "web":    *[_type == "project" && category == "web"]    | order(year desc, _createdAt desc) [0...20]{ ${projectCardFields} },
    "design": *[_type == "project" && category == "design"] | order(year desc, _createdAt desc) [0...20]{ ${projectCardFields} }
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(year desc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    role,
    client,
    thumbnailOrientation,
    "coverImage": coverImage{ ${imageFields} }
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    role,
    client,
    description,
    externalUrl,
    videoUrl,
    videoGallery,
    videoOrientation,
    thumbnailOrientation,
    "coverImage": coverImage{ ${imageFields} },
    "gallery": gallery[]{ ${imageFields} },
    "software": software[]->{ _id, name }
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

export const cvProjectsQuery = groq`
  *[_type == "project" && length(cvCompanies) > 0] | order(year desc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    cvCompanies,
    "coverImage": coverImage{ ${imageFields} }
  }
`;

export const allSoftwareQuery = groq`
  *[_type == "software"] | order(order asc, name asc){
    _id, name, cvCompanies, order,
    "projects": *[_type == "project" && references(^._id)] | order(year desc, _createdAt desc){
      _id,
      title,
      "slug": slug.current,
      category,
      year,
      "coverImage": coverImage{ ${imageFields} }
    }
  }
`;

export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc){
    _id, title, description, order
  }
`;

export const allEducationQuery = groq`
  *[_type == "education"] | order(startYear desc, order asc){
    _id, institution, qualification, startYear, endYear, description, order
  }
`;

const equipmentFields = `
  _id, name, brand, description, quantity, category, order,
  "image": image{ ${imageFields} }
`;

export const equipmentByCategoryQuery = groq`
  {
    "camera":    *[_type == "equipment" && category == "camera"]    | order(order asc, name asc){ ${equipmentFields} },
    "lens":      *[_type == "equipment" && category == "lens"]      | order(order asc, name asc){ ${equipmentFields} },
    "support":   *[_type == "equipment" && category == "support"]   | order(order asc, name asc){ ${equipmentFields} },
    "audio":     *[_type == "equipment" && category == "audio"]     | order(order asc, name asc){ ${equipmentFields} },
    "lighting":  *[_type == "equipment" && category == "lighting"]  | order(order asc, name asc){ ${equipmentFields} },
    "accessory": *[_type == "equipment" && category == "accessory"] | order(order asc, name asc){ ${equipmentFields} }
  }
`;

