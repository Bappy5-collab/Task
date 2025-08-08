import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LOCAL_STORAGE_KEY = "onlineShopReviews";

function Home() {
    const [shopName, setShopName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState("5");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Modal 
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [targetReview, setTargetReview] = useState(null);

    // Search 
    const [searchTerm, setSearchTerm] = useState("");

    const [reviews, setReviews] = useState(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        try {
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    }, [reviews]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!shopName.trim() || !reviewText.trim()) {
            toast.error("Please fill in both Shop Name and Review.");
            return;
        }

        if (isEditing) {
            setModalAction("update");
            setTargetReview({ id: editId });
            setShowModal(true);
        } else {
            const newReview = {
                id: Date.now(),
                shopName: shopName.trim(),
                reviewText: reviewText.trim(),
                rating: Number(rating),
                date: new Date().toLocaleString(),
            };
            setReviews((prev) => [newReview, ...prev]);
            toast.success("Review added successfully!");
            setShopName("");
            setReviewText("");
            setRating("5");
        }
    };

    const confirmUpdate = () => {
        setReviews((prev) =>
            prev.map((rev) =>
                rev.id === editId
                    ? {
                        ...rev,
                        shopName: shopName.trim(),
                        reviewText: reviewText.trim(),
                        rating: Number(rating),
                    }
                    : rev
            )
        );
        toast.success("Review updated successfully!");
        setIsEditing(false);
        setEditId(null);
        setShopName("");
        setReviewText("");
        setRating("5");
        closeModal();
    };

    const handleDelete = (id) => {
        setModalAction("delete");
        setTargetReview({ id });
        setShowModal(true);
    };

    const confirmDelete = () => {
        setReviews((prev) => prev.filter((rev) => rev.id !== targetReview.id));
        toast.info("Review deleted!");
        closeModal();
    };

    const closeModal = () => {
        setShowModal(false);
        setModalAction(null);
        setTargetReview(null);
    };

    const handleEdit = (review) => {
        setShopName(review.shopName);
        setReviewText(review.reviewText);
        setRating(review.rating.toString());
        setIsEditing(true);
        setEditId(review.id);
    };

    const renderStars = (num) => (
        <span className="text-yellow-400 text-lg">
            {"★".repeat(num) + "☆".repeat(5 - num)}
        </span>
    );

    // Filter 
    const filteredReviews = reviews.filter((rev) =>
        rev.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-xl mx-auto p-6 font-sans">
            <ToastContainer position="top-center" autoClose={2000} />

            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Online Shop Experience Review
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-10 bg-white p-6 rounded-lg shadow-md"
            >
                <label className="block mb-2 font-semibold text-gray-700">
                    Shop Name:
                </label>
                <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-4 py-2 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Enter shop name"
                />

                <label className="block mb-2 font-semibold text-gray-700">
                    Review:
                </label>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Write your review here"
                />

                <label className="block mb-2 font-semibold text-gray-700">
                    Rating:
                </label>
                <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    {[5, 4, 3, 2, 1].map((star) => (
                        <option key={star} value={star}>
                            {star} {star === 1 ? "star" : "stars"}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className={`w-full ${isEditing
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } text-white font-semibold py-3 rounded-md transition-colors`}
                >
                    {isEditing ? "Update Review" : "Submit Review"}
                </button>
            </form>

            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by shop name..."
                className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reviews</h2>

            {filteredReviews.length === 0 && (
                <p className="text-center text-gray-600">
                    No matching reviews found.
                </p>
            )}

            <div className="space-y-6">
                {filteredReviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                                {review.shopName}
                            </h3>
                            {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700 mb-3 whitespace-pre-line">
                            {review.reviewText}
                        </p>
                        <div className="text-sm text-gray-500 mb-3">{review.date}</div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleEdit(review)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">
                            {modalAction === "delete"
                                ? "Are you sure you want to delete this review?"
                                : "Are you sure you want to update this review?"}
                        </h2>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={
                                    modalAction === "delete" ? confirmDelete : confirmUpdate
                                }
                                className={`px-4 py-2 rounded text-white ${modalAction === "delete"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-yellow-500 hover:bg-yellow-600"
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
