export function getServerAddress() {
    const mode = process.env.REACT_APP_MODE;
    if (mode && mode.trim() === 'development'){
        return 'https://nba21-server.herokuapp.com';
    } else {
        return 'https://nba21-server.herokuapp.com';
    }
}