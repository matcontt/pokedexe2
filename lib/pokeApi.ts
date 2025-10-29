import axios from 'axios';

const { data } = await pokeApi.get('/pokemon?limit=150');

export default pokeApi;