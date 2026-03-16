(function () {
    const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const configuredBaseUrl = window.location.hostname === 'admin.therehabhouse.in'
        ? 'https://api.therehabhouse.in'
        : 'https://api.therehabhouse.in';

    window.API_CONFIG = {
        baseUrl: isLocalHost ? 'http://localhost:4000' : configuredBaseUrl
    };
})();
