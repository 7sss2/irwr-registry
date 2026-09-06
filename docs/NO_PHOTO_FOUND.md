# IRWR records with NO verified real photo (122 of 295)

Checked against: GBR-BOOK-NEW-PRINT-vers3.pdf, globalbestrecords.org category pages, and
(2026-09-05) globalbestrecords.org's News section (all 137 posts).
These records keep their picsum.photos placeholder image.

## 2026-09-06: economy-category photo pass (138 -> 122 without photo)

Same method as the culture pass below: `curl -L https://globalbestrecords.org/economyrecords`
returns full static HTML, parsed the same way (18-record page, two records per `#recNNNNNN`
block, two images each). No recurring generic-placeholder image this time (only `noroot.png`,
Tilda's own broken-image marker, and one legitimate 2x reuse of `Amazon-logo.png` across two
different Amazon-related record mentions). Downloaded and visually inspected all 17 apparent
hits against the 18 missing economy records before accepting any:
- **16 confirmed and added:** IRWR-00032 (Walmart storefront), 00033 (Dubai World Central
  airport render), 00035 (a second, different Walmart storefront photo), 00045 (Chinese wheat
  harvest), 00046 (US corn harvest), 00047 (Indian rice harvest, farmer holding grain), 00050
  (milk production — generic but on-topic farm stock photo, same treatment as the other
  national-statistic agriculture records already in the manifest), 00051 (tomato harvest), 00052
  (peanut export containers), 00054 (honey production), 00055 (stacked timber), 00056 (Indian
  tractor), 00058 (Wonder of the Seas, Royal Caribbean branding visible), 00060 (Knock Nevis —
  ship's name painted on the hull), 00062 (AmaMagna — ship's name painted on the hull), 00064
  (Hyundai Heavy Industries shipyard, signage visible).
- **1 rejected despite proximity:** IRWR-00031's only nearby image was the page's own
  category-hero collage (a mosaic mixing Walmart/ICBC/Saudi Aramco/iPhone/ship photos together
  for the whole "Economy, Industry" chapter banner) — not a photo specific to ICBC, so rejected
  rather than accepted on proximity alone. This is a new failure mode worth flagging for future
  category passes: a page's own hero/cover image can sit right next to the first record's text
  without actually depicting that record.
- **1 with no candidate at all:** IRWR-00041 (SoftBank Vision Fund 2) — the site itself shows
  `noroot.png` (its own missing-image placeholder) there.

16 images copied into `images/records/`, added to `scripts/photo-manifest.json`, dataset
rebuilt (295 records, ids unchanged), both test suites pass. Economy: 18 -> 2 records still
without a photo — the best per-category result so far.

## 2026-09-06: culture-category photo pass (156 -> 138 without photo)

