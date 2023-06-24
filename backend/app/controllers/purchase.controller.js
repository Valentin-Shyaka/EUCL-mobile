const {
    validatePurchasingToken,
    PurchasedTokens
} = require("../models/purchased_tokens.model");

const { generateToken } = require("../utils/imports");

/***
 * Get all purchased tokens
 * @param req
 * @param res
 */
exports.getAllPurchasedTokens = async (req, res) => {
    try {
        let {
            limit,
            page
        } = req.query;

        if (!page || page < 1) page = 1;

        if (!limit) limit = 10;

        const options = {
            page: page,
            limit: limit
        };

        let data = await PurchasedTokens.paginate({}, options)
        data = JSON.parse(JSON.stringify(data));
        for (const el of data.docs) {
            let count = await PurchasedTokens.countDocuments({ purchasedTokens: el._id });
            el.total_tokens = count + 1;
        }

        console.log("Reached here");
        console.log(data);

        res.send({
            data
        });

    } catch (e) {
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}



/***
 *  Purchase a new token
 * @param req
 * @param res
 */
exports.purchaseToken = async (req, res) => {
    try {
        const {
            error
        } = validatePurchasingToken(req.body);
        if (error) {
            return res.status(400).send({
                message: error.details[0].message
            })
        };

        const token_value_days = (req.body.amount) / 100;
        const purchased_date = new Date();
        const amount = req.body.amount;
        const meter_number = req.body.meter_number;

        const currentDate = new Date();

        const generatedToken = generateToken(meter_number, amount, token_value_days);

        const newPurchasedToken = new PurchasedTokens();
        newPurchasedToken.meter_number = meter_number;
        newPurchasedToken.token = (await generatedToken).token;
        newPurchasedToken.token_status = (await generatedToken).expirationDate > currentDate ? "NEW" : "EXPIRED";
        newPurchasedToken.token_value_days = token_value_days;
        newPurchasedToken.purchased_date = purchased_date;
        newPurchasedToken.amount = amount;


        const result = await PurchasedTokens(newPurchasedToken).save();

        return res.status(201).send({
            message: 'CREATED',
            data: generatedToken
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.toString().split('\"').join(''))
    }
}