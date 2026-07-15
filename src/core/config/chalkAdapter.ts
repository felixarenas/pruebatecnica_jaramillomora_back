import chalk from 'chalk';

// Definir un logger simple
export const logger = {
    successEnv: (msg: string, str: string) => console.log(`${chalk.green('✔')} ${chalk.bold.green('SUCCESS:')} ${msg} - ${str}`),
    info: (msg: string) => { console.log(`${chalk.blue('ℹ')} ${chalk.bold.blue('INFO:')} ${msg}`) },
    warn: (msg: string) => { console.log(`${chalk.yellow('⚠')} ${chalk.bold.yellow('WARN:')} ${msg}`) },
    error: (msg: string) => { console.error(`${chalk.red('✖')} ${chalk.bold.red('ERROR:')} ${msg}`) },
    success: (msg: string) => { console.log(`${chalk.green('✔')} ${chalk.bold.green('SUCCESS:')} ${msg}`) },
};