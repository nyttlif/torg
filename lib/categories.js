export const CATEGORIES = {
    'Föt og fatnaður': {
      icon: '👕',
      subcategories: {
        'Konur': {
          'Yfirföt': ['Jakkar', 'Frakkar', 'Regnföt', 'Skíðaföt'],
          'Efstir hlutар': ['Bolir', 'Skyrtur', 'Peysar', 'Hettupeysar', 'Vesti'],
          'Neðstir hlutar': ['Buxur', 'Gallabuxur', 'Stuttbuxur', 'Pilsar', 'Kjólar'],
          'Íþróttaföt': ['Leiðarföt', 'Hlaupabuxur', 'Sportbolir'],
          'Aðrar flokkar': ['Sundföt', 'Nærföt', 'Sokkar', 'Hálsar og hattar'],
        },
        'Karlar': {
          'Yfirföt': ['Jakkar', 'Frakkar', 'Regnföt', 'Skíðaföt'],
          'Efstir hlutar': ['Bolir', 'Skyrtur', 'Peysar', 'Hettupeysar', 'Vesti'],
          'Neðstir hlutar': ['Buxur', 'Gallabuxur', 'Stuttbuxur'],
          'Íþróttaföt': ['Leiðarföt', 'Hlaupabuxur', 'Sportbolir'],
          'Aðrar flokkar': ['Sundföt', 'Nærföt', 'Sokkar', 'Hálsar og hattar'],
        },
        'Börn': {
          'Stúlkur 0-12 ára': ['Yfirföt', 'Bolir', 'Buxur', 'Kjólar', 'Skór'],
          'Drengir 0-12 ára': ['Yfirföt', 'Bolir', 'Buxur', 'Skór'],
          'Unglingar': ['Yfirföt', 'Bolir', 'Buxur', 'Skór'],
        },
      },
    },
    'Skór og fylgihlutir': {
      icon: '👟',
      subcategories: {
        'Konur': {
          'Hversdagsskór': ['Gönguskór', 'Lófaskór', 'Sandalar'],
          'Tískuskór': ['Hælar', 'Stígvélar', 'Strimlaðir skór'],
          'Íþróttaskór': ['Hlaupaskór', 'Körfuboltaskór', 'Fótboltaskór'],
        },
        'Karlar': {
          'Hversdagsskór': ['Gönguskór', 'Lófaskór', 'Sandalar'],
          'Tískuskór': ['Stígvélar', 'Leðurskór'],
          'Íþróttaskór': ['Hlaupaskór', 'Körfuboltaskór', 'Fótboltaskór'],
        },
        'Börn': {
          'Skór': ['Göngusskór', 'Stígvélar', 'Íþróttaskór'],
        },
      },
    },
    'Rafræn tæki': {
      icon: '📱',
      subcategories: {
        'Símar og spjaldtölvur': {
          'Snjallsímar': ['iPhone', 'Samsung', 'Aðrir símar'],
          'Spjaldtölvur': ['iPad', 'Samsung Galaxy Tab', 'Aðrar spjaldtölvur'],
          'Fylgihlutir': ['Hulstur', 'Hleðslutæki', 'Heyrnartól'],
        },
        'Tölvur': {
          'Fartölvur': ['Apple MacBook', 'Windows fartölva', 'Chromebook'],
          'Borðtölvur': ['iMac', 'Windows borðtölva'],
          'Fylgihlutir': ['Skjáir', 'Lyklaborð', 'Mýs', 'Prentarar'],
        },
        'Leiktæki': {
          'Leiktæki': ['PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch'],
          'Leikir': ['PS5 leikir', 'PS4 leikir', 'Xbox leikir', 'Nintendo leikir'],
          'Fylgihlutir': ['Stýrar', 'Heyrnartól', 'Minnisspjöld'],
        },
        'Sjónvörp og hljóð': {
          'Sjónvörp': ['OLED', 'QLED', 'LED', '4K'],
          'Hljóðtæki': ['Hátalarar', 'Heyrnartól', 'Hljómborð'],
          'Myndavélar': ['DSLR', 'Myndbandalélar', 'GoPro'],
        },
      },
    },
    'Húsgögn og heimilistæki': {
      icon: '🛋️',
      subcategories: {
        'Stofuherbergi': {
          'Húsgögn': ['Sófar', 'Borð', 'Hillur', 'Skápar'],
          'Innréttingar': ['Pertur', 'Tjöld', 'Mottur'],
        },
        'Svefnherbergi': {
          'Húsgögn': ['Rúm', 'Náttborð', 'Fataskápar', 'Kommóður'],
          'Rúmfatnaður': ['Koddar', 'Sængur', 'Lín'],
        },
        'Eldhús': {
          'Tæki': ['Ísskápar', 'Þvottavélar', 'Uppþvottavélar', 'Ofnar'],
          'Áhöld': ['Pottar og pönnur', 'Hnífar', 'Matvinnsluvélar'],
        },
        'Baðherbergi': {
          'Húsgögn': ['Speglar', 'Baðkarsstólar', 'Skápar'],
        },
      },
    },
    'Bílar og farartæki': {
      icon: '🚗',
      subcategories: {
        'Bílar': {
          'Fólksbílar': ['Sedan', 'Hatchback', 'SUV', 'Jeppi'],
          'Sendibílar': ['Sendibílar', 'Krani og búðarbílar'],
        },
        'Bifhjól og reiðhjól': {
          'Bifhjól': ['Motorbifhjól', 'Mopeder'],
          'Reiðhjól': ['Götureiðhjól', 'Fjallareiðhjól', 'Rafmagnreiðhjól'],
        },
        'Varahlutir': {
          'Bílavarahlutir': ['Dekkjar', 'Felgur', 'Vélarhlutir'],
        },
      },
    },
    'Íþróttir og útivist': {
      icon: '⚽',
      subcategories: {
        'Knattspyrna': {
          'Búnaður': ['Boltар', 'Skór', 'Gæsluvörur', 'Hlífðarbúnaður'],
        },
        'Hjólreiðar': {
          'Búnaður': ['Hjálmar', 'Handskár', 'Hjólabúningur'],
        },
        'Útivist': {
          'Fjallganga': ['Skór', 'Föt', 'Bakpokар', 'Tjöld'],
          'Skiing': ['Skíður', 'Stafar', 'Skíðaskór', 'Skíðaföt'],
        },
        'Líkamsrækt': {
          'Tæki': ['Þyngdarstöng', 'Lóðar', 'Crossfit búnaður'],
        },
      },
    },
    'Leikföng og barnabúnaður': {
      icon: '🧸',
      subcategories: {
        'Leikföng': {
          'Eftir aldri': ['0-2 ára', '3-5 ára', '6-10 ára', '11+ ára'],
          'Tegund': ['Briklur', 'Púsluspil', 'Búbburnar', 'Fjarstýrðar bílar'],
        },
        'Barnabúnaður': {
          'Ferðast': ['Barnavagnar', 'Bílastólar', 'Burðarpoki'],
          'Heimili': ['Háar stólar', 'Barnagrindur', 'Skipta borð'],
        },
      },
    },
    'Bækur og tónlist': {
      icon: '📚',
      subcategories: {
        'Bækur': {
          'Tegund': ['Skáldskapur', 'Fræðibækur', 'Myndasögur', 'Barnabækur', 'Matreiðslubækur'],
          'Tungumál': ['Íslenskt', 'Enska', 'Annað'],
        },
        'Tónlist': {
          'Hljóðfæri': ['Gítar', 'Píanó', 'Trommur', 'Blásturshljóðfæri'],
          'Plötur og CD': ['Vínylplötur', 'CD plötur'],
        },
      },
    },
    'Listir og söfnun': {
      icon: '🎨',
      subcategories: {
        'Listir': {
          'Tegund': ['Málverk', 'Myndir', 'Skúlptúr', 'Prentlitir'],
        },
        'Söfnun': {
          'Tegund': ['Frímerkir', 'Myndir af íþróttamönnum', 'Gamla peningar', 'Leikföng til söfnunar'],
        },
      },
    },
    'Annað': {
      icon: '📦',
      subcategories: {
        'Ýmislegt': {
          'Flokkur': ['Garðurinn', 'Verkfæri', 'Heilsa og fegurð', 'Gæludýr', 'Matvæli', 'Annað'],
        },
      },
    },
  }
  
  export const SIZES_BY_TYPE = {
    'Konur': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', '44'],
    'Karlar': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38'],
    'Börn': ['50', '56', '62', '68', '74', '80', '86', '92', '98', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164'],
    'Skór konur': ['35', '36', '37', '38', '39', '40', '41', '42'],
    'Skór karlar': ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
    'default': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  }
  
  export const CONDITIONS = [
    { value: 'ny', label: 'Ný — með miða' },
    { value: 'eins_og_ny', label: 'Eins og ný — aldrei notuð' },
    { value: 'mjog_god', label: 'Mjög góð — lítið merki um notkun' },
    { value: 'god', label: 'Góð — notuð en vel haldin' },
    { value: 'notuð', label: 'Notuð — sýnileg notkun' },
    { value: 'gömul', label: 'Gömul — galli eða slitnar' },
  ]
  
  export const COLORS = [
    'Svartur', 'Hvítur', 'Grár', 'Brúnn', 'Blátt', 'Rauður', 'Grænn',
    'Gulur', 'Appelsínugulur', 'Fjólublár', 'Bleikur', 'Gullinbrúnn', 'Marínublár', 'Flekkóttur', 'Annað',
  ]
  
  export const LOCATIONS = [
    'Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Garðabær',
    'Mosfellsbær', 'Árborg', 'Akranes', 'Vestmannaeyjar', 'Annað',
  ]
  
  export function getCategoryPath(main, sub, group, leaf) {
    return [main, sub, group, leaf].filter(Boolean).join(' > ')
  }