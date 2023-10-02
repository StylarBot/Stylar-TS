import chalk from "chalk";

export default async function log(message: string, error: boolean) {
    if(error === false) {
        return console.log(`${chalk.bold(chalk.magenta(`Stylar`))} >> ${message}`)
    } else {
        return console.log(`${chalk.bold(chalk.red(`Stylar`))} >> ${message}`)
    }
}