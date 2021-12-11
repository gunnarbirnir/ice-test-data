const fs = require("fs");

const maleFirstNames = require("./data/maleFirstNames.json");
const maleMiddleNames = require("./data/maleMiddleNames.json");
const femaleFirstNames = require("./data/femaleFirstNames.json");
const femaleMiddleNames = require("./data/femaleMiddleNames.json");
const lastNames = require("./data/lastNames.json");

const DEFAULT_SIZE = 10;
const MIDDLE_NAME_FREQUENCY = 0.65;
// Percentage of names to exclude (0-1)
const EXCLUDE_RARE_NAMES = 0;
const DEFAULT_FILE_NAME = "people.json";

const resultSize = process.argv[2] || DEFAULT_SIZE;
const fileName = process.argv[3] || DEFAULT_FILE_NAME;
const results = [];

for (let i = 0; i < resultSize; i++) {
  results.push({
    name: generateName(),
    ssn: generateSSN(),
    // More fields can be added here
  });
}
writeToFile();

function writeToFile() {
  fs.writeFile(fileName, JSON.stringify(results, null, 2), function (err) {
    if (err) throw err;
    console.log(`Written to: ${fileName}`);
  });
}

function generateName() {
  const isMale = !!Math.floor(Math.random() * 2);
  const hasMiddleName = Math.random() < MIDDLE_NAME_FREQUENCY;
  const firstNames = isMale ? maleFirstNames : femaleFirstNames;
  const middleNames = isMale ? maleMiddleNames : femaleMiddleNames;
  const lastNameEnding = isMale ? "son" : "dóttir";

  const excludedNames =
    EXCLUDE_RARE_NAMES > 0 && EXCLUDE_RARE_NAMES < 1 ? EXCLUDE_RARE_NAMES : 0;
  const excludedFirstNames = Math.floor(firstNames.length * excludedNames);
  const excludedMiddleNames = Math.floor(middleNames.length * excludedNames);
  const excludedLastNames = Math.floor(lastNames.length * excludedNames);

  const firstNameIndex = getRandomInt(
    excludedFirstNames,
    firstNames.length - 1
  );
  const middleNameIndex = getRandomInt(
    excludedMiddleNames,
    middleNames.length - 1
  );
  const lastNameIndex = getRandomInt(excludedLastNames, lastNames.length - 1);

  let name = firstNames[firstNameIndex];
  name += hasMiddleName ? ` ${middleNames[middleNameIndex]}` : "";
  name += ` ${lastNames[lastNameIndex]}${lastNameEnding}`;

  return name;
}

function generateSSN() {
  const yearOfBirth = getRandomInt(1922, 2022);
  const monthOfBirth = getRandomInt(1, 12);
  const maxDays =
    monthOfBirth === 2 ? 28 : [4, 6, 9, 11].includes(monthOfBirth) ? 30 : 31;
  const dayOfBirth = getRandomInt(1, maxDays);

  const dayStr = dayOfBirth < 10 ? `0${dayOfBirth}` : dayOfBirth.toString();
  const monthStr =
    monthOfBirth < 10 ? `0${monthOfBirth}` : monthOfBirth.toString();
  const yearStr = yearOfBirth.toString().slice(2, 4);
  const randomDigits = getRandomInt(20, 99);
  const checkDigit = getRandomInt(0, 9);
  const century = yearOfBirth >= 2000 ? "0" : "9";

  return `${dayStr}${monthStr}${yearStr}-${randomDigits}${checkDigit}${century}`;
}

// Can be used if adding more fields
function oneOf(options) {
  const index = getRandomInt(0, options.length - 1);
  return options[index];
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
