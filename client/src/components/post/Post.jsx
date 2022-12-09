import React from "react";
import "./post.css";

export default function Post({ fullname, username, postBody, createdAt }) {
  let date = new Date(createdAt);
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return (
    <div className="post">
      <div className="post-content">
        <div className="post-picture">
          <img src="/default-pfp.jpg" alt="" />
        </div>
        <div className="post-text">
          <div className="post-header">
            <div className="left-post-header">
              <p className="post-fullname">{fullname}</p>
              <p className="post-username">@{username}</p>
              <p className="post-dot">&#8226;</p>
              <p className="post-date">
                {date.toLocaleString("en-US", dateOptions)}
              </p>
            </div>
            <div className="right-post-header">
              <div className="meatball-btn">
                <span class="material-symbols-outlined">more_horiz</span>
              </div>
            </div>
          </div>
          <p className="post-body">{postBody}</p>
          
          {/* <div className="like-comment-share-btns">
          <span class="material-symbols-rounded">thumb_up</span>
          <span class="material-symbols-rounded">chat_bubble</span>
          <span class="material-symbols-rounded">google_plus_reshare</span>
        </div> */}
        </div>
      </div>
      <hr />
      <div className="like-comment-share-btns">
        <span class="material-symbols-rounded">thumb_up</span>
        <span class="material-symbols-rounded">chat_bubble</span>
        <span class="material-symbols-rounded">google_plus_reshare</span>
      </div>
    </div>
  );
}
