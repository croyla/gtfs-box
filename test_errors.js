const playwright = require('playwright');

(async () => {
    const browser = await playwright.chromium.launch({
        headless: true,
        args: [
            '--use-gl=swiftshader',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    const consoleMessages = [];

    // Capture console messages
    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(text);
        console.log('[CONSOLE]', text);
    });

    // Capture page errors
    page.on('pageerror', error => {
        errors.push({
            message: error.message,
            stack: error.stack
        });
        console.error('[PAGE ERROR]', error.message);
        console.error(error.stack);
    });

    try {
        console.log('Loading page...');
        await page.goto('http://localhost:8000/index.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Wait for map to initialize
        console.log('Waiting for map initialization...');
        await page.waitForTimeout(5000);

        // Check if map loaded
        const mapLoaded = await page.evaluate(() => {
            return window.mt3dMap !== undefined;
        });

        console.log('Map loaded:', mapLoaded);

        // Take screenshot
        await page.screenshot({ path: '/home/user/gtfs-box/test_screenshot.png', fullPage: true });
        console.log('Screenshot saved');

    } catch (error) {
        console.error('[TEST ERROR]', error.message);
        errors.push({ message: error.message, stack: error.stack });
    }

    await browser.close();

    // Summary
    console.log('\n=== TEST SUMMARY ===');
    console.log('Total errors:', errors.length);
    if (errors.length > 0) {
        console.log('\nErrors:');
        errors.forEach((err, idx) => {
            console.log(`\n${idx + 1}.`, err.message);
            if (err.stack) console.log(err.stack);
        });
        process.exit(1);
    } else {
        console.log('No errors detected!');
        process.exit(0);
    }
})();
