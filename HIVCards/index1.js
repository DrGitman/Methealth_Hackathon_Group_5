// index1.js
require('dotenv').config();

const express    = require('express');
const bodyParser = require('body-parser');
const axios      = require('axios');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── STATIC ASSETS ─────────────────────────────────────────────────────────────
// serve images
app.use('/images', express.static(path.join(__dirname, 'images')));
// serve your HTML cards
app.use('/info',   express.static(path.join(__dirname, 'InformationCards')));
// root → redirect to your default English card
app.get('/', (req, res) => {
  res.redirect('/info/GeneralInfoStandardEnglish.html');
});

// ─── Telerivet SMS HELPER ────────────────────────────────────────────────────────
async function sendSMS(to, content) {
  const url  = `https://api.telerivet.com/v1/projects/${process.env.TELERIVET_PROJECT_ID}/messages.json`;
  const body = {
    to_number: to,
    content,
    phone_id:  process.env.TELERIVET_PHONE_ID
  };
  await axios.post(url, body, {
    auth: {
      username: process.env.TELERIVET_API_KEY,
      password: ''   // Telerivet uses blank password
    }
  });
}

// ─── MENU CONFIG ────────────────────────────────────────────────────────────────
const languageMap = {
  '1': 'english',
  '2': 'afrikaans',
  '3': 'oshwambo',
  '4': 'khoekhoe',
  '5': 'otjiherero'
};

const messages = {
  english: {
    serviceMenu: `What do you require?
1. HIV Information
2. Get Tested
3. Talk to Someone`,
    hivInfoMenu: `What information would you like?
1. General
2. Living with HIV
3. Rights
4. Getting Tested`,
    versionMenu: `Which version?
1. Standard
2. Children
3. Deaf Friendly
4. Audio`,
    testingRegions: `Here are the regions:`,
    testingTowns: reg => `Select town in ${reg}:`,
    talkEnd: `Thank you. A counselor will reach out to you shortly.`,
    invalid: `Invalid option. Thank you for using our service.`,
    langUnavailable: `Sorry, that language is not yet supported.`,
    smsInfoSent: `Your information link has been sent via SMS. Thank you!`,
    smsTestSent: `A testing-centres link has been sent via SMS. Please check your inbox.`
  },
  afrikaans: {
    serviceMenu: `Wat benodig u?
1. HIV-inligting
2. Laat toets doen
3. Praat met iemand`,
    hivInfoMenu: `Watter inligting wil u hê?
1. Algemeen
2. Lewe met HIV
3. Regte
4. Toets doen`,
    versionMenu: `Watter weergawe?
1. Standaard
2. Kinders
3. Deaf Friendly
4. Audio`,
    testingRegions: `Hier is die streke:`,
    testingTowns: reg => `Kies dorp in ${reg}:`,
    talkEnd: `Dankie. ’n Berader sal binnekort met u skakel.`,
    invalid: `Ongeldige opsie. Dankie vir die gebruik van ons diens.`,
    langUnavailable: `Jammer, daardie taal word nog nie ondersteun nie.`,
    smsInfoSent: `U inligtingskakel is via SMS gestuur. Dankie!`,
    smsTestSent: `’n Toets-stasies-koppelvlak is via SMS gestuur. Kyk asseblief in u inkassie.`
  }
};

const regionMap = {
  '1':'Erongo','2':'Hardap','3':'Kavango East','4':'Kavango West',
  '5':'Khomas','6':'Kunene','7':'Ohangwena','8':'Omaheke',
  '9':'Omusati','10':'Oshana','11':'Oshikoto','12':'Otjozondjupa',
  '13':'Zambezi','14':'Karas'
};

const townsMap = {
  '1':['Walvis Bay','Swakopmund','Omaruru'],
  '2':['Mariental','Rehoboth','Gibeon'],
  // …add the rest of your towns here…
};

// ─── HELPERS ────────────────────────────────────────────────────────────────────
function getLangKey(sel) {
  return languageMap[sel] || null;
}
function getMsg(langKey, key, ...args) {
  const lang = messages[langKey];
  if (!lang || !lang[key]) return null;
  const tmpl = lang[key];
  return typeof tmpl === 'function' ? tmpl(...args) : tmpl;
}
function buildMenu(header, lines=[]) {
  return ['CON ' + header, ...lines, '0. Back'].join('\n');
}

