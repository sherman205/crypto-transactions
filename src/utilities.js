const fs = require("fs");

const ADDRESS_TO_USER = {
    'mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ': 'Wesley Crusher',
    'mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp': 'Leonard McCoy',
    'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n': 'Jonathan Archer',
    '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo': 'Jadzia Dax',
    'mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8': 'Montgomery Scott',
    'miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM': 'James T. Kirk',
    'mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV': 'Spock'
}

/**
 * Reads and parses json file and returns list of transaction objects.
 * @param {string} file
 */
const parseJSONData = (file) => {
    const fileData = fs.readFileSync(file);
    let data;
    try {
        data = JSON.parse(fileData);
    }
    catch (err) {
        console.log("JSON parsing error: ", err);
    }

    return data.transactions;
}

/**
 * Extracts deposit information from database query for final output.
 * @param {Object[]} deposits
 */
const generateDepositData = (deposits) => {
    const amountsList = deposits.map(d => d.sum);
    const smallestDeposit = Math.min(...amountsList);
    const largestDeposit = Math.max(...amountsList);

    const referencedDeposits = deposits.filter(d => {
        return ADDRESS_TO_USER[d._id];
    })
    const notReferencedDeposits = deposits.filter(d => {
        return !ADDRESS_TO_USER[d._id];
    })

    let count = 0;
    let sum = 0;
    for (const deposit in notReferencedDeposits) {
        count += notReferencedDeposits[deposit].count;
        sum += notReferencedDeposits[deposit].sum;
    }

    const data = {
        referencedDeposits: referencedDeposits,
        smallestDeposit: smallestDeposit,
        largestDeposit: largestDeposit,
        notReferencedCount: count,
        notReferencedSum: sum
    }
    
    return data;
}

/**
 * Outputs formatted valid deposits to stdout.
 * @param {Object} depositData
 */
const outputDepositInfo = (depositData) => {
    for (const address in ADDRESS_TO_USER) {
        const referencedDeposit = depositData.referencedDeposits.find(t => t._id === address);
        console.log(`Deposited for ${ADDRESS_TO_USER[address]}: count=${referencedDeposit.count} sum=${(referencedDeposit.sum).toFixed(8)}`);
    }

    console.log(`Deposited without reference: count=${depositData.notReferencedCount} sum=${(depositData.notReferencedSum).toFixed(8)}`);
    console.log(`Smallest valid deposit: ${(depositData.smallestDeposit).toFixed(8)}`);
    console.log(`Largest valid deposit: ${(depositData.largestDeposit).toFixed(8)}`);
}

module.exports = {
    parseJSONData,
    generateDepositData,
    outputDepositInfo
}