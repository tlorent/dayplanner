export const DAYS = ["Ma", "Di", "Wo", "Do", "Vr"];
export const FULL_DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];

export const TASKS = {
  daily: [
    { id: "d1",  label: "HYF les-segment schrijven",            tags: ["hyf"] },
    { id: "d2",  label: "Frontend Masters video",               tags: ["leren"] },
    { id: "d3",  label: "5 LinkedIn posts liken/reageren",    tags: ["linkedin", "bc"] },
    { id: "d4",  label: "Reageer op reacties op eigen content", tags: ["linkedin", "bc"] },
    { id: "d5",  label: "Pipeline actie uitvoeren",             tags: ["bc"] },
    { id: "d6",  label: "5 comments op boekaccounts",           tags: ["leeskring", "instagram"] },
    { id: "d7",  label: "1 post publiceren of voorbereiden",    tags: ["leeskring", "instagram"] },
    { id: "d8", label: "Leeskring: 3–5 uitgeverijen/podcasts/boekhandels mailen", tags: ["leeskring"] },
    { id: "d9",  label: "5 LinkedIn posts liken/reageren",    tags: ["linkedin", "sudo"] },
    { id: "d10",  label: "Reageer op reacties op eigen content", tags: ["linkedin", "sudo"] },
    { id: "d12",  label: "5 comments op relevante posts",        tags: ["sudo", "instagram"] },
    { id: "d13",  label: "1 post publiceren of voorbereiden",    tags: ["sudo", "instagram"] },
    { id: "d13", label: "PingPilot minimaal 1 uur bouwen",      tags: ["pingpilot"] },
    { id: "d14", label: "Noteer wat je bouwde (input voor vrijdagpost)", tags: ["pingpilot"] },
  ],0: [ // Maandag — Content dag
  { id: "ma1", label: "BC: LinkedIn post schrijven",           tags: ["bc", "linkedin"] },
  { id: "ma2", label: "Sudo: LinkedIn post schrijven",         tags: ["sudo", "linkedin"] },
  { id: "ma3", label: "5 nieuwe ICP's toevoegen aan pipeline", tags: ["bc"] },
],

1: [ // Dinsdag — Bouwen
  { id: "di1", label: "PingPilot deep work: 2 uur",         tags: ["pingpilot"] },
],

2: [ // Woensdag — Outreach + content
  { id: "wo1", label: "BC: LinkedIn post schrijven",           tags: ["bc", "linkedin"] },
  { id: "wo2", label: "Sudo: LinkedIn post schrijven",         tags: ["sudo", "linkedin"] },
],

3: [ // Donderdag — Bouwen + BC
  { id: "do1", label: "PingPilot deep work: 2 uur",         tags: ["pingpilot"] },
  { id: "do2", label: "BC: 5 outreach mails naar leads",      tags: ["bc"] },
],

4: [ // Vrijdag — Content + review
  { id: "vr1", label: "BC: LinkedIn post schrijven",           tags: ["bc", "linkedin"] },
  { id: "vr2", label: "Sudo: LinkedIn post schrijven",         tags: ["sudo", "linkedin"] },
  { id: "vr3", label: "PingPilot building-in-public post",    tags: ["pingpilot", "linkedin"] },
  { id: "vr4", label: "Weekreview: wat werkte, wat schuift",  tags: ["bc", "pingpilot"] },
]}

export function getTodayIndex() {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return 0; // Weekend → default to Monday
  return day - 1; // Monday=1 → 0, ..., Friday=5 → 4
}
