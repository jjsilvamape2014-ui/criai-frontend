// Service worker mínimo: só existe para o navegador oferecer "Instalar app".
// Não guarda nada em cache (o app sempre carrega a versão mais nova do servidor).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
