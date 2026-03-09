import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import mosqueLogo from "@/assets/mosque-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md text-center">
        <img
          src={mosqueLogo}
          alt="Jamia Masjid Shareef logo"
          className="mx-auto mb-5 h-14 w-14 object-contain"
          loading="lazy"
        />

        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-5 text-base text-muted-foreground">Page not found — یہ صفحہ موجود نہیں ہے</p>

        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <p className="font-arabic text-accent text-xl" dir="rtl">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="mt-2 text-xs text-muted-foreground font-body">
            “Indeed, with hardship comes ease.” (Qur’an 94:6)
          </p>
        </div>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-body font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

