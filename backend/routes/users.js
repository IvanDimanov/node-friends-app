const crypto = require('crypto');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const isLoggedIn = require('../koa-middleware/isLoggedIn');
const HttpError = require('../koa-middleware/HttpError');

const {isValidUuidV4} = require('../../utils/isValidUuidV4');
const {isValidEmail} = require('../../utils/isValidEmail');
const {isValidPassword} = require('../../utils/isValidPassword');

const router = new Router();

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     description: Will return a time-limited JWT if sent user credentials are valid.
 *
 *     produces:
 *       - application/json
 *
 *     consumes:
 *       - application/json
 *
 *     parameters:
 *       - in: body
 *         name: login
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               required: true
 *               example: john@smith.com
 *
 *             password:
 *               type: string
 *               required: true
 *               example: Pass@123
 *
 *     responses:
 *       200:
 *         description: Your credentials are valid and JWT is been generated and returned.
 *         schema:
 *           type: object
 *           properties:
 *             JWT:
 *               type: string
 *               example: Bearer eyJhbGciOi...rWR8FC62tYb0qA
 *
 *       400:
 *         description: Missing or invalid email or password.
 *         schema:
 *           $ref: '#/definitions/UserInputError'
 *
 *       401:
 *         description: Email/password pair do not match.
 *         schema:
 *           $ref: '#/definitions/AuthError'
 */
router.post('/api/v1/users/login',
    async (ctx) => {
      if (!ctx.request.body) {
        throw new HttpError(
            400,
            'INVALID_INPUT',
            `Please send JSON as an input`
        );
      }

      const {email, password} = ctx.request.body;

      if (!isValidEmail(email)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_EMAIL',
            `"${email}" is invalid email`
        );
      }

      if (!password) {
        throw new HttpError(
            400,
            'INVALID_INPUT_PASSWORD',
            `"${password}" is invalid password`
        );
      }

      const user = await ctx.postgres.Users
          .findOne({
            where: {
              email,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!user) {
        ctx.logger.info(`Unable to find user with email "${email}"`);
        throw new HttpError(
            401,
            'NO_MATCH',
            'Email or password do not match'
        );
      }

      const hashedPassword = crypto
          .createHmac('sha256', user.id)
          .update(String(password))
          .digest('hex');

      if (hashedPassword !== user.hashedPassword) {
        ctx.logger.info(`Password mismatch for user ${user.id} "${email}"`);
        throw new HttpError(
            401,
            'NO_MATCH',
            'Email or password do not match'
        );
      }

      ctx.body = {
        JWT: 'Bearer ' + jwt.sign({
          userId: user.id,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expires in 1 day
        }, process.env.JWT_SECRET || 'Pass@123'),
      };
    }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     description: Returns a User that has the requested `id`.
 *
 *     produces:
 *       - application/json
 *
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Authorization header with JWT
 *         required: true
 *         type: string
 *
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         required: true
 *         description: The `id` of the User we want to be returned
 *
 *     responses:
 *       200:
 *         description: The User object that has the requested `id`.
 *         schema:
 *           $ref: '#/definitions/User'
 *
 *       400:
 *         description: Invalid URI `id` parameter.
 *         schema:
 *           $ref: '#/definitions/UserInputError'
 *
 *       401:
 *         description: User is not logged-in.
 *         schema:
 *           $ref: '#/definitions/AuthError'
 *
 *       403:
 *         description: User is logged-in but has no permission to see the requested User.
 *         schema:
 *           $ref: '#/definitions/PermissionError'
 *
 *       404:
 *         description: The requested User is not found in the DB.
 *         schema:
 *           $ref: '#/definitions/NoFoundError'
 */
router.get('/api/v1/users/:id',
    isLoggedIn(),
    async (ctx) => {
      const userId = ctx.params.id;

      if (!isValidUuidV4(userId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_ID',
            `User id "${userId}" is invalid UUID v4`
        );
      }

      /* A user wants to see its own data */
      if (ctx.state.user.id === userId) {
        if (!ctx.state.userPermissions.includes('canReadOwnUser')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canReadOwnUser" in order to access your own User data'
          );
        }

        ctx.body = ctx.state.user;
        return;
      }

      if (!ctx.state.userPermissions.includes('canReadOthersUser')) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            `You must have permission "canReadOthersUser" in order to access others User data`
        );
      }

      const user = await ctx.postgres.Users
          .findOne({
            where: {
              id: userId,
            },
          })
          .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : response);

      if (!user) {
        throw new HttpError(
            404,
            'USER_NO_FOUND',
            `Unable to find user with id "${userId}"`
        );
      }

      ctx.body = user;
    }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     description: Updating User that has the requested `id` and then we'll return his updated info.
 *
 *     produces:
 *       - application/json
 *
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Authorization header with JWT
 *         required: true
 *         type: string
 *
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         required: true
 *         description: The `id` of the User we want to update
 *
 *       - in: body
 *         name: update
 *         type: object
 *         description: Holds only the info that we want to update.
 *           For example, if we want to update only the User firstName, then we'll send `{"firstName":"New first name"}`
 *         example: {"firstName": "Johnny"}
 *         parameters:
 *           firstName:
 *             type: string
 *           lastName:
 *             type: string
 *           email:
 *             type: string
 *             format: email
 *           password:
 *             type: string
 *
 *     responses:
 *       200:
 *         description: The User object that has the requested `id`.
 *         schema:
 *           $ref: '#/definitions/User'
 *
 *       400:
 *         description: Invalid URI `id` parameter or invalid request body.
 *         schema:
 *           $ref: '#/definitions/UserInputError'
 *
 *       401:
 *         description: User is not logged-in.
 *         schema:
 *           $ref: '#/definitions/AuthError'
 *
 *       403:
 *         description: User is logged-in but has no permission to update the requested User.
 *         schema:
 *           $ref: '#/definitions/PermissionError'
 */
