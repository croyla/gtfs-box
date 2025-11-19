const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🧪 Starting MapLibre migration test...\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Collect console messages
    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push({ type: msg.type(), text });
        if (msg.type() === 'error') {
            errors.push(text);
        }
    });

    // Collect page errors
    page.on('pageerror', error => {
        errors.push(`PAGE ERROR: ${error.message}`);
        console.error('❌ Page Error:', error.message);
    });

    try {
        // Load the page
        const indexPath = 'file://' + path.join(__dirname, 'index.html');
        console.log('📄 Loading:', indexPath);
        await page.goto(indexPath, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait a bit for the map to initialize
        console.log('⏳ Waiting for map initialization...');
        await page.waitForTimeout(5000);

        // Check for critical errors
        console.log('\n📊 Console Analysis:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Check for our interceptor message
        const interceptMessages = consoleMessages.filter(m => m.text.includes('[MAPBOX INTERCEPT]'));
        if (interceptMessages.length > 0) {
            console.log('✅ Mapbox API interceptor working (' + interceptMessages.length + ' calls intercepted)');
        }

        // Check for getOwnLayer errors
        const getOwnLayerErrors = errors.filter(e => e.includes('getOwnLayer'));
        if (getOwnLayerErrors.length > 0) {
            console.log('❌ CRITICAL: getOwnLayer errors still present!');
            getOwnLayerErrors.forEach(e => console.log('   ', e));
        } else {
            console.log('✅ No getOwnLayer errors detected');
        }

        // Check for setLights errors
        const setLightsErrors = errors.filter(e => e.includes('setLights'));
        if (setLightsErrors.length > 0) {
            console.log('❌ CRITICAL: setLights errors still present!');
            setLightsErrors.forEach(e => console.log('   ', e));
        } else {
            console.log('✅ No setLights errors detected');
        }

        // Check for 403 errors
        const forbiddenErrors = errors.filter(e => e.includes('403') || e.includes('Forbidden'));
        if (forbiddenErrors.length > 0) {
            console.log('⚠️  Warning: Some 403 errors detected:');
            forbiddenErrors.forEach(e => console.log('   ', e));
        } else {
            console.log('✅ No 403 Forbidden errors');
        }

        // Check if map canvas exists
        const canvas = await page.$('canvas.maplibregl-canvas, canvas.mapboxgl-canvas');
        if (canvas) {
            console.log('✅ Map canvas element found');
        } else {
            console.log('❌ Map canvas NOT found - map may not have loaded');
        }

        // Check if GTFS box elements exist
        const headerExists = await page.$('.header');
        const mapExists = await page.$('#map');
        console.log('✅ Header element:', headerExists ? 'Found' : 'NOT FOUND');
        console.log('✅ Map container:', mapExists ? 'Found' : 'NOT FOUND');

        // Take a screenshot
        await page.screenshot({ path: 'test-screenshot.png', fullPage: false });
        console.log('✅ Screenshot saved to test-screenshot.png');

        // Summary
        console.log('\n📈 Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Total console messages:', consoleMessages.length);
        console.log('Total errors:', errors.length);

        if (errors.length > 0) {
            console.log('\n⚠️  All errors:');
            errors.forEach((err, i) => {
                console.log(`${i + 1}. ${err}`);
            });
        }

        // Final verdict
        const criticalErrors = getOwnLayerErrors.length + setLightsErrors.length;
        console.log('\n' + '='.repeat(50));
        if (criticalErrors === 0 && canvas) {
            console.log('✅ TEST PASSED: MapLibre migration appears successful!');
            console.log('   Map loaded without critical errors.');
        } else {
            console.log('❌ TEST FAILED: Critical issues detected.');
            console.log('   Please review errors above.');
        }
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Test failed with exception:', error.message);
        errors.push(error.message);
    } finally {
        await browser.close();
        process.exit(errors.length > 0 ? 1 : 0);
    }
})();
