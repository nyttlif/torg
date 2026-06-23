// ─── CATEGORY TREE ────────────────────────────────────────────────────────────
export const CATEGORIES = {
    'Föt og fatnaður': {
      icon: '👕',
      subcategories: {
        'Konur': {
          'Yfirföt': ['Jakkar', 'Frakkar', 'Leðurjakkar', 'Skíðajakkar', 'Regnföt', 'Úlpur', 'Vesti'],
          'Peysar og hettupeysar': ['Hettupeysar', 'Peysar', 'Lopapeysar', 'Cardigans', 'Turtleneck'],
          'Bolir': ['Stuttermabol', 'Langermabol', 'Crop top', 'Tankar', 'Polo'],
          'Skyrtur': ['Klassískar skyrtur', 'Denim skyrtur', 'Blúsur', 'Crop skyrtur'],
          'Buxur': ['Gallabuxur', 'Buxur', 'Leggings', 'Culottes', 'Háháls buxur'],
          'Stuttbuxur': ['Stuttbuxur', 'Denim stuttbuxur', 'Bermúda'],
          'Kjólar': ['Stuttkjólar', 'Langar kjólar', 'Kveldkjólar', 'Sumarkjólar'],
          'Pilsar': ['Stuttpilar', 'Langpilar', 'Denim pilar', 'Miðlingspilar'],
          'Íþróttaföt': ['Hlaupabuxur', 'Leggings', 'Sportbolir', 'Sportjakkar', 'Yoga buxur'],
          'Sundföt': ['Bikíní', 'Sundjakkar', 'Sundbuxur'],
          'Aðrir flokkar': ['Nærföt', 'Sokkar', 'Sokkabuxur', 'Pysjur', 'Hálslínur', 'Hanskar'],
        },
        'Karlar': {
          'Yfirföt': ['Jakkar', 'Frakkar', 'Leðurjakkar', 'Skíðajakkar', 'Regnföt', 'Úlpur', 'Vesti', 'Blazers'],
          'Peysar og hettupeysar': ['Hettupeysar', 'Peysar', 'Lopapeysar', 'Cardigans', 'Turtleneck', 'Zip-up'],
          'Bolir': ['Stuttermabol', 'Langermabol', 'Polo', 'Tankar', 'Grafíkbol'],
          'Skyrtur': ['Oxford skyrtur', 'Denim skyrtur', 'Flannels', 'Havaí skyrtur', 'Blazer skyrtur'],
          'Buxur': ['Gallabuxur', 'Chinos', 'Joggerar', 'Slítar', 'Cargo buxur', 'Háháls buxur'],
          'Stuttbuxur': ['Stuttbuxur', 'Denim stuttbuxur', 'Íþróttastuttbuxur', 'Bermúda'],
          'Íþróttaföt': ['Hlaupabuxur', 'Sportbolir', 'Sportjakkar', 'Compression'],
          'Sundfatnaður': ['Sundbuxur', 'Board shorts'],
          'Aðrir flokkar': ['Nærföt', 'Sokkar', 'Pysjur', 'Hálslínur', 'Hanskar'],
        },
        'Börn': {
          'Stúlkur 0–2 ára': ['Bodíar', 'Jakkar', 'Bolir', 'Buxur', 'Kjólar', 'Pysjur', 'Settar'],
          'Drengir 0–2 ára': ['Bodíar', 'Jakkar', 'Bolir', 'Buxur', 'Pysjur', 'Settar'],
          'Stúlkur 2–8 ára': ['Jakkar', 'Peysar', 'Bolir', 'Buxur', 'Kjólar', 'Pilsar', 'Pysjur'],
          'Drengir 2–8 ára': ['Jakkar', 'Peysar', 'Bolir', 'Buxur', 'Stuttbuxur', 'Pysjur'],
          'Stúlkur 8–16 ára': ['Jakkar', 'Peysar', 'Hettupeysar', 'Bolir', 'Buxur', 'Kjólar', 'Pilsar'],
          'Drengir 8–16 ára': ['Jakkar', 'Peysar', 'Hettupeysar', 'Bolir', 'Buxur', 'Stuttbuxur'],
          'Unisex': ['Jakkar', 'Peysar', 'Bolir', 'Buxur', 'Pysjur', 'Skíðaföt'],
        },
      },
    },
  
    'Skór og fylgihlutir': {
      icon: '👟',
      subcategories: {
        'Konur': {
          'Hversdagsskór': ['Sneakers', 'Lófaskór', 'Sandalar', 'Mules', 'Flats'],
          'Hælar': ['Stilettos', 'Block hælar', 'Kitten hælar', 'Platforms'],
          'Stígvélar': ['Ankle stígvélar', 'Knee-high stígvélar', 'Chelsea stígvélar', 'Cowboy stígvélar'],
          'Íþróttaskór': ['Hlaupaskór', 'Þjálfunarskór', 'Körfuboltaskór', 'Fótboltaskór'],
          'Vetrartími': ['Snjóstígvélar', 'Vaðstígvélar', 'Ullartofflur'],
        },
        'Karlar': {
          'Hversdagsskór': ['Sneakers', 'Lófaskór', 'Sandalar', 'Slip-ons'],
          'Leðurskór': ['Oxford', 'Derby', 'Loafers', 'Monks'],
          'Stígvélar': ['Chelsea stígvélar', 'Vinnustígvélar', 'Hjúpstígvélar', 'Desert stígvélar'],
          'Íþróttaskór': ['Hlaupaskór', 'Þjálfunarskór', 'Körfuboltaskór', 'Fótboltaskór', 'Golfskór'],
          'Vetrartími': ['Snjóstígvélar', 'Vaðstígvélar', 'Ullartofflur'],
        },
        'Börn': {
          'Ungbörn 0–2': ['Fyrstu skref', 'Tofflur', 'Stígvélar'],
          'Börn 2–8': ['Sneakers', 'Sandalar', 'Stígvélar', 'Íþróttaskór'],
          'Unglingar 8–16': ['Sneakers', 'Stígvélar', 'Sandalar', 'Íþróttaskór'],
        },
        'Fylgihlutir': {
          'Skótengsl og umhirða': ['Skótengsli', 'Skóhreinsun', 'Skóvernd'],
        },
      },
    },
  
    'Töskur og fylgihlutir': {
      icon: '👜',
      subcategories: {
        'Konur': {
          'Handtöskur': ['Tote bags', 'Clutch', 'Crossbody', 'Shoulder bags', 'Mini töskur'],
          'Bakpokar': ['Daglegir bakpokar', 'Mini bakpokar', 'Fartölvupokár'],
          'Ferðatöskur': ['Rúllutöskur', 'Ferðabakpokar', 'Helgarpokar'],
          'Veski': ['Veski', 'Korthaldari', 'Keðjuveski'],
        },
        'Karlar': {
          'Bakpokar': ['Daglegir bakpokar', 'Fartölvupokár', 'Sporttöskur'],
          'Ferðatöskur': ['Rúllutöskur', 'Ferðabakpokar', 'Duffle bags'],
          'Veski og lyklatöskur': ['Veski', 'Korthaldari', 'Lyklabundar'],
          'Messenger og tote': ['Messenger bags', 'Tote bags', 'Handleggspokár'],
        },
      },
    },
  
    'Fylgihlutir og skartgripir': {
      icon: '💍',
      subcategories: {
        'Konur': {
          'Skartgripir': ['Hálsmen', 'Eyrnalokkur', 'Hringur', 'Armbandur', 'Bróch'],
          'Hattар og húfur': ['Húfur', 'Hattar', 'Beanies', 'Bílskífahattar'],
          'Treflar og hálsfatnaður': ['Treflar', 'Hálslínur', 'Bandanas'],
          'Sólgleraugu': ['Sólgleraugu', 'Bláljósgleraugu'],
          'Belti': ['Leðurbelti', 'Strigabelti', 'Keðjubelti'],
        },
        'Karlar': {
          'Skartgripir': ['Hálsmen', 'Hringur', 'Armbandur', 'Eyrnalokkur'],
          'Hattar og húfur': ['Snapback', 'Bílskífahattar', 'Beanies', 'Hattar', 'Búðarhattar'],
          'Treflar': ['Ullartrефlar', 'Léttir treflar'],
          'Sólgleraugu': ['Sólgleraugu'],
          'Belti': ['Leðurbelti', 'Strigabelti'],
          'Úrar': ['Úrar'],
        },
      },
    },
  
    'Rafræn tæki': {
      icon: '📱',
      subcategories: {
        'Símar og spjaldtölvur': {
          'iPhone': ['iPhone 16 Pro', 'iPhone 16', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'Eldri iPhone'],
          'Samsung': ['Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy A', 'Galaxy Z Fold', 'Galaxy Z Flip'],
          'Aðrir símar': ['Google Pixel', 'OnePlus', 'Xiaomi', 'Huawei', 'Annað'],
          'iPad': ['iPad Pro', 'iPad Air', 'iPad mini', 'iPad (venjulegur)'],
          'Spjaldtölvur': ['Samsung Galaxy Tab', 'Microsoft Surface', 'Annað'],
          'Símafylgihlutir': ['Hulstur', 'Skjáhlífar', 'Hleðslutæki', 'Earphones', 'MagSafe'],
        },
        'Tölvur': {
          'MacBook': ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air M2', 'MacBook Air M1', 'Eldri MacBook'],
          'Windows fartölvur': ['Dell', 'HP', 'Lenovo ThinkPad', 'ASUS', 'Microsoft Surface', 'Acer', 'Annað'],
          'Borðtölvur': ['iMac', 'Mac mini', 'Mac Pro', 'Windows borðtölva'],
          'Tölvufylgihlutir': ['Skjáir', 'Lyklaborð', 'Mýs', 'Dockar', 'Vebkamerar', 'Prentarar'],
        },
        'Leiktæki': {
          'PlayStation': ['PS5', 'PS4', 'PS4 Pro', 'PS3', 'PSP / PS Vita'],
          'Xbox': ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One'],
          'Nintendo': ['Nintendo Switch OLED', 'Nintendo Switch', 'Nintendo Switch Lite', '3DS', 'GameBoy'],
          'PC gaming': ['Gaming PC', 'Gaming skjár', 'Gaming lyklaborð', 'Gaming mús', 'Gaming headset'],
          'Leikir': ['PS5 leikir', 'PS4 leikir', 'Xbox leikir', 'Nintendo leikir', 'PC leikir'],
          'Leikjafylgihlutir': ['Stýrar', 'Headsets', 'Charging docks', 'VR'],
        },
        'Sjónvörp og hljóð': {
          'Sjónvörp': ['55"+ OLED', '55"+ QLED', '40–55" sjónvarp', 'Undir 40" sjónvarp', 'Projectors'],
          'Hljóðtæki': ['Bluetooth hátalarar', 'Heimahljóðkerfi', 'Soundbars', 'Vinyl / plötuspilari'],
          'Heyrnartól': ['AirPods Pro', 'AirPods', 'Sony WH', 'Bose', 'Annað þráðlaust', 'Með snúru'],
          'Myndavélar': ['DSLR', 'Mirrorless', 'Point & shoot', 'Action cams (GoPro)', 'Myndbandalélar'],
        },
        'Annað rafrænt': {
          'Snjallúrar': ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Fitbit', 'Annað'],
          'Heimanetkerfi': ['Routers', 'Mesh kerfi', 'Switches'],
          'Annað': ['Prentarar', 'Skannar', 'Ytri harðar diskar', 'USB hubar', 'Annað'],
        },
      },
    },
  
    'Húsgögn og heimili': {
      icon: '🛋️',
      subcategories: {
        'Stofuherbergi': {
          'Húsgögn': ['Sófar', 'Leðursófar', 'Lænistólar', 'Borð', 'Salernistöflur', 'Hillur', 'TV borð'],
          'Innréttingar': ['Pertur', 'Tjöld', 'Mottur', 'Púðar', 'Sængurhlífar'],
        },
        'Svefnherbergi': {
          'Rúm og dýnur': ['Tvöfalt rúm', 'Einfalt rúm', 'Rúmgrind', 'Dýnur', 'Náttborð'],
          'Geymsla': ['Fataskápar', 'Kommóður', 'Skápar', 'Hillur'],
          'Rúmfatnaður': ['Sæng og koddi', 'Lín og dúkur', 'Rúmábreiður'],
        },
        'Eldhús': {
          'Stór tæki': ['Kæliskap', 'Þvottavél', 'Uppþvottavél', 'Ofnar og eldavélar', 'Þurrkari'],
          'Lítil tæki': ['Kaffikokkur', 'Espresso vél', 'Blender', 'Matvinnsluvél', 'Brauðrist', 'Lofteldavél'],
          'Eldhúsáhöld': ['Pottар og pönnur', 'Hnífahneppur', 'Bakstursáhöld', 'Borðbúnaður'],
        },
        'Baðherbergi': {
          'Húsgögn': ['Speglar', 'Skápar', 'Handklæðahaldari', 'Sturtuþyrill'],
        },
        'Garður og útikjallari': {
          'Garðhúsgögn': ['Garðstólar', 'Garðborð', 'Sólstólar', 'Grillur og BBQ'],
          'Garðtæki': ['Grasaliðar', 'Hreinsitæki', 'Garðfæri'],
        },
        'Innréttingarlýsing': {
          'Ljósakerfi': ['Gólflýsingar', 'Borðlýsingar', 'Loftljós', 'Veggljós', 'Smart lýsing'],
        },
      },
    },
  
    'Bílar og farartæki': {
      icon: '🚗',
      subcategories: {
        'Fólksbílar': {
          'Gerð': ['Sedan', 'Hatchback', 'SUV og jeppar', 'Stationwagon', 'Minivan', 'Cabriolet', 'Coupé'],
          'Eldsneyti': ['Bensín', 'Dísel', 'Rafmagn', 'Hybrid', 'Vélagas'],
        },
        'Bifhjól': {
          'Gerð': ['Motorbifhjól', 'Scooter', 'Moped', 'Enduro', 'Dirt bike'],
        },
        'Reiðhjól': {
          'Gerð': ['Götureiðhjól', 'Fjallareiðhjól', 'Gravel reiðhjól', 'BMX', 'Rafmagnsreiðhjól', 'Reiðhjól fyrir börn'],
        },
        'Bílavarahlutir': {
          'Dekkjar og felgur': ['Sumardekkjar', 'Vetradekkjar', 'Stálfelgur', 'Léttfelgur'],
          'Innréttingar': ['Bílstólar', 'Stýrár', 'Mats', 'GPS'],
          'Ytri hlutir': ['Hjólhlífar', 'Spoilers', 'Þaksett', 'Biltjöld'],
          'Vélarhlutir': ['Batterí', 'Olía og vökvar', 'Lofthreinsar', 'Bremsur'],
        },
        'Önnur farartæki': {
          'Gerð': ['Hlaupahjól', 'Einhjólingur', 'ATV / Quad', 'Snjóscooter', 'Bátar'],
        },
      },
    },
  
    'Íþróttir og útivist': {
      icon: '⚽',
      subcategories: {
        'Knattspyrna': {
          'Búnaður': ['Knattspyrnuskór', 'Gæsluvörur', 'Hlífðarbúnaður', 'Boltар', 'Leikjafatnaður'],
        },
        'Körfubolti': {
          'Búnaður': ['Körfuboltaskór', 'Körfuboltafatnaður', 'Boltар'],
        },
        'Hjólreiðar': {
          'Hjólreiðabúnaður': ['Hjálmar', 'Handskár', 'Hlífðarbúnaður', 'Hjólabúningur', 'Hjólreiðapokar'],
        },
        'Sund': {
          'Sundbúnaður': ['Sundgleraugu', 'Sundhattar', 'Sundföt', 'Svigunar'],
        },
        'Skíðaiþróttir': {
          'Skíður': ['Alpine skíður', 'Langlíðskíður', 'Snowboard'],
          'Skíðaskór': ['Alpine skíðaskór', 'Snowboard skór'],
          'Skíðaföt': ['Skíðajakkar', 'Skíðabuxur', 'Skíðasettar'],
          'Fylgihlutir': ['Skíðahjálmar', 'Skíðaglerur', 'Skíðahandskár', 'Skíðastafar'],
        },
        'Útivist og fjallganga': {
          'Föt': ['Goretex jakkar', 'Fleece', 'Útivistarskór', 'Ullarsokkar'],
          'Búnaður': ['Bakpokar', 'Tjöld', 'Svefnpokár', 'Eldavélar', 'Leiðsöguvörur'],
        },
        'Líkamsrækt': {
          'Tæki': ['Þyngdarstöng og diskár', 'Kettlebells', 'Resistance bands', 'Yoga motta', 'Crossfit búnaður'],
          'Þjálfunarbúnaður': ['Jogging bretti', 'Reiðhjól', 'Rowing machine'],
        },
        'Golf': {
          'Golfbúnaður': ['Golfkylfor', 'Golftöskur', 'Golfboltар', 'Golfskór', 'Golfföt'],
        },
        'Annað': {
          'Aðrar íþróttir': ['Tennis', 'Badminton', 'Pádel', 'Kampsport', 'Rugger', 'Handbolti'],
        },
      },
    },
  
    'Leikföng og barnabúnaður': {
      icon: '🧸',
      subcategories: {
        'Leikföng': {
          '0–2 ára': ['Hríslar', 'Leikfimi', 'Mjúkar dúkkur', 'Músíktæki'],
          '3–5 ára': ['Briklur', 'Púsluspil', 'Búbburnar', 'Leikjabílar', 'Riddarar og prinsessur'],
          '6–10 ára': ['LEGO', 'Borðspil', 'Fjarstýrðar bílar', 'Figurines', 'Útivistartæki'],
          '11+ ára': ['Borðspil', 'Trading cards', 'Myndíhlutir', 'Tæknileikföng'],
        },
        'Barnabúnaður': {
          'Vagnar og stólar': ['Barnakerra', 'Kerruföt', 'Háir stólar', 'Bílastólar', 'Burðarpokar'],
          'Svefn': ['Barnagrind', 'Bassinet', 'Skipta borð', 'Svefnpokar'],
          'Fæða': ['Brjóstadæla', 'Flaskar', 'Háar stólar', 'Barnamat tæki'],
          'Bad og hreinlæti': ['Baðker', 'Gleymsluspjall', 'Pottar'],
        },
        'Leikjatæki og tölvuleikir': {
          'Leiktæki': ['Nintendo Switch leikir', 'PS leikir', 'Xbox leikir', 'Handheld leiktæki'],
        },
      },
    },
  
    'Bækur og tónlist': {
      icon: '📚',
      subcategories: {
        'Bækur': {
          'Skáldskapur': ['Íslenskar skáldsögur', 'Þýddar skáldsögur', 'Fantasy og Sci-fi', 'Glæpasögur'],
          'Fræðibækur': ['Sögu- og menningarbækur', 'Vísindir', 'Heimspeki', 'Sjálfshjálp'],
          'Barnabækur': ['Myndasögur', 'Unglingabókmenntir', 'Námsefni'],
          'Annað': ['Matreiðslubækur', 'Listabækur', 'Tímarit', 'Myndasögur (manga)'],
        },
        'Tónlist': {
          'Hljóðfæri': ['Rafmagnsgítar', 'Hljómgítar', 'Bas', 'Trommur', 'Píanó og keyboard', 'Blásturshljóðfæri', 'Strengjahljóðfæri'],
          'Hljóðfærafylgihlutir': ['Gítarstrengir', 'Picks', 'Gítarveskar', 'Pedalar', 'Amplifiers'],
          'Plötur og CD': ['Vínylplötur', 'CD plötur', 'Kasettur'],
          'DJ og hljóðbúnaður': ['DJ borð', 'Mixers', 'Hljóðnemar', 'Hljóðkort'],
        },
      },
    },
  
    'Listir og söfnun': {
      icon: '🎨',
      subcategories: {
        'Myndlist': {
          'Gerð': ['Olíumálverk', 'Vatnslitamálverk', 'Prentlitir', 'Myndir og ljósmyndir', 'Skúlptúr', 'Teikningar'],
        },
        'Söfnun': {
          'Tegund': ['Frímerkasöfnun', 'Myntasöfnun', 'Leikfangasöfnun', 'Sports cards', 'Pokémon kort', 'Vínylplötur'],
        },
        'Listavörur og handverk': {
          'Tegund': ['Prjóna- og hekluvorur', 'Handmálaðar vörur', 'Keramík', 'Smíði'],
        },
      },
    },
  
    'Annað': {
      icon: '📦',
      subcategories: {
        'Garðurinn': {
          'Garðbúnaður': ['Pottaplöntur', 'Garðverkfæri', 'Grill og BBQ', 'Garðhúsgögn'],
        },
        'Verkfæri': {
          'Verkfæri': ['Rafknúin verkfæri', 'Handverkfæri', 'Mælitæki', 'Málningarbúnaður'],
        },
        'Heilsa og fegurð': {
          'Tegund': ['Húðvörður', 'Hárgreiðslutæki', 'Líkamsræktartæki', 'Masserar'],
        },
        'Gæludýr': {
          'Tegund': ['Gæludýrafæði', 'Gæludýraleikföng', 'Rúm og búrið', 'Fatnаður'],
        },
        'Ýmislegt': {
          'Tegund': ['Skrifstofubúnaður', 'Skólar og námsefni', 'Partýbúnaður', 'Annað'],
        },
      },
    },
  }
  
  // ─── SIZES ────────────────────────────────────────────────────────────────────
  export const SIZES = {
    'Konur': {
      'Yfirföt': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      'Peysar og hettupeysar': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'Bolir': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'Skyrtur': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'Buxur': ['32', '34', '36', '38', '40', '42', '44', '46', 'XS', 'S', 'M', 'L', 'XL'],
      'Stuttbuxur': ['32', '34', '36', '38', '40', '42', '44', 'XS', 'S', 'M', 'L', 'XL'],
      'Kjólar': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'Pilsar': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'default': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    'Karlar': {
      'Yfirföt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      'Peysar og hettupeysar': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
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
    { value: 'ny_med_mida', label: 'Ný — með miða' },
    { value: 'ny_an_mida', label: 'Ný — án miða' },
    { value: 'mjog_god', label: 'Mjög góð — lítið merki um notkun' },
    { value: 'god', label: 'Góð — notuð en vel haldin' },
    { value: 'notud', label: 'Notuð — sýnileg notkun' },
    { value: 'gamall', label: 'Slæm — galli eða mikil slitni' },
  ]
  
  // ─── COLORS ───────────────────────────────────────────────────────────────────
  export const COLORS = [
    'Svartur', 'Hvítur', 'Grár', 'Brúnn', 'Beige', 'Blátt',
    'Dökkblátt', 'Rauður', 'Bleikur', 'Fjólublár', 'Grænn',
    'Gulur', 'Appelsínugulur', 'Gullinbrúnn', 'Marínublár',
    'Bordeaux', 'Kaki', 'Flekkóttur', 'Rendað', 'Annað',
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
    if (mainCat === 'Skór og fylgihlutir') {
      if (subCat === 'Konur') return SIZES['Skór konur']
      if (subCat === 'Karlar') return SIZES['Skór karlar']
      if (subCat === 'Börn') return SIZES['Skór börn']
    }
    if (mainCat === 'Föt og fatnaður') {
      const sub = SIZES[subCat]
      if (sub) return sub[groupCat] || sub['default']
    }
    return null
  }