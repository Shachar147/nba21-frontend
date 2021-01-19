export const SERVER_URL = (process.env.NODE_ENV === 'production') ? 'https://nba21-server.herokuapp.com' : 'http://localhost';
export const SERVER_PORT = (process.env.NODE_ENV === 'production') ? '' : '3001';
export const SERVER_ADDRESS = SERVER_URL + (SERVER_PORT !== '') ? ':' + SERVER_PORT : '';