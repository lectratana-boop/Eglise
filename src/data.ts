/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Church, Member, Announcement, ChurchEvent, Sermon, Donation, Song, QuizQuestion, BibleChapter } from './types';

export const INITIAL_CHURCHES: Church[] = [
  {
    id: "fjkm-isotry",
    name: "FJKM Isotry Fitiavana",
    type: "FJKM",
    location: "Isotry, Antananarivo",
    logo: "cross",
    description: "Fiangonana Jesosy Kristy eto Madagasikara ao Isotry Fitiavana. Tempoly feno fitiavana ary manambara ny Vaovao Mahafaly ho an'ny olona rehetra."
  },
  {
    id: "ekar-antanimena",
    name: "EKAR Antanimena",
    type: "EKAR",
    location: "Antanimena, Antananarivo",
    logo: "dove",
    description: "Eglizy Katolika Apostolika Romana - Paroasy Masina Maria mpanjakavavin'ny lanitra, Antanimena. Toeram-pivoriana sy fandalinana ny finoana katolika."
  },
  {
    id: "flm-ambatovinaky",
    name: "FLM Ambatovinaky",
    type: "FLM",
    location: "Ambatovinaky, Antananarivo",
    logo: "bible",
    description: "Fiangonana Loterana Malagasy - Katedraly Ambatovinaky. Renivohitry ny tantara sy ny finoana loterana eto Madagasikara, mitory ny fahamarinana."
  }
];

