# Icelandic test data

Generate test data with Icelandic full names and SSN (kennitala).

## Prerequisites

You must have [node](https://nodejs.org) and [yarn](https://yarnpkg.com) installed.

## Generating test data

1. Run `yarn install` to install dependencies.
2. Run `yarn generate` to generate test data. The command can take two arguments, the number of entries in the results and the output file. So you could for example run `yarn generate 100 test.json` to output 100 entries to _test.json_. By default 10 entries are created and saved to _people.json_.

You can also edit _index.js_ to customize your results. You can add fields to the data or change constants for middle name frequency and name rarity.
