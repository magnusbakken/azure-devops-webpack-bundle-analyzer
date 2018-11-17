import process = require('process');
import child_process = require('child_process');
import tl = require('azure-pipelines-task-lib/task');

const isWindows = process.platform === "win32";

function execute(statsJsonPath: string): void {
    const args = ['node_modules\\.bin\\webpack-bundle-analyzer', statsJsonPath, '--mode=static', '--report=report.html', '--no-open'];
    if (isWindows) {
        child_process.execFileSync('cmd.exe', ['/c', ...args]);
    } else {
        const [file, ...otherArgs] = args;
        child_process.spawnSync(file, otherArgs);
    }
}

async function run(): Promise<void> {
    try {
        const statsJsonPath: string = tl.getPathInput('statsJsonPath', true, true);
        console.log('Starting...');
        execute(statsJsonPath);
        console.log('Done');
    } catch (err) {
        console.log(err);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();