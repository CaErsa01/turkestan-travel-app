"use client";

import { Suspense } from "react";
import { ReviewsPageContent } from "./reviews-content";
import { LoadingState } from "@/components/shared/loading-state";

export default function ReviewsPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading..." />}>
      <ReviewsPageContent />
    </Suspense>
  );
}
