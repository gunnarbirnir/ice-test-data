const fs = require("fs");
const fetch = require("node-fetch");
const utf8 = require("utf8");

const maleFirstNames = require("./data/maleFirstNames.json");

const BATCH_SIZE = 10;
const BATCH_INTERVAL = 10000;
const DEFAULT_FILE_NAME = "data/lastNames.json";
const GRAMMAR_API_URL = "https://bin.arnastofnun.is/api/ord";

const fileName = process.argv[2] || DEFAULT_FILE_NAME;
const totalCount = maleFirstNames.length;
const results = [];
let notFound = 0;
let started = 0;

processBatch();
// Only do 10 names at a time to not overwhelm API
const interval = setInterval(() => {
  if (started >= totalCount) {
    clearInterval(interval);
  } else {
    processBatch();
  }
}, BATCH_INTERVAL);

function processBatch() {
  const promises = [];
  const currentBatch = Math.min(BATCH_SIZE, totalCount - started);
  const batchNumber = `${started + 1}-${started + currentBatch}`;
  console.log(`Processing names ${batchNumber}`);

  for (let i = 0; i < currentBatch; i++) {
    promises.push(fetchLastName(started + i));
  }
  started += currentBatch;

  Promise.all(promises).then((lastNames) => {
    const successNames = lastNames.filter((name) => !!name);
    successNames.forEach((name) => results.push(name));
    notFound += lastNames.length - successNames.length;
    console.log(
      `Names ${batchNumber} successful: ${successNames.length}/${currentBatch}`
    );

    if (results.length + notFound >= totalCount) {
      writeToFile();
    }
  });
}

function writeToFile() {
  console.log("---------------------------------");
  console.log(`Successful: ${results.length}`);
  console.log(`Not found: ${notFound}`);
  console.log("---------------------------------");

  fs.writeFile(fileName, JSON.stringify(results, null, 2), function (err) {
    if (err) throw err;
    console.log(`Last names written to: ${fileName}`);
  });
}

async function fetchLastName(index) {
  const response = await fetch(
    `${GRAMMAR_API_URL}/${utf8.encode(maleFirstNames[index])}`
  );

  try {
    const json = await response.json();
    return json[0].bmyndir.find((m) => m.g === "EFET").b;
  } catch {
    return "";
  }
}
