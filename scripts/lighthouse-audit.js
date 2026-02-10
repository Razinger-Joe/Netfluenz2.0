import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'http://localhost:5173';
const REPORT_DIR = path.join(process.cwd(), 'reports');

if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR);
}

const runAudit = async () => {
    console.log(`Starting Lighthouse audit for ${TARGET_URL}...`);

    // Launch Chrome
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'html', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], port: chrome.port };

    // Run Lighthouse
    const runnerResult = await lighthouse(TARGET_URL, options);

    // Report
    const reportHtml = runnerResult.report;
    const reportPath = path.join(REPORT_DIR, 'lighthouse-report.html');
    fs.writeFileSync(reportPath, reportHtml);

    // JSON Report for scores
    const scorePath = path.join(REPORT_DIR, 'lighthouse-scores.json');
    const scores = {
        performance: runnerResult.lhr.categories.performance.score * 100,
        accessibility: runnerResult.lhr.categories.accessibility.score * 100,
        bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
        seo: runnerResult.lhr.categories.seo.score * 100,
    };
    fs.writeFileSync(scorePath, JSON.stringify(scores, null, 2));

    console.log('Report is done for', runnerResult.lhr.finalUrl);
    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

    await chrome.kill();
};

runAudit();
