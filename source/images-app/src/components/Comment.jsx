import React from "react";

const Comment = props => {
  return (
    <div className="card">
      <h6 className="comment-user">{props.comment.username} :</h6>
      <p className="card-body"> {props.comment.comment} </p>
    </div>
  );
};

export default Comment;