import { reactive } from 'vue';

export const DEBOUNCE_DURATION = 350;
export const ScrollState = reactive({
  trigger: false,
});
export const removeLastSymbol = (text: string) => text.replace(/.$/, '');
export const removeDuplicates = (arr: any) => [...new Set(arr)];
export function convertCamelCaseToNormal(text: string) {
  // Split the string by capital letters and join with a space
  const sequence = text.split(/(?=[A-Z])/).join(' ');
  // Capitalize the first letter
  const firstLetterCapitalized =
    sequence.charAt(0).toUpperCase() + sequence.slice(1);
  return firstLetterCapitalized;
}
const newLineExpression = /\r\n|\n\r|\n|\r/g;
export const removeDuplicatedLines = (text: string) => {
  return text
    .split(newLineExpression)
    .filter((item, index, array) => array.indexOf(item) === index)
    .join('\n');
};
