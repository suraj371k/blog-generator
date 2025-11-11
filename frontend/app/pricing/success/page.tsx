// app/pricing/success/page.tsx
import React, { Suspense } from "react";
import PaymentSuccess from "@/components/PyamentSuccess";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