Re-fetched globalbestrecords.org/culturerecords directly via `curl` (a plain GET returns full
static HTML including every `data-original` attribute — Tilda serves this category page
server-rendered, so no browser/JS execution was needed). Each `#recNNNNNN` block on the page
pairs two records with two images in document order; one recurring image
(`photo_52044602423882.png`, seen 12 times) is Tilda's own generic unfilled-slot placeholder
and was excluded, matching the project's existing >2-claims-means-generic rule. Every other
image on the page appears exactly once, uniquely tied to one specific record's caption text.
Cross-referenced all 38 of culture's missing-photo holders/titles against this page, downloaded
every apparent hit, and visually inspected each before accepting it (per the project's existing
discipline — the previous session's PDF/site pass caught 2 of 4 title-based matches as wrong,
so nothing here was accepted on caption/filename match alone):
- **18 confirmed and added:** IRWR-00070 (Documenta Fifteen, matched via a second on-page
  mention with a filename referencing "d15"/Ottoneum, a real Kassel exhibition venue), 00071
  (Louvre), 00072 (The Scream), 00073 (snow figures), 00074 (The Mousetrap), 00075 (The Lion
  King), 00076 (National Centre for the Performing Arts), 00077 (Ramayana performance), 00084
  (Korkyt ensemble — the photo itself is a GBR award-ceremony banner naming the group), 00088
  (Codex Leicester — a designed book-cover graphic naming the manuscript, same "commissioned
  graphic" category as Task 19's Voyager 1/Neil Armstrong precedent), 00090 (Mao's "Red Book"),
  00091 (the Bible), 00092 (Shiki no Kusabana), 00094 (Bay Psalm Book), 00095 (Diamond Sutra),
  00098 (IKEA catalogue), 00102 (Balmain/Olivier Rousteing), 00115 (Mouawad diamond purse).
- **2 rejected despite an on-page caption match**, kept in the list below with the reason:
  00096 (image was a different Agatha Christie book entirely) and 00107 (generic bridal stock
  photo, no sign of the dress's signature 150-carat diamond bodice).
All 18 accepted images copied into `images/records/`, added to `scripts/photo-manifest.json`,
`scripts/build-real-data.js` re-run, both test suites pass, rebuilt, deployed, and spot-checked
live (curl against the deployed `js/data.js` and two of the new image URLs, both 200).

## 2026-09-06: education/humanbody dedup (303 -> 295 records, 160 -> 156 without photo)

8 records filed under `education` (IRWR-00148..00155) turned out to be word-for-word
duplicates of facts already recorded under `humanbody` (IRWR-00272..00279) — the source
book's combined "Education, Science, Medicine, Digital Technologies" chapter briefly
previews these 8 facts before the dedicated "Human Body With Patients" chapter covers
each in full; extraction picked both up as separate records. The education-side echoes
were removed (user-confirmed); IDs were not renumbered, so IRWR-00148..00155 are now
retired gaps rather than being reused or causing every later ID to shift.
Of the 3 real-world facts that had no photo on either side (Robert Wadlow, John Brower
Minnoch, Timothy Ray Brown), removing the education duplicate collapses two "no photo"
entries into one — same underlying gap, listed once now instead of twice.
One fact (Kekubi/Kecubi, the surviving 245g newborn) had a verified photo only on its
education-side entry (IRWR-00154); that photo was reused for the surviving humanbody
entry (IRWR-00278), which previously had none — net one more record gains a photo.

## 2026-09-05: News-section pass (+3 found, 163 -> 160)

Fetched all 137 `/tpost/...` articles from globalbestrecords.org/news (via `fetch()` in-page,
https-forced to dodge mixed-content blocks), stripped each post's Tilda widget JS/CSS boilerplate
down to real article prose, then matched every one of the then-163 missing records' `holderName`
(parenthetical stripped) as an exact case-insensitive substring against all 137 articles' title+body.
Every hit was opened and the candidate photo visually inspected before acceptance (no title-only or
generic-word matches accepted — same discipline as the earlier PDF/category-page pass, which found
2 of 4 title-based matches to be wrong).

Result: only 3 of 163 had a genuine hit. This is expected, not a shortfall in the search — the News
section covers GBR's own press releases for records *it organized or announced* (heavily Kazakhstan /
Central Asia ethnosport, agriculture, and civic-event records), while most of the remaining 160 are
generic world-record facts (Leonardo da Vinci paintings, Walmart, ICBC, IBM quantum chips, Robert
Wadlow, national crop harvests, etc.) that GBR's own site never had occasion to cover — there is no
article to find because the underlying event isn't a GBR-organized one.

Found:
- **IRWR-00049** — Heaviest Ram on Record (Kuanysh Myktybayev, ram "Million") — article "Kazakhstan
  once again proves its agricultural strength on the global stage." names the ram (231kg, Sary-Agash)
  and farmer by name; photo shows the actual ram in its pen.
- **IRWR-00113** — Largest Collection of Traditional Kazakh Patchwork Quilts (Nurgul Abaykhan,
  "Alaman Kurak" project) — article "THE ALAMAN KURAK PROJECT" is a GBR-commissioned announcement
  graphic naming "Nurgul Abaykhan" and "The ALAMAN KURAK project" verbatim.
- **IRWR-00301** — Farthest Manual Tow of Two Pickup Trucks (Women Over 55) (Aigul Yerzhanova) —
  article "CHALLENGE TO THE WORLD!" names Yerzhanova (55, Astana) manually towing a heavy vehicle
  for a GBR record; photo shows her at the tow site. Note: the article's vehicle (a 13,500kg city
  bus) differs from this record's "two pickup trucks" description — same real person and record
  category (manual vehicle tow, women 55+, Kazakhstan/GBR), photo assigned on that identity match
  per the project's existing holder-identity convention, but flagging the vehicle-detail mismatch
  for anyone auditing this entry later.

Rejected candidates (real GBR mention, but no record-specific photo available):
- IRWR-00119 (ROMANTIK Company / rose bouquet) — the company is a named nominee in "Nominees for the
  GBR AWARD OF THE YEAR 2025 Announced!", but that post's only image is a generic AI-generated award
  graphic shared across all 5 nominees, not a rose-bouquet-specific photo — excluded as a generic
  filler image under the same rule that dropped multi-record-claimed images in the prior pass.

