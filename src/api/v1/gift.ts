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

interface GiftCreateBody {
	name: string,
}

interface GiftCreateParams {
	playerId: number,
}

router.route('/player/:playerId(\\d+)/gift')
	.post(
		checkSchema({
			playerId: {
				custom: { options: _ => validator.isInt(_, { min: 1, }), },
				customSanitizer: { options: _ => +_, },
				errorMessage: '"playerId" expected as Integer',
				in: ['params'],
			},
			name: {
				custom: { options: _ => validator.isLength(_, { min: 1, max: 100, }), },
				errorMessage: '"name" expected as String',
				in: ['body'],
			},
		}),
		validate,
		async (req, res) => {
			const {
				playerId,
			}: GiftCreateParams = req.params;
			const {
				name,
			}: GiftCreateBody = req.body;

			const playerItem = await models.Player.findByPk(playerId, {
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
				}, ],
      });
			const player = playerItem && playerItem.toJSON();

			if (!player) {
				throw new ApiRequestError({
					text: 'Player unknown',
				});
			} else if (player.gift.length + 1> player.game.settings.giftsMaxAmount) {
				throw new ApiRequestError({
					text: 'Player gifts full filled',
				});
			}

			const giftItem = await models.Gift.create({
				playerId,
				name,
			});
			const gift = giftItem && giftItem.toJSON();

			throw new ApiSuccess({
				data: {
					id: gift?.id,
					name: gift?.name,
				},
			});
		},
	);
