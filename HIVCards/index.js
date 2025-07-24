// index1.js
require('dotenv').config();

const express    = require('express');
const bodyParser = require('body-parser');
const axios      = require('axios');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── STATIC ASSETS ─────────────────────────────────────────────────────────────
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/info',   express.static(path.join(__dirname, 'InformationCards')));
app.get('/', (req, res) => {
  res.redirect('/info/GeneralInfoStandardEnglish.html');
});

// under your existing /download/general-hiv-info route
app.get('/download/general-hiv-info-afrikaans', (req, res) => {
  const filePath = path.join(__dirname, 'InformationCards', 'GeneralInfoAfrikaans.html');
  res.download(filePath, 'Algemene_HIV_Inligting.html');
});


app.get('/download/general-hiv-info', (req, res) => {
  const filePath = path.join(__dirname, 'InformationCards', 'GeneralInforStandardEnglish.html');
  res.download(filePath, 'General_HIV_Info.html');
});

async function sendSMS(to, content) {
  const url = `https://api.telerivet.com/v1/projects/${process.env.TELERIVET_PROJECT_ID}/messages/send`;
  const body = {
    to_number: to,
    content,
    route_id: process.env.TELERIVET_PHONE_ID
  };
  await axios.post(url, body, {
    auth: {
      username: process.env.TELERIVET_API_KEY,
      password: ''
    }
  });
}


// ─── LANGUAGE CONFIG ───────────────────────────────────────────────────────────
const languageMap = {
  '1': 'english',
  '2': 'afrikaans',
  '3': 'oshwambo',
  '4': 'khoekhoe',
  '5': 'otjiherero'
};

const messages = {
  english: {
    serviceMenu: `What do you require?\n1. HIV Information\n2. Get Tested\n3. Talk to Someone`,
    hivInfoMenu: `What information would you like?\n1. General\n2. Living with HIV\n3. Rights\n4. Getting Tested`,
    versionMenu: `Which version?\n1. Standard\n2. Children\n3. Deaf Friendly\n4. Audio`,
    testingRegions: `Here are the regions:`,
    testingTowns: reg => `Select town in ${reg}:`,
    talkEnd: `Thank you. A counselor will reach out to you shortly.`,
    invalid: `Invalid option. Thank you for using our service.`,
    langUnavailable: `Sorry, that language is not yet supported.`,
    smsInfoSent: `Your information link has been sent via SMS. Thank you!`,
    smsTestSent: `A testing-centres link has been sent via SMS. Please check your inbox.`
  },
  afrikaans: {
    serviceMenu: `Wat benodig u?\n1. HIV-inligting\n2. Laat toets doen\n3. Praat met iemand`,
    hivInfoMenu: `Watter inligting wil u hê?\n1. Algemeen\n2. Lewe met HIV\n3. Regte\n4. Toets doen`,
    versionMenu: `Watter weergawe?\n1. Standaard\n2. Kinders\n3. Deaf Friendly\n4. Audio`,
    testingRegions: `Hier is die streke:`,
    testingTowns: reg => `Kies dorp in ${reg}:`,
    talkEnd: `Dankie. ’n Berader sal binnekort met u skakel.`,
    invalid: `Ongeldige opsie. Dankie vir die gebruik van ons diens.`,
    langUnavailable: `Jammer, daardie taal word nog nie ondersteun nie.`,
    smsInfoSent: `U inligtingskakel is via SMS gestuur. Dankie!`,
    smsTestSent: `’n Toets-stasies-koppelvlak is via SMS gestuur. Kyk asseblief in u inkassie.`
  }
};

// ─── REGIONS AND TOWNS ─────────────────────────────────────────────────────────
const regionMap = {
  '1': 'Erongo', '2': 'Hardap', '3': 'Kavango East', '4': 'Kavango West',
  '5': 'Khomas', '6': 'Kunene', '7': 'Ohangwena', '8': 'Omaheke',
  '9': 'Omusati', '10': 'Oshana', '11': 'Oshikoto', '12': 'Otjozondjupa',
  '13': 'Zambezi', '14': 'Karas'
};