## architecture (9)
- IRWR-00229 — Tallest Modern Skyscraper in Historic London (The Shard (architect Renzo Piano))
- IRWR-00233 — Largest Glass Greenhouse Dome Complex (Gardens by the Bay (Grant Associates and Wilkinson Eyre))
- IRWR-00234 — Tallest Building Engineered for Extreme Northern Climate (Lakhta Center Tower (architect Gordon Bennett, RMJM))
- IRWR-00236 — First Museum Built Around a Spiral Ramp (Guggenheim Museum New York (architect Frank Lloyd Wright))
- IRWR-00237 — First All-Suite Hotel on an Artificial Island (Burj Al Arab (architect Tom Wright))
- IRWR-00245 — Highest Railway Bridge of Its Era (Rendsburg High Bridge (Deutsche Bahn, engineer Fritz Leonhardt))
- IRWR-00246 — Longest Steel Central Arch Span (Varazdin Bridge (Hrvatske Ceste, architect Marko Muzina))
- IRWR-00251 — Longest Bridge Built Entirely of Wood (John Carroll Bridge (Timberworks, architect James Hudson))
- IRWR-00252 — Steepest Pedestrian Bridge (Twist Bridge (COWI, Bjarke Ingels Group))

## cooking (12)
- IRWR-00210 — Largest Pizza Ever Made ("Big Mama" (Italian pizzaiolos))
- IRWR-00211 — Longest Line of Sushi (Japan Sushi Association)
- IRWR-00212 — Largest Caprese Salad (Bagration-ULAN)
- IRWR-00213 — Largest Chocolate Sculpture (Chocoversum (Chocolate Museum))
- IRWR-00214 — Most Expensive Hamburger (Fleur restaurant, Mandalay Bay)
- IRWR-00215 — Largest Portion of Foie Gras (Maison Rince)
- IRWR-00216 — World's Largest Birthday Cake (Guatemalan pastry chefs)
- IRWR-00217 — Longest Sausage (Rome meat processing plant)
- IRWR-00218 — Longest Hot Dog (Balkhash Health and Medical Sanatorium / HICHGARDEN Coffee Shop)
- IRWR-00219 — Largest Cheeseburger (Black Bear Lodge restaurant)
- IRWR-00220 — Largest Sushi Roll (OKADZAKI sushi restaurant chain)
- IRWR-00221 — Largest Cup of Coffee (Cafe de Colombia Coffee Company)

## culture (20)
- IRWR-00067 — Most Expensive Painting Sold at Auction (Leonardo da Vinci ("Salvator Mundi"))
- IRWR-00068 — Largest Painting in the World (Sacha Jafri ("The Journey of Humanity"))
- IRWR-00078 — Most People Dancing Ballet Simultaneously (Buenos Aires ballet mass event)
- IRWR-00081 — Youngest Composer of a Symphony (Eitan Matlis)
- IRWR-00096 — Longest Single Printed Publication (HarperCollins ("Agatha Christie Collection")) — a candidate image existed on globalbestrecords.org/culturerecords but visually depicted a *different* Agatha Christie book ("Capital Christie: Twelve London Mysteries"), not the 7232-page HarperCollins collection this record describes; rejected as a wrong match rather than accepted on a title-only hit.
- IRWR-00099 — Fastest Printing Press (Canon Group (Oce JetStream 4300))
- IRWR-00100 — Most Expensive Dress Ever Sold (Marilyn Monroe (dress by Jean Louis))
- IRWR-00101 — Largest Traditional Kazakh Women's Headdress (Gulyaim Akumbayeva (Kimeshek headdress))
- IRWR-00103 — Longest Wedding Veil (Maria Paraskevopoulou)
- IRWR-00104 — Largest Traditional Kazakh Wedding Headdress (Akmaral Dauylbayeva (Saukele headdress))
- IRWR-00106 — Largest Fashion Show by Model Count (Ajio Luxe (Reliance))
- IRWR-00107 — Most Expensive Wedding Dress (Rene Strauss and Martin Katz) — globalbestrecords.org/culturerecords carries an image captioned for this record, but it's a generic bridal-editorial photo with no sign of the dress's signature 150-carat diamond bodice; rejected as unverified rather than accepted on caption match alone.
- IRWR-00109 — Fastest Fast-Fashion Production Cycle (ZARA (Inditex))
- IRWR-00111 — Highest-Altitude Fashion Show (Turkish Airlines)
- IRWR-00112 — Most Expensive Jacket Sold at Auction (Michael Jackson (gold-embroidered jacket))
- IRWR-00114 — Longest Wedding Dress Train (Anne Andrews)
- IRWR-00116 — Largest Pair of Shoes (Nike Turkey)
- IRWR-00117 — Wedding Dress with the Most Rhinestones (Nina Khan)
- IRWR-00118 — Fastest Sewing Machine (Samsung Textile Tech)
- IRWR-00119 — Largest Rose Bouquet in a Single Basket (ROMANTIK Company (Izbasarova G.))

