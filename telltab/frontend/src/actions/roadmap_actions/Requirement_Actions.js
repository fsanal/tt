import {
    CREATE_REQUIREMENT,
    SELECT_REQUIREMENT,
    DELETE_REQUIREMENT,
    EDIT_REQUIREMENT,
    GET_REQUIREMENT,
    ADD_REQUIREMENT_VISIBILITY,
    REMOVE_REQUIREMENT_VISIBILITY,
    ADD_REQUIREMENT_TAG,
    DELETE_REQUIREMENT_TAG,
    ADD_REQUIREMENT_ASSIGNMENT,
    DELETE_REQUIREMENT_ASSIGNMENT,
    CREATE_REQUIREMENT_CUSTOMFIELD,
    DELETE_REQUIREMENT_CUSTOMFIELD,
    RETRIEVE_REQUIREMENTS
} from '../types/roadmap_types';
import api from '../../apis/api';
import history from '../../history';


export const createRequirement = (timeblockID, formValues) => async (dispatch, getState) => {
    //visibilityIDs, tagIDs, assignmentIDs (map()?)
    let roadmapID; //, initiativeID;
    const { currentRoadmap } = getState().roadmapState;
    //const { currentAuthor } = getState().authorState;
    //const { currentPersona } = getState().personaState;
    //const { currentTimeblock } = getState().timeblockState;
    if (currentRoadmap) roadmapID = currentRoadmap._id;
    //if (currentInitiative) initiativeID = currentInitiative._id;
    //if (currentAuthor) authorID = currentAuthor._id;
    //if (currentPersona) personaID = currentPersona._id;
    //if (currentTimeblock) timeblockID = currentTimeblock._id;
    const response = await api.post('/requirements/create', { ...formValues, roadmapID,
    timeblockID});
    dispatch({type: CREATE_REQUIREMENT, payload: response.data});
    return response.data;
}

export const selectRequirement = (requirement) => {
    return {
        type: SELECT_REQUIREMENT,
        payload: requirement
    }
}

export const getRequirement = (id) => async (dispatch) => {
    const response = await api.get(`/requirements/get/${id}`);
    return response.data;
}

export const editRequirement = (id, formValues) => async dispatch => {
    const response = await api.put(`/requirements/edit/${id}`, formValues);
    dispatch({type: EDIT_REQUIREMENT, payload: response.data});
}

export const deleteRequirement = (id) => async dispatch => {
    const response = await api.delete(`/requirements/delete/${id}`);
    dispatch({type: DELETE_REQUIREMENT, payload: response.data});
}

export const addRequirementVisibility = (id, visibilityID) => async dispatch => {
    const response = await api.put(`/requirements/add_visibility/${id}`, {visibilityID});
    dispatch({type: ADD_REQUIREMENT_VISIBILITY, payload: response.data});
}

export const removeRequirementVisibility = (id, visibilityID) => async dispatch => {
    const response = await api.put(`/requirements/remove_visibility/${id}`, {visibilityID});
    dispatch({type: REMOVE_REQUIREMENT_VISIBILITY, payload: response.data});
}

export const addRequirementTag = (id, tagID) => async dispatch => {
    const response = await api.put(`/requirements/add_tag/${id}`, {tagID});
    dispatch({type: ADD_REQUIREMENT_TAG, payload: response.data});
}

export const deleteRequirementTag = (id, tagID) => async dispatch => {
    const response = await api.put(`/requirements/delete_tag/${id}`, {tagID});
    dispatch({type: DELETE_REQUIREMENT_TAG, payload: response.data});
}

export const addRequirementAssignment = (id, assignmentID) => async dispatch => {
    const response = await api.put(`/requirements/add_assignment/${id}`, {assignmentID});
    dispatch({type: ADD_REQUIREMENT_ASSIGNMENT, payload: response.data});
}

export const deleteRequirementAssignment = (id, assignmentID) => async dispatch => {
    const response = await api.put(`/requirements/delete_assignment/${id}`, {assignmentID});
    dispatch({type: DELETE_REQUIREMENT_ASSIGNMENT, payload: response.data});
}

export const addRequirementCustomField = (id, fieldID) => async dispatch => {
    const response = await api.put(`/requirements/add_customfield/${id}`, {fieldID});
    dispatch({type: CREATE_REQUIREMENT_CUSTOMFIELD, payload: response.data});
}

export const deleteRequirementCustomField = (id, fieldID) => async dispatch => {
    const response = await api.put(`/requirements/delete_customfield/${id}`, {fieldID});
    dispatch({type: DELETE_REQUIREMENT_CUSTOMFIELD, payload: response.data});
}

export const retrieveRequirements = (timeblockID) => async () => {
    //const { secret } = getState().auth;
    const response = await api.post('/requirements/retrieve', {timeblockID});
    return response.data;
}

export const retrieveRequirements2 = () => async (dispatch, getState) => {
    //const { secret } = getState().auth;
    let roadmapID;
    const {currentRoadmap} = getState().roadmapState;
    if (currentRoadmap) roadmapID = currentRoadmap._id;
    const response = await api.post('/requirements/retrieve', {roadmapID});
    dispatch({type: RETRIEVE_REQUIREMENTS, payload: response.data});
}