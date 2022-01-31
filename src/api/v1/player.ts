import { Router, } from 'express';
import { checkSchema, } from 'express-validator';
import { validate, validator, } from '../../lib/ApiValidationError';
import { ApiRequestError, } from '../../lib/ApiRequestError';
import { ApiSuccess, } from '../../lib/ApiSuccess';

import {
	aliases,
	models,
} from '../../../db';

export const router = new Router({
	caseSensitive: true,
	mergeParams: true,
	strict: true,
});

interface PlayerCreateBody {
	name: string,
	surname: string,
}

interface PlayerCreateParams {
	gameId: number,
}

interface PlayerSantaParams {
	gameId: number,
	santaPlayerId: number,
}

router.route('/game/:gameId(\\d+)/player')
	.post(
		checkSchema({
			gameId: {
				custom: { options: _ => validator.isInt(_, { min: 1, }), },
				customSanitizer: { options: _ => +_, },
				errorMessage: '"gameId" expected as Integer',
				in: ['params'],
			},
			name: {
				custom: { options: _ => validator.isLength(_, { min: 1, max: 100, }), },
				errorMessage: '"name" expected as String',
				in: ['body'],
			},
			surname: {
				custom: { options: _ => validator.isLength(_, { min: 1, max: 100, }), },
				errorMessage: '"surname" expected as String',
				in: ['body'],
			},
		}),
		validate,
		async (req, res) => {
			const {
				gameId,
			}: PlayerCreateParams = req.params;
			const {
				name,
				surname,
			}: PlayerCreateBody = req.body;

			const gameItem = await models.Game.findOne({
				include: {
					model: models.Player,
					as: aliases.Player.as,
					required: false,
					separated: true,
				},
				where: {
					id: gameId,
					active: true,
				},
			});
			const game = gameItem && gameItem.toJSON();

			if (!game) {
				throw new ApiRequestError({
					text: 'Game unknown',
				});
			} else if (game.player.length > game.settings.playersMaxAmount) {
				throw new ApiRequestError({
					text: 'Game player full filled',
				});
			}

			const playerItem = await models.Player.create({
				gameId,
				santaPlayerId: null,
				name,
				surname,
			});
			const player = playerItem && playerItem.toJSON();

			throw new ApiSuccess({
				data: {
					id: player?.id,
					name: player?.name,
					surname: player?.surname,
				},
			});
		},
	);

router.route('/game/:gameId(\\d+)/santa/:santaPlayerId(\\d+)')
	.get(
		checkSchema({
			gameId: {
				custom: { options: _ => validator.isInt(_, { min: 1, }), },
				customSanitizer: { options: _ => +_, },
				errorMessage: '"gameId" expected as Integer',
				in: ['params'],
			},
			santaPlayerId: {
				custom: { options: _ => validator.isInt(_, { min: 1, }), },
				customSanitizer: { options: _ => +_, },
				errorMessage: '"santaPlayerId" expected as Integer',
				in: ['params'],
			},
		}),
		validate,
		async (req, res) => {
			const {
				gameId,
				santaPlayerId,
			}: PlayerSantaParams = req.params;

			const playerItem = await models.Player.findOne({
				where: {
					gameId,
					santaPlayerId,
				},
				include: [ {
					model: models.Game,
					as: aliases.Game.as,
					required: true,
					where: {
						active: true,
					},
				}, {
					model: models.Gift,
					as: aliases.Gift.as,
					required: false,
					separated: true,
				}, {
					model: models.Player,
					as: aliases.Player.santa,
					required: false,
					where: {
						gameId,
					},
				}, ],
			});
			const player = playerItem && playerItem.toJSON();

			if (!player) {
				throw new ApiRequestError({
					text: 'Santa unknown',
				});
			}

			throw new ApiSuccess({
				data: {
					player: {
						name: player.name,
						surname: player.surname,
					},
					gifts: player.gift.map(gift => gift.name),
				},
			});
		},
	);