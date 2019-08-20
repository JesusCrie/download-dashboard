import requestFactory from './requestFactory';

const statsRequest = requestFactory('/aria2/stats');
const listRequest = requestFactory('/aria2/list');
const showRequest = id => requestFactory(`/aria2/show/${id}`);

const newRequest = requestFactory('/aria2/new', 'post');
const resumeRequest = requestFactory('/aria2/resume', 'patch');
const pauseRequest = requestFactory('/aria2/pause', 'patch');
const removeRequest = id => requestFactory(`/aria2/remove/${id}`, 'delete');
const purgeRequest = requestFactory('/aria2/purge', 'delete');
const moveRequest = id => requestFactory(`/aria2/move/${id}`, 'patch');

export {
    statsRequest,
    listRequest,
    showRequest,

    newRequest,
    resumeRequest,
    pauseRequest,
    removeRequest,
    purgeRequest,
    moveRequest
};