router.put('/api/v1/users/:id',
    isLoggedIn(),
    async (ctx) => {
      const userId = ctx.params.id;

      if (!isValidUuidV4(userId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_ID',
            `User id "${userId}" is invalid UUID v4`
        );
      }

      if (!ctx.request.body) {
        throw new HttpError(
            400,
            'INVALID_INPUT',
            `Please send JSON as an input`
        );
      }

      const {firstName, lastName, email, password} = ctx.request.body;

      if (ctx.state.user.id !== userId) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must cannot update the user of someone else'
        );
      }

      /* Checks for updating the logged-in user First name */
      if (firstName && ctx.state.user.firstName !== firstName) {
        if (!ctx.state.userPermissions.includes('canWriteOwnFirstName')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canWriteOwnFirstName" in order to update your first name'
          );
        }

        if (typeof firstName !== 'string') {
          throw new HttpError(
              400,
              'INVALID_INPUT_FIRST_NAME',
              `"${firstName}" is invalid first name`
          );
        }

        await ctx.postgres.Users
            .update(
                {firstName},
                {where: {id: userId}}
            );
        ctx.state.user.firstName = firstName;
      }

      /* Checks for updating the logged-in user Last name */
      if (lastName && ctx.state.user.lastName !== lastName) {
        if (!ctx.state.userPermissions.includes('canWriteOwnLastName')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canWriteOwnLastName" in order to update your last name'
          );
        }

        if (typeof lastName !== 'string') {
          throw new HttpError(
              400,
              'INVALID_INPUT_LAST_NAME',
              `"${lastName}" is invalid last name`
          );
        }

        await ctx.postgres.Users
            .update(
                {lastName},
                {where: {id: userId}}
            );
        ctx.state.user.lastName = lastName;
      }

      /* Checks for updating the logged-in user Email */
      if (email && ctx.state.user.email !== email) {
        if (!ctx.state.userPermissions.includes('canWriteOwnEmail')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canWriteOwnEmail" in order to update your email'
          );
        }

        if (!isValidEmail(email)) {
          throw new HttpError(
              400,
              'INVALID_INPUT_EMAIL',
              `"${email}" is invalid email`
          );
        }

        await ctx.postgres.Users
            .update(
                {email},
                {where: {id: userId}}
            );
        ctx.state.user.email = email;
      }

      /* Checks for setting new Password for the logged-in user */
      const hashedPassword = crypto
          .createHmac('sha256', ctx.state.user.id)
          .update(String(password))
          .digest('hex');

      if (password && ctx.state.user.hashedPassword !== hashedPassword) {
        if (!ctx.state.userPermissions.includes('canWriteOwnPassword')) {
          throw new HttpError(
              403,
              'NO_PERMISSION',
              'You must have permission "canWriteOwnPassword" in order to update your password'
          );
        }

        if (!isValidPassword(password)) {
          throw new HttpError(
              400,
              'INVALID_INPUT_PASSWORD',
              `"${password}" is invalid password`
          );
        }

        await ctx.postgres.Users
            .update(
                {hashedPassword},
                {where: {id: userId}}
            );
        ctx.state.user.hashedPassword = hashedPassword;
      }

      if (ctx.state.userPermissions.includes('canReadOwnUser')) {
        ctx.body = ctx.state.user;
      } else {
        ctx.body = {};
      }
    }
);

/**
 * @swagger
 * /api/v1/users/{id}/invitations:
 *   get:
 *     description: Returns a list of all Invitations that User with the requested `id` have.
 *       This list will include Invitations that the user is accepted, kicked, or pending to accept.
 *
 *     produces:
 *       - application/json
 *
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Authorization header with JWT
 *         required: true
 *         type: string
 *
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         required: true
 *         description: The `id` of the User we want to see all Invitations
 *
 *     responses:
 *       200:
 *         description: List of all Invitations for User that has the requested `id`.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Invitation'
 *
 *       400:
 *         description: Invalid URI `id` parameter.
 *         schema:
 *           $ref: '#/definitions/UserInputError'
 *
 *       401:
 *         description: User is not logged-in.
 *         schema:
 *           $ref: '#/definitions/AuthError'
 *
 *       403:
 *         description: User is logged-in but has no permission to see the Invitations
 *         schema:
 *           $ref: '#/definitions/PermissionError'
 */
router.get('/api/v1/users/:id/invitations',
    isLoggedIn(),
    async (ctx) => {
      const userId = ctx.params.id;

      if (!isValidUuidV4(userId)) {
        throw new HttpError(
            400,
            'INVALID_INPUT_ID',
            `User id "${userId}" is invalid UUID v4`
        );
      }

      if (ctx.state.user.id !== userId) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must cannot get a list of group invitations for someone else'
        );
      }

      if (!ctx.state.userPermissions.includes('canReadJoinedGroups')) {
        throw new HttpError(
            403,
            'NO_PERMISSION',
            'You must have permission "canReadJoinedGroups" in order to get a list of your group invitations'
        );
      }

      const invitations = await ctx.postgres.Invitations
          .findAll({
            where: {toUserId: userId},
          })
          .then((responses) => Array.isArray(responses) ? responses.map((response) => response.toJSON()) : []);

      ctx.body = invitations;
    }
);

module.exports = router;
