export function HoldOversætter(holdForkortet=String, holdArray=Array) {
  if (holdForkortet == null) return "Ukendt hold"; // return "Ukendt hold" if holdForkortet is null
  let fagObj= JSON.stringify(holdArray.find(hold => holdForkortet.toLowerCase().includes(hold.forkortelse.toLowerCase()))); // return the name of the hold if the holdForkortet is found in the holdArray
  if (fagObj == null) return holdForkortet;
  return JSON.parse(fagObj).fag;
}