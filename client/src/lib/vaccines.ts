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
    id: "nobivac-dhppi-l",
    name: "Nobivac DHPPi+L",
    laboratory: "MSD/Nobivac",
    type: "Polivalente + Leptospira",
    pathogens: ["Distemper", "Hepatitis", "Parvovirus", "Parainfluenza", "Leptospira"],
    species: ["Canino"]
  },
  {
    id: "nobivac-dhppi-rl",
    name: "Nobivac DHPPi+RL",
    laboratory: "MSD/Nobivac",
    type: "Polivalente + Rabia + Leptospira",
    pathogens: ["Distemper", "Hepatitis", "Parvovirus", "Parainfluenza", "Rabia", "Leptospira"],
    species: ["Canino"]
  },
  {
    id: "nobivac-tricat-trio",
    name: "Nobivac Tricat Trio",
    laboratory: "MSD/Nobivac",
    type: "Triple felina",
    pathogens: ["Rinotraqueitis viral felina", "Calicivirus felino", "Panleucopenia felina"],
    species: ["Felino"]
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
    id: "nobivac-rabies",
    name: "Nobivac Rabies",
    laboratory: "MSD/Nobivac",
    type: "Antirrábica",
    pathogens: ["Rabia"],
    species: ["Canino", "Felino"]
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
  return chileanVaccines.filter(vaccine => vaccine.species.includes(species));
};

export const getVaccinesByLaboratory = (laboratory: string): Vaccine[] => {
  return chileanVaccines.filter(vaccine => vaccine.laboratory === laboratory);
};

export const searchVaccines = (query: string): Vaccine[] => {
  const lowerQuery = query.toLowerCase();
  return chileanVaccines.filter(vaccine => 
    vaccine.name.toLowerCase().includes(lowerQuery) ||
    vaccine.laboratory.toLowerCase().includes(lowerQuery) ||
    vaccine.type.toLowerCase().includes(lowerQuery) ||
    vaccine.pathogens.some(pathogen => pathogen.toLowerCase().includes(lowerQuery))
  );
};
