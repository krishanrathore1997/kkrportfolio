"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { addReview, updateReview, deleteReview } from "../../actions";
import { Plus, Edit2, Trash2, Quote, Save, X, User } from "lucide-react";

interface ReviewItem {
  id: string;
  clientName: string;
  designation: string;
  reviewText: string;
  imageUrl: string;
  order: number;
}

interface ReviewsEditorProps {
  initialReviews: ReviewItem[];
}

export default function ReviewsEditor({ initialReviews }: ReviewsEditorProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clientName: "",
    designation: "",
    reviewText: "",
    imageUrl: "",
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      clientName: "",
      designation: "",
      reviewText: "",
      imageUrl: "",
      order: 0,
    });
    setEditingId(null);
  };

  const handleEditClick = (review: ReviewItem) => {
    setEditingId(review.id);
    setFormData({
      clientName: review.clientName,
      designation: review.designation,
      reviewText: review.reviewText,
      imageUrl: review.imageUrl,
      order: review.order,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update
        const res = await updateReview(editingId, formData);
        if (res.success) {
          setReviews((prev) =>
            prev
              .map((r) => (r.id === editingId ? { ...r, ...formData } : r))
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Review updated successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          resetForm();
        } else {
          throw new Error(res.message);
        }
      } else {
        // Create
        const res = await addReview(formData);
        if (res.success) {
          Swal.fire({
            title: "Success!",
            text: "Review added successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(res.message);
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save review.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C59B4C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const res = await deleteReview(id);
        if (res.success) {
          setReviews((prev) => prev.filter((r) => r.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Review has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to delete review.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Reviews List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-text-primary mb-2">Existing Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <div className="glass-panel p-10 text-center text-text-secondary rounded-2xl">
            No testimonials added yet. Use the editor to insert client recommendations.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`glass-panel p-6 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between transition-all duration-300 ${
                  editingId === review.id ? "border-primary bg-primary/5" : "border-black/5"
                }`}
              >
                {/* Client Profile and Text */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 shrink-0 flex items-center justify-center text-text-secondary">
                    {review.imageUrl ? (
                      <img
                        src={review.imageUrl}
                        alt={review.clientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = ""; // Force fallback to Icon
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{review.clientName}</h4>
                      <p className="text-xs text-primary font-medium">{review.designation}</p>
                      <span className="text-[10px] text-text-secondary bg-black/5 px-2 py-0.5 rounded font-bold w-fit block mt-1">
                        Order: {review.order}
                      </span>
                    </div>
                    <div className="relative pt-2 border-t border-black/5">
                      <Quote className="w-4 h-4 text-primary/20 absolute -top-1 -left-2" />
                      <p className="text-text-secondary text-xs font-light leading-relaxed pl-4 italic">
                        {review.reviewText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-black/5 pt-3 md:pt-0 md:pl-4 mt-4 md:mt-0 shrink-0">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="p-1.5 bg-black/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 bg-black/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Form */}
      <div>
        <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24">
          <div className="flex justify-between items-center border-b border-black/5 pb-3">
            <h3 className="font-bold text-text-primary text-md">
              {editingId ? "Edit Review" : "Add Review"}
            </h3>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs text-text-secondary hover:text-red-500 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g. Richard Miles"
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Client Designation / Company</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. CEO, Founder"
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Client Photo URL (Optional)</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g. /assets/img/client/client.png"
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Sort Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Review Text */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Testimonial Comment</label>
              <textarea
                name="reviewText"
                value={formData.reviewText}
                onChange={handleChange}
                rows={5}
                placeholder="Paste client recommendation description..."
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors resize-none"
                required
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-black font-semibold rounded-lg hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-xs"
            >
              {editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {loading ? "Saving..." : editingId ? "Update Review" : "Add Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
