import Vue from 'vue';
import { TrackStatus } from '../index';

const aria = {
    namespaced: true,

    state: {
        tracks: []
    },

    mutations: {
        setTracks(state, {tracks}) {
            state.tracks = tracks;
        },

        addTrack(state, {track}) {
            Vue.set(state.tracks, state.tracks.length, track);
        }
    },

    actions: {
        normalizeAndSaveTracks({commit, dispatch}, {tracks}) {
            // Reset list
            commit('setTracks', {tracks: []});

            // Normalize and save each
            tracks.forEach(track => {
                dispatch('normalizeAndAddTrack', {track});
            });
        },

        normalizeAndAddTrack({commit}, {track}) {
            // TODO: Modify to save more fields
            const normalized = {
                gid: track.gid,
                name: track.out,
                status: track.status,
                progress: track.sizeCompleted / track.sizeTotal,
                downloadedSize: track.sizeCompleted,
                totalSize: track.sizeTotal,
                speed: track.speedDown,
                elapsed: track.elapsedTime
            };

            // Compute remaining time
            if (track.status !== TrackStatus.ACTIVE) {
                // If not active, remaining time infinite due to the dl speed of 0
                normalized.remaning = Number.POSITIVE_INFINITY;
            } else {
                // Is active

                normalized.elapsed += (Date.now() / 1000 - track.startedAt);
                normalized.remaining = (normalized.totalSize - normalized.downloadedSize) / normalized.speed;
            }

            commit('addTrack', {track: normalized});
        }
    }
};

export default aria;
