import { inspect, } from 'util';
import { Router, } from 'express';
import { checkSchema, } from 'express-validator';
import { ApiSuccess, } from '../../lib/ApiSuccess';
import { ApiRequestError, } from '../../lib/ApiRequestError';
import { validate, validator, optional, } from '../../lib/ApiValidationError';

import {
	aliases,
	models,
	sequelize,
} from '../../../db';

export const router = new Router({
	caseSensitive: true,
	mergeParams: true,
	strict: true,
});

interface GameRestartBody {
	giftsMaxAmount?: number,
	giftsMinAmount?: number,
	playersMaxAmount?: number,
	playersMinAmount?: number,
}

interface GameShuffleParams {
	gameId: number,
}

router.route('/game/restart')
	.post(
		checkSchema({
			giftsMaxAmount: {
				custom: { options: _ => typeof _ === 'number' && _ > 0, },
				errorMessage: '"giftsMaxAmount" expected as Integer',
				in: ['body'],
				optional,
			},
			giftsMinAmount: {
				custom: { options: _ => typeof _ === 'number' && _ > 0, },
				errorMessage: '"giftsMinAmount" expected as Integer',
				in: ['body'],
				optional,
			},
			playersMaxAmount: {
				custom: { options: _ => typeof _ === 'number' && _ > 0, },
				errorMessage: '"playersMaxAmount" expected as Integer',
				in: ['body'],
				optional,
			},
			playersMinAmount: {
				custom: { options: _ => typeof _ === 'number' && _ > 0, },
				errorMessage: '"playersMinAmount" expected as Integer',
				in: ['body'],
				optional,
			},
		}),
		validate,
		async (req, res) => {
			const {
				giftsMaxAmount = 10,
				giftsMinAmount = 1,
				playersMaxAmount = 500,
				playersMinAmount = 3,
			}: GameRestartBody = req.body;

			await models.Game.update({
				active: false,
			}, {
				where: {
					active: true,
				},
			});

			const gameItem = await models.Game.create({
				active: true,
				settings: {
					giftsMaxAmount,
					giftsMinAmount,
					playersMaxAmount,
					playersMinAmount,
				},
			});
			const game = gameItem.toJSON();

			throw new ApiSuccess({
				data: {
					id: game?.id,
					settings: { ...game?.settings, },
				}
			});
		},
	);

router.route('/game/:gameId(\\d+)/shuffle')
	.post(
		checkSchema({
			gameId: {
				custom: { options: _ => validator.isInt(_, { min: 1, }), },
				customSanitizer: { options: _ => +_, },
				errorMessage: '"gameId" expected as Integer',
				in: ['params'],
			},
		}),
		validate,
		async (req, res) => {
			const transaction = await sequelize.transaction();
			try {
				const {
					gameId,
				}: GameShuffleParams = req.params;

				const gameItem = await models.Game.findByPk(gameId, {
					include: {
						model: models.Player,
						as: aliases.Player.as,
						required: false,
						separated: true,
						include: {
							model: models.Gift,
							as: aliases.Gift.as,
							required: false,
							separated: true,
						},
					},
					transaction,
				});
				const game = gameItem.toJSON();
				const checks = [
					() => game,
					() => Array.isArray(game.player),
					() => game.settings.playersMinAmount <= game.player.length,
					() => game.player.length <= game.settings.playersMaxAmount,
					() => game.player.every(player => Array.isArray(player.gift)),
					() => game.player.every(player => game.settings.giftsMinAmount <= player.gift.length),
					() => game.player.every(player => player.gift.length <= game.settings.giftsMaxAmount),
					() => game.player.every(player => !player.santaPlayerId),
				];
	
				if (checks.some(check => !check())) {
					throw new ApiRequestError({
						text: 'Game not full filled',
					});
				}
	
				const playerIds = game.player.map(player => player.id);
				const santaIds = [];
				for (const player of gameItem.get('player')) {
					const playerId = player.get('id');
					const santaPlayerId = [ ...playerIds, ]
						.filter(id => ![ playerId, santaIds, ].includes(id))
						.sort(() => Math.random()>0 ? -1 : 1)
						.shift();
					santaIds.push(santaPlayerId);
					await player.update({
						santaPlayerId,
					}, {
						transaction,
					});
				}
	
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
			throw new ApiSuccess({
				data: {
					shuffled: true,
				},
			});
		},
	);