import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import * as serviceRegister from '../services/serviceManager';
import { AriaTrackService } from '../services/ariaTrackService';
import { RedisService } from '../services/redisService';
import { validate } from '../validator';
import schemas from '../schemas/schemas';
import { commonNotFound, commonOk } from '../commonPayload';
import { trackerLogger } from '../baseLogger';

const router = Router();
const ariaTrackService = serviceRegister.createGetter(AriaTrackService.ID);
const redisService = serviceRegister.createGetter(RedisService.ID);

const trackMapper = (track, timestamps) => {
    const data = {
        gid: track.gid,
        status: track.status,
        dir: track.dir,
        files: track.files.map(f => ({
            index: +f.index,
            path: f.path,
            uris: f.uris
        })),
        sizeTotal: +track.totalLength,
        sizeCompleted: +track.completedLength,
        pieceAmount: +track.numPieces,
        pieceSize: +track.pieceLength,
        bitfield: track.bitfield,
        connectionAmount: +track.connections,
        speedDown: +track.downloadSpeed,
        addedAt: timestamps.addedAt,
        elapsedTime: timestamps.elapsedTime
    };

    if (track.errorCode && track.errorCode > 0) {
        data.error = {
            code: +track.errorCode,
            message: track.errorMessage
        };
    }

    return data;
};

router.get('/list', authMiddleware, (req, res, next) => {

    ariaTrackService().allDownloads().then(tracks =>
        Promise.all(tracks.map(track =>
            redisService().getTrack(track.gid)
                .then(timestamps => [track, timestamps])
        ))
    ).then(combined => {
        const data = combined.map(([track, timestamps]) => trackMapper(track, timestamps));
        res.json(data);
    }).catch(err => {
        trackerLogger.error(err);
        next(err);
    });
});

router.get('/show/:gid', authMiddleware, (req, res) => {
    const gid = req.params.gid;

    ariaTrackService().downloadByGid(gid).then(track =>
        Promise.all([
            Promise.resolve(track),
            redisService().getTrack(gid)
        ])
    ).then(([track, timestamps]) => {
        res.json(trackMapper(track, timestamps));
    }).catch(err => {
        trackerLogger.track(err);
        res.status(404).json({
            error: true,
            code: 404,
            message: err.message || err
        });
    });
});

router.post('/new', authMiddleware, validate({body: schemas.ariaNew}), (req, res, next) => {

    const options = req.body?.options;
    const ariaUris = Array.isArray(req.body.uris) ? req.body.uris : [req.body.uris];
    const ariaPosition = req.body?.position;

    // Convert options to aria options
    let ariaOpts = undefined;
    if (options) {
        ariaOpts = {
            dir: options?.dir,
            out: options?.out,
            'auto-file-renaming': options?.autoFileRenaming,
            'max-connection-per-server': options?.maxConnectionsPerServer,
            'max-download-limit': options?.maxSpeed,
            'max-tries': options?.maxTries,
            'piece-length': options?.pieceLength,
            pause: options?.pause,
            checksum: options?.integrity && `${options.integrity.type}=${options.integrity.digest}`,
            'user-agent': options?.userAgent,
            header: options?.headers,
            'ftp-user': options?.ftp?.user,
            'ftp-passwd': options?.ftp?.passwd,
            'http-user': options?.http?.user,
            'http-passwd': options?.http?.passwd,
            'bt-trackers': options?.btTrackers
        };
    }

    ariaTrackService().addUri(ariaUris, ariaOpts, ariaPosition).then(r => {
        res.json(r);
    }).catch(err => {
        trackerLogger.error(err);
        next(err);
    });
});

router.patch('/resume', authMiddleware, (req, res, next) => {
    if (req.query?.gid) {
        ariaTrackService().resume(req.query.gid).then(() => {
            res.json(commonOk);
        }).catch(err => {
            trackerLogger.track(err);
            res.status(404).json(commonNotFound);
        });

    } else {
        ariaTrackService().resumeAll().then(() => {
            res.json(commonOk);
        }).catch(err => {
            trackerLogger.error(err);
            next(err);
        });
    }
});

router.patch('/pause', authMiddleware, (req, res, next) => {
    if (req.query?.gid) {
        ariaTrackService().pause(req.query.gid).then(() => {
            res.json(commonOk);
        }).catch(err => {
            trackerLogger.track(err);
            res.status(404).json(commonNotFound);
        });

    } else {
        ariaTrackService().pauseAll().then(() => {
            res.json(commonOk);
        }).catch(err => {
            trackerLogger.error(err);
            next(err);
        });
    }
});

router.patch('/remove/:gid', authMiddleware, (req, res, next) => {
    ariaTrackService().remove(req.params.gid).then(() => {
        res.json(commonOk);
    }).catch(err => {
        trackerLogger.track(err);
        res.status(404).json(commonNotFound);
    });
});

router.patch('/move/:gid', authMiddleware, validate({body: schemas.ariaMove}), (req, res, next) => {

    ariaTrackService().move(req.params.gid, req.body.position, 'POS_' + req.body.method).then(position => {
        res.json({position});
    }).catch(err => {
        trackerLogger.track(err);
        res.status(404).json(commonNotFound);
    });
});

export default router;