// ─── USSD ENDPOINT ──────────────────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', async (req, res) => {
  const { text = '', phoneNumber = '' } = req.body;
  let parts = text === '' ? [] : text.split('*');
  let response = '';

  // handle “0. Back”
  if (parts[parts.length-1] === '0') {
    parts.pop();
  }

  // 1️⃣ Language selection
  if (parts.length === 0) {
    response = buildMenu(
      'Welcome to Hope Inclusive!\nChoose your language:',
      Object.entries(languageMap).map(([k, v]) =>
        `${k}. ${v.charAt(0).toUpperCase() + v.slice(1)}`
      )
    );
  }
  // 2️⃣ Service menu (after language)
  else if (parts.length === 1) {
    const lk = getLangKey(parts[0]);
    const menu = getMsg(lk, 'serviceMenu') || messages.english.langUnavailable;
    if (!getMsg(lk, 'serviceMenu')) {
      response = 'END ' + messages.english.langUnavailable;
    } else {
      response = buildMenu(menu);
    }
  }
  // 3️⃣ HIV-info submenu
  else if (parts[1] === '1' && parts.length === 2) {
    const lk   = getLangKey(parts[0]);
    const menu = getMsg(lk, 'hivInfoMenu');
    response = menu
      ? buildMenu(menu)
      : 'END ' + messages.english.langUnavailable;
  }
  // 4️⃣ Version submenu
  else if (parts[1] === '1' && parts.length === 3) {
    const lk   = getLangKey(parts[0]);
    const menu = getMsg(lk, 'versionMenu');
    response = menu
      ? buildMenu(menu)
      : 'END ' + messages.english.langUnavailable;
  }
  // 5️⃣ Send SMS for “General → Standard” only
  else if (parts[1] === '1' && parts[2] === '1' && parts.length === 4) {
    const lk    = getLangKey(parts[0]);
    const link  = `${process.env.SERVER_URL}/info/GeneralInfoStandardEnglish.html`;
    const sms   = lk === 'afrikaans'
                  ? `Laai Algemene HIV-inligting af: ${link}`
                  : `Download General HIV Info here: ${link}`;
    try {
      await sendSMS(phoneNumber, sms);
      response = 'END ' + getMsg(lk, 'smsInfoSent');
    } catch (err) {
      console.error('Telerivet error:', err.message);
      response = 'END Sorry, SMS failed. Please try again later.';
    }
  }
  // 3️⃣b “Get Tested” → regions
  else if (parts[1] === '2' && parts.length === 2) {
    const lk   = getLangKey(parts[0]);
    const hdr  = getMsg(lk, 'testingRegions') || messages.english.testingRegions;
    const opts = Object.entries(regionMap).map(([k,v]) => `${k}. ${v}`);
    response = buildMenu(hdr, opts);
  }
  // 4️⃣b region → towns
  else if (parts[1] === '2' && parts.length === 3 && regionMap[parts[2]]) {
    const lk     = getLangKey(parts[0]);
    const region = regionMap[parts[2]];
    const hdr    = getMsg(lk, 'testingTowns', region)
                  || messages.english.testingTowns(region);
    const opts   = townsMap[parts[2]].map((t,i) => `${i+1}. ${t}`);
    response = buildMenu(hdr, opts);
  }
  // 5️⃣b send SMS for testing-centres link
  else if (parts[1] === '2'
        && parts.length === 4
        && regionMap[parts[2]]
        && townsMap[parts[2]][parts[3]-1]) {
    const region = regionMap[parts[2]];
    const town   = townsMap[parts[2]][parts[3]-1];
    const link   = `${process.env.SERVER_URL}/testing-centres/${encodeURIComponent(region)}/${encodeURIComponent(town)}`;
    const sms    = `Testing centers in ${town}, ${region}: ${link}`;
    try {
      await sendSMS(phoneNumber, sms);
      response = 'END ' + getMsg(getLangKey(parts[0]), 'smsTestSent');
    } catch {
      response = 'END Sorry, SMS failed. Please try again later.';
    }
  }
  // 3️⃣c “Talk to Someone”
  else if (parts[1] === '3' && parts.length === 2) {
    const lk  = getLangKey(parts[0]);
    const txt = getMsg(lk, 'talkEnd') || messages.english.talkEnd;
    try {
      await sendSMS(phoneNumber, txt);
      response = 'END ' + txt;
    } catch {
      response = 'END Sorry, SMS failed. Please try again later.';
    }
  }
  // fallback invalid
  else {
    const lk = getLangKey(parts[0]) || 'english';
    response = 'END ' + getMsg(lk, 'invalid');
  }

  res.type('text/plain').send(response);
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);  
});
