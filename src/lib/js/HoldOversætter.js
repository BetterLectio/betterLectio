import { get } from "./http.js";

export function HoldOversætter(holdForkortet = String, holdArray = Array) {
  let indstillinger = JSON.parse(localStorage.getItem("indstillinger")); // get the settings from localStorage
  if (indstillinger.brugHoldOversætter == false) return holdForkortet;
  if (holdForkortet == null) return "Ukendt hold"; // return "Ukendt hold" if holdForkortet is null
  let fagObj = JSON.stringify(holdArray.find((hold) => holdForkortet.toLowerCase().includes(hold.forkortelse.toLowerCase()))); // return the name of the hold if the holdForkortet is found in the holdArray
  if (fagObj == null) return holdForkortet;
  return JSON.parse(fagObj).fag;
}

export async function HoldOversætterNy(holdId = String) {
  try {
    let fag = await get("/hold_til_fag?id=" + holdId);
    console.log(fag);
    return fag.fag;
  } catch {
    return "Andet";
  }
}
