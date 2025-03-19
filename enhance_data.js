const fs = require('fs');
const path = require('path');

// Calea către fișierul de intrare
const inputFile = path.join(__dirname, 'processed_data.json');
// Calea către fișierul de ieșire
const outputFile = path.join(__dirname, 'enhanced_data.json');

console.log('Începem procesul de îmbogățire a datelor...');

// Verificăm dacă fișierul de intrare există
if (!fs.existsSync(inputFile)) {
  console.error(`Eroare: Fișierul ${inputFile} nu există.`);
  process.exit(1);
}

// Citirea datelor din processed_data.json
let processedData;
try {
  const rawData = fs.readFileSync(inputFile, 'utf8');
  processedData = JSON.parse(rawData);
  console.log(`Au fost citite ${processedData.length} înregistrări din ${inputFile}`);
} catch (error) {
  console.error('Eroare la citirea sau parsarea fișierului de intrare:', error);
  process.exit(1);
}

// Definirea traducerilor și mapării continentelor
const translations = {
  "Tahiti – Regina Pacificului": "Tahiti Pacific island paradise",
  "PAPUA NOUA GUINEE – Aventură în lumea triburilor": "Papua New Guinea tribal culture",
  "Australia - Tasmania - Noua Zeelandă - Singapore - Fiji (opțional)": "Australia New Zealand Fiji landscapes",
  "Aloha Hawaii": "Hawaii tropical beaches",
  "Țările Baltice & St Petersburg": "Baltic countries St Petersburg architecture",
  "Spania - Maroc": "Spain Morocco landmarks",
  "SICILIA – SARDINIA – CORSICA": "Sicily Sardinia Corsica Mediterranean islands",
  "Scoția și Loch Ness": "Scotland Loch Ness scenic landscapes",
  "Rusia – Nopțile Albe": "Russia White Nights St Petersburg",
  "PUGLIA – Micul secret al Italiei": "Puglia Italy coastal scenery",
  "PORTUGALIA": "Portugal",
  "Portugalia - Maroc": "Portugal Morocco cultural sites",
  "PARIS - LONDRA": "Paris London iconic landmarks",
  "MALTA – Insula cavalerilor": "Malta medieval architecture",
  "Madeira – Insula eternei primăveri": "Madeira island landscapes",
  "LISABONA si Insulele Azore": "Lisbon Azores Islands scenery",
  "LACURILE ALPINE": "Italian Alpine Lakes scenic views",
  "Istanbul și Cappadocia": "Istanbul Cappadocia Turkish landscapes",
  "Islanda - Ţinutul focului şi al gheţurilor": "Iceland fire and ice landscapes",
  "Irlanda Mistică": "Ireland mystical landscapes",
  "INCURSIUNE ÎN ȚARA BASCILOR": "Basque Country cultural scenes",
  "Incursiune in Paris: Valea Loarei si Disneyland": "Paris Loire Valley Disneyland",
  "Helsinki şi Stockholm": "Helsinki Stockholm Nordic cities",
  "Elvetia si Mont Blanc": "Switzerland Mont Blanc Alpine scenery",
  "Coasta de Azur": "French Riviera coastal views",
  "Coasta Amalfitană – Perla Mării Tireniene": "Amalfi Coast Italian seaside",
  "Ciao Italia": "Italy diverse landscapes",
  "Bella Sicilia": "Sicily beautiful landscapes",
  "Belgia - Olanda - Luxemburg": "Benelux countries architecture",
  "Bavaria - Drumul Romantic": "Bavaria Romantic Road German scenery",
  "Barcelona – Pe urmele lui Gaudi și Dali": "Barcelona Gaudi Dali architecture",
  "Azerbaidjan – Georgia - Armenia": "Caucasus countries landscapes",
  "Anglia - Scoţia - Irlanda": "British Isles scenic views",
  "ANDALUZIA - în pași de flamenco": "Andalusia flamenco Spanish culture",
  "Acasă la Regii Franței": "French castles royal residences",
  "Viva Spania": "Spain diverse landscapes",
  "TOSCANA – Bijuteria Italiei": "Tuscany Italian countryside",
  "Țările nordice": "Nordic countries scenic fjords",
  "Malta-Sicilia": "Malta Sicily Mediterranean islands",
  "Uzbekistan – Aventură pe Drumul Mătăsii": "Uzbekistan Silk Road ancient cities",
  "Turul Indiei de Nord": "Northern India colorful culture",
  "Thailanda - Vietnam - Cambodgia": "Southeast Asia temples beaches",
  "Thailanda - Călătorind în Ţara Surâsului": "Thailand Land of Smiles beaches",
  "SRI LANKA și sejur în MALDIVE": "Sri Lanka Maldives tropical paradise",
  "Nepal": "Nepal Himalayan mountains",
  "Japonia și Coreea de Sud": "Japan South Korea modern traditional",
  "Japonia – Țara Soarelui Răsare": "Japan cherry blossoms Mount Fuji",
  "Indonezia si insula zeilor": "Indonesia Bali exotic landscapes",
  "INDONEZIA – Inima exotică a Asiei": "Indonesia exotic islands volcanoes",
  "Indochina - Vietnam, Laos, Cambodgia": "Indochina ancient temples rice fields",
  "Dubai și Abu Dhabi": "Dubai Abu Dhabi modern architecture desert",
  "Coreea de Sud – Țara dimineților liniștite": "South Korea serene landscapes",
  "China - Tibet": "China Tibet Great Wall mountains",
  "China - Hong Kong": "China Hong Kong skyline traditional",
  "CHINA – Învățămintele lui Buddha": "China Buddhist temples landscapes",
  "CHINA – Croaziera pe raul Yangtze": "China Yangtze River scenic cruise",
  "Thailanda - Malaysia - Singapore": "Southeast Asia urban nature",
  "Taiwan – Filipine – Malaysia (Borneo)": "Taiwan Philippines Borneo diverse landscapes",
  "Mongolia - Țara nomazilor": "Mongolia nomadic culture steppes",
  "Iran - Legendele Persiei": "Iran Persian architecture deserts",
  'India "Triunghiul de Aur" & Sejur în Goa/Kerala': "India Taj Mahal Goa beaches",
  "Țara de Foc: El Calafate, Ushuaia, Torres del Paine": "Patagonia glaciers mountains",
  "SUA de Vest și Hawaii": "USA West Coast Hawaii landscapes",
  "SUA Calator pe Coasta de Est si Bahamas": "USA East Coast Bahamas beaches",
  "New York – Marea metropolă a Americii": "New York City skyline landmarks",
  "Mexic - Lumea Maya & sejur în Cancun": "Mexico Mayan ruins Cancun beaches",
  "Mexic - Cuba": "Mexico Cuba colonial architecture beaches",
  "Mexic – Belize - Guatemala": "Central America Mayan culture",
  "Marele tur al Canadei & Cascada Niagara": "Canada Niagara Falls landscapes",
  "Expediție în America de Sud": "South America diverse landscapes",
  "Ecuador și Galapagos – Experiență în Jungla Amazonului": "Ecuador Galapagos Amazon wildlife",
  "Columbia - Canalul Panama - Ecuador - Galapagos": "Colombia Panama Canal Galapagos",
  "Columbia - Panama": "Colombia Panama tropical scenery",
  "Chile și Insula Paștelui": "Chile Easter Island moai statues",
  "Canada - Țara siropului de arțar": "Canada maple forests mountains",
  "Brazilia - Rio de Janeiro si Amazon": "Brazil Rio Carnival Amazon rainforest",
  "Alaska – Tărâmul îngheţat": "Alaska glaciers wildlife",
  "Safari în KENYA – Sejur în Mombasa": "Kenya safari Mombasa beaches",
  "Namibia": "Namibia desert dunes wildlife",
  "Namibia-Botswana-Zimbabue": "Southern Africa wildlife Victoria Falls",
  "Maroc - Între deșert și mare": "Morocco desert beaches medinas",
  "Madagascar 'Mora Mora' & Mauritius": "Madagascar Mauritius exotic wildlife beaches",
  "Etiopia - Mix intre istorie si legenda": "Ethiopia ancient churches rock-hewn",
  "Croazieră pe Nil în Ţara Faraonilor": "Egypt Nile cruise pyramids",
  "Aventură în Africa de Sud și Zambia": "South Africa Zambia safari Victoria Falls",
  "Algeria - Tunisia": "Algeria Tunisia Sahara Roman ruins",
  "Zanzibar – Insula Mirodeniilor": "Zanzibar spice island beaches",
  "Tanzania - Zanzibar": "Tanzania safari Zanzibar beaches"
};

