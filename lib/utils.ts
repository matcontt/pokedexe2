export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export const getTypeColors = (): Record<PokemonType, string[]> => ({
  normal: ['#A8A878', '#C6C6A7'],
  fire: ['#F08030', '#F5AC78'],
  water: ['#6890F0', '#9DB7F5'],
  grass: ['#78C850', '#A7DB8D'],
  electric: ['#F8D030', '#FAE078'],
  ice: ['#98D8D8', '#BCE6E6'],
  fighting: ['#C03028', '#D67873'],
  poison: ['#A040A0', '#C183C1'],
  ground: ['#E0C068', '#EBD69D'],
  flying: ['#A890F0', '#C6B7F5'],
  psychic: ['#F85888', '#FA92B2'],
  bug: ['#A8B820', '#C6D16E'],
  rock: ['#B8A038', '#D1C17D'],
  ghost: ['#705898', '#A292BC'],
  dragon: ['#7038F8', '#A27DFA'],
  dark: ['#705848', '#A29288'],
  steel: ['#B8B8D0', '#D1D1E0'],
  fairy: ['#EE99AC', '#F4BDC9'],
});