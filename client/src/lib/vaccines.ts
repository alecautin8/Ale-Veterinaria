export interface Vaccine {
  id: string;
  name: string;
  laboratory: string;
  type: string;
  pathogens: string[];
  species: string[];
}

export const chileanVaccines: Vaccine[] = [
  // Zoetis Vaccines
  {
    id: "zoetis-vanguard-plus5",
    name: "Vanguard Plus 5",
    laboratory: "Zoetis",
    type: "Polivalente",
    pathogens: ["Distemper", "Adenovirus tipo 1", "Adenovirus tipo 2", "Parainfluenza", "Parvovirus"],
    species: ["Canino"]
  },
  {
    id: "zoetis-vanguard-plus5-l4",
    name: "Vanguard Plus 5 L4",
    laboratory: "Zoetis",
    type: "Polivalente + Leptospira",
    pathogens: ["Distemper", "Adenovirus tipo 1", "Adenovirus tipo 2", "Parainfluenza", "Parvovirus", "Leptospira canicola", "Leptospira grippotyphosa", "Leptospira icterohaemorrhagiae", "Leptospira pomona"],
    species: ["Canino"]
  },
  {
    id: "zoetis-vanguard-htlp5",
    name: "Vanguard HTLP 5",
    laboratory: "Zoetis",
    type: "Polivalente + Leptospira",
    pathogens: ["Distemper", "Adenovirus", "Leptospira", "Parainfluenza", "Parvovirus"],
    species: ["Canino"]
  },
  {
    id: "zoetis-fel-o-vax-iv",
    name: "Fel-O-Vax IV",
    laboratory: "Zoetis",
    type: "Polivalente felina",
    pathogens: ["Rinotraqueitis viral felina", "Calicivirus felino", "Panleucopenia felina", "Leucemia felina"],
    species: ["Felino"]
  },
  {
    id: "zoetis-fel-o-vax-pch",
    name: "Fel-O-Vax PCH",
    laboratory: "Zoetis",
    type: "Triple felina",
    pathogens: ["Rinotraqueitis viral felina", "Calicivirus felino", "Panleucopenia felina"],
    species: ["Felino"]
  },
  
  // MSD/Nobivac Vaccines
  {
    id: "nobivac-dhppi",
    name: "Nobivac DHPPi",
    laboratory: "MSD/Nobivac",
    type: "Polivalente",
    pathogens: ["Distemper", "Hepatitis", "Parvovirus", "Parainfluenza"],
    species: ["Canino"]
  },
  {
    id: "nobivac-dh2pp",
    name: "Nobivac DH2PP",
    laboratory: "MSD/Nobivac", 
    type: "Polivalente",
    pathogens: ["Distemper", "Adenovirus tipo 2", "Parvovirus", "Parainfluenza"],
    species: ["Canino"]
  },
  {
    id: "nobivac-lepto-4",
    name: "Nobivac Lepto 4",
    laboratory: "MSD/Nobivac",
    type: "Leptospirosis",
    pathogens: ["Leptospira canicola", "Leptospira grippotyphosa", "Leptospira icterohaemorrhagiae", "Leptospira pomona"],
    species: ["Canino"]
  },
  {
    id: "nobivac-rabies",
    name: "Nobivac Rabia",
    laboratory: "MSD/Nobivac",
    type: "Antirrábica",
    pathogens: ["Virus de la rabia"],
    species: ["Canino", "Felino"]
  },
  {
    id: "nobivac-tricat-trio",
    name: "Nobivac Tricat Trio",
    laboratory: "MSD/Nobivac",
    type: "Triple felina",
    pathogens: ["Rinotraqueitis viral felina", "Calicivirus felino", "Panleucopenia felina"],
    species: ["Felino"]
  },
  
  // Additional Chilean market vaccines
  {
    id: "merial-eurican-dhppi2-l",
    name: "Eurican DHPPi2-L",
    laboratory: "Merial",
    type: "Polivalente + Leptospira",
    pathogens: ["Distemper", "Hepatitis", "Parvovirus", "Parainfluenza", "Adenovirus tipo 2", "Leptospira"],
    species: ["Canino"]
  },
  {
    id: "virbac-canigen-dha2ppil",
    name: "Canigen DHA2PPiL",
    laboratory: "Virbac",
    type: "Polivalente + Leptospira",
    pathogens: ["Distemper", "Hepatitis", "Adenovirus tipo 2", "Parvovirus", "Parainfluenza", "Leptospira"],
    species: ["Canino"]
  },
  {
    id: "nobivac-felv",
    name: "Nobivac FeLV",
    laboratory: "MSD/Nobivac",
    type: "Leucemia felina",
    pathogens: ["Leucemia felina"],
    species: ["Felino"]
  },
  {
    id: "nobivac-puppy-dp",
    name: "Nobivac Puppy DP",
    laboratory: "MSD/Nobivac",
    type: "Cachorro",
    pathogens: ["Distemper", "Parvovirus"],
    species: ["Canino"]
  },
  {
    id: "nobivac-kc",
    name: "Nobivac KC",
    laboratory: "MSD/Nobivac",
    type: "Tos de las perreras",
    pathogens: ["Bordetella bronchiseptica", "Parainfluenza"],
    species: ["Canino"]
  }
];

export const getVaccineById = (id: string): Vaccine | undefined => {
  return chileanVaccines.find(vaccine => vaccine.id === id);
};

export const getVaccinesBySpecies = (species: string): Vaccine[] => {
  return chileanVaccines.filter(vaccine => 
    vaccine.species.includes(species)
  );
};

export const getLaboratories = (): string[] => {
  const labs = new Set(chileanVaccines.map(vaccine => vaccine.laboratory));
  return Array.from(labs).sort();
};

export const getVaccineTypes = (): string[] => {
  const types = new Set(chileanVaccines.map(vaccine => vaccine.type));
  return Array.from(types).sort();
};