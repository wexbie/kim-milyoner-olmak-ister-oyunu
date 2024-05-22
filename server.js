const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // istek yapılan dosyanın yolu
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // dosyanın varlığını kontrol etme
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // dosya bulunamazsa 404 hatası döndür
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        // dosya uzantısına göre içerik türünü belirle
        let contentType = 'text/html';
        if (filePath.endsWith('.js')) {
            contentType = 'text/javascript';
        } else if (filePath.endsWith('.css')) {
            contentType = 'text/css';
        } else if (filePath.endsWith('.png')) {
            contentType = 'image/png';
        }

        // dosyayı oku ve yanıt olarak gönder
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // dosya okunamazsa 500 hatası döndür
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('<h1>500 Internal Server Error</h1>');
                return;
            }
            // başarıyla okunan dosyayı yanıt olarak gönder
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        });
    });
});

// sunucuyu belirtilen portta dinle
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
