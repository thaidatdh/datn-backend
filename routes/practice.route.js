let router = require("express").Router();
let practiceController = require("../controllers/practice.controller");
router.route("/").get(practiceController.index).post(practiceController.add);
router
  .route("/:practice_id")
  .post(practiceController.update)
  .delete(practiceController.delete);
module.exports = router;

/**
 * @swagger
 * /api/practice:
 *   get:
 *     summary: Retrieve a list of practices
 *     description: Retrieve a list of practices from database.
 *     responses:
 *       200:
 *         description: Success. List of Practice.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 practices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '60488f2d8d74df3204f559d8'
 *                       name:
 *                         type: string
 *                         example: ''
 *                       address:
 *                         type: string
 *                         example: ''
 *                       phone:
 *                         type: string
 *                         example: ''
 *                       fax:
 *                         type: string
 *                         example: ''
 *                       default_provider:
 *                         type: string
 *                         example: '60488f2d8d74df3204f559d8'
 *   post:
 *     summary: Create a new practice.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  example: ''
 *               address:
 *                   type: string
 *                   example: ''
 *               phone:
 *                   type: string
 *                   example: ''
 *               fax:
 *                   type: string
 *                   example: ''
 *               default_provider:
 *                   type: string
 *                   example: null
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 practice:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: '60488f2d8d74df3204f559d8'
 *                     name:
 *                       type: string
 *                       example: ''
 *                     address:
 *                       type: string
 *                       example: ''
 *                     phone:
 *                       type: string
 *                       example: ''
 *                     fax:
 *                       type: string
 *                       example: ''
 *                     default_provider:
 *                       type: string
 *                       example: '60488f2d8d74df3204f559d8'
*/
