import {
    CREATE_POST,
    RETRIEVE_POSTS,
    SELECT_POST,
    DELETE_POST,
    EDIT_POST,
    ADD_POST_TAG,
    DELETE_POST_TAG,
    SET_CURRENT_POST
} from '../types/feedback_forum_types';
import api from '../../apis/api';
import history from '../../history';

export const selectPost = (post) => {
    return {
        type: SELECT_POST,
        payload: post
    }
}

export const setCurrentPost = (post) => {
    return {
        type: SET_CURRENT_POST,
        payload: post
    }
}

export const createPost = (formValues) => async (dispatch, getState) => {
    const { title, body } = formValues;
    const { currentForum } = getState().forumState;
    const { currentBucket } = getState().bucketState;
    let forumID, bucketID;
    if (currentForum) forumID = currentForum._id;
    if (currentBucket) bucketID = currentBucket._id;
    const response = await api.post('/posts/create', { ...formValues, forumID, bucketID });
    dispatch({type: CREATE_POST, payload: response.data});
}

export const retrievePosts = (search) => async (dispatch, getState) => {
    const { forumState, bucketState } = getState();
    let forumID, bucketID;
    if (!forumState.currentForum) return history.push('/');
    forumID = forumState.currentForum._id;
    if (bucketState.currentBucket) bucketID = bucketState.currentBucket._id;
    const response = await api.post(`/posts/retrieve`, {forumID, bucketID, search});
    dispatch({type: RETRIEVE_POSTS, payload: response.data});
} 

export const deletePost = (post) => async (dispatch, getState) => {
    const { secret } = getState().auth;
    let id = post._id;
    const response = await api.delete(`/posts/delete/${id}`);
    dispatch({ type: DELETE_POST, payload: response.data });
}


export const addPostTag = (tagID) => async (dispatch, getState) => {
   // const { secret } = getState().auth;
    const { currentPost } = getState().postState;
    let id;
    if (currentPost) id = currentPost._id; else return;
    if (currentPost.tags.includes(tagID)) return
   // if (currentTagIDs.includes(tagID)) console.log("contains tagID");
    const response = await api.put(`/posts/add_tag/${id}`, {tagID});
    dispatch({ type: ADD_POST_TAG, payload: response.data });
}

export const deletePostTag = (tagID) => async (dispatch, getState) => {
    // const { secret } = getState().auth;
    const { currentPost } = getState().productState;
    let id;
    if (currentPost) id = currentPost._id; else return;
    const response = await api.put(`/posts/delete_tag/${id}`, {tagID});
    dispatch({ type: DELETE_POST_TAG, payload: response.data });
 }