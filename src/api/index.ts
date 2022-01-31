import { Router, } from 'express';
import * as game from './v1/game';
import * as player from './v1/player';
import * as gift from './v1/gift';

export const router = new Router({
	caseSensitive: true,
	mergeParams: true,
	strict: true,
});

router.use('/v1', game.router);
router.use('/v1', player.router);
router.use('/v1', gift.router);
// router.use('/v1', (req, res, next) => next(new Error(`${ req.url }`)));
