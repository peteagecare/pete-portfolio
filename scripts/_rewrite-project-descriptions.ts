/**
 * One-off rewrite of all project descriptions in Pete's CV voice.
 * Clears em dashes, strips agency-speak, switches to first-person.
 * Also fixes two titles that contain em dashes.
 *
 *   npx tsx scripts/_rewrite-project-descriptions.ts
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

function textToBlocks(text: string) {
  const paragraphs = text.trim().split(/\n\n+/);
  return paragraphs.map((p) => ({
    _type: "block",
    _key: randomUUID().replace(/-/g, "").slice(0, 12),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: randomUUID().replace(/-/g, "").slice(0, 12),
        text: p.trim(),
        marks: [],
      },
    ],
  }));
}

type ProjectUpdate = {
  id: string;
  title?: string;
  description: string;
};

const UPDATES: ProjectUpdate[] = [
  {
    id: "bf01622d-e88a-4660-9a76-9bd1cc28a50f",
    description:
      "Produced a short-form social cut of the Age Care Bathrooms TV advert 'On The Front Line', adapted from the Brian Blessed commercial we'd just shot for TV. Reformatted for vertical and square feeds so it could run on Instagram, Facebook and YouTube Shorts. I worked across every part of the production apart from filming and the final edit: concept, scripting, on-set coordination and post-production direction.",
  },
  {
    id: "0aff1108-cf09-473c-ae58-e880747bc9ca",
    description:
      "A personal album collecting my favourite shots of architecture and old industry from Nottingham and around. Victorian breweries, viaducts and pumphouses, country houses, cathedrals and minsters, weathered shopfronts, the quiet bones of buildings that have outlasted the people who used them. Shot for the love of it rather than to brief. It sits alongside My Favourite Countryside Shots as a companion set, focused on the places people built and left behind on my doorstep.",
  },
  {
    id: "fd48809a-fa10-40f1-9ea7-39dad959e953",
    description:
      "Close-up photography of completed Age Care Bathrooms installs, focused on the small details that make a mobility bathroom feel properly designed: grab rails, shower seats, lever taps, AKW SmartCare controls, dual-flush plates, the chrome and porcelain finishes that bring each space together. Shot on location at customers' homes across the UK as the companion to the Wide Shots series. The library gets used across the website, brochures and paid social, where the wide shots alone don't tell the full story.",
  },
  {
    id: "c374d3a6-267e-4df0-8aa2-42473c5d5c8d",
    description:
      "Directed, filmed and edited the Age Care Bathrooms brand story video. A personal piece with Director Sam telling the story behind the business, made for the About Us page and YouTube channel. Shot on location at the office on a Sony A7 V, cut in Premiere Pro. End-to-end as a one-person crew, from concept to delivery.",
  },
  {
    id: "6d98fb84-78fd-4494-aa50-3f22dfd75fdb",
    description:
      "Produced 'On The Front Line', the 2026 Age Care Bathrooms national TV advert, broadcast on GB News. Partnered with production company Top Banana on the shoot and post-production. On the producer side I handled talent and casting, locations, on-the-day logistics, and shot behind-the-scenes footage so the campaign could keep running on paid social and YouTube after the broadcast slot.",
  },
  {
    id: "c2b0a4f6-0c3a-4f16-930b-4e7be8de85ed",
    description:
      "A photography set documenting a completed accessible bathroom install at a residential care home for Age Care Bathrooms. The shots capture the finished space: wet room flooring, grab rails, level-access shower, supported sanitaryware. Used across the website, the 2026 brochure and wider marketing as a real-world reference for the care home install work.",
  },
  {
    id: "b37289a4-b294-4370-ab11-4c0a25cc3cc1",
    description:
      "Directed, shot and edited a before-and-after bathroom transformation for Age Care Bathrooms, filmed on location at a residential care home. The piece shows the move from an ageing, hard-to-use setup to a safer, more accessible design. Runs on YouTube, social and the website to drive home visit bookings. One-person crew, cut in Premiere Pro.",
  },
  {
    id: "7b297ed4-25ff-455b-b647-69ee56e8653f",
    description:
      "Directed and shot a video testimonial with Gavin Nickson at Bearwardcote Hall Residential Care Home, working solo on location. Gavin talks through his experience of working with Age Care Bathrooms. The piece runs on the website, social and in outreach to care coordinators. Edit was handled separately.",
  },
  {
    id: "4a766814-f3c6-42ce-be16-3621ad69843c",
    description:
      "Designed the 2026 Age Care Bathrooms customer brochure in Canva. Produced in two formats: a print version sent out to prospective customers, and a digital edition published on FlippingBook for online viewing and email distribution. Designed with the 55+ audience in mind: clear, age-appropriate, easy to read.",
  },
  {
    id: "project-personal-ilkeston",
    title: "Ilkeston - Town Walk",
    description:
      "A walk around Ilkeston with the camera. Same kit, different brief: Derbyshire street and architecture, the kind of detail you only see when you stop.",
  },
  {
    id: "project-personal-southwell",
    title: "Southwell - A Slow Walk",
    description:
      "An afternoon in Southwell with the A7 V. The Minster, stonework, and the quiet end of a Nottinghamshire market town when you're not in a hurry.",
  },
  {
    id: "project-personal-robin-hood-way",
    description:
      "A long walk along the Robin Hood Way with the camera. Landscape, light, the kind of countryside photography that started all this for me.",
  },
  {
    id: "45492767-a765-44c6-b06b-b48e0c4580b6",
    description:
      "Produced a long-form customer testimonial for Age Care Bathrooms telling Bruce's story, focused on the difference his new bathroom has made day to day. At 2:10 it gives Bruce space to tell things in his own words. Cutdowns run on Instagram, Facebook and YouTube Shorts alongside the full version on YouTube and the website. I worked across every part of the production apart from filming and the final edit: concept, interview direction, on-site coordination and post-production direction.",
  },
  {
    id: "5541addb-6fb7-40b9-9fcb-a21a79194c0f",
    description:
      "Filmed and edited a series of 'A Day In The Life' social videos for Age Care Bathrooms, following the team through a typical install day. Shot on iPhone, cut for vertical, proving good social content doesn't always need a full camera kit. Ran on Instagram, Facebook and YouTube Shorts.",
  },
  {
    id: "2f420817-ac34-4ad9-a685-0f353d7d838d",
    description:
      "Filmed and edited a behind-the-scenes social cut from the shoot day of the Age Care Bathrooms TV advert. Captured on a Sony A7 V while I was producing on set, then cut for vertical and posted across Instagram, Facebook and YouTube Shorts to show how the campaign came together.",
  },
  {
    id: "02309ace-6113-47a2-ac1a-691d8579d6d1",
    description:
      "Produced a short-form walkthrough video for Age Care Bathrooms covering the 6-stage installation process, from survey to sign-off. Cut for social first, running on Instagram, Facebook and YouTube Shorts so prospective customers know exactly what to expect when booking an install. I worked across every part of the production apart from filming and the final edit: concept, scripting, on-site coordination and post-production direction.",
  },
  {
    id: "132262d2-3836-45be-af6e-93e6d19e8c38",
    description:
      "Filmed and edited a series of before-and-after social videos for Age Care Bathrooms, travelling around the country to catch each bathroom before the work started and again once the install was finished. Shot on a Sony A7 V and A6700, cut in Premiere Pro. The format gives prospective customers an honest look at the transformation in under a minute. Built for paid social and organic feeds.",
  },
  {
    id: "5220532e-1179-49c3-b8d0-0d29a07f34e6",
    description:
      "A personal album collecting my favourite countryside shots from across the UK. Quiet hilltop churchyards, lakes and reedbeds, Welsh estuary trains, lone trees in the Dales, geese among the daffodils. Shot for the love of it rather than to brief. Sits a little outside the rest of the portfolio but shows the same eye for light and framing that runs through the commercial work.",
  },
  {
    id: "17b9625a-bd42-4a63-b2fb-94ff1c45ab89",
    description:
      "Wide-angle photography of completed Age Care Bathrooms installs, capturing the layout, light and proportion of each finished space. Shot on location at customers' homes across the UK. The series covers everything from compact wet rooms and walk-in baths to marble-effect loft conversions and fully tiled mobility bathrooms, each one tailored to the customer's space. Runs as a visual library across the website, the 2026 brochure, paid social and wider marketing.",
  },
  {
    id: "b07b403f-0343-467f-b88e-d42fe6bd6386",
    description:
      "Directed and edited an AI-driven video series for Age Care Bathrooms, following each project from original bathroom, through CAD design, to finished install. Sales photos, CAD renders and installer shots animated in Artlist AI, then sequenced in Premiere Pro. Six pieces shown here. Used across YouTube, paid social and the website, turning existing assets into marketing content with no extra shoot cost.",
  },
  {
    id: "1d4a8958-0f48-48c2-96a9-cbb4b330c7ba",
    description:
      "An ongoing series of customer before-and-after bathroom transformation videos for Age Care Bathrooms, shot on location at customers' homes across the UK. Each piece captures the shift from an ageing, hard-to-use setup to a safer, more accessible design. End-to-end one-person production: shot on a Sony A7 V, cut in Premiere Pro. Six pieces shown here from a much larger run.",
  },
  {
    id: "b6d4d065-590f-4f53-8deb-9b2647dfd784",
    description:
      "A region-specific direct mail flyer for Age Care Bathrooms, designed in Canva and aimed at a high-performing Manchester postcode. ACB operates nationally but the flyer leans into a 'Manchester's Mobility Bathroom Experts' positioning to lift local response. Set up a dedicated Manchester phone number (0161 401 0056) so we could attribute calls cleanly. Pairs the regional hook with a £500 M&S gift card incentive, Google Reviews social proof and a free home visit call to action.",
  },
  {
    id: "9e07d9e8-4a2f-4c75-8c5e-f7b083c2bae6",
    description:
      "A two-sided print flyer for Age Care Maintenance, designed in Canva, supporting their handyman subscription service for the 55+ community. The front leads with the value proposition: DBS-checked experts, a clear breakdown of services covered (plumbing, heating, electrics, drains, decorating, mobility, handyman, building) and a three-step 'How It Works' explanation of the Home Wallet Subscription model. The reverse compares the Silver, Gold and Platinum tiers in a clean table, highlighting yearly savings, free call-outs, priority booking and maintenance discounts. Designed to make a subscription service feel easy to grasp at a glance for an older audience.",
  },
  {
    id: "1b91410d-4eb9-41be-9085-7f99cf84f057",
    description:
      "Producer on Age Care Bathrooms' 'Discover Our Process' video, a customer-facing brand piece walking through the six-step journey from first enquiry to final installation. Partnered again with Top Banana on the shoot and post-production. On the producer side I handled talent and casting, locations, on-the-day logistics, and shot behind-the-scenes footage for social. The finished piece sits on the website and YouTube channel.",
  },
  {
    id: "3dc67a2e-dde9-4e94-89c7-f85b3e580eae",
    description:
      "An A5 print flyer for Town & Country Builders & DIY Merchants, an independent builders merchant in Staveley, located in the same industrial park as Age Care Bathrooms. Produced in Canva with full bleed for print. Highlights the merchant's product range across timber, plumbing, heating, bathrooms, insulation, screws and fixings, and aggregates. Paired with opening times, phone number and store location to support a 'shop local' call to action.",
  },
  {
    id: "acee067f-f2a5-4e0d-985d-c99680418bca",
    description:
      "Age Care Maintenance is a subscription handyman service for over-55s. I built the site in Next.js, integrating an OpenAI-powered chat estimator that uses semantic job matching (rather than keyword lookups) to quote jobs in real time. Features include membership plan selection, postcode validation and a full booking flow. Built with Next.js, with a bit of help from Claude.",
  },
  {
    id: "635904fe-d69e-49a7-ab8e-18b5a635c22a",
    description:
      "In-house producer on Age Care Bathrooms' Brian Blessed TV advert, the campaign that kicked off the brand's 'As Seen on TV' positioning. Partnered with CNS Media on the shoot and post-production. On my side I handled talent and casting, locations, on-the-day logistics, and shot behind-the-scenes content for social. The spot has run extensively on UK TV and feeds into the brand's 'As Seen on TV with Brian Blessed OBE' wording across print adverts, brochures and the website.",
  },
  {
    id: "6c681522-6269-4f00-81c1-9ad74d462cee",
    description:
      "A foldable post-installation flyer for Age Care Bathrooms, designed in Canva, handed to customers as part of the handover after their new bathroom is installed. Captures key install details (installer name, install date, guarantee expiry), signposts to the support team and online help centre, and includes a structured cleaning and maintenance routine. Also a quiet soft-sell touchpoint for the ForeverCare cleaning package and the extended warranty.",
  },
  {
    id: "8d2e5d6b-32c6-486f-85ff-bcc44e45bc34",
    description:
      "A dedicated walk-in bath brochure for Age Care Bathrooms, designed in Canva. Produced in two formats: a print version mailed to prospective customers and a digital edition on FlippingBook. Focuses specifically on the walk-in bath range so customers researching that product get something richer and more focused than the main brochure.",
  },
  {
    id: "8d229343-6fca-44b7-9c15-88990865ff2d",
    description:
      "Designed and built a WordPress site for Town & Country Builders & DIY Merchants, an independent builders merchant in Staveley. The site presents the full product range (timber, plumbing, heating, bathrooms, insulation, fixings, aggregates) alongside store info and contact details, giving local trade and DIY customers an easy way to browse and get in touch.",
  },
  {
    id: "b7aec654-492a-4c9d-b308-efbaeab2ce9c",
    description:
      "A national press advert for Age Care Bathrooms, designed in Canva and placed in The Sunday Times and Daily Mail. The creative leads with the brand's 'UK's mobility bathroom experts' positioning, supported by product call-outs (walk-in baths, walk-in showers, wet rooms, full mobility bathrooms), Google and Trustpilot ratings, and the 'As Seen on TV with Brian Blessed OBE' credential. Clear response path via phone, email and web.",
  },
  {
    id: "b9704672-6ffb-4eba-b967-f32b457e678f",
    description:
      "Designed and built a WordPress and WooCommerce site for World Music Day, an online store selling music education resources to primary schools. WordPress handles content and editorial, WooCommerce powers the storefront: product listings, cart, checkout, order management. Gives teachers a straightforward route to browse, buy and access classroom-ready resources.",
  },
  {
    id: "c856e383-8690-43f4-9af8-2c5e03b8d477",
    description:
      "Designed and built a WordPress site for Lime Tree Music Centre, the Matlock music school I co-own. The site covers lesson information, teacher profiles and enquiry forms through a flexible WordPress CMS so we can manage content and onboard new students ourselves.",
  },
  {
    id: "4482e001-922a-48f6-a694-bdefdfaac4bb",
    description:
      "Age Care Bathrooms is a UK bathroom adaptation company focused on accessibility for older customers. I built the site primarily on WordPress, with a custom header built in Next.js, giving the marketing team WordPress's content flexibility while keeping the top-level navigation fast and componentised. Integrated with HubSpot for lead capture, home visit booking and lifecycle stage tracking.",
  },
  {
    id: "56d8f52d-a0b5-4f06-befa-708781a7b4ee",
    description:
      "A WordPress website for The Musical Me, where I was Co-Director from June 2020. The site is built around MemberPress, handling member subscriptions, recurring billing and access control for gated content. Members get a tailored experience with restricted content tiers managed through the WordPress CMS.",
  },
];

async function run() {
  const tx = client.transaction();
  for (const u of UPDATES) {
    const patch: Record<string, unknown> = {
      description: textToBlocks(u.description),
    };
    if (u.title) patch.title = u.title;
    tx.patch(u.id, (p) => p.set(patch));
  }
  const res = await tx.commit();
  console.log(`✓ Patched ${res.results.length} projects.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
