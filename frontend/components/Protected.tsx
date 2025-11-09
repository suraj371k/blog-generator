"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, profile } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        await profile();
      }
    };
    checkUser();
  }, [user, profile]);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push("/login"); // redirect to login
    return null;
  }
  return <>{children}</>; // render protected content
};

export default ProtectedRoute;
