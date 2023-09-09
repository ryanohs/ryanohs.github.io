import data from "./resources/fips-counties-full.js"

const getByFipsAndState = (fips, state) => {
  if (!fips) throw new Error("You must provide a three digit fips code.");
  if (!state) throw new Error("You must provide a state name.");
  if (typeof fips !== "string") throw new Error("Fips code must be a string.");
  if (fips.length !== 3) throw new Error("Fips code must be three digits.");
  const row = data.find(county => county.countyfp === fips && county.state === state);

  return {
    state: row.state,
    county: row.countyname,
    countyfp: row.countyfp,
    fips: `${row.statefp}${row.countyfp}`
  };
};

const getByCountyAndState = (county, state) => {
  if (!state || !county)
    throw new Error("You must provide a state name and county name.");
  if (typeof state !== "string")
    throw new Error("State must be a string.");
  if (typeof county !== "string")
    throw new Error("County name must be a string.");

  const match = data.find(
    row =>
      row.countyname === county ||
      (row.countyname === county && row.state === state)
  );

  if(match == null)
  {
    throw `unknown county '${county}' in state '${state}'`
  }

  return {
    state: match.state,
    county: match.countyname,
    countyfp: match.countyfp,
    fips: `${match.statefp}${match.countyfp}`
  }
};

const get = options => {
  if (options.fips) return getByFipsAndState(options.fips, options.state);
  return getByCountyAndState(options.state, options.county);
};

const getCountiesByState = state => {
  return data.filter(c => c.state === state);
}

const search = regex => {
  if (!regex instanceof RegExp) return new Error('You must provide a regular expression.');
  return data.filter(row =>
    (
      regex.test(row.countyname) ||
      regex.test(row.countyfp) ||
      regex.test(row.statefp) ||
      regex.test(row.state)
    )
  ).map(result => ({
    state: result.state,
    county: result.countyname,
    countyfp: result.countyfp,
    fips: `${result.statefp}${result.countyfp}`
  }));
};

export default {
  get,
  getByCountyAndState,
  getByFipsAndState,
  getCountiesByState,
  search
};