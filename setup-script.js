const readLine = require("readline");
const yargs = require("yargs");
const { execSync } = require("child_process")
const path = require("path");


const createInterface = () => {
    return readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
};

const askQuestion =  (rl, question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        })
    })
}

const getProjectName = async () => {
    let projectName = yargs.argv.name; 

    if(!projectName){
        const rl = createInterface();
        projectName = await askQuestion(rl, 'Nome do projeto: ');
        rl.close();
    }

    return projectName
}

const execCommand = (command, options = {}) => {
    try {
        execSync(command, { stdio: 'inherit', ...options})

    } catch (e) { 
        console.error(e)
        process.exit(1)
    }
}

const setupRepository = async (templateRepositoryURL, projectName) => {
    execCommand(`git clone --depth=1 ${templateRepositoryURL} ${projectName}`);

    const projectPath = path.join(process.cwd(), projectName);
    execCommand('npm install', { cwd: projectPath });
    
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true }); 
    execCommand('git init', { cwd: projectPath });
    execCommand('git add .', { cwd: projectPath });
    execCommand('git commit -m "Commit inicial"', { cwd: projectPath });
}

const main = async () => {
    console.log("### Setup mStack ###\n")
    const templateRepositoryURL = "https://github.com/lopesmarcello/mstack.git"
    const projectName = await getProjectName();

    await setupRepository(templateRepositoryURL, projectName);
}

main().catch(console.error)