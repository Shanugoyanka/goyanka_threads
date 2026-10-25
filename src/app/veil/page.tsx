"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderForm from "@/components/order/OrderForm";
import OrderConfirmation from "@/components/order/OrderConfirmation";

function OrderFlow() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const campaign = searchParams.get("campaign");

  const [orderNumber, setOrderNumber] = useState("");

  if (orderNumber) {
    return <OrderConfirmation orderNumber={orderNumber} />;
  }

  return (
    <OrderForm
      source={source}
      campaign={campaign}
      onSuccess={(num) => setOrderNumber(num)}
    />
  );
}

export default function VeilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--gold-light)] border-t-[var(--gold)] animate-spin" />
        </div>
      }
    >
      <OrderFlow />
    </Suspense>
  );
}
