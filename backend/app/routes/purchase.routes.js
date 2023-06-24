const {
  getAllPurchasedTokens,
  purchaseToken
} = require("../controllers/purchase.controller");
const {
  auth
} = require("../middlewares/auth.middleware");

module.exports = (app) => {

  var router = require("express").Router();

  router.route("/")
    /**
     * @swagger
     * /purchase:
     *   get:
     *     tags:
     *       - Purchased
     *     description: Returns all Purchased tokens
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - meter_number: page
     *         description: page number
     *         in: query
     *         type: string
     *       - meter_number: limit
     *         description: elements per page
     *         in: query
     *         type: string
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    .get([auth, getAllPurchasedTokens])
    /**
     * @swagger
     * /purchase:
     *   post:
     *     tags:
     *       - Purchase
     *     description: Purchase a token
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - meter_number: body
     *         description: Fields for purchase a token
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Purchase'
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    .post([auth, purchaseToken]);
  app.use("/api/purchase", router);
};