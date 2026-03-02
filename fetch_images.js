fetch('https://deelestari.com/id/2017/10/10/serialsurel-kerangka-bukanlah-penjara/')
    .then(r => r.text())
    .then(t => {
        const matches = t.match(/https:\/\/deelestari\.com\/wp-content\/uploads\/[^"'\s]+\.(jpg|jpeg|png)/ig);
        if (matches) {
            console.log([...new Set(matches)].slice(0, 3));
        } else {
            console.log('No images found');
        }
    }).catch(console.error);
