import React from 'react';
import Post from './Post'
import { connect } from 'react-redux';
import { retrievePosts, selectPost, deletePost, setCurrentPost, editPost } from '../../actions/feedback_forum_actions/Post_Actions';
import { createVote, deleteVote } from '../../actions/feedback_forum_actions/Vote_Actions';
class PostList extends React.Component {



    renderFeedbackClass(post){
        let cls = (this.props.selectedPosts.hasOwnProperty(post._id)) ? "feedback-selected" : "feedback";
        return cls
    }

    handleSelectPost = (post, e) => {
        e.preventDefault();
        console.log(e);
        if (e.type === "contextmenu") this.props.selectPost(post);
    }

    handleDeletePost = (post) => {
        console.log(post.tags);
        this.props.deletePost(post);
    }

    handleSetCurrentPost = (post) => {
        this.props.setCurrentPost(post);
    }

    addPostTag = (post) => {
        this.props.setCurrentPost(post);
        this.props.openCreateTagModal();
    }

    showPostModal = (post) => {
        this.props.setCurrentPost(post);
        this.props.openShowPostModal();
    }

    checkVote = (post) => {
        let votePosts = this.props.votes.map((vote) => vote.post._id);
        let index = votePosts.indexOf(post._id);
        if (index != -1) return this.props.votes[index] ; else return null;
    }

    renderVoteClass(post){
        let cls = (this.checkVote(post)) ? "feedback-voted" : "";
        return cls
    }
    
    handleVote = (post) => {
        let vote = this.checkVote(post);
        if (!vote) {
            console.log("Entered Create");
            this.props.createVote(post).then((result) => {
                this.props.setCurrentPost(post);
                let newNumVotes = post.numVotes + 1;
                this.props.editPost({ numVotes: newNumVotes})
            })
        } else {
            console.log("Entered Delete");
            this.props.deleteVote(vote).then((result) => {
                this.props.setCurrentPost(post);
                let newNumVotes = post.numVotes - 1;
                console.log(newNumVotes);
                this.props.editPost({ numVotes: newNumVotes})
            })
        }
    }

   
    renderList() {
        return this.props.posts.map(post => {
            return <Post numVotes = {post.numVotes} showPost = {() => {this.showPostModal(post)}} addPostTag = {() => {this.addPostTag(post)}} 
            onSetCurrent = {() => this.handleSetCurrentPost(post)} onDelete = {() => {this.handleDeletePost(post)}} 
            onSelect = {(e) => {this.handleSelectPost(post, e)}} key = {post._id} votes = {post.numVotes}
            voteCls = {this.renderVoteClass(post)} onVote = {() => {this.handleVote(post)}}
            cls = {this.renderFeedbackClass(post)} name = "Baiju" id = {post._id} title = {post.title} body = {post.body} />
        })
    }

    render() {
        return (
            <div className = "dashcontent__feedbacklist">
                {this.renderList()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: Object.values(state.postState.posts),
        selectedPosts: state.postState.selectedPosts,
        votes: Object.values(state.voteState.votes)
    }
}

export default connect(mapStateToProps, { retrievePosts, selectPost, deletePost, 
    setCurrentPost, editPost, createVote, deleteVote })(PostList);