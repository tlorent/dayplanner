export const DAYS = ["Ma", "Di", "Wo", "Do", "Vr"];
export const FULL_DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];

export const TASKS = {
  daily: [
    { id: "d1",  label: "Frontend Masters video (~30 min)",               tag: "leren" },
    { id: "d2",  label: "HYF les-segment schrijven (~30–60 min)",         tag: "leren" },
    { id: "d3",  label: "3–5 LinkedIn posts liken/reageren",              tag: "linkedin" },
    { id: "d4",  label: "Reageer op reacties op eigen content",           tag: "linkedin" },
    { id: "d5",  label: "Leeskring: 5 comments op boekaccounts",         tag: "leeskring" },
    { id: "d6",  label: "Leeskring: 1 post publiceren of voorbereiden",  tag: "leeskring" },
    { id: "d7",  label: "Sudo: 5 comments op relevante posts",           tag: "sudo" },
    { id: "d8",  label: "Sudo: 1 post publiceren of voorbereiden",       tag: "sudo" },
    { id: "d9",  label: "Beyond Commit: pipeline actie uitvoeren",       tag: "bc" },
    { id: "d10", label: "PingPilot: minimaal 1 uur bouwen",              tag: "pingpilot" },
    { id: "d11", label: "Noteer wat je bouwde (input voor vrijdagpost)", tag: "pingpilot" },
  ],
  0: [ // Maandag
    { id: "ma1", label: "5 nieuwe ICP's toevoegen aan pipeline (dag 1: volgen)", tag: "bc" },
    { id: "ma2", label: "1 LinkedIn post schrijven: Beyond Commit content",       tag: "linkedin" },
    { id: "ma3", label: "3 connectieverzoeken sturen naar leads op dag 7",        tag: "bc" },
    { id: "ma4", label: "Sudo: samenwerkingsverzoek sturen",                      tag: "sudo" },
  ],
  1: [ // Dinsdag
    { id: "di1", label: "PingPilot deep work: 3–4 uur bouwen", tag: "pingpilot" },
    { id: "di2", label: "Kort noteren wat je bouwde",           tag: "pingpilot" },
  ],
  2: [ // Woensdag
    { id: "wo1", label: "Leeskring: 3–5 uitgeverijen/podcasts mailen, óf",          tag: "leeskring" },
    { id: "wo2", label: "Leeskring: 2 Instagram posts plannen + publiceren, óf",    tag: "leeskring" },
    { id: "wo3", label: "Leeskring: reageren op 5 posts van grotere boekaccounts",  tag: "leeskring" },
    { id: "wo4", label: "1 LinkedIn post schrijven: Story (eigen ervaring)",         tag: "linkedin" },
  ],
  3: [ // Donderdag
    { id: "do1", label: "5 outreach mails naar geconnecte leads", tag: "bc" },
    { id: "do2", label: "PingPilot bouwen (extra blok)",           tag: "pingpilot" },
  ],
  4: [ // Vrijdag
    { id: "vr1", label: "1 LinkedIn building-in-public post over PingPilot", tag: "linkedin" },
    { id: "vr2", label: "Elke 2–3 weken: standalone post over FHWTTL",      tag: "linkedin" },
    { id: "vr3", label: "5 nieuwe ICP's toevoegen aan pipeline",             tag: "bc" },
    { id: "vr4", label: "1 LinkedIn post schrijven: Hot take",               tag: "linkedin" },
  ],
};

export function getTodayIndex() {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return 0; // Weekend → default to Monday
  return day - 1; // Monday=1 → 0, ..., Friday=5 → 4
}
