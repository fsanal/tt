import {
    CREATE_POST,
    RETRIEVE_POSTS,
    SELECT_POST,
    DELETE_POST,
    EDIT_POST,
    ADD_POST_TAG,
    DELETE_POST_TAG,
    SET_CURRENT_POST
} from '../../actions/types/feedback_forum_types';
import _ from 'lodash';

const INITIAL_STATE = {
    currentPost: null,
    posts: {},
    selectedPosts: {}
}

export default (state = INITIAL_STATE, action) => {
    let { posts, currentPost, selectedPosts} = state;
    switch (action.type) {
        case RETRIEVE_POSTS:
            return { ...state, posts: _.mapKeys(action.payload, '_id') };
        case CREATE_POST:
            posts[action.payload._id] = action.payload
            return { ...state, posts };
        case EDIT_POST:
            posts[action.payload._id] = action.payload
            return { ...state, posts };
        case DELETE_POST:
            posts = _.omit(posts, action.payload._id);
            return { ...state, posts };
        case SELECT_POST:
            let post = action.payload;
            if (!(selectedPosts.hasOwnProperty(post._id))) {
                selectedPosts[post._id] = post;
                return {...state, selectedPosts};
            } else {
                selectedPosts = _.omit(selectedPosts, post._id)
                return {...state, selectedPosts};
            }
        case ADD_POST_TAG:
            posts[action.payload._id] = action.payload;
            currentPost = action.payload;
            return { ...state, posts, currentPost };
        case DELETE_POST_TAG:
            posts[action.payload._id] = action.payload;
            currentPost = action.payload;
            return { ...state, posts, currentPost };    
        case SET_CURRENT_POST:
            currentPost = action.payload;
            console.log("Setting current post");
            return { ...state, currentPost };    
        default:
            return state;
    }
}