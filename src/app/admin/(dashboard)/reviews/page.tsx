import React from "react";
import { prisma } from "@/lib/db";
import ReviewsEditor from "./ReviewsEditor";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Client Reviews & Testimonials</h1>
        <p className="text-xs text-text-secondary mt-1">Manage client recommendations, feedback comments, client images, and rankings displayed on the portfolio.</p>
      </div>

      <ReviewsEditor initialReviews={reviews} />
    </div>
  );
}
