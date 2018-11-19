import process = require('process');
import child_process = require('child_process');
import tasklib = require('azure-pipelines-task-lib/task');
import path = require('path');

const isWindows = process.platform === "win32";

function execute(statsJsonPath: string, reportOutputPath: string): void {
    const args = [statsJsonPath, '--mode=static', `--report=${reportOutputPath}`, '--no-open'];
    if (isWindows) {
        const analyzerPath = path.join(__dirname, 'node_modules\\.bin\\webpack-bundle-analyzer.cmd');
        child_process.execFileSync('cmd.exe', ['/c', analyzerPath, ...args]);
    } else {
        const analyzerPath = path.join(__dirname, 'node_modules\\.bin\\webpack-bundle-analyzer');
        child_process.spawnSync(analyzerPath, args);
    }
}

function attachReport(reportPath: string): void {
    console.log(`##vso[task.addattachment type=wba-report;name=report]${reportPath}`)
}

async function run(): Promise<void> {
    try {
        console.log(`Command: ${process.argv.join(' ')}`);
        const statsJsonPath: string = tasklib.getPathInput('statsJsonPath', true, true);
        console.log('Generating report...');
        const reportOutputPath = path.join(__dirname, 'report.html');
        execute(statsJsonPath, reportOutputPath);
        console.log('Report generated!');
        console.log('Attaching generated report...');
        attachReport(reportOutputPath);
    } catch (err) {
        console.log(err);
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
    }
}

run();