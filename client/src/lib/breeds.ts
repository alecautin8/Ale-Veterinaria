// Lista completa de razas de perros y gatos para Chile
export const DOG_BREEDS = [
  // Razas Toy y Miniatura
  'Affenpinscher',
  'Bichón Frisé',
  'Bichón Maltés',
  'Boston Terrier',
  'Caniche Toy',
  'Cavalier King Charles Spaniel',
  'Chihuahua',
  'Chinese Crested',
  'Griffón de Bruselas',
  'Havanese',
  'Jack Russell Terrier',
  'Japanese Chin',
  'Lhasa Apso',
  'Papillon',
  'Pekinés',
  'Pomerania',
  'Pug',
  'Schnauzer Miniatura',
  'Shih Tzu',
  'Silky Terrier',
  'Toy Fox Terrier',
  'Yorkshire Terrier',

  // Razas Pequeñas
  'Basset Hound',
  'Beagle',
  'Border Terrier',
  'Cairn Terrier',
  'Caniche Mediano',
  'Cocker Spaniel Americano',
  'Cocker Spaniel Inglés',
  'Corgi Galés de Cardigan',
  'Corgi Galés de Pembroke',
  'Dachshund',
  'Fox Terrier',
  'French Bulldog',
  'Parson Russell Terrier',
  'Scottish Terrier',
  'Sealyham Terrier',
  'Shetland Sheepdog',
  'Springer Spaniel Inglés',
  'Staffordshire Bull Terrier',
  'Terrier Tibetano',
  'West Highland White Terrier',
  'Wire Fox Terrier',

  // Razas Medianas
  'American Staffordshire Terrier',
  'Australian Cattle Dog',
  'Australian Shepherd',
  'Basenji',
  'Border Collie',
  'Brittany',
  'Bull Terrier',
  'Bulldog Inglés',
  'Caniche Estándar',
  'Chow Chow',
  'Dálmata',
  'Finnish Spitz',
  'Golden Retriever',
  'Keeshond',
  'Labrador Retriever',
  'Pastor Australiano',
  'Pointer',
  'Samoyed',
  'Siberian Husky',
  'Standard Schnauzer',
  'Vizsla',
  'Weimaraner',
  'Whippet',

  // Razas Grandes
  'Afgano',
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'Bernese Mountain Dog',
  'Bloodhound',
  'Borzoi',
  'Boxer',
  'Chesapeake Bay Retriever',
  'Collie',
  'Doberman Pinscher',
  'Flat-Coated Retriever',
  'German Shepherd',
  'Giant Schnauzer',
  'Gordon Setter',
  'Greyhound',
  'Irish Setter',
  'Irish Wolfhound',
  'Newfoundland',
  'Old English Sheepdog',
  'Otterhound',
  'Pointer Alemán de Pelo Corto',
  'Ridgeback de Rodesia',
  'Rottweiler',
  'Saint Bernard',
  'Setter Inglés',
  'Setter Irlandés',

  // Razas Gigantes
  'Dogo Alemán (Gran Danés)',
  'Leonberger',
  'Mastiff',
  'Mastiff Napolitano',
  'Mastín Español',
  'Mastín Tibetano',
  'Terranova',

  // Razas Chilenas y Sudamericanas
  'Terrier Chileno',
  'Quiltro (Mestizo)',

  // Otras razas comunes
  'Mestizo',
  'Criollo',
  'Sin raza definida'
];

export const CAT_BREEDS = [
  // Razas de pelo corto
  'Abisinio',
  'American Curl',
  'American Shorthair',
  'American Wirehair',
  'Bengalí',
  'Bombay',
  'British Shorthair',
  'Burmés',
  'Chartreux',
  'Cornish Rex',
  'Devon Rex',
  'Egyptian Mau',
  'European Shorthair',
  'Exótico de Pelo Corto',
  'Habana Brown',
  'Japanese Bobtail',
  'Korat',
  'Manx',
  'Mau Egipcio',
  'Ocicat',
  'Oriental',
  'Russian Blue',
  'Scottish Fold',
  'Selkirk Rex',
  'Siamés',
  'Singapura',
  'Sphynx',
  'Tonkinés',

  // Razas de pelo largo
  'Angora Turco',
  'Balinés',
  'Birmano',
  'Maine Coon',
  'Noruego del Bosque',
  'Persa',
  'Ragdoll',
  'Sagrado de Birmania',
  'Siberiano',
  'Somali',
  'Van Turco',

  // Razas menos comunes
  'Curl Americano',
  'LaPerm',
  'Pixie Bob',
  'Ragamuffin',
  'Snowshoe',

  // Categorías generales
  'Mestizo',
  'Criollo',
  'Común Europeo',
  'Sin raza definida'
];

export const getBreedsBySpecies = (species: string): string[] => {
  switch (species.toLowerCase()) {
    case 'perro':
    case 'canino':
      return DOG_BREEDS;
    case 'gato':
    case 'felino':
      return CAT_BREEDS;
    default:
      return ['Sin raza definida', 'Mestizo'];
  }
};