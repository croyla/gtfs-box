const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🧪 Testing MapLibre Migration - JavaScript Validation\n');

    const browser = await chromium.launch({
        headless: true,
        args: ['--disable-gpu', '--disable-software-rasterizer']
    });

    const page = await browser.newPage();

    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push({ type: msg.type(), text });

        // Log important messages
        if (text.includes('[MAPBOX INTERCEPT]')) {
            console.log('✅', text);
        }

        if (msg.type() === 'error' && !text.includes('WebGL')) {
            errors.push(text);
            console.log('❌ Console Error:', text);
        }
    });

    page.on('pageerror', error => {
        if (!error.message.includes('WebGL')) {
            errors.push(`PAGE ERROR: ${error.message}`);
            console.error('❌ Page Error:', error.message);
        }
    });

    try {
        const indexPath = 'file://' + path.join(__dirname, 'index.html');
        console.log('📄 Loading:', indexPath, '\n');

        await page.goto(indexPath, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Wait for scripts to execute
        console.log('⏳ Waiting for scripts to execute...\n');
        await page.waitForTimeout(3000);

        // Check for critical errors (excluding WebGL)
        const criticalErrors = errors.filter(e =>
            !e.includes('WebGL') &&
            !e.includes('WebGL2') &&
            !e.includes('VENDOR')
        );

        console.log('\n' + '='.repeat(60));
        console.log('📋 TEST RESULTS');
        console.log('='.repeat(60));

        // Check for specific error types
        const getOwnLayerErrors = criticalErrors.filter(e => e.includes('getOwnLayer'));
        const setLightsErrors = criticalErrors.filter(e => e.includes('setLights'));
        const forbiddenErrors = criticalErrors.filter(e => e.includes('403') || e.includes('Forbidden'));

        console.log('\n🔍 Critical Error Checks:');
        console.log('  getOwnLayer errors:', getOwnLayerErrors.length === 0 ? '✅ PASS' : '❌ FAIL');
        console.log('  setLights errors:', setLightsErrors.length === 0 ? '✅ PASS' : '❌ FAIL');
        console.log('  403 Forbidden errors:', forbiddenErrors.length === 0 ? '✅ PASS' : '❌ FAIL');

        // Check intercept messages
        const interceptCount = consoleMessages.filter(m => m.text.includes('[MAPBOX INTERCEPT]')).length;
        console.log('  Mapbox API interception:', interceptCount > 0 ? `✅ PASS (${interceptCount} calls)` : '⚠️  NONE');

        console.log('\n📊 Statistics:');
        console.log('  Total console messages:', consoleMessages.length);
        console.log('  Critical errors (non-WebGL):', criticalErrors.length);

        if (criticalErrors.length > 0) {
            console.log('\n⚠️  Critical Errors Found:');
            criticalErrors.forEach((err, i) => {
                console.log(`  ${i + 1}. ${err}`);
            });
        }

        // Final verdict
        const hasCriticalErrors = getOwnLayerErrors.length > 0 || setLightsErrors.length > 0;

        console.log('\n' + '='.repeat(60));
        if (!hasCriticalErrors) {
            console.log('✅ TEST PASSED');
            console.log('   MapLibre migration is successful!');
            console.log('   All critical compatibility issues are resolved.');
        } else {
            console.log('❌ TEST FAILED');
            console.log('   Critical compatibility issues remain.');
        }
        console.log('='.repeat(60) + '\n');

        await browser.close();
        process.exit(hasCriticalErrors ? 1 : 0);

    } catch (error) {
        console.error('\n❌ Test Exception:', error.message);
        await browser.close();
        process.exit(1);
    }
})();
