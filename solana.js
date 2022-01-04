import { createRequire} from 'module'
const require = createRequire(import.meta.url);

const web3 = require('@solana/web3.js');
import chalk from 'chalk';



const getBalance = async(pubK) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        const balance = await connection.getBalance(pubK);

        console.log(`\nWallet Address ` + chalk.bold.green(`${pubK}`) +
        `\nWallet Balance: ` + chalk.bold.cyan(`${parseInt(balance)/web3.LAMPORTS_PER_SOL} SOL\n`));

        return parseInt(balance);
    } catch(err) {
        console.log(err);
    }
}

const airDropSol = async(pubK, amnt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        console.log(chalk.yellow.bold(`----- Airdropping SOL to ${pubK} -----`))
        amnt = parseInt(amnt);
        const fromAirdropSignature = await connection.requestAirdrop(pubK, amnt * web3.LAMPORTS_PER_SOL)
        
        await connection.confirmTransaction(fromAirdropSignature);

    } catch(err){
        console.log(err);
    }
}

const transferSOL = async(from, to, amnt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

        // Creating a transaction from the userWallet to a treasuryWallet
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(from.publicKey.toString()),
                toPubkey: new web3.PublicKey(to.publicKey.toString()),
                lamports: amnt * web3.LAMPORTS_PER_SOL,
            })
        );

        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );

        return signature;

    } catch (err) {
        console.log(err);
    }
}

export { transferSOL, getBalance, airDropSol };