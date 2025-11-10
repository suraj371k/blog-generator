import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-yellow-600 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">Your payment was cancelled. No charges were made.</p>
        <Link href="/pricing" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Back to Pricing
        </Link>
      </div>
    </div>
  );
}