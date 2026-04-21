const generateProductId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from(
    { length: 3 },
    () => letters[Math.floor(Math.random() * letters.length)],
  ).join("");
  const randomNumbers = Math.floor(10000 + Math.random() * 90000);
  return `${randomLetters}${randomNumbers}`;
};

const generateCombinations = (arrays) => {
  if (!arrays || arrays.length === 0) return [];
  const result = [];
  const max = arrays.length - 1;
  const helper = (arr, i) => {
    for (let j = 0, l = arrays[i].length; j < l; j++) {
      const a = [...arr, arrays[i][j]];
      if (i === max) result.push(a);
      else helper(a, i + 1);
    }
  };
  helper([], 0);
  return result;
};

module.exports = {
  generateProductId,
  generateCombinations,
};
