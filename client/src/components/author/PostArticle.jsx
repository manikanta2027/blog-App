import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { userAuthorContextObj } from "../../context/UserAuthorContext";
import { useNavigate } from "react-router-dom";

function PostArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();

  async function postArticle(articleObj) {
    if (!currentUser.email) {
      alert("User email not found. Please refresh the page.");
      return;
    }

    const authorData = {
      nameOfAuthor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl,
    };
    articleObj.authorData = authorData;

    // article Id (timestamp)
    articleObj.articleId = Date.now();

    let currentDate = new Date();

    articleObj.dateOfCreation =
      currentDate.getDate() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getFullYear() +
      " " +
      currentDate.toLocaleTimeString("en-US", { hour12: true });

    articleObj.dateOfModification = articleObj.dateOfCreation;

    articleObj.comments = [];
    articleObj.isArticleActive = true;

    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/author-api/article`,
        articleObj
      );

      if (res.status === 201) {
        navigate(`/author-profile/${currentUser.email}/articles`);
      }
    } catch (err) {
      console.log("Error posting article:", err);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-8">

          {/* Title Like First Image */}
          <h2 className="text-center mb-4">Add new Articles</h2>

          {/* Card form like first image */}
          <div className="card shadow p-4 rounded-3">

            <form onSubmit={handleSubmit(postArticle)}>

              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="form-label fw-bold">
                  Article Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter a captivating title..."
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-danger mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="form-label fw-bold">
                  Category
                </label>
                <select
                  className="form-select"
                  id="category"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-danger mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Content */}
              <div className="mb-4">
                <label htmlFor="content" className="form-label fw-bold">
                  Content
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  rows="8"
                  placeholder="Write your article content here..."
                  {...register("content", {
                    required: "Content is required",
                    minLength: {
                      value: 100,
                      message: "Content must be at least 100 characters",
                    },
                  })}
                ></textarea>
                {errors.content && (
                  <p className="text-danger mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Publish Article
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;
