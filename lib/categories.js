// ─── CATEGORY TREE ────────────────────────────────────────────────────────────
export const CATEGORIES = {
  'Föt': {
    icon: '👕',
    subcategories: {
      'Konur': {
        'Yfirhafnir': ['Jakkar', 'Frakkar', 'Leðurjakkar', 'Skíðajakkar', 'Regnföt', 'Úlpur', 'Vesti'],
        'Peysur og hettupeysur': ['Hettupeysur', 'Peysur', 'Lopapeysur', 'Cardigans', 'Turtleneck'],
        'Bolir': ['Stuttermabol', 'Langermabol', 'Crop top', 'Tankar', 'Polo'],
        'Skyrtur': ['Klassískar skyrtur', 'Denim skyrtur', 'Blúsur', 'Crop skyrtur'],
        'Buxur': ['Gallabuxur', 'Buxur', 'Leggings', 'Culottes', 'Hábuxur'],
        'Stuttbuxur': ['Stuttbuxur', 'Denim stuttbuxur', 'Bermúda'],
        'Kjólar': ['Stuttkjólar', 'Langir kjólar', 'Kveldkjólar', 'Sumarkjólar'],
        'Pils': ['Stuttpils', 'Langt pils', 'Denim pils'],
        'Íþróttaföt': ['Hlaupabuxur', 'Leggings', 'Sportbolir', 'Sportjakkar', 'Yogabuxur'],
        'Sundföt': ['Bikíní', 'Sundstakkar', 'Sundbuxur'],
        'Hattar og húfur': ['Húfur', 'Hattar', 'Beanies', 'Skífahattar'],
        'Treflar': ['Ullartreflar', 'Léttir treflar'],
        'Annað': ['Nærföt', 'Sokkar', 'Sokkabuxur', 'Náttföt', 'Hanskar'],
      },
      'Karlar': {
        'Yfirhafnir': ['Jakkar', 'Frakkar', 'Leðurjakkar', 'Skíðajakkar', 'Regnföt', 'Úlpur', 'Vesti', 'Blazers'],
        'Peysur og hettupeysur': ['Hettupeysur', 'Peysur', 'Lopapeysur', 'Cardigans', 'Turtleneck', 'Zip-up'],
        'Bolir': ['Stuttermabol', 'Langermabol', 'Polo', 'Tankar', 'Grafíkbol'],
        'Skyrtur': ['Oxford skyrtur', 'Denim skyrtur', 'Flannel skyrtur', 'Havaí skyrtur'],
        'Buxur': ['Gallabuxur', 'Chinos', 'Joggerar', 'Slítar', 'Cargo buxur', 'Hábuxur'],
        'Stuttbuxur': ['Stuttbuxur', 'Denim stuttbuxur', 'Íþróttastuttbuxur', 'Bermúda'],
        'Íþróttaföt': ['Hlaupabuxur', 'Sportbolir', 'Sportjakkar', 'Compression'],
        'Sundföt': ['Sundbuxur', 'Board shorts'],
        'Hattar og húfur': ['Snapback', 'Skífahattar', 'Beanies', 'Hattar'],
        'Treflar': ['Ullartreflar', 'Léttir treflar'],
        'Annað': ['Nærföt', 'Sokkar', 'Náttföt', 'Hanskar'],
      },
      'Börn': {
        'Stúlkur 0–2 ára': ['Bodíar', 'Jakkar', 'Bolir', 'Buxur', 'Kjólar', 'Náttföt', 'Settar'],
        'Drengir 0–2 ára': ['Bodíar', 'Jakkar', 'Bolir', 'Buxur', 'Náttföt', 'Settar'],
        'Stúlkur 2–8 ára': ['Jakkar', 'Peysur', 'Bolir', 'Buxur', 'Kjólar', 'Pils', 'Náttföt'],
        'Drengir 2–8 ára': ['Jakkar', 'Peysur', 'Bolir', 'Buxur', 'Stuttbuxur', 'Náttföt'],
        'Stúlkur 8–16 ára': ['Jakkar', 'Peysur', 'Hettupeysur', 'Bolir', 'Buxur', 'Kjólar', 'Pils'],
        'Drengir 8–16 ára': ['Jakkar', 'Peysur', 'Hettupeysur', 'Bolir', 'Buxur', 'Stuttbuxur'],
        'Unisex': ['Jakkar', 'Peysur', 'Bolir', 'Buxur', 'Náttföt', 'Skíðaföt'],
      },
    },
  },

  'Skór': {
    icon: '👟',
    subcategories: {
      'Konur': {
        'Skór': ['Sneakers', 'Lófaskór', 'Sandalar', 'Mules', 'Flats'],
        'Hælar': ['Stilettos', 'Block hælar', 'Kitten hælar', 'Platforms'],
        'Stígvélar': ['Ankle stígvélar', 'Hnjástígvélar', 'Chelsea stígvélar', 'Cowboy stígvélar'],
        'Íþróttaskór': ['Hlaupaskór', 'Þjálfunarskór', 'Körfuboltaskór', 'Fótboltaskór'],
        'Gönguskór': ['Snjóstígvélar', 'Vaðstígvélar', 'Ullartofflur'],
      },
      'Karlar': {
        'Skór': ['Sneakers', 'Lófaskór', 'Sandalar', 'Slip-ons'],
        'Leðurskór': ['Oxford', 'Derby', 'Loafers', 'Monks'],
        'Stígvélar': ['Chelsea stígvélar', 'Vinnustígvélar', 'Hnjástígvélar', 'Desert stígvélar'],
        'Íþróttaskór': ['Hlaupaskór', 'Þjálfunarskór', 'Körfuboltaskór', 'Fótboltaskór', 'Golfskór'],
        'Gönguskór': ['Snjóstígvélar', 'Vaðstígvélar', 'Ullartofflur'],
      },
      'Börn': {
        'Ungbörn 0–2': ['Fyrstu skref', 'Tofflur', 'Stígvélar'],
        'Börn 2–8': ['Sneakers', 'Sandalar', 'Stígvélar', 'Íþróttaskór'],
        'Unglingar 8–16': ['Sneakers', 'Stígvélar', 'Sandalar', 'Íþróttaskór'],
      },
    },
  },

  'Töskur': {
    icon: '👜',
    subcategories: {
      'Konur': {
        'Handtöskur': ['Tote bags', 'Clutch', 'Crossbody', 'Axlartöskur', 'Smátöskur'],
        'Bakpokar': ['Daglegir bakpokar', 'Smábakpokar', 'Fartölvupokar'],
        'Ferðatöskur': ['Rúllutöskur', 'Ferðabakpokar', 'Helgarpokar'],
        'Veski': ['Veski', 'Korthaldari', 'Keðjuveski'],
      },
      'Karlar': {
        'Töskur': ['Axlartöskur', 'Messenger bags', 'Tote bags'],
        'Bakpokar': ['Daglegir bakpokar', 'Fartölvupokar', 'Sporttöskur'],
        'Ferðatöskur': ['Rúllutöskur', 'Ferðabakpokar', 'Duffle bags'],
        'Veski': ['Veski', 'Korthaldari', 'Lyklabundar'],
      },
    },
  },

  'Skartgripir': {
    icon: '💍',
    subcategories: {
      'Konur': {
        'Skartgripir': ['Hálsmen', 'Eyrnalokkur', 'Hringur', 'Armband', 'Bróch'],
        'Sólgleraugu': ['Sólgleraugu', 'Bláljósgleraugu'],
        'Belti': ['Leðurbelti', 'Strigabelti', 'Keðjubelti'],
        'Úrar': ['Úrar'],
      },
      'Karlar': {
        'Skartgripir': ['Hálsmen', 'Hringur', 'Armband', 'Eyrnalokkur'],
        'Sólgleraugu': ['Sólgleraugu'],
        'Belti': ['Leðurbelti', 'Strigabelti'],
        'Úrar': ['Úrar'],
      },
    },
  },

  'Raftæki': {
    icon: '📱',
    subcategories: {
      'Símar og spjaldtölvur': {
        'iPhone': ['iPhone 16 Pro', 'iPhone 16', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'Eldri iPhone'],
        'Samsung': ['Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy A', 'Galaxy Z Fold', 'Galaxy Z Flip'],
        'Aðrir símar': ['Google Pixel', 'OnePlus', 'Xiaomi', 'Huawei', 'Annað'],
        'iPad': ['iPad Pro', 'iPad Air', 'iPad mini', 'iPad'],
        'Spjaldtölvur': ['Samsung Galaxy Tab', 'Microsoft Surface', 'Annað'],
        'Símafylgihlutir': ['Hulstur', 'Skjáhlífar', 'Hleðslutæki', 'Heyrnartól', 'MagSafe'],
      },
      'Tölvur': {
        'MacBook': ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air M2', 'MacBook Air M1', 'Eldri MacBook'],
        'Aðrar tölvur': ['Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft Surface', 'Acer', 'Annað'],
        'Borðtölvur': ['iMac', 'Mac mini', 'Mac Pro', 'Windows borðtölva'],
        'Skjáir': ['Skjáir'],
        'Tölvufylgihlutir': ['Lyklaborð', 'Mýs', 'Dockar', 'Vefkamerar', 'Prentarar'],
      },
      'Leikjatölvur': {
        'PlayStation': ['PS5', 'PS4', 'PS4 Pro', 'PS3', 'PSP / PS Vita'],
        'Xbox': ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One'],
        'Nintendo': ['Nintendo Switch OLED', 'Nintendo Switch', 'Nintendo Switch Lite', '3DS', 'GameBoy'],
        'PC gaming': ['Gaming PC', 'Gaming skjár', 'Gaming lyklaborð', 'Gaming mús', 'Gaming headset'],
        'Leikir': ['PS5 leikir', 'PS4 leikir', 'Xbox leikir', 'Nintendo leikir', 'PC leikir'],
        'Annað': ['Stýrar', 'Headsets', 'Hleðslustöðvar', 'VR'],
      },
      'Sjónvarp': ['55"+ OLED', '55"+ QLED', '40–55" sjónvarp', 'Undir 40" sjónvarp', 'Skjávarpar'],
      'Hátalarar': ['Bluetooth hátalarar', 'Heimahljóðkerfi', 'Soundbars', 'Plötuspilarar'],
      'Heyrnartól': ['AirPods Pro', 'AirPods', 'Sony WH', 'Bose', 'Annað þráðlaust', 'Með snúru'],
      'Tölvuleikir': ['Nintendo Switch leikir', 'PS leikir', 'Xbox leikir', 'PC leikir', 'Handheld leiktæki'],
      'Annað': ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'DSLR', 'Mirrorless', 'Action cams', 'Beinir', 'Ytri harðar diskar', 'Annað'],
    },
  },

  'Húsgögn': {
    icon: '🛋️',
    subcategories: {
      'Sófar og stólar': ['Sófar', 'Leðursófar', 'Lænistólar', 'Stólar', 'Barstólar', 'Bekkir'],
      'Borð': ['Matborð', 'Sofaborð', 'Skrifborð', 'Hliðarborð', 'Sjónvarpsborð'],
      'Geymsla': ['Hillur', 'Skápar', 'Fataskápar', 'Kommóður', 'Bókahillur'],
      'Rúm og svefn': ['Tvöfalt rúm', 'Einfalt rúm', 'Rúmgrind', 'Dýnur', 'Náttborð', 'Barnagrind'],
      'Eldhús': ['Kæliskap', 'Þvottavél', 'Uppþvottavél', 'Eldavélar', 'Þurrkari', 'Kaffikokkur', 'Espresso vél', 'Blandari', 'Matvinnsluvél', 'Brauðrist', 'Pottar og pönnur', 'Borðbúnaður'],
      'Lýsing': ['Gólflampar', 'Borðlampar', 'Loftljós', 'Veggljós', 'Snjallljós'],
      'Innréttingar': ['Mottur', 'Tjöld', 'Gluggatjöld', 'Speglar', 'Myndir og listaverk', 'Púðar'],
      'Garður og svalir': ['Garðstólar', 'Garðborð', 'Sólstólar', 'Grill og BBQ', 'Pottaplöntur', 'Garðtæki'],
      'Annað': ['Rúmföt', 'Sæng og koddi', 'Handklæður', 'Baðherbergi', 'Annað'],
    },
  },

  'Bílar og farartæki': {
    icon: '🚗',
    subcategories: {
      'Fólksbílar': ['Sedan', 'Hatchback', 'SUV og jeppar', 'Stationwagon', 'Minivan', 'Cabriolet', 'Coupé', 'Rafbílar'],
      'Bifhjól': ['Mótorhjól', 'Scooter', 'Moped', 'Enduro', 'Dirt bike'],
      'Reiðhjól': ['Götureiðhjól', 'Fjallareiðhjól', 'Gravel reiðhjól', 'BMX', 'Rafmagnsreiðhjól', 'Reiðhjól fyrir börn'],
      'Bílavarahlutir': ['Sumardekkjar', 'Vetradekkjar', 'Felgur', 'Bílstólar', 'GPS', 'Hjólhlífar', 'Rafhlaða', 'Bremsur', 'Annað'],
      'Önnur farartæki': ['Rafhlaupahjól', 'Einhjólingur', 'ATV', 'Snjóscooter', 'Bátar'],
    },
  },

  'Íþróttir og útivist': {
    icon: '⚽',
    subcategories: {
      'Knattspyrna': ['Knattspyrnuskór', 'Markvörðubúnaður', 'Hlífðarbúnaður', 'Boltar', 'Leikjafatnaður'],
      'Körfubolti': ['Körfuboltaskór', 'Körfuboltafatnaður', 'Boltar'],
      'Hjólreiðar': ['Hjálmar', 'Hanskar', 'Hlífðarbúnaður', 'Hjólreiðaföt', 'Hjólreiðapokar'],
      'Sund': ['Sundgleraugu', 'Sundhattar', 'Sundföt', 'Svigunar'],
      'Skíði': ['Alpine skíður', 'Langrennisskíður', 'Snowboard', 'Skíðaskór', 'Snowboard skór', 'Skíðajakkar', 'Skíðabuxur', 'Skíðahjálmar', 'Skíðaglerur', 'Skíðahanskar', 'Skíðastafar'],
      'Útivist': ['Gore-Tex jakkar', 'Fleece', 'Gönguskór', 'Ullarsokkar', 'Bakpokar', 'Tjöld', 'Svefnpokar', 'Eldavélar', 'Leiðsögutæki'],
      'Líkamsrækt': ['Þyngdarstöng og lóðir', 'Kettlebells', 'Mótstöðubönd', 'Yogamotta', 'Crossfit búnaður', 'Hlaupabrettur', 'Kyrrstætt reiðhjól'],
      'Golf': ['Golfkylfor', 'Golftöskur', 'Golfboltar', 'Golfskór', 'Golfföt'],
      'Annað': ['Tennis', 'Badminton', 'Pádel', 'Kampsport', 'Rugby', 'Handbolti'],
    },
  },

  'Leikföng og barnabúnaður': {
    icon: '🧸',
    subcategories: {
      'Leikföng': {
        '0–2 ára': ['Hríslar', 'Leikfimibúnaður', 'Mjúkar dúkkur', 'Tónleikartæki'],
        '3–5 ára': ['Kubbar', 'Púsluspil', 'Dúkkur', 'Leikjabílar', 'Annað'],
        '6–10 ára': ['LEGO', 'Borðspil', 'Fjarstýrðir bílar', 'Figurines', 'Annað'],
        '11+ ára': ['Borðspil', 'Trading cards', 'Tæknileg leikföng', 'Annað'],
      },
      'Barnabúnaður': {
        'Vagnar og stólar': ['Barnakerra', 'Kerruföt', 'Hár stóll', 'Bílastóll', 'Burðarpokar'],
        'Svefn': ['Barnagrind', 'Bassinet', 'Skipta borð', 'Svefnpokar'],
        'Annað': ['Brjóstadæla', 'Flaskar', 'Baðker', 'Pottur', 'Annað'],
      },
    },
  },

  'Bækur og tónlist': {
    icon: '📚',
    subcategories: {
      'Bækur': {
        'Skáldskapur': ['Íslenskar skáldsögur', 'Þýddar skáldsögur', 'Fantasy og Sci-fi', 'Glæpasögur'],
        'Fræðibækur': ['Sögubækur', 'Vísindabækur', 'Heimspeki', 'Sjálfshjálp'],
        'Barnabækur': ['Myndabækur', 'Unglingabókmenntir', 'Námsefni'],
        'Annað': ['Matreiðslubækur', 'Listabækur', 'Tímarit', 'Manga'],
      },
      'Tónlist': {
        'Hljóðfæri': ['Rafmagnsgítar', 'Hljómgítar', 'Bassagítar', 'Trommur', 'Píanó og keyboard', 'Blásturshljóðfæri', 'Strengjahljóðfæri'],
        'Hljóðfærafylgihlutir': ['Gítarstrengir', 'Picks', 'Gítarvestar', 'Pedalar', 'Magnara'],
        'Plötur': ['Vínylplötur', 'CD plötur', 'Kasettur'],
        'DJ og hljóðbúnaður': ['DJ borð', 'Mixers', 'Hljóðnemar', 'Hljóðkort'],
      },
    },
  },

  'Listir og söfnun': {
    icon: '🎨',
    subcategories: {
      'Myndlist': ['Olíumálverk', 'Vatnslitamálverk', 'Prentverk', 'Ljósmyndir', 'Skúlptúr', 'Teikningar'],
      'Safngripir': ['Frímerki', 'Myntar', 'Leikfangasöfnun', 'Íþróttakort', 'Pokémon kort', 'Vínylplötur'],
      'Handverk': ['Prjóna- og hekluverk', 'Handmálaðar vörur', 'Keramík', 'Smíðavörur'],
    },
  },

  'Annað': {
    icon: '📦',
    subcategories: {
      'Garðbúnaður': ['Pottaplöntur', 'Garðverkfæri', 'Grill og BBQ', 'Garðhúsgögn'],
      'Verkfæri': ['Rafknúin verkfæri', 'Handverkfæri', 'Mælitæki', 'Málningarbúnaður'],
      'Heilsa og útlit': ['Húðvörður', 'Hárgreiðslutæki', 'Nuddtæki', 'Annað'],
      'Gæludýr': ['Gæludýrafæði', 'Gæludýraleikföng', 'Rúm og búr', 'Gæludýraföt'],
      'Ýmislegt': ['Skrifstofubúnaður', 'Námsefni', 'Partýbúnaður', 'Annað'],
    },
  },
}

