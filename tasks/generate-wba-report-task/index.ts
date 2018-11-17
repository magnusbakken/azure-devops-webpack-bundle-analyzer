import tl = require('azure-pipelines-task-lib/task')

async function run(): Promise<void> {
    try {
        const statsJsonPath: string = tl.getPathInput('statsJsonPath', true, true);
        console.log('stats.json', statsJsonPath);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();