export const INITIAL_MEMBERS: Member[] = [
  // FJKM Isotry Fitiavana members
  { id: "m1", churchId: "fjkm-isotry", name: "Andry Rakotomalala", phone: "034 12 345 67", address: "Isotry II G 12", role: "Loholona" },
  { id: "m2", churchId: "fjkm-isotry", name: "Miora Rasoarilalao", phone: "032 98 765 43", address: "67Ha Atsimo III Y 3", role: "Diakra" },
  { id: "m3", churchId: "fjkm-isotry", name: "Jean Razafindrabe", phone: "033 45 678 90", address: "Ampefiloha Block 5", role: "Mpitahiry vola" },
  { id: "m4", churchId: "fjkm-isotry", name: "Soa Rabetafika", phone: "034 56 789 12", address: "Anosy, ruelle 2", role: "Mpihira (Chorale)" },
  
  // EKAR Antanimena members
  { id: "m5", churchId: "ekar-antanimena", name: "Faly Randriamanantena", phone: "034 99 222 11", address: "Antanimena, Villa Rose", role: "Pretra / Katekista" },
  { id: "m6", churchId: "ekar-antanimena", name: "Landry Rakotoarison", phone: "033 77 111 33", address: "Ankorondrano Est", role: "Mpikambana Tanora" },
  { id: "m7", churchId: "ekar-antanimena", name: "Chantal Rasoanaivo", phone: "032 44 888 99", address: "Ivandry, rihana 2", role: "Komitin'ny mpiantoka" },

  // FLM Ambatovinaky members
  { id: "m8", churchId: "flm-ambatovinaky", name: "Pastor Michel Rabenandrasana", phone: "034 55 444 33", address: "Ambatovinaky, Villa Finoana", role: "Mpitandrina" },
  { id: "m9", churchId: "flm-ambatovinaky", name: "Nirina Randria", phone: "033 11 999 88", address: "Faravohitra ambony", role: "Lehiben'ny Chorale" },
  { id: "m10", churchId: "flm-ambatovinaky", name: "Harijaona Lala", phone: "032 11 222 34", address: "Ambohijatovo Atsinanana", role: "Tsotra" }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  // FJKM Isotry Fitiavana
  {
    id: "a1",
    churchId: "fjkm-isotry",
    title: "Fivorian'ny Diakra sy Loholona",
    date: "2026-06-03",
    category: "fivoriana",
    content: "Ampandrenesina ny vahoaka andriamanitra fa hisy fivoriana maika ho an'ny Diakra sy Loholona rehetra ny Alahady izao aorian meva ny fanompoam-pivavahana. Handinihana ny asa fanamboarana ny tempoly."
  },
  {
    id: "a2",
    churchId: "fjkm-isotry",
    title: "Hetsika fitoriana filantsara lehibe",
    date: "2026-06-14",
    category: "hetsika",
    content: "Hetsika lehibe any Mahamasina hitondrana am-bavaka ny firenena sy hitoriana ny tenin'Andriamanitra. Asaina ny rehetra ho tonga maro amin'ny 2 ora tolakandro."
  },
  {
    id: "a3",
    churchId: "fjkm-isotry",
    title: "Drafitra fiasana vaovao",
    date: "2026-05-28",
    category: "hafa",
    content: "Navoaka ny boky kely fandaharam-potoana any amin'ny isam-pianakaviana indray amin'ity taona ity. Azonao sintonina amin'ny birao izany."
  },

  // EKAR Antanimena
  {
    id: "a4",
    churchId: "ekar-antanimena",
    title: "Fankalazana ny Pentekosta sy Kiobana",
    date: "2026-05-24",
    category: "hetsika",
    content: "Misaotra ny mpino rehetra nandray anjara tamin'ny fety masina. Mbola mitohy ny asan'ny Fanahy Masina ao amintsika ary hisy ny lamesa manokana hisaorana an'Andriamanitra."
  },
  {
    id: "a5",
    churchId: "ekar-antanimena",
    title: "Katolika Action - Vavaka Iombonana",
    date: "2026-06-05",
    category: "fivoriana",
    content: "Vavaka iombonana isaky ny Zoma amin'ny 6 ora hariva ho an'ny fikambanan'ny tanora Katolika rehetra eto amin'ny paroasy. Tongava maro!"
  }
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: "ev1",
    churchId: "fjkm-isotry",
    title: "Fivoriana Alahady (Kulto Lehibe)",
    date: "2026-06-07",
    time: "08:00 - 11:30",
    location: "Tempoly lehibe Isotry",
    description: "Kulto lehibe handraisana ny fanasan'ny Tompo sy ny batisa. Mpitandrina no hitarika ary ny Chorale fahatelo no hihira."
  },
  {
    id: "ev2",
    churchId: "fjkm-isotry",
    title: "Vavaka sy Fiofanana Tanora",
    date: "2026-06-13",
    time: "14:00 - 16:30",
    location: "Trano Fihaonana faha-2",
    description: "Fotoana manokana ho an'ny tanora rehetra handinihana ny Fanambidian'ny fiainana kristiana ankehitriny."
  },
  {
    id: "ev3",
    churchId: "ekar-antanimena",
    title: "Lamesa Alahady Lehibe",
    date: "2026-06-07",
    time: "06:30 - 08:30",
    location: "Fiangonana Masina",
    description: "Lamesa voalohany amin'ny Alahady maraina. Hira avy amin'ny chorale Saint Michel."
  },
  {
    id: "ev4",
    churchId: "flm-ambatovinaky",
    title: "Fampianarana Katolika / Batisa lehibe",
    date: "2026-06-14",
    time: "09:00 - 11:15",
    location: "Katedraly Ambatovinaky",
    description: "Batisa ho an'ny zaza madinika sy fanekem-pinoana ofisialy ho an'ny olon-dehibe."
  }
];

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: "s1",
    churchId: "fjkm-isotry",
    title: "Mandeha amin'ny finoana fa tsy amin'ny fijerena",
    preacher: "Mpitandrina Andrianina Rajaona",
    date: "2026-05-24",
    type: "video",
    duration: "45 mn 12 s",
    url: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "s2",
    churchId: "fjkm-isotry",
    title: "Andriamanitra mahay mitarika antsika hatrany",
    preacher: "Past. Andry",
    date: "2026-05-17",
    type: "audio",
    duration: "32 mn 45 s",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "s3",
    churchId: "ekar-antanimena",
    title: "Ny herin'ny vavaka manetry tena",
    preacher: "Pretra Jean Marc",
    date: "2026-05-10",
    type: "audio",
    duration: "25 mn 08 s",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "s4",
    churchId: "flm-ambatovinaky",
    title: "Fahasoavana famonjena maimaimpoana",
    preacher: "Pastor Michel Rabenandrasana",
    date: "2026-05-31",
    type: "video",
    duration: "38 mn 40 s",
    url: "https://www.w3schools.com/html/movie.mp4"
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  { id: "d1", churchId: "fjkm-isotry", type: "Dimy", amount: 50000, date: "2026-05-24", donor: "Fianakaviana Rakoto", method: "MVola" },
  { id: "d2", churchId: "fjkm-isotry", type: "Fanatitra", amount: 20000, date: "2026-05-24", donor: "Tsy fantatra anarana", method: "Volan-tanana" },
  { id: "d3", churchId: "fjkm-isotry", type: "Fanampiny", amount: 100000, date: "2026-05-20", donor: "Andry Rabenja", method: "Orange Money" },
  { id: "d4", churchId: "ekar-antanimena", type: "Dimy", amount: 150000, date: "2026-05-25", donor: "Jean de Dieu", method: "Airtel Money" }
];

