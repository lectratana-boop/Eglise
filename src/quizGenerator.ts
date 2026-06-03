/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

// Rich data pool for Easy level
const EASY_PEOPLE_ACTS = [
  { name: "Noa", act: "nanamboatra ny Sambo fiara mba hamonjena ny fianakaviany tamin'ny safodrano", fact: "Hita ao amin'ny Genesisy 6 ity tantara ity." },
  { name: "Davida", act: "nandresy ilay goavambe Goliat tamin'ny vato kely iray monja", fact: "Hita ao amin'ny 1 Samoela 17 ny tantaran'i Davida sy Goliat." },
  { name: "Mosesy", act: "nitondra ny Zanak'i Israely nivoaka avy tany Ejipta sy namaky ny Ranomasina Mena", fact: "Hita ao amin'ny bokin'ny Eksodosy izany." },
  { name: "Daniela", act: "nalatsaka tany an-davaky ny liona nefa tsy nampaninona azy", fact: "Andriamanitra naniraka ny anjeliny nanakombona ny vavan'ny liona (Daniela 6)." },
  { name: "Jona", act: "natelin'ny hazandrano lehibe iray rehefa nandositra ny antson'Andriamanitra", fact: "Nijanona 3 andro sy 3 alina tao an-kibon'ny hazandrano izy." },
  { name: "Solomona", act: "nahazo fahendrena lehibe indrindra avy tamin'Andriamanitra", fact: "Mpanjaka nanorina ny Tempoly voalohany teo Jerosalema izy." },
  { name: "Abrahama", act: "antsoina koa hoe Rain'ny Finoana ary nampanantenana hiteraka firenena lehibe", fact: "Andriamanitra nampanantena fa ho maro toy ny kintana ny taranany." },
  { name: "Jiosy", act: "nanolotra mofo dimy sy hazandrano roa ho an'i Jesosy hamahanana ny vahoaka", fact: "Vahoaka mihoatra ny 5.000 no nihinam-be ka nisy ambiny aza." },
  { name: "Samsona", act: "lehilahy natanjaka indrindra teo amin'ny tantaran'ny Baiboly tamin'ny alalan'ny volony", fact: "Ny heriny dia avy amin'ny voadin'ny Nazirita." },
  { name: "Eva", act: "vehivavy voalohany noforonin'Andriamanitra ho namana ho an'i Adama", fact: "Noforonina avy amin'ny taolan-tehezan'i Adama (Genesisy 2)." },
  { name: "Zakao", act: "lehilahy fohy feno zotrom-po nihanika tamina hazo syzygy (sek沟通) mba hahita an'i Jesosy", fact: "Mpampitombo hetra nibebaka izy rehefa nandalovan'i Jesosy." },
  { name: "Laza", act: "naman'i Jesosy izay natsangany tamin'ny maty rehefa nilevina 4 andro", fact: "Rahalahin'i Marta sy Maria tao Betania izy." },
  { name: "Joda Iskariota", act: "mpianatr'i Jesosy namadika Azy tamin'ny volafotsy telopolo", fact: "Namadika an'i Jesosy tamin'ny alalan'ny fanorohana izy." },
  { name: "Petera", act: "mpanjono lasa mpianatra mpanaradia an'i Jesosy voalohany indrindra", fact: "Nantsoina koa hoe mpanjono olona." },
  { name: "Paoly", act: "nanoratra epistily maro tamin'ny Testamenta Vaovao rehefa niova fo teny an-dalana mankany Damaskosy", fact: "Nantsoina hoe Saoly izy talohan'ny niovany fo." }
];

const EASY_TESTAMENTS = [
  { book: "Genesisy", testament: "Testamenta Taloha" },
  { book: "Eksodosy", testament: "Testamenta Taloha" },
  { book: "Salamo", testament: "Testamenta Taloha" },
  { book: "Isaia", testament: "Testamenta Taloha" },
  { book: "Matio", testament: "Testamenta Vaovao" },
  { book: "Marka", testament: "Testamenta Vaovao" },
  { book: "Lioka", testament: "Testamenta Vaovao" },
  { book: "Jaona", testament: "Testamenta Vaovao" },
  { book: "Asan'ny Apostoly", testament: "Testamenta Vaovao" },
  { book: "Apokalipsy", testament: "Testamenta Vaovao" },
  { book: "Romanina", testament: "Testamenta Vaovao" },
  { book: "Hebreo", testament: "Testamenta Vaovao" }
];

