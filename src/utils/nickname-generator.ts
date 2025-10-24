import { verbs, animals } from '../data/nickname-data';

export function generateRandomNickname(): string {
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  
  // Capitalize first letter of verb
  const capitalizedVerb = randomVerb.charAt(0).toUpperCase() + randomVerb.slice(1);
  
  return `${capitalizedVerb} ${randomAnimal}`;
}

export function generateMultipleNicknames(count: number): string[] {
  const nicknames = new Set<string>();
  
  while (nicknames.size < count) {
    nicknames.add(generateRandomNickname());
  }
  
  return Array.from(nicknames);
}