export const SONGS: Song[] = [
  {
    id: "sg1",
    number: 1,
    title: "Misaora an'i Jehovah ry fanahiko",
    lyrics: `Misaora an'i Jehovah, ry fanahiko,
Ary izay rehetra ato anatiko, misaora ny anarany masina.
Misaora an'i Jehovah, ry fanahiko,
Ary aza manadino ny fitondrany tsara rehetra.

Izy no mamela ny helokao rehetra,
Ary manasitrana ny aretinao rehetra,
Izy no manavotra ny ainao tsy hidina any an-davaka,
Ary manarona anao fitiavana sy famindram-po.

Misaora an'izay mahay mamono ny hetahetanao,
Ka tonga tanora indray ianao toy ny voromahery.
Fa masina sy be indrafo i Jehovah,
Mahari-po sady be famindram-po tokoa.`,
    category: "Fiderana"
  },
  {
    id: "sg2",
    number: 23,
    title: "Andriamanitra no mpiandry ahy",
    lyrics: `Jehovah no mpiandry ahy, tsy hanan-javaha-manantena aho.
Mampandry ahy any amin'ny ahi-maitso Izy;
Mitondra ahy eo amin'ny rano mangina Izy.
Mamelombelona ny fanahiko Izy re;

Mitari-dalana ahy amin'ny lalan'ny fahamarinana,
Noho ny anarany masina be voninahitra.
Na dia mandeha namakivaky ny lohasaha maizina aza aho,
Tsy hatahotra ny loza na inona na inona aho.

Fa Ianao no miaraka amiko hatrany;
Ny tsorakazoo sy ny tehinao no mampionona ahy.
Manomana latabatra eo anoloako Ianao,
Manosotra diloilo ny lohako, ka feno ny kapoakako.`,
    category: "Pinoana"
  },
  {
    id: "sg3",
    number: 104,
    title: "Satrohinao famonjena ny foko",
    lyrics: `Satrohinao famonjena ny foko, ry Jesosy tia,
Fony mbola mania teny an-dalana aho.
Ny feonao mamy no niantso sy nitaona ahy:
"Avia, ry mpanota, jereo ny ràn'ny hazo fijaliana!"

Fivononana, fitiavana lehibe,
No nasehonao teo an-tampon'i Kalvary!
Hira fiderana no atolotro Anao,
Ry Mpamonjy malala, be fitiavana.

Mankalaza Anao ny vavanay ankehitriny,
Efa afaka tokoa ny fatoran'ny ota rehetra.
Handeha am-pifaliana hanaraka Anao,
Mandra-pahatonga any an-danitra any.`,
    category: "Vavaka"
  },
  {
    id: "sg4",
    number: 112,
    title: "Ray malala, jereo ireto zanakao",
    lyrics: `Ray malala ô, jereo ireto zanakao tafangona eto ankehitriny.
Mitalaho ny fahasoavanao izahay mianakavy.
Mampidina ny Fanahinao Masina ao am-ponay,
Mba hanazava sy hitarika anay amin'ny lalanao.

Aza avela ho very amin'izao tontolo izao izahay,
Fa hereno ny finoanay rehefa reraka izahay.
Ny fitiavanao tsy manam-pahefana no aro,
Mandra-pandresy anay ny adin'ny fiainana.`,
    category: "Fifandraisana"
  }
];

