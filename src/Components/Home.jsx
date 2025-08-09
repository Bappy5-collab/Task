import React, { useState, useEffect } from "react";
import { FaPlus, FaRegStar, FaSearch, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LOCAL_STORAGE_KEY = "onlineShopReviews";

function Home() {
    const [shopName, setShopName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState("5");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [showFormModal, setShowFormModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [targetReview, setTargetReview] = useState(null);

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

    const handleAddNew = () => {
        setShopName("");
        setReviewText("");
        setRating("5");
        setIsEditing(false);
        setEditId(null);
        setShowFormModal(true);
    };

    const handleEdit = (review) => {
        setShopName(review.shopName);
        setReviewText(review.reviewText);
        setRating(review.rating.toString());
        setIsEditing(true);
        setEditId(review.id);
        setShowFormModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!shopName.trim() || !reviewText.trim()) {
            toast.error("Please fill in both Shop Name and Review.");
            return;
        }

        if (isEditing) {
            setModalAction("update");
            setTargetReview({ id: editId });
            setShowConfirmModal(true);
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
            closeFormModal();
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
        closeFormModal();
        closeConfirmModal();
    };

    const handleDelete = (id) => {
        setModalAction("delete");
        setTargetReview({ id });
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        setReviews((prev) => prev.filter((rev) => rev.id !== targetReview.id));
        toast.info("Review deleted!");
        closeConfirmModal();
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setIsEditing(false);
        setEditId(null);
        setShopName("");
        setReviewText("");
        setRating("5");
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setModalAction(null);
        setTargetReview(null);
    };

    const renderStars = (num) => (
        <span className="text-yellow-400 text-lg flex">
            {[...Array(5)].map((_, index) =>
                index < num ? (
                    <FaStar key={index} />
                ) : (
                    <FaRegStar key={index} />
                )
            )}
        </span>
    );


    const filteredReviews = reviews.filter((rev) =>
        rev.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto font-san ">
            {/* Banner */}
            <section className="mb-12 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-500 text-white overflow-hidden flex items-center h-[320px]">
                <div className="w-full">
                    <div className="max-w-7xl mx-auto px-6 py-16 text-center md:text-left">
                        <p className="text-cyan-300 text-xl font-medium mb-2">Find Your Review Experience</p>
                        <h1 className="text-2xl md:text-5xl font-bold leading-tight">Discover & Promote <br /> Upcoming Review</h1>
                        <div className="mt-10 flex flex-col md:flex-row bg-white rounded-xl overflow-hidden text-gray-700 shadow-lg w-full md:max-w-5xl">
                            <div className="flex items-center gap-2 p-4 border-b md:border-b-0 md:border-r w-full">
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type="text"
                                    placeholder="Search Review"
                                    className="w-full outline-none"
                                />
                            </div>
                            <button className="bg-indigo-600 text-white px-6 py-4 hover:bg-indigo-700 flex items-center justify-center">
                                <FaSearch className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <ToastContainer position="top-center" autoClose={2000} />

            <div className="flex justify-center items-center  mb-6">
                <button onClick={handleAddNew} className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    <FaPlus className="text-white" />
                    Add New Review
                </button>
            </div>
            <div><hr className="text-gray-200" /> </div>
            {filteredReviews.length === 0 && (
                <p className="text-center text-red-500">No  reviews found.</p>
            )}
            {/* Review all cards */}
            <div className="space-y-6 px-4 py-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Review</h2>

                {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-5 rounded-xl border border-gray-300 shadow-sm">
                        <div className="mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{review.shopName}</h3>
                            {renderStars(review.rating)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-3">{review.date}</div>
                        <p className="text-gray-700 mb-3 whitespace-pre-line text-sm sm:text-base">{review.reviewText}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button onClick={() => handleEdit(review)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm sm:text-base"> Edit</button>
                            <button onClick={() => handleDelete(review.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base">  Delete </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                        <h1 className="text-2xl font-bold mb-4">{isEditing ? "Edit Review" : "Add Review"} </h1>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2 font-semibold text-gray-700">
                                Shop Name:
                            </label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Enter shop name"
                            />
                            <label className="block mb-2 font-semibold text-gray-700">
                                Review:
                            </label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className={`flex-1 ${isEditing
                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        } text-white font-semibold py-2 rounded-md`}
                                >
                                    {isEditing ? "Update Review" : "Submit Review"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeFormModal}
                                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-red-100 rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">
                            {modalAction === "delete"
                                ? "Are you sure you want to delete this review?"
                                : "Are you sure you want to update this review?"}
                        </h2>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 bg-white rounded hover:bg-gray-400"
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
