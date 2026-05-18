/**
 * One-off: rewrite all project descriptions in Pete's CV voice + clear em dashes.
 * Also fixes 2 titles that contain em dashes.
 *
 *   npx tsx scripts/_rewrite-projects.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";

config({ path: resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

function block(text: string) {
  return {
    _key: randomUUID(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      { _key: randomUUID(), _type: "span", marks: [], text },
    ],
  };
}

type Update = { _id: string; title?: string; description: string };

const updates: Update[] = [
  {
    _id: "bf01622d-e88a-4660-9a76-9bd1cc28a50f",
    description:
      "A short-form social cut of the Age Care Bathrooms 'On The Front Line' TV advert, adapted from the Brian Blessed-fronted original. I reformatted it for vertical and square feeds so versions could run on Instagram, Facebook and YouTube Shorts. Worked across the whole production except filming and editing: concept, scripting, on-set coordination, post-production direction.",
  },
  {
    _id: "0aff1108-cf09-473c-ae58-e880747bc9ca",
    description:
      "A personal photography album of my favourite architecture and old-industry shots from Nottingham and the surrounding area. Victorian breweries, viaducts and pumphouses, country houses, cathedrals and minsters, weathered shopfronts, the quiet bones of buildings that have outlasted the people who used them. Shot for the love of it rather than to brief. Sits alongside My Favourite Countryside Shots as a companion set.",
  },
  {
    _id: "fd48809a-fa10-40f1-9ea7-39dad959e953",
    description:
      "A close-up photography collection of completed Age Care Bathrooms installations, focused on the small details that define a well-designed mobility bathroom: grab rails, shower seats, lever taps, AKW SmartCare controls, dual-flush plates, the chrome and porcelain finishes that bring each space together. Shot on location at customers' homes across the UK. Sits alongside the Bathroom Collection Wide Shots series as a library of texture, hardware and finish references for the website, brochures, paid social and product-led marketing.",
  },
  {
    _id: "c374d3a6-267e-4df0-8aa2-42473c5d5c8d",
    description:
      "Directed, filmed and edited the Age Care Bathrooms brand story video. A personal piece featuring Director Sam telling the story behind the business, produced for the company's About Us page and YouTube channel. Shot on location at the office on a Sony A7 V, edited in Premiere Pro. End-to-end from concept to delivery.",
  },
  {
    _id: "6d98fb84-78fd-4494-aa50-3f22dfd75fdb",
    description:
      "Produced 'On The Front Line', Age Care Bathrooms' 2026 national TV advert, broadcast on GB News. Partnered with production company Top Banana on the shoot and post-production while leading the producer side: coordinating talent and casting, securing locations, managing on-the-day logistics, capturing behind-the-scenes footage for paid social and organic. The finished spot also feeds into our Sky AdSmart attribution work.",
  },
  {
    _id: "c2b0a4f6-0c3a-4f16-930b-4e7be8de85ed",
    description:
      "Shot a photography set documenting a completed accessible bathroom installation at a residential care home for Age Care Bathrooms. Wet room flooring, grab rails, level-access shower, supported sanitaryware. The images run across the website, the 2026 brochure and the wider marketing collateral as a real-world reference for our care home and residential install work.",
  },
  {
    _id: "b37289a4-b294-4370-ab11-4c0a25cc3cc1",
    description:
      "Directed, shot and edited a before-and-after bathroom transformation video for Age Care Bathrooms, filmed on location at a residential care home. The piece shows the move from an ageing, hard-to-use setup to a safer, more accessible design. Runs across YouTube, social and the website to drive home design visit bookings. Worked solo as a one-person crew, edited in Premiere Pro.",
  },
  {
    _id: "7b297ed4-25ff-455b-b647-69ee56e8653f",
    description:
      "Directed and shot a video testimonial with Gavin Nickson at Bearwardcote Hall Residential Care Home, working solo as a one-person crew on location. Gavin talks through his experience of working with Age Care Bathrooms. The piece runs across the website, social, and our outreach to care coordinators and residential care decision-makers. Editing handled separately.",
  },
  {
    _id: "4a766814-f3c6-42ce-be16-3621ad69843c",
    description:
      "Designed the 2026 Age Care Bathrooms customer brochure in Canva. Two formats: a print version sent to prospective customers as part of the lead nurture process, and a digital edition on FlippingBook for online viewing and email distribution. Shows the accessible bathroom range with clear, age-appropriate design for the 55+ audience.",
  },
  {
    _id: "project-personal-ilkeston",
    title: "Ilkeston - Town Walk",
    description:
      "A walk around Ilkeston with the camera. Same kit, different brief. Derbyshire street and architecture, the kind of detail you only see when you stop.",
  },
  {
    _id: "project-personal-southwell",
    title: "Southwell - A Slow Walk",
    description:
      "An afternoon in Southwell with the A7 V. The Minster, stonework, the quiet end of a Nottinghamshire market town when you're not in a hurry.",
  },
  {
    _id: "project-personal-robin-hood-way",
    description:
      "A long walk along the Robin Hood Way with the camera. Landscape, light, the kind of countryside photography that started all this for me.",
  },
  {
    _id: "45492767-a765-44c6-b06b-b48e0c4580b6",
    description:
      "Produced a long-form customer testimonial video for Age Care Bathrooms telling Bruce's story, focused on the difference his new bathroom has made day to day. At 2:10 it gives Bruce space to say things in his own words. Cutdowns run across Instagram, Facebook and YouTube Shorts alongside the full version on YouTube and the Age Care Bathrooms site. Worked across the whole production except filming and editing: concept, interview direction, on-site coordination, post-production direction.",
  },
  {
    _id: "5541addb-6fb7-40b9-9fcb-a21a79194c0f",
    description:
      "Filmed and edited a series of 'A Day In The Life' social videos for Age Care Bathrooms, following the team through a typical install day. Shot on iPhone and cut for vertical: strong social content doesn't always need a full camera kit. Versions ran on Instagram, Facebook and YouTube Shorts.",
  },
  {
    _id: "2f420817-ac34-4ad9-a685-0f353d7d838d",
    description:
      "Filmed and edited a behind-the-scenes social cut from the shoot day of the Age Care Bathrooms TV advert. Captured on a Sony A7 V while producing on set. Cut for vertical, with versions running on Instagram, Facebook and YouTube Shorts.",
  },
  {
    _id: "02309ace-6113-47a2-ac1a-691d8579d6d1",
    description:
      "Produced a short-form walkthrough video for Age Care Bathrooms covering our 6-stage installation process, from survey to sign-off. Cut for social first, with versions running on Instagram, Facebook and YouTube Shorts. Worked across the whole production except filming and editing: concept, scripting, on-site coordination, post-production direction.",
  },
  {
    _id: "132262d2-3836-45be-af6e-93e6d19e8c38",
    description:
      "Filmed and edited a series of before-and-after social videos for Age Care Bathrooms, travelling around the country to capture each bathroom before the work started and again once the install was finished. Shot on a Sony A7 V and A6700, cut in Premiere Pro. Each one gives prospective customers an honest look at the transformation in under a minute, built for paid social and organic feeds.",
  },
  {
    _id: "5220532e-1179-49c3-b8d0-0d29a07f34e6",
    description:
      "A personal photography album of my favourite countryside shots from across the UK. Quiet hilltop churchyards, lakes and reedbeds, Welsh estuary trains, lone trees in the Dales, geese among the daffodils. Shot for the love of it rather than to brief. Sits a little outside the rest of the portfolio but shows the same eye for light, framing and composition that runs through the commercial work.",
  },
  {
    _id: "17b9625a-bd42-4a63-b2fb-94ff1c45ab89",
    description:
      "A curated photography collection of completed Age Care Bathrooms installations, shot wide to show the full layout, light and proportion of each finished space. Shot on location at customers' homes across the UK. The series covers compact wet rooms, walk-in baths, marble-effect loft conversions and fully tiled mobility bathrooms, each one tailored to the customer's space and accessibility needs. The collection runs across the website, the 2026 brochure, paid social and wider marketing collateral as a real-world reference for the breadth and quality of our installation work.",
  },
  {
    _id: "b07b403f-0343-467f-b88e-d42fe6bd6386",
    description:
      "Directed and edited an AI-driven video series for Age Care Bathrooms, following each project from the original bathroom through CAD design to finished install. Sales photos, CAD renders and installer shots animated in Artlist AI, then sequenced in Premiere Pro. Six pieces shown here, running across YouTube, paid social and the Age Care Bathrooms site. Existing assets turned into marketing content with no extra shoot cost.",
  },
  {
    _id: "1d4a8958-0f48-48c2-96a9-cbb4b330c7ba",
    description:
      "Directed, filmed and edited an ongoing series of customer before-and-after bathroom transformation videos for Age Care Bathrooms, shot on location at customers' homes across the UK. Each one shows the shift from an ageing, hard-to-use setup to a safer, more accessible design. Worked end-to-end as a one-person production, shooting solo on a Sony A7 V, full edit in Premiere Pro. Six selected pieces here from a much larger body of work.",
  },
  {
    _id: "b6d4d065-590f-4f53-8deb-9b2647dfd784",
    description:
      "Designed a region-specific direct mail flyer for Age Care Bathrooms in Canva, targeting a high-performing Manchester postcode as part of a localised acquisition campaign. Age Care Bathrooms operates nationally, but this flyer leans into a 'Manchester's Mobility Bathroom Experts' positioning to drive stronger local response, with a dedicated Manchester phone number (0161 401 0056) provisioned specifically for the campaign for clean attribution back to the activity. The creative pairs the regional hook with a £500 M&S gift card incentive, social proof from Google Reviews, and a free home visit call to action.",
  },
  {
    _id: "9e07d9e8-4a2f-4c75-8c5e-f7b083c2bae6",
    description:
      "Designed a two-sided print flyer for Age Care Maintenance in Canva, supporting acquisition for the brand's handyman subscription service for the 55+ community. The front leads with the value proposition: DBS-checked experts, a breakdown of services covered (plumbing, heating, electrics, drains, decorating, mobility, handyman, building), and a three-step 'How It Works' explanation of the Home Wallet Subscription model. The reverse presents the Silver, Gold and Platinum subscription tiers in a clean comparison table, highlighting yearly savings, free call-outs, priority booking and maintenance discounts to drive sign-ups at agecaremaintenance.co.uk. Designed to translate a subscription-based service into something easy to grasp at a glance for an older audience.",
  },
  {
    _id: "1b91410d-4eb9-41be-9085-7f99cf84f057",
    description:
      "Producer on Age Care Bathrooms' 'Discover Our Process' video, a customer-facing brand piece walking through the six-step journey from first enquiry to final installation. Partnered with production company Top Banana on the shoot and post-production while leading the producer side: coordinating talent and casting, securing locations, managing on-the-day logistics, capturing behind-the-scenes footage for paid social and organic. The finished piece sits on the Age Care Bathrooms website and YouTube channel.",
  },
  {
    _id: "3dc67a2e-dde9-4e94-89c7-f85b3e580eae",
    description:
      "Designed an A5 print flyer for Town & Country Builders & DIY Merchants, an independent builders merchant in Staveley. They're based in the same industrial park as Age Care Bathrooms. Produced in Canva with full bleed for print. The flyer highlights the merchant's product range across timber, plumbing, heating, bathrooms, insulation, screws and fixings, and aggregates, paired with opening times, phone number and store location to support a 'shop local' call to action.",
  },
  {
    _id: "acee067f-f2a5-4e0d-985d-c99680418bca",
    description:
      "Age Care Maintenance is a subscription handyman service for over-55s. I built the site in Next.js with an OpenAI-powered chat estimator that uses semantic job matching (rather than keyword lookups) to quote jobs in real time. Features include membership plan selection, postcode validation and a full booking flow. Built with a bit of help from Claude.",
  },
  {
    _id: "635904fe-d69e-49a7-ab8e-18b5a635c22a",
    description:
      "In-house producer on Age Care Bathrooms' Brian Blessed TV advert, the campaign that established our 'As Seen on TV' celebrity-fronted positioning. Partnered with CNS Media on the shoot and post-production while leading the producer side internally: coordinating talent and casting, securing locations, managing on-the-day logistics, capturing behind-the-scenes content for paid social and organic. The finished spot has run extensively across UK television and now sits at the centre of our 'As Seen on TV with Brian Blessed OBE' positioning, used in print adverts, brochures and across the wider marketing ecosystem.",
  },
  {
    _id: "6c681522-6269-4f00-81c1-9ad74d462cee",
    description:
      "Designed a foldable post-installation flyer for Age Care Bathrooms in Canva, given to customers as part of the handover process after their new bathroom is installed. Functions as a tangible welcome pack: install details (installer name, install date, guarantee expiry), signposting to the support team and online help centre, and a structured cleaning and maintenance routine to help customers protect their investment. Also a soft-sell touchpoint for the Age Care ForeverCare cleaning package and the extended warranty programme.",
  },
  {
    _id: "8d2e5d6b-32c6-486f-85ff-bcc44e45bc34",
    description:
      "Designed a dedicated walk-in bath brochure for Age Care Bathrooms in Canva. Two formats: print mailed to prospective customers, and a digital edition on FlippingBook for online viewing and email distribution. Focuses specifically on the walk-in bath range, giving customers researching that product a richer, more focused alternative to the main 2026 brochure.",
  },
  {
    _id: "8d229343-6fca-44b7-9c15-88990865ff2d",
    description:
      "Designed and built a WordPress website for Town & Country Builders & DIY Merchants, an independent builders merchant in Staveley. The site presents the full product range (timber, plumbing, heating, bathrooms, insulation, fixings, aggregates) alongside store information and contact details, giving local trade and DIY customers an easy way to browse and get in touch.",
  },
  {
    _id: "b7aec654-492a-4c9d-b308-efbaeab2ce9c",
    description:
      "Designed a national press advert for Age Care Bathrooms in Canva, placed in The Sunday Times and Daily Mail. Leads with our positioning as the UK's mobility bathroom experts, supported by product call-outs (walk-in baths, walk-in showers, wet rooms, full mobility bathrooms), Google and Trustpilot ratings, and the 'As Seen on TV with Brian Blessed OBE' credential. All wrapped in the Age Care Bathrooms brand identity with a clear response path via phone, email and web.",
  },
  {
    _id: "b9704672-6ffb-4eba-b967-f32b457e678f",
    description:
      "Designed and built a WordPress and WooCommerce website for World Music Day, an online store selling music education resources to primary schools. WordPress handles content and editorial, WooCommerce powers the storefront: product listings, cart, checkout and order management. Gives teachers an easy route to browse, purchase and access classroom-ready resources.",
  },
  {
    _id: "c856e383-8690-43f4-9af8-2c5e03b8d477",
    description:
      "Designed and built a WordPress website for Lime Tree Music Centre, the music school I co-own in Matlock. Lesson information, teacher profiles and enquiry forms through a flexible WordPress CMS so we can manage content and onboard new students ourselves.",
  },
  {
    _id: "4482e001-922a-48f6-a694-bdefdfaac4bb",
    description:
      "Age Care Bathrooms is a UK bathroom adaptation company focused on accessibility for older customers. The site runs primarily on WordPress, with a custom header built in Next.js. Gives the marketing team WordPress's content flexibility while keeping the top-level navigation fast and componentised. Integrated with HubSpot for lead capture, home visit booking and lifecycle stage tracking.",
  },
  {
    _id: "56d8f52d-a0b5-4f06-befa-708781a7b4ee",
    description:
      "A WordPress website for The Musical Me, where I was Co-Director from June 2020. Built around MemberPress, which handles member subscriptions, recurring billing and access control for gated content. Members get a tailored experience with restricted content tiers managed through the WordPress CMS.",
  },
];

async function run() {
  const tx = client.transaction();
  for (const u of updates) {
    const set: Record<string, unknown> = { description: [block(u.description)] };
    if (u.title) set.title = u.title;
    tx.patch(u._id, { set });
  }
  const res = await tx.commit();
  console.log(`✓ Patched ${res.results.length} projects.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
