// Rare animals list based on IUCN Red List categories (https://www.iucnredlist.org/).
// Listed are any species present in models' training data that are Near Threatened or above.
export const RareAnimalsClasses = [
  // Gabon dataset
  'Cat_Golden',
  'Chimpanzee',
  'Duiker_Yellow_Backed',
  'Elephant_African',
  'Gorilla',
  'Leopard_African',
  'Mandrillus',
  'Pangolin',
  // Serengeti dataset
  'cheetah',
  'elephant',
  'giraffe',
  'hippopotamus',
  'hyenastriped',
  'koribustard',
  'leopard',
  'lionfemale',
  'lionmale',
  'rhinoceros',
  'secretarybird',
  'topi',
  'vulture'
];

// Models can use different name for images without animals.
export const EmptyClasses = ['Blank', 'empty'];

export function formatAnimalClassName(className: string) {
  return className.replace(/_/g, ' ');
}
