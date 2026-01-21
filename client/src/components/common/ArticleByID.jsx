import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userAuthorContextObj } from "../../context/UserAuthorContext.jsx";

import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import "./ArticleByID.css";

const ArticleByID = () => {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);

  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const [currentState, setCurrentState] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");

  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // enable edit mode
  function enableEdit() {
    setEditArticleStatus(true);
  }

  // save modified article
  async function onSave(modifiedArticle) {
    try {
      const token = await getToken();

      // merge edits into current state
      const articleAfterChanges = { ...currentState, ...modifiedArticle };

      const currentDate = new Date();
      articleAfterChanges.dateOfModification =
        currentDate.getDate() +
        "-" +
        (currentDate.getMonth() + 1) +
        "-" +
        currentDate.getFullYear();

      let res = await axios.put(
        `http://localhost:3000/author-api/article/${articleAfterChanges._id}`,
        articleAfterChanges,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "article modified") {
        setEditArticleStatus(false);
        setCurrentState(res.data.payload);

        // navigate to updated article
        navigate(`/author-profile/articles/${res.data.payload.articleId}`, {
          state: res.data.payload,
        });
      }
    } catch (err) {
      console.log("Error updating article:", err);
    }
  }

  // delete article
  async function deleteArticle() {
    try {
      const token = await getToken();

      const updatedArticle = { ...currentState, isArticleActive: false };

      let res = await axios.put(
        `http://localhost:3000/author-api/articles/${currentState._id}`,
        updatedArticle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "article deleted or restored") {
        setCurrentState(res.data.payload);
      }
    } catch (err) {
      console.log("Error deleting article:", err);
    }
  }

  // restore article
  async function restoreArticle() {
    try {
      const token = await getToken();

      const updatedArticle = { ...currentState, isArticleActive: true };

      let res = await axios.put(
        `http://localhost:3000/author-api/articles/${currentState._id}`,
        updatedArticle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "article deleted or restored") {
        setCurrentState(res.data.payload);
      }
    } catch (err) {
      console.log("Error restoring article:", err);
    }
  }

  // add comment by user
  async function addComment(commentObj) {
    try {
      commentObj.nameOfUser = currentUser.firstName;

      let res = await axios.put(
        `http://localhost:3000/user-api/comment/${currentState.articleId}`,
        commentObj
      );

      if (res.data.message === "comment added") {
        setCommentStatus("Comment added ✅");
        setCurrentState(res.data.payload); // update UI with new comments
        reset();
      }
    } catch (err) {
      console.log("Error adding comment:", err);
    }
  }

  return (
    <div className="article-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* ================= VIEW MODE ================= */}
            {!editArticleStatus ? (
              <div className="article-card">
                {/* HEADER */}
                <div className="article-card-header d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <h1>{currentState.title}</h1>
                    <div className="article-meta">
                      <span className="me-3">
                        📅 Created: {currentState.dateOfCreation}
                      </span>
                      <span>✏️ Modified: {currentState.dateOfModification}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-end gap-2">
                    {/* Author box */}
                    <div className="author-box">
                      <img
                        src={currentState.authorData.profileImageUrl}
                        alt="author"
                      />
                      <div>
                        <div className="fw-bold">
                          {currentState.authorData.nameOfAuthor}
                        </div>
                        <small className="opacity-75">
                          {currentState.authorData.email}
                        </small>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {currentUser.role === "author" && (
                      <div className="action-btns d-flex gap-2">
                        <button className="btn btn-light" onClick={enableEdit}>
                          <FaEdit className="text-warning" />
                        </button>

                        {currentState.isArticleActive ? (
                          <button
                            className="btn btn-light"
                            onClick={deleteArticle}
                          >
                            <MdDelete className="text-danger fs-4" />
                          </button>
                        ) : (
                          <button
                            className="btn btn-light"
                            onClick={restoreArticle}
                          >
                            <MdRestore className="text-info fs-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* BODY */}
                <div className="article-card-body">
                  <p
                    className="article-content"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {currentState.content}
                  </p>

                  {/* COMMENTS */}
                  <div className="comment-box">
                    <h5 className="fw-bold mb-3">💬 Comments</h5>

                    {currentState.comments.length === 0 ? (
                      <p className="text-secondary mb-0">No comments yet...</p>
                    ) : (
                      currentState.comments.map((commentObj) => (
                        <div key={commentObj._id} className="comment-item">
                          <div className="comment-user">
                            {commentObj?.nameOfUser}
                          </div>
                          <div>{commentObj?.comment}</div>
                        </div>
                      ))
                    )}

                    {commentStatus.length > 0 && (
                      <div className="comment-status">{commentStatus}</div>
                    )}

                    {/* Comment form */}
                    {currentUser.role === "user" && (
                      <form
                        onSubmit={handleSubmit(addComment)}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          {...register("comment", { required: true })}
                          className="form-control"
                          placeholder="Write a comment..."
                        />
                        <button className="btn-gradient mt-3" type="submit">
                          Add Comment
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ================= EDIT MODE ================= */
              <div className="article-card">
                <div className="article-card-header">
                  <h1>✏️ Edit Article</h1>
                  <p className="article-meta mb-0">
                    Update your article details below
                  </p>
                </div>

                <div className="article-card-body">
                  <form
                    onSubmit={handleSubmit(onSave)}
                    className="form-modern"
                  >
                    {/* Title */}
                    <div className="mb-4">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        defaultValue={currentState.title}
                        {...register("title")}
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label htmlFor="category">Category</label>
                      <select
                        {...register("category")}
                        id="category"
                        className="form-select"
                        defaultValue={currentState.category}
                      >
                        <option value="programming">Programming</option>
                        <option value="technology">Technology</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                        <option value="travel">Travel</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                      </select>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <label htmlFor="content">Content</label>
                      <textarea
                        className="form-control"
                        id="content"
                        rows="10"
                        defaultValue={currentState.content}
                        {...register("content")}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-soft"
                        onClick={() => setEditArticleStatus(false)}
                      >
                        Cancel
                      </button>

                      <button type="submit" className="btn-gradient">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* ================= END ================= */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleByID;
