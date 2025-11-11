export const dynamic = "force-dynamic";

import PaymentSuccess from "@/components/PyamentSuccess";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
