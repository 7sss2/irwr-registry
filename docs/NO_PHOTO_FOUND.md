# IRWR records with NO verified real photo (156 of 295)

Checked against: GBR-BOOK-NEW-PRINT-vers3.pdf, globalbestrecords.org category pages, and
(2026-09-05) globalbestrecords.org's News section (all 137 posts).
These records keep their picsum.photos placeholder image.

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

## culture (38)
- IRWR-00067 — Most Expensive Painting Sold at Auction (Leonardo da Vinci ("Salvator Mundi"))
- IRWR-00068 — Largest Painting in the World (Sacha Jafri ("The Journey of Humanity"))
- IRWR-00070 — Longest-Running Art Exhibition (Documenta Fifteen)
- IRWR-00071 — Largest Art Gallery by Exhibition Space (The Louvre)
- IRWR-00072 — Best-Selling Art Reproduction (Edvard Munch ("The Scream"))
- IRWR-00073 — Most Snow Figures Built (Akimat of Kamysty District, Kostanay Region)
- IRWR-00074 — Longest-Running Theatrical Production ("The Mousetrap" (Agatha Christie))
- IRWR-00075 — Highest-Grossing Musical ("The Lion King" (Disney))
- IRWR-00076 — Largest Performance Stage (National Centre for the Performing Arts)
- IRWR-00077 — Largest Cast in a Theatrical Production (Ramayana production)
- IRWR-00078 — Most People Dancing Ballet Simultaneously (Buenos Aires ballet mass event)
- IRWR-00081 — Youngest Composer of a Symphony (Eitan Matlis)
- IRWR-00084 — Longest Unscripted Ethnic Music Performance (State Philharmonic Ethno-ensemble "Korkyt")
- IRWR-00088 — Most Expensive Manuscript Sold (Leonardo da Vinci (Codex Leicester))
- IRWR-00090 — Most Published Non-Religious Book ("Quotes from Chairman Mao Zedong" (the "Red Book"))
- IRWR-00091 — Most Translated Book (The Bible)
- IRWR-00092 — Smallest Printed Book (Toppan Printing ("Shiki no Kusabana"))
- IRWR-00094 — Most Expensive Printed Book Sold at Auction (The Bay Psalm Book)
- IRWR-00095 — Oldest Printed Book Held in a Library (Diamond Sutra (British Library copy))
- IRWR-00096 — Longest Single Printed Publication (HarperCollins ("Agatha Christie Collection"))
- IRWR-00098 — Most-Printed Advertising Catalogue (IKEA)
- IRWR-00099 — Fastest Printing Press (Canon Group (Oce JetStream 4300))
- IRWR-00100 — Most Expensive Dress Ever Sold (Marilyn Monroe (dress by Jean Louis))
- IRWR-00101 — Largest Traditional Kazakh Women's Headdress (Gulyaim Akumbayeva (Kimeshek headdress))
- IRWR-00102 — Fastest Haute Couture Collection Produced (Balmain (Olivier Rousteing))
- IRWR-00103 — Longest Wedding Veil (Maria Paraskevopoulou)
- IRWR-00104 — Largest Traditional Kazakh Wedding Headdress (Akmaral Dauylbayeva (Saukele headdress))
- IRWR-00106 — Largest Fashion Show by Model Count (Ajio Luxe (Reliance))
- IRWR-00107 — Most Expensive Wedding Dress (Rene Strauss and Martin Katz)
- IRWR-00109 — Fastest Fast-Fashion Production Cycle (ZARA (Inditex))
- IRWR-00111 — Highest-Altitude Fashion Show (Turkish Airlines)
- IRWR-00112 — Most Expensive Jacket Sold at Auction (Michael Jackson (gold-embroidered jacket))
- IRWR-00114 — Longest Wedding Dress Train (Anne Andrews)
- IRWR-00115 — Most Expensive Handbag (The House of Mouawad)
- IRWR-00116 — Largest Pair of Shoes (Nike Turkey)
- IRWR-00117 — Wedding Dress with the Most Rhinestones (Nina Khan)
- IRWR-00118 — Fastest Sewing Machine (Samsung Textile Tech)
- IRWR-00119 — Largest Rose Bouquet in a Single Basket (ROMANTIK Company (Izbasarova G.))

## economy (18)
- IRWR-00031 — Largest Bank by Total Assets (Industrial and Commercial Bank of China (ICBC))
- IRWR-00032 — Largest Retail Chain by Turnover (Walmart)
- IRWR-00033 — Most Expensive Construction Project (Dubai World Central (Dubai International Airport))
- IRWR-00035 — Largest Company by Employee Count (Walmart)
- IRWR-00041 — Largest Venture Capital Fund (SoftBank Vision Fund 2)
- IRWR-00045 — Largest Annual Wheat Harvest (China (national wheat harvest))
- IRWR-00046 — Largest Annual Corn Harvest (United States (national corn harvest))
- IRWR-00047 — Largest Annual Rice Harvest (India (national rice harvest))
- IRWR-00050 — Largest Milk Production (India (national milk production))
- IRWR-00051 — Largest Tomato Harvest (China (national tomato harvest))
- IRWR-00052 — Largest Peanut Exports (United States (peanut exports))
- IRWR-00054 — Largest Honey Production (China (national honey production))
- IRWR-00055 — Largest Wood Production (United States (timber production))
- IRWR-00056 — Largest Agricultural Tractor Fleet (India (agricultural tractor fleet))
- IRWR-00058 — Largest Cruise Ship (Wonder of the Seas (Royal Caribbean International))
- IRWR-00060 — Largest Oil Tanker by Deadweight (Knock Nevis (formerly Seawise Giant))
- IRWR-00062 — Longest River Cruise Ship (AmaMagna (AmaWaterways))
- IRWR-00064 — Largest Shipyard by Area (Hyundai Heavy Industries)

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