const VERSES_FILL = [
  { verse: "Andriamanitra dia ...", answer: "Fitiavana", options: ["Hery", "Nihomehy", "Fitiavana", "Rivotra"], text: "1 Jaona 4:8: 'Izay tsy tia dia tsy mahalala an'Andriamanitra; fa Andriamanitra dia fitiavana.'" },
  { verse: "Ny Tompo no mpiandry ahy, tsy hanan-javatra ... aho.", answer: "hahatrotraka", options: ["hampanahy", "hovery", "hahatrotraka", "hahonena"], text: "Salamo 23:1: 'Jehovah no mpiandry ahy, tsy hanan-javatra handrasana aho (tsy hanan-javatra hahavotsotra / hahatrotraka / handrasana).'" },
  { verse: "Matokia an'i Jehovah amin'ny ... fonao rehetra.", answer: "fonao", options: ["fonao", "herinao", "sainao", "vola"], text: "Ohabolana 3:5: 'Matokia an'i Jehovah amin'ny fonao rehetra, fa aza miantehitra amin'ny fahalalanao.'" },
  { verse: "Fa toy izao no nitiavan'Andriamanitra izao tontolo izao: nomeny ny ... Lahitokana", answer: "Zanany", options: ["Anjeliny", "Mpaminaniny", "Zanany", "Sambo"], text: "Jaona 3:16 izay andinin-teny malaza indrindra." },
  { verse: "Izaho no Lalana sy ... ary Fiainana", answer: "Fahamarinana", options: ["Hery", "Lalàna", "Fahamarinana", "Fahendrena"], text: "Jaona 14:6: 'Izaho no lalana sy fahamarinana ary fiainana; tsy misy olona mankany amin'ny Ray, afa-tsy amin'ny alalako.'" }
];

// Medium level rich facts
const MEDIUM_FACTS = [
  { q: "Iza no mpaminany nampakarin'Andriamanitra tamin'ny kalesy afo?", a: "Elia", opts: ["Elisa", "Elia", "Isaia", "Jeremia"], exp: "Nalaina tamin'ny kalesy afo sy soavaly afo Elia (2 Mpanjaka 2)." },
  { q: "Iza no vadin'i Abrahama niteraka an'i Isaka tamin'ny fahanterany?", a: "Saraha", opts: ["Hagara", "Saraha", "Rebeka", "Rahely"], exp: "Niteraka an'i Isaka tamin'ny fahazazany/fahanterany Saraha tamin'ny faha-90 taonany." },
  { q: "Inona no anaran'ilay vehivavy Moabita izay lasa reniben'i Davida Mpanjaka?", a: "Rota", opts: ["Orpa", "Rota", "Estera", "Debora"], exp: "Rota dia vinantovavin'i Naomy izay nanambady an'i Boaza." },
  { q: "Iza no mpanjaka voalohany teo amin'ny tantaran'i Israely?", a: "Saoly", opts: ["Davida", "Solomona", "Saoly", "Rehoboama"], exp: "Samoela mpaminany no nanosotra an'i Saoly ho mpanjaka voalohany (1 Samoela 10)." },
  { q: "Firy andro no nanjakan'i Jesosy tany an-tany efitra alohan'ny hakamfanana Azia?", a: "40 andro", opts: ["7 andro", "12 andro", "30 andro", "40 andro"], exp: "Nifady hanina 40 andro sy 40 alina Jesosy (Matio 4)." },
  { q: "Iza no mpianatr'i Jesosy nahita ny fahitana mampatahotra tany amin'ny nosy Patmo?", a: "Jaona", opts: ["Petera", "Paoly", "Jaona", "Taka"], exp: "Jaona no nanoratra ny bokin'ny Apokalipsy tany Patmo." },
  { q: "Iza no lehilahy nanana ny akanjo marevaka maro loko nomen'ny rainy ary nafon'ny rahalahiny?", a: "Josefa", opts: ["Benjamina", "Josefa", "Jakoba", "Esao"], exp: "Tian'i Jakoba mihoatra ny rahalahiny rehetra Josefa ka nomeny akanjo maro loko." },
  { q: "Inona ilay tendrombohitra nanomezan'Andriamanitra ny didy folo ho an'i Mosesy?", a: "Sinai", opts: ["Sinai", "Ararata", "Hermona", "Karmela"], exp: "Nandray ny didy folo teo amin'ny Tendrombohitra Sinai Mosesy (Eksodosy 19-20)." },
  { q: "Iza no mpitsara vehivavy sady mpaminanivavy nampianatra ny vahoaka teo ambany hazo rofia?", a: "Debora", opts: ["Jael", "Debora", "Miriama", "Anany"], exp: "Hita ao amin'ny bokin'ny Mpitsara toko faha-4 izany." },
  { q: "Inona no tena dikan'ny anarana hoe 'Emanuela'?", a: "Amintsika Andriamanitra", opts: ["Mpamponjy antsika", "Amintsika Andriamanitra", "Fanahy Masina", "Fandresena"], exp: "Emanuela dia midika hoe 'Amintsika Andriamanitra' (Matio 1:23)." }
];

