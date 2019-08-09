import { Router } from 'express';
import * as serviceRegister from '../services/serviceManager';
import { AriaTrackService } from '../services/ariaTrackService';
import { RedisService } from '../services/redisService';
import authMiddleware from '../middlewares/authMiddleware';
import { validate } from '../validator';
import schemas from '../schemas/schemas';

const router = Router();
const ariaTrackService = serviceRegister.createGetter(AriaTrackService.ID);
const redisService = serviceRegister.createGetter(RedisService.ID);



export default router;
