const { webkit } = require('playwright');
const notifier = require('node-notifier');

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
 }

(async () => {

    const urls = {
        'pfizer' : 'https://www.doctolib.fr/vaccination-covid-19/75017-paris?force_max_limit=2&ref_visit_motive_id=6970&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005',
        'moderna' : 'https://www.doctolib.fr/vaccination-covid-19/75017-paris?force_max_limit=2&ref_visit_motive_id=7005&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005',
        // 'dentiste' : 'https://www.doctolib.fr/medecin-generaliste/paris-75017'
    };

    const browser = await webkit.launch({ headless: true });
    const page = await browser.newPage();
    
    while(true) {
        for (const vaccineName in urls) {
            await page.setViewportSize({
                width: 1024,
                height: 1000,
            });
            await page.goto(urls[vaccineName]);
            await delay(1000);
            page.evaluate(() => Didomi.setUserAgreeToAll());
            page.$eval('body', (element) => element.click());
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await delay(1000);
            await page.evaluate(() => window.scrollTo(0, 200));
            await delay(20000);
            found = await page.$$('.Tappable-inactive.availabilities-slot');
            if (found.length > 0) {
                await page.evaluate(() => window.scrollTo(0, 0));
                let now = new Date();
                let filename = (vaccineName + '-' + now.getMonth()+1) + '-' + now.getDate() + '_' + now.getHours() + '-' + now.getMinutes() + '.png';
                await page.screenshot({ path: filename + '.png' });
                notifier.notify({
                    title: 'Très vite ma dose !',
                    message: 'RDV disponibles pour ' + vaccineName
                  });
            }
        }
        await delay(50000);
    }
    
    
  })();