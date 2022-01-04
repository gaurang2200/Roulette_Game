import { createRequire} from 'module'
const require = createRequire(import.meta.url);

import chalk from 'chalk';
const inquirer = require('inquirer');
const figlet = require('figlet')

const getReturnAmount = (stakedAmount, ratio) => {
    let returnAmount = stakedAmount * ratio;
    return returnAmount;
}

const totalAmtToBePaid = async (balance) => {
    let stakeAmount = 0, ratio = 1, mxAmount = 2.5;
    console.log(chalk.magentaBright.bold(`The max bidding amount is ${mxAmount} SOL\n`))

    await inquirer
        .prompt([
            {
                type: 'number',
                message: 'What is the amount of SOL you want to stake?',
                name: 'stakeAmnt',
                validate: (input) => {
                    if(input > mxAmount){
                        console.log(chalk.red.italic(`\nAmount should be less than ${mxAmount} SOL`));
                        return;
                    } else if(input > balance){
                        console.log(chalk.red.italic('\nInsufficient Balance'));
                        return;
                    }
                    return(true);
                }
            },
            {
                type: 'number',
                message: 'What is the ratio of your staking? (1 : ?)',
                name: 'ratio'
            }
        ])
        .then(answers => {
            stakeAmount = answers.stakeAmnt;
            ratio = answers.ratio;
            console.log(`\nYou need to pay ` + chalk.green(stakeAmount + ` SOL`) + ` to move forward`);
            console.log(chalk.green(`You will get ` + stakeAmount * ratio + ` SOL if you guess the number correctly\n`));
        }).catch(err => {
            console.log("Inquirer! Something Went Wrong...")
        })
    
    return { stakeAmount, ratio };
}

// Generates a random number between min and max inclusive
const randomNumber = async(min, max) => {
    let generatedNumber, playerGuess = 0;

    await inquirer
    .prompt([
        {
            type: 'number',
            message: 'Guess a random number from 1 to 5 inclusive?',
            name: 'guess',
            validate: (input) => {
                if(input > 5){
                    console.log(chalk.red.italic('\nNumber should be between 1 and 5 Inclusive'));
                    return;
                }
                return(true);
            }
        }
    ])
    .then(answers => {
        generatedNumber = min + Math.floor(Math.random() * max);
        playerGuess = answers.guess;
    }).catch(err => {
        console.log("Inquirer! Something Went Wrong...")
    })

    return generatedNumber == playerGuess;
}

export { getReturnAmount, totalAmtToBePaid, randomNumber };