export const SIZES = {
  'Konur': {
    'Yfirhafnir': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Peysur og hettupeysur': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Bolir': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Skyrtur': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Buxur': ['32', '34', '36', '38', '40', '42', '44', '46', 'XS', 'S', 'M', 'L', 'XL'],
    'Stuttbuxur': ['32', '34', '36', '38', '40', '42', '44', 'XS', 'S', 'M', 'L', 'XL'],
    'Kjólar': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Pils': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'default': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  'Karlar': {
    'Yfirhafnir': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Peysur og hettupeysur': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Bolir': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Skyrtur': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    'Buxur': ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40', 'XS', 'S', 'M', 'L', 'XL'],
    'Stuttbuxur': ['28', '30', '32', '34', '36', '38', 'XS', 'S', 'M', 'L', 'XL'],
    'default': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  },
  'Börn': {
    'default': ['50', '56', '62', '68', '74', '80', '86', '92', '98', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164', '170', '176'],
  },
  'Skór konur': ['35', '36', '37', '38', '39', '40', '41', '42', '43'],
  'Skór karlar': ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
  'Skór börn': ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
}

// ─── CONDITIONS ───────────────────────────────────────────────────────────────
export const CONDITIONS = [
  { value: 'nytt', label: 'Nýtt' },
  { value: 'mjog_gott', label: 'Mjög gott' },
  { value: 'gott', label: 'Gott' },
  { value: 'notad', label: 'Notað' },
  { value: 'slaemt', label: 'Slæmt' },
]

// ─── COLORS ───────────────────────────────────────────────────────────────────
export const COLORS = [
  'Svartur', 'Hvítur', 'Grár', 'Brúnn', 'Beige', 'Blár',
  'Dökkblár', 'Rauður', 'Bleikur', 'Fjólublár', 'Grænn',
  'Gulur', 'Appelsínugulur', 'Annað',
]

// ─── LOCATIONS ────────────────────────────────────────────────────────────────
export const LOCATIONS = [
  'Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Garðabær',
  'Mosfellsbær', 'Akureyri', 'Árborg', 'Akranes',
  'Vestmannaeyjar', 'Ísafjörður', 'Egilsstaðir', 'Annað',
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export function getCategoryPath(main, sub, group, leaf) {
  return [main, sub, group, leaf].filter(Boolean).join(' > ')
}

export function getSizes(mainCat, subCat, groupCat) {
  if (mainCat === 'Skór') {
    if (subCat === 'Konur') return SIZES['Skór konur']
    if (subCat === 'Karlar') return SIZES['Skór karlar']
    if (subCat === 'Börn') return SIZES['Skór börn']
  }
  if (mainCat === 'Föt') {
    const sub = SIZES[subCat]
    if (sub) return sub[groupCat] || sub['default']
  }
  return null
}