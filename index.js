import { createRequire} from 'module';
import chalk from 'chalk';
const require = createRequire(import.meta.url);

const web3 = require('@solana/web3.js');
import { transferSOL, getBalance, airDropSol } from './solana.js';
import { getReturnAmount, totalAmtToBePaid, randomNumber } from './helper.js';

const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

const treasuryWallet = web3.Keypair.generate();

const userWallet = web3.Keypair.generate();


const gameExecution = async() => {
    // TREASURY WALLET
    // Dropping 1000 SOL in the treasuryWallet
    // airDropSol(treasuryWallet.publicKey, 1000);

    // USER WALLET
    // Dropping 10 SOL in the userWallet for playing the game
    let airDropAmnt = 2;
    await airDropSol(userWallet.publicKey, airDropAmnt);

    // Checking the balance of the User
    let balance = await getBalance(userWallet.publicKey);

    // Game Starts - User enter the amount to be staked
    const { stakeAmount, ratio } = await totalAmtToBePaid(balance);

    // Total balance the player will get
    let bal = stakeAmount;

    // Return the amount to be won if the guess is correct
    const returnAmount = getReturnAmount(stakeAmount, ratio);

    // Guessing the number - Award/Loser Ceremony
    if(await randomNumber(1, 5)){
        bal = returnAmount - bal;

        console.log(chalk.green(`Your Guess is absolutely Correct!!`));
        console.log(chalk.greenBright(`Getting your prize money of ${returnAmount} SOL...`));

        const sign = await transferSOL(treasuryWallet, userWallet, bal);
        console.log(`Signature of the transaction: ` + chalk.green(sign))

    } else {
        console.log(chalk.red(`Your Guess is Wrong!!`) + chalk.yellow(`\nBetter Luck next time`));
        
        const sign = await transferSOL(userWallet, treasuryWallet, bal);
        console.log(`Signature of payment for playing the game: ` + chalk.yellow(sign))
    }
}

gameExecution();