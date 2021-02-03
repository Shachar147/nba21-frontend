export function getServerAddress() {
    const mode = process.env.REACT_APP_MODE;
    if (mode && mode.trim() === 'development'){
        return 'http://localhost:3000';
    } else {
        return 'https://nba21-server.herokuapp.com';
    }
}