export const BIBLE_DATA: BibleChapter[] = [
  {
    book: "Genesisy",
    chapter: 1,
    verses: [
      { number: 1, text: "Tamin'ny voalohany Andriamanitra nahary ny lanitra sy ny tany." },
      { number: 2, text: "Ary ny tany dia tsy nisy endrika sady foana; ary ny aizina dia teo ambonin'ny lalina; ary ny Fanahin'Andriamanitra nanidintsidina teo ambonin'ny rano." },
      { number: 3, text: "Ary Andriamanitra nanao hoe: Hahazava; dia nisy mazava." },
      { number: 4, text: "Ary hitan'Andriamanitra ny mazava fa tsara; ary nampisarahin'Andriamanitra ny mazava sy ny aizina." },
      { number: 5, text: "Ary Andriamanitra nanao ny mazava hoe Andro, ary ny aizina nataony hoe Alina. Dia nisy hariva, ary nisy maraina, andro voalohany izany." },
      { number: 6, text: "Ary Andriamanitra nanao hoe: Hisy habakabaka eo anelanelan'ny rano, mba hampisaka ny rano amin'ny rano." },
      { number: 7, text: "Dia nataon'Andriamanitra ny habakabaka, ka nampisarahiny ny rano ambanin'ny habakabaka sy ny rano ambonin'ny habakabaka. Dia nisy izany." },
      { number: 8, text: "Nantsoin'Andriamanitra hoe Lanitra ny habakabaka. Dia nisy hariva, ary nisy maraina, andro faharoa izany." }
    ]
  },
  {
    book: "Salamo",
    chapter: 23,
    verses: [
      { number: 1, text: "Jehovah no Mpiandry ahy; Tsy hanan-java-mahory aho." },
      { number: 2, text: "Mampandry ahy any amin'ny ahi-maitso Izy; Mitondra ahy eo amin'ny rano mangina Izy." },
      { number: 3, text: "Mamelombelona ny fanahiko Izy; Mitondra ahy amin'ny lalan'ny fahamarinana noho ny anarany." },
      { number: 4, text: "Na dia mandeha mamaky ny lohasaha aloky ny fahafatesana aza aho, dia tsy hatahotra ny loza rehetra, fa Ianao no miaraka amiko; Ny tsorakazoo sy ny tehinao, ireo no mampionona ahy." },
      { number: 5, text: "Manomana latabatra eo anoloako eo imason'ny fahavaloko Ianao; Manosotra diloilo ny lohako Ianao; Safononoka ny kapoakako." },
      { number: 6, text: "Eny, fahasoavana sy famindram-po no hanaraka ahy amin'ny andro rehetra hiainako; Dia hitoetra ao an-tranon'i Jehovah andro maro aho." }
    ]
  },
  {
    book: "Ohabolana",
    chapter: 3,
    verses: [
      { number: 5, text: "Matokia an'i Jehovah amin'ny fonao rehetra, fa aza miantehitra amin'ny fahalalanao." },
      { number: 6, text: "Maneke Azy amin'ny alehanao rehetra, fa Izy handamina ny lalanao." },
      { number: 7, text: "Aza manao anao ho hendry, fa matahafa an'i Jehovah ka mialà amin'ny ratsy." },
      { number: 8, text: "Dia ho fahasalamana ho an'ny nofonao izany ary ho famelombelomana ny taolanao." }
    ]
  },
  {
    book: "Jaona",
    chapter: 3,
    verses: [
      { number: 16, text: "Fa toy izao no nitiavan'Andriamanitra izao tontolo izao: nomeny ny Zanany Lahitokana, mba tsy ho very izay rehetra mino Azy, fa hanana fiainana mandrakizay." },
      { number: 17, text: "Fa Andriamanitra tsy naniraka ny Zanaka ho amin'izao tontolo izao hanameloka izao tontolo izao, fa mba hamonjena izao tontolo izao amin'ny alalany." }
    ]
  },
  {
    book: "Romanina",
    chapter: 8,
    verses: [
      { number: 28, text: "Ary fantatsika fa ny zavatra rehetra dia miara-miasa hahasoa izay tia an'Andriamanitra, dia izay voantso araka ny fikasany sahady." },
      { number: 31, text: "Inona ary no holazaintsika ny amin'izany zavatra izany? Raha Andriamanitra no momba antsika, iza no hahatohitra antsika?" },
      { number: 38, text: "Fa matoky aho fa na fahafatesana, na fiainana, na anjely, na hery ara-panahy, na ny ankehitriny, na ny ho avy, na ny any ambony, na ny any ambany," },
      { number: 39, text: "na zava-boahary hafa rehetra, dia tsy hahasaraka antsika amin'ny fitiavan'Andriamanitra izay ao amin'i Kristy Jesosy Tompontsika." }
    ]
  },
  {
    book: "Filipiana",
    chapter: 4,
    verses: [
      { number: 4, text: "Mifalia amin'ny Tompo mandrakariva; hoy izaho indray: Mifalia!" },
      { number: 13, text: "Mahay ny zavatra rehetra aho ao amin'Ilay mampahery ahy." },
      { number: 19, text: "Ary ny Andriamanitro hanefa izay rehetra ilainareo araka ny haren'ny voninahiny ao amin'i Kristy Jesosy." }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Iza no nitarika ny zanak'Israely nivoaka avy tany Egypta teo ambany fitarihan'Andriamanitra?",
    options: ["Mose (Moyse)", "Josoa (Josué)", "Davida (David)", "Abrahama (Abraham)"],
    answerIndex: 0,
    explanation: "I Mose no voafidin'Andriamanitra nitarika ny vahoaka nivoaka ny tany Egypta sy namaky ny ranomasina Mena."
  },
  {
    id: "q2",
    question: "Firy ny isan'ny boky ao amin'ny Testamenta Vaovao ao amin'ny Baiboly Protestanta sy Katolika?",
    options: ["12 boky", "27 boky", "39 boky", "66 boky"],
    answerIndex: 1,
    explanation: "Misy boky 27 ao amin'ny Testamenta Vaovao, manomboka amin'ny Filazantsara araka an'i Matio ka hatramin'ny Apokalypsy."
  },
  {
    id: "q3",
    question: "Taiza no toerana nahaterahan'i Jesosy Mpamonjy?",
    options: ["Betlehema (Bethléem)", "Nazareta (Nazareth)", "Jerosalema (Jérusalem)", "Ambohimanga"],
    answerIndex: 0,
    explanation: "Teraka tao Betlehema i Jesosy, araka ny faminaniana voalaza ao amin'ny bokin'i Mika Mpaminany."
  },
  {
    id: "q4",
    question: "Inona no dikan'ny anarana hoe 'Emanuel' izay voalaza ao amin'ny bokin'i Isaia sy Matio?",
    options: [
      "Andriamanitra momba antsika",
      "Andriamanitra be famindram-po",
      "Mpamonjy izao tontolo izao",
      "Mpiandry ondry tsara"
    ],
    answerIndex: 0,
    explanation: "Avy amin'ny teny hebreo hoe 'Immanuel', ny dikan'izany dia 'Andriamanitra homba antsika' (Andriamanitra momba antsika)."
  },
  {
    id: "q5",
    question: "Iza tamin'ireto no natsipy tao amin'ny lavaka feno liona nefa narovan'ny anjelin'Andriamanitra?",
    options: ["Daniela (Daniel)", "Samsona (Samson)", "Jona (Jonas)", "Davida (David)"],
    answerIndex: 0,
    explanation: "Natsipy tao an-davaka feno liona i Daniela noho ny fivavahany tamin'Andriamanitra, saingy nanampi-bava ny liona ny anjely."
  }
];