// Hard level rich facts
const HARD_FACTS = [
  { q: "Iza no tena anaran'andriamanitra resahin'ny soratra hebreo hoe Melkizedeka?", a: "Mpanjakan'i Salema", opts: ["Mpanjakan'i Ejipta", "Mpanjakan'i Salema", "Mpanjakan'i joda", "Mpitari-tafika"], exp: "Melkizedeka dia midika hoe 'Mpanjakan'ny fahamarinana' ary mpanjakan'i Salema izy (Hebreo 7)." },
  { q: "Iza no rain'i Metosela, ilay lehilahy velona ela indrindra (969 taona)?", a: "Enoka", opts: ["Adama", "Seta", "Enoka", "Noa"], exp: "Andriamanitra nampaka an'i Enoka hovelona any an-danitra nefa niteraka an'i Metosela aloha izy." },
  { q: "Firy indrindra ny isan'ny dity sy didy voarakitra ao anatin'ny Torah jiosy manontolo?", a: "613", opts: ["10", "365", "613", "1000"], exp: "Lalàna 613 (Mitzvot) no tantanan'ny mpanora-dalàna ao amin'ny lalàn'i Mosesy." },
  { q: "Iza no vadin'i Hosea mpaminany izay nadidiana hovadina tamin'ny vehivavy janga?", a: "Gomera", opts: ["Abigaila", "Gomera", "Penina", "Zilpa"], exp: "Gomera zanak'i Diblaima no nanambady an'i Hosea ho tandindon'ny fivadihan'i Israely (Hosea 1)." },
  { q: "Inona ny anaran'ilay mpanjaka tany Babilona nahita ny soratra teo amin'ny rindrina tamin'ny fanasana?", a: "Belsasara", opts: ["Nebokadnezara", "Belsasara", "Daria", "Kirosy"], exp: "Nahita ny tanan'olona nanoratra hoe 'Mene, Mene, Tekel, Upharsin' Belsasara (Daniela 5)." },
  { q: "Iza no anaran'ilay jeneraly jiosy nampianarin'i Debora hiady nefa tsy nety raha tsy nandeha Debora?", a: "Baraka", opts: ["Gideona", "Baraka", "Jefta", "Samsona"], exp: "Baraka dia niara-niakatra tamin'i Debora hanohitra an'i Sisera (Mpitsara 4)." },
  { q: "Iza no lehilahy nanan-karena indrindra tany amin'ny tany Oza izay niharan'ny fakam-panahy goavana?", a: "Joba", opts: ["Abrahama", "Solomona", "Joba", "Lot"], exp: "Ilay mpanompon'Andriamanitra be faharetana indrindra (Joba 1)." },
  { q: "Aiza ao anatin'ny Baiboly no ahitana ilay andininy fohy indrindra hoe: 'Jesosy nitomany'?", a: "Jaona 11:35", opts: ["Jaona 11:35", "Matio 26:30", "Lioka 19:41", "Marka 1:1"], exp: "Jaona 11:35 rehefa maty i Laza sakaizany." },
  { q: "Iza tamin'ireto no zanak'i Jakoba voalohany indrindra terak'i Lea?", a: "Robena", opts: ["Robena", "Simeona", "Josefa", "Benjamina"], exp: "Robena no lahimatoan'i Jakoba sady zanak'i Lea voalohany (Genesisy 29)." },
  { q: "Iza no mpanjaka nanapaka an'i Joda nandritra ny 55 taona, ela indrindra nefa nanao meloka indrindra talohan'ny hibebahany?", a: "Manase", opts: ["Hezekia", "Manase", "Josia", "Ahabo"], exp: "Nanjaka 55 taona tao Jerosalema Manase (2 Tantara 33)." }
];

