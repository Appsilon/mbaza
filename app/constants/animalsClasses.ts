export const RareAnimalsClasses = [
  // Gabon
  'Cat_Golden',
  'Chimpanzee',
  'Duiker_Yellow_Backed',
  'Elephant_African',
  'Gorilla',
  'Leopard_African',
  'Mandrillus',
  'Pangolin',
  // Serengeti
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