## economy (2)
- IRWR-00031 — Largest Bank by Total Assets (Industrial and Commercial Bank of China (ICBC)) — the only image on globalbestrecords.org/economyrecords near this record is the page's own category-hero collage (Walmart/ICBC/Saudi Aramco/etc. logos mixed together), not a photo specific to ICBC; rejected rather than accepted on proximity alone.
- IRWR-00041 — Largest Venture Capital Fund (SoftBank Vision Fund 2)

## education (31)
- IRWR-00120 — Largest University by Enrollment (Indira Gandhi National Open University (IGNOU))
- IRWR-00122 — Most Multilingual Educational Institution (Lycee International de Saint-Germain-en-Laye)
- IRWR-00124 — One of the World's Highest Literacy Rates (Latvia)
- IRWR-00125 — Fastest Growth in Higher Education Enrollment (China (higher education expansion))
- IRWR-00126 — Largest Distance Learning Platform (China's National Open University)
- IRWR-00128 — Most Online Courses from a Single Institution (Stanford University)
- IRWR-00130 — Fastest Robot to Solve a Rubik's Cube (Purdue University team (Ota, Hurd, Patrohay, Berta))
- IRWR-00132 — Most Powerful European Supercomputer (LUMI supercomputer (EuroHPC / CSC))
- IRWR-00133 — Top-Ranked ARM-Based Supercomputer (Microsoft "Eagle" supercomputer)
- IRWR-00134 — Most Powerful Quantum Processor at Launch (IBM (Osprey quantum processor))
- IRWR-00135 — First Quantum Chip to Exceed 100 Qubits (IBM (Eagle quantum processor))
- IRWR-00136 — Largest Superconducting Quantum Chip (IBM (Condor quantum processor))
- IRWR-00138 — Most Educators on a Distance-Learning Platform (Coursera)
- IRWR-00139 — Largest Sustainability Education Network (UN Sustainable Development Solutions Network (SDSN))
- IRWR-00140 — Largest University AI Training Program (University of Science and Technology of China (USTC))
- IRWR-00141 — Oldest Continuously Operating University (University of Bologna)
- IRWR-00142 — Largest School for Children with Special Needs (Special Education School 518)
- IRWR-00144 — Largest International Education Conference (World Education Summit)
- IRWR-00145 — Largest Dance Lesson (Kosshy village organizers)
- IRWR-00146 — Largest Education Data Assessment Project (OECD (PISA program))
- IRWR-00147 — Most Online Diplomas Issued in a Year (University of Phoenix)
- IRWR-00156 — First Successful Heart Transplant (Dr. Christiaan Barnard)
- IRWR-00157 — First Partial Face Transplant (Isabelle Dinoire)
- IRWR-00158 — Youngest Surgeon to Perform an Operation (Akiande Jade Essa)
- IRWR-00159 — Most Expensive Medical Treatment (Zolgensma (Novartis))
- IRWR-00160 — First Disease Eradicated by Vaccination (World Health Organization (Smallpox Eradication Program))
- IRWR-00161 — First Operation by a Fully Autonomous Robot (Smart Tissue Autonomous Robot (STAR))
- IRWR-00164 — First AI to Pass a US Oral Legal Exam (GPT-4 (OpenAI))
- IRWR-00165 — Largest Smart City IoT Network (Shenzhen (smart city IoT network))
- IRWR-00166 — First Digital Model of Human Brain Activity (Human Brain Project (Blue Brain Project))
- IRWR-00169 — Fastest Quantum Computer for AI Problems (University of Science and Technology of China (Jiuzhang 2.0))

## extreme (10)
- IRWR-00285 — Fastest Power Stairs Climb (Mikhail Shivlyakov)
- IRWR-00286 — Fastest Everest Ascent Without Supplemental Oxygen (Josh Albert)
- IRWR-00287 — Longest Plank Hold (Julia Bachmann)
- IRWR-00288 — Heaviest Vehicle Pulled by Teeth (Martin Thierry)
- IRWR-00290 — Heaviest One-Handed Barbell Lift (Sanjay Kumar)
- IRWR-00293 — Longest Ultramarathon Without Sleep or Rest (Anita Kovacs)
- IRWR-00295 — Longest One-Handed Hold of a Car (David Lynch)
- IRWR-00296 — Fastest Vertical Wall Climb (Kenji Saito)
- IRWR-00297 — Most Push-Ups in One Hour (Women) (Marina Gonzalez)
- IRWR-00299 — Heaviest Bench Press (Vladimir Mbassi)

## humanbody (3)
- IRWR-00273 — Tallest Man in Recorded History (Robert Wadlow)
- IRWR-00274 — Heaviest Man in Medical History (John Brower Minnoch)
- IRWR-00276 — First Person Cured of HIV (Timothy Ray Brown)

## military (7)
- IRWR-00253 — Most Expensive Military Aviation Program (F-35 Lightning II program)
- IRWR-00255 — Largest Submarine Ever Built (Project 941 "Akula" submarine)
- IRWR-00257 — Largest Army by Personnel (Chinese People's Liberation Army)
- IRWR-00258 — Largest Aircraft Carrier (USS Gerald R. Ford (CVN-78))
- IRWR-00260 — Longest Artillery Siege of a City in the 20th Century (Siege of Sarajevo)
- IRWR-00268 — Most Expensive Space Program (International Space Station program)
- IRWR-00270 — First Successful Planetary Rover (Sojourner rover (NASA))

## sport (10)
- IRWR-00001 — Longest Continuous English Channel Swim (Wildmarie Guy)
- IRWR-00005 — Longest Ice Swim Distance (Pavel Konovalov)
- IRWR-00006 — Farthest Distance Run in 24 Hours (Thomas Freimut)
- IRWR-00008 — Most Pull-Ups in One Minute (Artem Kucherenko)
- IRWR-00009 — Highest Trampoline Jump (Irene Kuran)
- IRWR-00022 — Most Goals Scored in a Single Bandy Match (Maria Konstantinova)
- IRWR-00024 — Highest Standing High Jump (Robert Gibbons)
- IRWR-00025 — Fastest Mountain Marathon (Jean-Luc Bonnet)
- IRWR-00026 — Longest Continuous Skateboarding Session (Simon Baker)
- IRWR-00028 — Highest Snowboard Ramp Jump (Robert Vaughn)

## transport (18)
- IRWR-00172 — Highest Mileage on an Original EV Battery (Eric Cline)
- IRWR-00173 — Fastest Car Engine Replacement (UK repair team (Lamborghini Huracan))
- IRWR-00174 — Largest Electric Car Battery (Tesla (Model S Plaid battery))
- IRWR-00179 — Most Expensive Car (Rolls-Royce Boat Tail)
- IRWR-00181 — Lowest CO2 Emissions Rating (Toyota Prius Prime)
- IRWR-00184 — Best-Selling Electric Car (Tesla Model 3)
- IRWR-00185 — World's Largest Car Manufacturer (Toyota Motor Corporation)
- IRWR-00188 — Fastest Production Car Lap at the Nurburgring (Porsche 911 GT2 RS)
- IRWR-00192 — Most Automated Car Factory (Tesla Gigafactory Shanghai)
- IRWR-00193 — Fastest EV Charging Technology (Tesla (V4 Supercharger))
- IRWR-00194 — Largest National Electric Vehicle Fleet (China (national EV fleet))
- IRWR-00195 — Most Robotic Car Factory (BMW (Dingolfing plant))
- IRWR-00198 — Fastest Robotic Vehicle Assembly Step (Toyota (robotic vehicle mounting))
- IRWR-00199 — Largest EV Charging Network (Tesla Supercharger network)
- IRWR-00201 — Longest High-Speed Train (China State Railway Corporation (CRH))
- IRWR-00203 — Longest Freight Train (BHP)
- IRWR-00205 — Fastest Commercial Train Service (Shanghai Maglev Transportation Development Co.)
- IRWR-00208 — Most Expensive Rail Project (California High-Speed Rail Authority)
