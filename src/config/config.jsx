export function getServerAddress() {
    const mode = process.env.REACT_APP_MODE || process.env.STORYBOOK_APP_MODE;
    if (mode && mode.trim() === 'development'){
        return 'http://localhost:3000';
    } else {
        return 'http://10.0.12.40:3000' // 'https://nba21-server.herokuapp.com';
    }
}