export const addWordToInputEnd = (input, suggestionWord) => {
  const endIndex = input.value.lastIndexOf(" ");
  const inputValueWithoutLastWord = input.value.substring(0, endIndex);
  input.value = inputValueWithoutLastWord + " " + suggestionWord;

  // focus to the end of the input
  input.scrollLeft = input.scrollWidth;
  input.focus();
};