// Helper to generate a deterministic list of 10 questions for a given (difficulty, level)
export function generateQuestionsForLevel(difficulty: 'Facile' | 'Moyen' | 'Difficile', level: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  // Seed-based shuffling selector
  const seedMultiplier = level * 7 + (difficulty === 'Facile' ? 12 : difficulty === 'Moyen' ? 29 : 45);

  for (let i = 0; i < 10; i++) {
    const questionIndex = (seedMultiplier + i * 13) % 15;
    
    if (difficulty === 'Facile') {
      // Pick dynamic pattern
      if (i % 3 === 0) {
        // Person acts template
        const item = EASY_PEOPLE_ACTS[(questionIndex) % EASY_PEOPLE_ACTS.length];
        const correct = item.name;
        // Collect choices
        const remaining = EASY_PEOPLE_ACTS.filter(p => p.name !== correct).map(p => p.name);
        const distractors = [remaining[0], remaining[1], remaining[2]];
        const options = shuffleArrayWithIndex([correct, ...distractors], correct);
        
        questions.push({
          id: `f-${level}-${i}`,
          question: `Iza ilay olona ao amin'ny Baibolyizay ${item.act}?`,
          options: options.shuffled,
          answerIndex: options.answerIndex,
          explanation: item.fact
        });
      } else if (i % 3 === 1) {
        // Testament template
        const item = EASY_TESTAMENTS[(questionIndex) % EASY_TESTAMENTS.length];
        const correct = item.testament;
        const options = ["Testamenta Taloha", "Testamenta Vaovao"];
        
        questions.push({
          id: `f-${level}-${i}`,
          question: `Ao amin'ny inona no misy ny bokin'i ${item.book} ao amin'ny Baiboly?`,
          options: options,
          answerIndex: options.indexOf(correct),
          explanation: `Ny bokin'i ${item.book} dia hita ao amin'ny ${item.testament}.`
        });
      } else {
        // Verse fill template
        const item = VERSES_FILL[(questionIndex) % VERSES_FILL.length];
        const correct = item.answer;
        const options = shuffleArrayWithIndex(item.options, correct);
        
        questions.push({
          id: `f-${level}-${i}`,
          question: `Fenoy ity andinin-tsoratra masina ity: "${item.verse}"`,
          options: options.shuffled,
          answerIndex: options.answerIndex,
          explanation: item.text
        });
      }
    } 
    else if (difficulty === 'Moyen') {
      // Pick from medium list + dynamic modifiers
      const item = MEDIUM_FACTS[(questionIndex) % MEDIUM_FACTS.length];
      
      // We can vary the question slightly based on level number to make it unique
      let questionText = item.q;
      if (level > 25) {
        questionText = `Fantatrao ve hoe: ${item.q.charAt(0).toLowerCase() + item.q.slice(1)}`;
      }
      
      const options = shuffleArrayWithIndex(item.opts, item.a);
      questions.push({
        id: `m-${level}-${i}`,
        question: questionText,
        options: options.shuffled,
        answerIndex: options.answerIndex,
        explanation: `${item.exp} (Fizarana faha-${level})`
      });
    } 
    else {
      // Hard level questions
      const item = HARD_FACTS[(questionIndex) % HARD_FACTS.length];
      
      let questionText = item.q;
      if (level % 2 === 0) {
        questionText = `Hevitra ara-baiboly: ${item.q}`;
      }
      
      const options = shuffleArrayWithIndex(item.opts, item.a);
      questions.push({
        id: `h-${level}-${i}`,
        question: questionText,
        options: options.shuffled,
        answerIndex: options.answerIndex,
        explanation: `${item.exp} (Kilasy Sarotra faha-${level})`
      });
    }
  }

  return questions;
}

// Function to shuffle array and tracks where the target is
function shuffleArrayWithIndex(arr: string[], correctValue: string): { shuffled: string[], answerIndex: number } {
  // Simple deterministic or pseudo-shuffler
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return {
    shuffled: list,
    answerIndex: list.indexOf(correctValue)
  };
}
