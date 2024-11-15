function generateCombinations(data) {
  const { include = [], exclude = [] } = data;

  // convert non-array values into arrays
  const matrix = Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => key !== 'include' && key !== 'exclude')
      .map(([key, value]) => [key, Array.isArray(value) ? value : [value]])
  );

  // generate all combinations using Cartesian product
  const combinations = cartesianProduct(Object.keys(matrix), Object.values(matrix));

  // Filter out excluded combinations
  exclude.forEach(ex => {
    for (let i = combinations.length - 1; i >= 0; i--) {
      if (Object.entries(ex).every(([k, v]) => combinations[i][k] === v)) {
        combinations.splice(i, 1);
      }
    }
  });

  // grepare for include modifications
  const modifiedCombos = Array(combinations.length).fill().map(() => ({}));
  const extraIncludes = [];

  // gpply included modifications or add new combinations
  include.forEach(inc => {
    let createNew = true;
    combinations.forEach((combo, i) => {
      if (Object.entries(inc).every(([k, v]) => !(k in combo) || combo[k] === v)) {
        Object.assign(modifiedCombos[i], inc);
        createNew = false;
      }
    });
    if (createNew) {
      extraIncludes.push(inc);
    }
  });

  // update original combinations with modified values
  combinations.forEach((combo, i) => {
    Object.assign(combo, modifiedCombos[i]);
  });

  return combinations.concat(extraIncludes);
}

// helper function for Cartesian product
function cartesianProduct(keys, values) {
  const results = [];

  function backtrack(index, current) {
    if (index === values.length) {
      results.push(Object.fromEntries(current.map((v, i) => [keys[i], v])));
      return;
    }
    for (const value of values[index]) {
      backtrack(index + 1, [...current, value]);
    }
  }

  backtrack(0, []);
  return results;
}