const townsMap = {
  '1': ['Walvis Bay','Swakopmund','Omaruru'],
  '2': ['Mariental','Rehoboth','Gibeon'],
  // Add more if needed
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

// ─── USSD LOGIC ────────────────────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/ussd', async (req, res) => {
  const { text = '', phoneNumber = '' } = req.body;
  let parts = text === '' ? [] : text.split('*');
  let response = '';

  if (parts[parts.length - 1] === '0') parts.pop();

  if (parts.length === 0) {
    response = buildMenu('Welcome to Hope Inclusive!\nChoose your language:', Object.entries(languageMap).map(([k, v]) => `${k}. ${v.charAt(0).toUpperCase() + v.slice(1)}`));
  }
  else if (parts.length === 1) {
    const lk = getLangKey(parts[0]);
    const menu = getMsg(lk, 'serviceMenu') || messages.english.langUnavailable;
    response = menu ? buildMenu(menu) : 'END ' + messages.english.langUnavailable;
  }
  else if (parts[1] === '1' && parts.length === 2) {
    const lk = getLangKey(parts[0]);
    const menu = getMsg(lk, 'hivInfoMenu');
    response = menu ? buildMenu(menu) : 'END ' + messages.english.langUnavailable;
  }
  else if (parts[1] === '1' && parts.length === 3) {
    const lk = getLangKey(parts[0]);
    const menu = getMsg(lk, 'versionMenu');
    response = menu ? buildMenu(menu) : 'END ' + messages.english.langUnavailable;
  }
  else if (parts[1] === '1' && parts[2] === '1' && parts[3] === '1') {
    const lk = getLangKey(parts[0]);
    const route = lk === 'afrikaans'
   ? '/download/general-hiv-info-afrikaans'
     : '/download/general-hiv-info';
   const link = `${process.env.SERVER_URL}${route}`
    const sms = lk === 'afrikaans'
      ? `Laai Algemene HIV-inligting af: ${link}`
      : `Download General HIV Info here: ${link}`;
    
      try {https://8c5ff62c017a.ngrok-free.app
      await sendSMS(phoneNumber, sms);
      response = 'END ' + getMsg(lk, 'smsInfoSent');
    } catch (err) {
      console.error('Telerivet error:', err.message);
      response = 'END Sorry, SMS failed. Please try again later.';
    }
  }
  else if (parts[1] === '1' && parts[2] === '1' && ['2', '3', '4'].includes(parts[3])) {
    response = 'END Sorry, that version is not yet available.';
  }
  else if (parts[1] === '2' && parts.length === 2) {
    const lk = getLangKey(parts[0]);
    const hdr = getMsg(lk, 'testingRegions') || messages.english.testingRegions;
    const opts = Object.entries(regionMap).map(([k,v]) => `${k}. ${v}`);
    response = buildMenu(hdr, opts);
  }
  else if (parts[1] === '2' && parts.length === 3 && regionMap[parts[2]]) {
    const lk = getLangKey(parts[0]);
    const region = regionMap[parts[2]];
    const hdr = getMsg(lk, 'testingTowns', region) || messages.english.testingTowns(region);
    const opts = townsMap[parts[2]].map((t,i) => `${i+1}. ${t}`);
    response = buildMenu(hdr, opts);
  }
  else if (parts[1] === '2' && parts.length === 4 && regionMap[parts[2]] && townsMap[parts[2]][parts[3] - 1]) {
    const region = regionMap[parts[2]];
    const town = townsMap[parts[2]][parts[3] - 1];
    const link = `${process.env.SERVER_URL}/testing-centres/${encodeURIComponent(region)}/${encodeURIComponent(town)}`;
    const sms = `Testing centers in ${town}, ${region}: ${link}`;
    try {
      await sendSMS(phoneNumber, sms);
      response = 'END ' + getMsg(getLangKey(parts[0]), 'smsTestSent');
    } catch {
      response = 'END Sorry, SMS failed. Please try again later.';
    }
  }
  else if (parts[1] === '3' && parts.length === 2) {
    const lk = getLangKey(parts[0]);
    const txt = getMsg(lk, 'talkEnd') || messages.english.talkEnd;
    try {
      await sendSMS(phoneNumber, txt);
      response = 'END ' + txt;
    } catch {
      response = 'END Sorry, SMS failed. Please try again later.';
    }
  }
  else {
    const lk = getLangKey(parts[0]) || 'english';
    response = 'END ' + getMsg(lk, 'invalid');
  }

  res.type('text/plain').send(response);
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);
});
