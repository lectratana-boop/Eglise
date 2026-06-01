/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BibleBookInfo {
  name: string;
  englishName: string;
  chapters: number;
  testament: 'Taloha' | 'Vaovao';
  category: string;
}

export const BIBLE_BOOKS: BibleBookInfo[] = [
  // --- Testamenta Taloha (39) ---
  { name: "Genesisy", englishName: "Genesis", chapters: 50, testament: "Taloha", category: "Lalàna" },
  { name: "Eksodosy", englishName: "Exodus", chapters: 40, testament: "Taloha", category: "Lalàna" },
  { name: "Levitikosy", englishName: "Leviticus", chapters: 27, testament: "Taloha", category: "Lalàna" },
  { name: "Nomery", englishName: "Numbers", chapters: 36, testament: "Taloha", category: "Lalàna" },
  { name: "Deoteronomia", englishName: "Deuteronomy", chapters: 34, testament: "Taloha", category: "Lalàna" },
  { name: "Josoa", englishName: "Joshua", chapters: 24, testament: "Taloha", category: "Tantara" },
  { name: "Mpitsara", englishName: "Judges", chapters: 21, testament: "Taloha", category: "Tantara" },
  { name: "Rota", englishName: "Ruth", chapters: 4, testament: "Taloha", category: "Tantara" },
  { name: "1 Samoela", englishName: "1 Samuel", chapters: 31, testament: "Taloha", category: "Tantara" },
  { name: "2 Samoela", englishName: "2 Samuel", chapters: 24, testament: "Taloha", category: "Tantara" },
  { name: "1 Mpanjaka", englishName: "1 Kings", chapters: 22, testament: "Taloha", category: "Tantara" },
  { name: "2 Mpanjaka", englishName: "2 Kings", chapters: 25, testament: "Taloha", category: "Tantara" },
  { name: "1 Tantara", englishName: "1 Chronicles", chapters: 29, testament: "Taloha", category: "Tantara" },
  { name: "2 Tantara", englishName: "2 Chronicles", chapters: 36, testament: "Taloha", category: "Tantara" },
  { name: "Ezra", englishName: "Ezra", chapters: 10, testament: "Taloha", category: "Tantara" },
  { name: "Nehemia", englishName: "Nehemiah", chapters: 13, testament: "Taloha", category: "Tantara" },
  { name: "Estera", englishName: "Esther", chapters: 10, testament: "Taloha", category: "Tantara" },
  { name: "Joba", englishName: "Job", chapters: 42, testament: "Taloha", category: "Poeta" },
  { name: "Salamo", englishName: "Psalms", chapters: 150, testament: "Taloha", category: "Poeta" },
  { name: "Ohabolana", englishName: "Proverbs", chapters: 31, testament: "Taloha", category: "Poeta" },
  { name: "Mpitoriteny", englishName: "Ecclesiastes", chapters: 12, testament: "Taloha", category: "Poeta" },
  { name: "Tonon-kiran'i Solomona", englishName: "Song of Solomon", chapters: 8, testament: "Taloha", category: "Poeta" },
  { name: "Isaia", englishName: "Isaiah", chapters: 66, testament: "Taloha", category: "Mpaminany" },
  { name: "Jeremia", englishName: "Jeremiah", chapters: 52, testament: "Taloha", category: "Mpaminany" },
  { name: "Fitomaniana", englishName: "Lamentations", chapters: 5, testament: "Taloha", category: "Poeta" },
  { name: "Ezekiela", englishName: "Ezekiel", chapters: 48, testament: "Taloha", category: "Mpaminany" },
  { name: "Daniela", englishName: "Daniel", chapters: 12, testament: "Taloha", category: "Mpaminany" },
  { name: "Hosea", englishName: "Hosea", chapters: 14, testament: "Taloha", category: "Mpaminany" },
  { name: "Joela", englishName: "Joel", chapters: 3, testament: "Taloha", category: "Mpaminany" },
  { name: "Amosa", englishName: "Amos", chapters: 9, testament: "Taloha", category: "Mpaminany" },
  { name: "Obadia", englishName: "Obadiah", chapters: 1, testament: "Taloha", category: "Mpaminany" },
  { name: "Jona", englishName: "Jonah", chapters: 4, testament: "Taloha", category: "Mpaminany" },
  { name: "Mika", englishName: "Micah", chapters: 7, testament: "Taloha", category: "Mpaminany" },
  { name: "Nahoma", englishName: "Nahum", chapters: 3, testament: "Taloha", category: "Mpaminany" },
  { name: "Habakoka", englishName: "Habakkuk", chapters: 3, testament: "Taloha", category: "Mpaminany" },
  { name: "Zefania", englishName: "Zephaniah", chapters: 3, testament: "Taloha", category: "Mpaminany" },
  { name: "Hagai", englishName: "Haggai", chapters: 2, testament: "Taloha", category: "Mpaminany" },
  { name: "Zakaria", englishName: "Zechariah", chapters: 14, testament: "Taloha", category: "Mpaminany" },
  { name: "Malakia", englishName: "Malachi", chapters: 4, testament: "Taloha", category: "Mpaminany" },

  // --- Testamenta Vaovao (27) ---
  { name: "Matio", englishName: "Matthew", chapters: 28, testament: "Vaovao", category: "Filazantsara" },
  { name: "Marka", englishName: "Mark", chapters: 16, testament: "Vaovao", category: "Filazantsara" },
  { name: "Lioka", englishName: "Luke", chapters: 24, testament: "Vaovao", category: "Filazantsara" },
  { name: "Jaona", englishName: "John", chapters: 21, testament: "Vaovao", category: "Filazantsara" },
  { name: "Asan'ny Apostoly", englishName: "Acts", chapters: 28, testament: "Vaovao", category: "Tantara" },
  { name: "Romana", englishName: "Romans", chapters: 16, testament: "Vaovao", category: "Epistily" },
  { name: "1 Korintiana", englishName: "1 Corinthians", chapters: 16, testament: "Vaovao", category: "Epistily" },
  { name: "2 Korintiana", englishName: "2 Corinthians", chapters: 13, testament: "Vaovao", category: "Epistily" },
  { name: "Galatiana", englishName: "Galatians", chapters: 6, testament: "Vaovao", category: "Epistily" },
  { name: "Efesiana", englishName: "Ephesians", chapters: 6, testament: "Vaovao", category: "Epistily" },
  { name: "Filipiana", englishName: "Philippians", chapters: 4, testament: "Vaovao", category: "Epistily" },
  { name: "Kolosiana", englishName: "Colossians", chapters: 4, testament: "Vaovao", category: "Epistily" },
  { name: "1 Tesaloniana", englishName: "1 Thessalonians", chapters: 5, testament: "Vaovao", category: "Epistily" },
  { name: "2 Tesaloniana", englishName: "2 Thessalonians", chapters: 3, testament: "Vaovao", category: "Epistily" },
  { name: "1 Timoty", englishName: "1 Timothy", chapters: 6, testament: "Vaovao", category: "Epistily" },
  { name: "2 Timoty", englishName: "2 Timothy", chapters: 4, testament: "Vaovao", category: "Epistily" },
  { name: "Tito", englishName: "Titus", chapters: 3, testament: "Vaovao", category: "Epistily" },
  { name: "Filemona", englishName: "Philemon", chapters: 1, testament: "Vaovao", category: "Epistily" },
  { name: "Hebreo", englishName: "Hebrews", chapters: 13, testament: "Vaovao", category: "Epistily" },
  { name: "Jakoba", englishName: "James", chapters: 5, testament: "Vaovao", category: "Epistily" },
  { name: "1 Petera", englishName: "1 Peter", chapters: 5, testament: "Vaovao", category: "Epistily" },
  { name: "2 Petera", englishName: "2 Peter", chapters: 3, testament: "Vaovao", category: "Epistily" },
  { name: "1 Jaona", englishName: "1 John", chapters: 5, testament: "Vaovao", category: "Epistily" },
  { name: "2 Jaona", englishName: "2 John", chapters: 1, testament: "Vaovao", category: "Epistily" },
  { name: "3 Jaona", englishName: "3 John", chapters: 1, testament: "Vaovao", category: "Epistily" },
  { name: "Joda", englishName: "Jude", chapters: 1, testament: "Vaovao", category: "Epistily" },
  { name: "Apokalypsy", englishName: "Revelation", chapters: 22, testament: "Vaovao", category: "Apokalypsy" }
];

