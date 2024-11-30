'use client';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/signin";
            } else {
                console.error("Logout failed:", res.status);
            }
        } catch (error) {
            console.error("Error occurred during logout:", error);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            className="text-teal-800 border-teal-800 hover:bg-teal-100"
        >
            <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
    );
}
