# Kraken Crypto/Payments Hiring Test

Command: `docker-compose up`

## Notes

### Assumptions

1. Running `node --version` v11.14.0
2. This project is not designed to be run locally outside the Docker environment.

### Design decisions
1. Choosing Mongoose as the database because it's a NoSQL database and adds an ORM layer with built-in query building. It is easy to work with given the task at hand.
2. Separation of code by function to ensure readability and reusability. The main script is in `app.js`, the model can be found in `src/model.js`, and extra utility functions to help reach the final solution are located in `src/utilities.js`.
3. Not silencing the extraneous output resulting from `docker-compose up` just in case there are errors.


### High level steps to achieve the result

1. Parse "transactions" out of each .json file and combine them together into one large list of transactions to process.
2. Drop the `transactions` collection each time `docker-compose up` is run to ensure we are inserting the transactions data into a clean database instance each time just in case.
3. Batch insert the transactions into the `transactions` collection to make it a more optimized and less expensive operation.
4. Read contents of the database by using an aggregate function, which is best suited to extract the kind of data we're interested in:
    * matching for a valid deposit if 'confirmations' > 6 and the transaction is of the category "received" and not "sent"
    * group the deposits by address and also calculate for the sum and count of the deposits
5. Close the database connection and continue processing the data.
6. Prepare the deposit data for the output by finding the deposits associated with a known customer and without a known customer, and the min and max of all the deposits.
7. Output the data in the prescribed format:

Result:

```
Deposited for Wesley Crusher: count=35 sum=217.00000000
Deposited for Leonard McCoy: count=15 sum=64.00000000
Deposited for Jonathan Archer: count=28 sum=154.20000000
Deposited for Jadzia Dax: count=12 sum=59.49000000
Deposited for Montgomery Scott: count=24 sum=108.04593000
Deposited for James T. Kirk: count=28 sum=1267.00848015
Deposited for Spock: count=16 sum=805.55492390
Deposited without reference: count=22 sum=954.03578583
Smallest valid deposit: 1.46426397
Largest valid deposit: 1267.00848015
```