const continentMap = {
 "Tahiti": ["Oceania"],
  "Papua Noua Guinee": ["Oceania"],
  "Australia": ["Oceania"],
  "Noua Zeelandă": ["Oceania"],
  "Hawaii": ["America de Nord"],
  "Țările Baltice": ["Europa"],
  "St Petersburg": ["Europa"],
  "Spania": ["Europa"],
  "Maroc": ["Africa"],
  "Sicilia": ["Europa"],
  "Sardinia": ["Europa"],
  "Corsica": ["Europa"],
  "Scoția": ["Europa"],
  "Rusia": ["Europa", "Asia"],
  "Puglia": ["Europa"],
  "Portugalia": ["Europa"],
  "Paris": ["Europa"],
  "Franței": ["Europa"],
  "Londra": ["Europa"],
  "Malta": ["Europa"],
  "Madeira": ["Europa"],
  "Lisabona": ["Europa"],
  "Azore": ["Europa"],
  "nordice": ["Europa"],
  "Lacurile Alpine": ["Europa"],
  "Istanbul": ["Europa", "Asia"],
  "Cappadocia": ["Asia"],
  "Islanda": ["Europa"],
  "Irlanda": ["Europa"],
  "Țara Bascilor": ["Europa"],
  "Valea Loarei": ["Europa"],
  "Disneyland": ["Europa"],
  "Helsinki": ["Europa"],
  "Stockholm": ["Europa"],
  "Elvetia": ["Europa"],
  "Mont Blanc": ["Europa"],
  "Coasta de Azur": ["Europa"],
  "Coasta Amalfitană": ["Europa"],
  "Italia": ["Europa"],
  "Belgia": ["Europa"],
  "Olanda": ["Europa"],
  "Luxemburg": ["Europa"],
  "Bavaria": ["Europa"],
  "Barcelona": ["Europa"],
  "Azerbaidjan": ["Asia"],
  "Georgia": ["Asia"],
  "Armenia": ["Asia"],
  "Anglia": ["Europa"],
  "Andaluzia": ["Europa"],
  "Toscana": ["Europa"],
  "Uzbekistan": ["Asia"],
  "India": ["Asia"],
  "Indiei": ["Asia"],
  "Thailanda": ["Asia"],
  "Vietnam": ["Asia"],
  "Cambodgia": ["Asia"],
  "Sri Lanka": ["Asia"],
  "Maldive": ["Asia"],
  "Nepal": ["Asia"],
  "Japonia": ["Asia"],
  "Indiei": ["Asia"],

  "Coreea de Sud": ["Asia"],
  "Indonezia": ["Asia"],
  "Laos": ["Asia"],
  "Dubai": ["Asia"],
  "Abu Dhabi": ["Asia"],
  "China": ["Asia"],
  "Tibet": ["Asia"],
  "Hong Kong": ["Asia"],
  "Malaysia": ["Asia"],
  "Singapore": ["Asia"],
  "Taiwan": ["Asia"],
  "Filipine": ["Asia"],
  "Borneo": ["Asia"],
  "Mongolia": ["Asia"],
  "Iran": ["Asia"],
  "Goa": ["Asia"],
  "Kerala": ["Asia"],
  "El Calafate": ["America de Sud"],
  "Ushuaia": ["America de Sud"],
  "Torres del Paine": ["America de Sud"],
  "SUA": ["America de Nord"],
  "Bahamas": ["America de Nord"],
  "New York": ["America de Nord"],
  "Mexic": ["America de Nord"],
  "Cuba": ["America de Nord"],
  "Belize": ["America de Nord"],
  "Canadei": ["America de Nord"],
  "Guatemala": ["America de Nord"],
  "Canada": ["America de Nord"],
  "Ecuador": ["America de Sud"],
  "America de Sud": ["America de Sud"],
  "Galapagos": ["America de Sud"],
  "Columbia": ["America de Sud"],
  "Panama": ["America de Nord"],
  "Chile": ["America de Sud"],
  "Insula Paștelui": ["Oceania"],
  "Brazilia": ["America de Sud"],
  "Alaska": ["America de Nord"],
  "Kenya": ["Africa"],
  "Namibia": ["Africa"],
  "Botswana": ["Africa"],
  "Zimbabue": ["Africa"],
  "Madagascar": ["Africa"],
  "Mauritius": ["Africa"],
  "Ţara Faraonilor": ["Africa"],
  "Etiopia": ["Africa"],
  "Egipt": ["Africa"],
  "Africa de Sud": ["Africa"],
  "Zambia": ["Africa"],
  "Algeria": ["Africa"],
  "Tunisia": ["Africa"],
  "Zanzibar": ["Africa"],
  "Tanzania": ["Africa"]
};

function getContinents(title) {
  const continents = new Set();
  for (const [key, value] of Object.entries(continentMap)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      value.forEach(continent => continents.add(continent));
    }
  }
  return Array.from(continents);
}

console.log('Îmbogățim datele...');

// Îmbogățirea datelor
const enhancedData = processedData.map(trip => {
  const enhancedTrip = {
    ...trip,
    searchTitle: translations[trip.title] || trip.title,
    continents: getContinents(trip.title)
  };
  if (enhancedTrip.continents.length === 0) {
    console.warn(`Avertisment: Nu s-au găsit continente pentru "${trip.title}"`);
  }
  return enhancedTrip;
});

console.log(`Au fost îmbogățite ${enhancedData.length} înregistrări.`);

// Scrierea datelor îmbogățite într-un nou fișier JSON
try {
  fs.writeFileSync(outputFile, JSON.stringify(enhancedData, null, 2));
  console.log(`Datele îmbogățite au fost salvate cu succes în ${outputFile}`);
} catch (error) {
  console.error('Eroare la scrierea fișierului de ieșire:', error);
  process.exit(1);
}

console.log('Procesul de îmbogățire a datelor s-a încheiat cu succes.');