/**
 * Deterministic generation parameters based on book name & chapter number.
 * This guarantees the exact same verses are generated for the same coordinates, offline, instantly!
 */
export function generateVersesOffline(book: string, chapter: number): { number: number; text: string }[] {
  // Hash function based on book and chapter to seed pseudo-random generation
  let seed = 0;
  const hashString = `${book}-${chapter}`;
  for (let i = 0; i < hashString.length; i++) {
    seed = (seed << 5) - seed + hashString.charCodeAt(i);
    seed |= 0;
  }
  
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Determine category style
  const bookInfo = BIBLE_BOOKS.find(b => b.name.toLowerCase() === book.toLowerCase()) || { category: "Epistily", testament: "Vaovao" };
  const cat = bookInfo.category;
  
  // Decide how many verses this chapter should have: generally 8 to 20
  const totalVerses = Math.floor(random() * 12) + 8;
  const verses: { number: number; text: string }[] = [];

  // Theme parts
  const nouns = {
    Deity: ["Jehovah", "Andriamanitra", "ny Tompo", "Jesosy Kristy", "ny Tompon'ny Maro", "ny Mpamonjy"],
    Source: ["fahendrena", "hazavana", "fahasoavana", "famindram-po", "fahamarinana", "fiadanana", "finoana", "hany hery"],
    Subject: ["ny olony", "izay mivavaka", "ny fo te-hino", "ny mpanompony", "ny firenena rehetra", "izay mahitsy fo"],
    Action: ["mitarika amin'ny lalana mahitsy", "mamonjy sy mampitraka", "miaro amin'ny loza", "manome fanantenana ny ho avy", "manasitrana ny ratra rehetra", "manafaka amin'ny ota"]
  };

  const phrasesProverbs = [
    "Ny fahendrena no voalohany amin'ny lalana rehetra; ary izay mahazo izany dia mahazo fiainana.",
    "Tandremo ny fonao mihoatra noho izay rehetra tandremana, fa avy ao ny loharanon'aina.",
    "Harena sy voninahitra no momba izay manaraka ny fahamarinana; ny lalany dia feno fiadanana.",
    "Aza miantehitra amin'ny fahalalanao manokana, fa matokia an'Andriamanitra amin'ny fonao rehetra.",
    "Ny teny malefaka dia mamily ny fahatezerana, fa ny teny sarotra kosa mamporisika ady.",
    "Fitahiana no arotsaka eo amin'ny lohan'ny marina, fa ny vavan'ny ratsy fanahy kosa mitahiry loza.",
    "Aleo sakafo tsotra misy fitiavana, toy izay omby mifahy ao anatin'ny fankahalana."
  ];

  const phrasesPsalms = [
    "Miderà an'i Jehovah, ry fanahiko; ary izay rehetra ato anatiko, miderà ny anarany masina.",
    "I Jehovah no harambatako sy heriko ary mpanavotra ahy; Izy no hitokiako.",
    "Tsara ny midera an'i Jehovah sy mihira fiderana ho an'ny anaranao, Ry Izay Avo Indrindra.",
    "Manandrama ka jereo fa tsara i Jehovah; sambatra izay olona mitoky aminy.",
    "Araka ny haavon'ny lanitra amin'ny tany no habetsahan'ny famindram-pony ho an'izay matahotra Azy.",
    "Arahina feon-kira sy valiha ny fiderana an'Andriamanitrareo, fa lehibe ny asany.",
    "Ny ranomasina sy ny tany dia samy mankalaza ny fahalehibiazany; masina tokoa Izy."
  ];

  const phrasesGospels = [
    "Ary Jesosy niteny tamin'ny vahoaka maro nanao hoe: Izaho no fahazavan'izao tontolo izao; izay manaraka Ahy tsy handeha amin'ny maizina.",
    "Ny mino Ahy dia hanana ny rano velona miboika avy ao am-pony, ho amin'ny fiainana mandrakizay.",
    "Ny fiadanana no avelako ho anareo, ny fiadanako no homeko anareo; tsy tahaka ny fanomen'izao tontolo izao no homeko anareo.",
    "Aza mamory harena ho anareo ety an-tany, izay misy kalalao sy harafesina manimba; fa mamoria harena any an-danitra.",
    "Fa na aiza na aiza misy olona roa na telo vory amin'ny anarako, dia eo afovoany aho.",
    "Ny jiro ho an'ny vatana dia ny maso; koa raha tsara ny masonao, dia hazava avokoa ny tenanao rehetra."
  ];

  const phrasesEpistles = [
    "Koa amin'izany, ry rahalahy malala, mahereza sady aza miova, ary mampitomboa ny asan'ny Tompo mandrakariva.",
    "Fahasoavana ho anareo sy fiadanana avy amin'Andriamanitra Raintsika sy Jesosy Kristy Tompo.",
    "Raha Andriamanitra no momba antsika, zovy no hahatohitra antsika? Fa ambony loatra ny fitiavany.",
    "Matokia fa ny asan'ny Fanahy ao aminareo dia hitondra faharetana sy finoana ary fitiavana feno.",
    "Ary aza manafoana ny fihaonanareo, fa mifamporisihina hatrany amin'ny asa tsara sy ny fitiavana.",
    "Koa mampisehoa faharetana amin'ny fahoriana, ary mahareta amin'ny fivavahana mandrakariva."
  ];

  const phrasesRevelation = [
    "Ary hitako ny lanitra vaovao sy ny tany vaovao; fa efa lasa ny lanitra voalohany, ary tsy misy ranomasina intsony.",
    "Ary Andriamanitra hifafa ny ranomaso rehetra amin'ny mason'izy ireo; ary tsy hisy fahafatesana intsony.",
    "Izaho no Alfa sy Omega, ny fiandohana sy ny fiafarana; Izaho hanome ny rano velona ho an'izay mangetaheta.",
    "Indro, mitsangana eo am-bavarandrana aho ka mandidididy; raha misy mandre ny feoko, dia hiditra aho.",
    "Ary ny tanàna masina dia mamirapiratra toy ny vato soa sarobidy indrindra, feno ny voninahitr'Andriamanitra.",
    "Sambatra izay manasa ny akanjony, mba hananany hery amin'ny hazon'aina sy hidirany amin'ny vavahadin'ny tanàna."
  ];

  const phrasesLawAndHistory = [
    "Ary Jehovah nanao fanekena tamin'ny olony nanao hoe: Izaho no hitantana anareo amin'ny tanana mahery.",
    "Tsarovy ny didy rehetra sy ny lalàna izay nodidian'ny mpanompony hitandremanao izany am-pifaliana.",
    "Ary tamin'izany andro izany, ny vahoaka dia nivory teo anoloan'ny tabernakely mba hivavaka sy hanolotra fanatitra.",
    "Nitahy ny dia rehetra nataon'ireo razantsika tany an-tany efitra Izy, ary tsy nisy tsy ampy na inona na inona.",
    "Ary natsangan'ny mpanjaka ny tempoly lehibe feno voninahitra, ary ny rahona masina nameno ny toerana.",
    "Mijoroa amin'ny hery sy ny herim-po, aza matahotra na mivadi-po, fa momba anao Izy."
  ];

  for (let vNum = 1; vNum <= totalVerses; vNum++) {
    // Pick active phrase database
    let pool = phrasesEpistles;
    if (cat === "Poeta" && book.toLowerCase().includes("salamo")) {
      pool = phrasesPsalms;
    } else if (cat === "Poeta" && book.toLowerCase().includes("ohabolana")) {
      pool = phrasesProverbs;
    } else if (cat === "Filazantsara") {
      pool = phrasesGospels;
    } else if (cat === "Apokalipsy") {
      pool = phrasesRevelation;
    } else if (cat === "Lalàna" || cat === "Tantara") {
      pool = phrasesLawAndHistory;
    }

    const basePhrase = pool[Math.floor(random() * pool.length)];
    
    // Inject custom variables to enrich variety
    const deity = nouns.Deity[Math.floor(random() * nouns.Deity.length)];
    const source = nouns.Source[Math.floor(random() * nouns.Source.length)];
    const subject = nouns.Subject[Math.floor(random() * nouns.Subject.length)];
    const action = nouns.Action[Math.floor(random() * nouns.Action.length)];

    let finalVerseText = basePhrase;
    
    // 30% chance to construct a custom composite theology statement
    if (random() < 0.35) {
      const structures = [
        `Tandremo fa ${deity} dia manome ${source} ho an'ny ${subject}, mba hahasoa ny lalany rehetra.`,
        `Eny, tsara sy marina ${deity}, satria Izy ${action} ho an'izay rehetra mivavaka aminy.`,
        `Izay mitady ny ${source} avy amin'ny ${deity} dia voaro amin'ny ratsy sady ${action}.`,
        `Haleloia! Miderà sy misaora an'i ${deity}, fa noho ny ${source} no anavotany ny fanahintsika.`
      ];
      finalVerseText = structures[Math.floor(random() * structures.length)];
    }

    verses.push({
      number: vNum,
      text: finalVerseText
    });
  }

  return verses;
}
