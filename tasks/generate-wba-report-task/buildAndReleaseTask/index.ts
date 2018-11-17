import process = require('process');
import child_process = require('child_process');
import tasklib = require('azure-pipelines-task-lib/task');

const isWindows = process.platform === "win32";

function execute(statsJsonPath: string): void {
    const args = [statsJsonPath, '--mode=static', '--report=report.html', '--no-open'];
    if (isWindows) {
        child_process.execFileSync('cmd.exe', ['/c', 'node_modules\\.bin\\webpack-bundle-analyzer.cmd', ...args]);
    } else {
        child_process.spawnSync('node_modules/.bin/webpack-bundle-analyzer', args);
    }
}

function attachReport(reportPath: string): void {
    console.log(`##vso[task.addattachment type=wba-report name=report.html]${reportPath}`)
}

async function run(): Promise<void> {
    try {
        console.debug(`Command: ${process.argv.join(' ')}`);
        const statsJsonPath: string = tasklib.getPathInput('statsJsonPath', true, true);
        console.debug('Generating report...');
        execute(statsJsonPath);
        console.debug('Report generated!');
        console.debug('Attaching generated report...');
        attachReport('report.html');
    } catch (err) {
        console.log(err);
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
    }
}

run();