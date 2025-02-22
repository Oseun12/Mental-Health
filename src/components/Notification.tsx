"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Notification() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      const interval = setInterval(() => {
        toast.info("Don't forget to check in on your mood and journal today!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, 24 * 60 * 60 * 1000); 

      return () => clearInterval(interval);
    }
  }, [enabled]);

  return (
    <div className="mt-4">
      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="text-gray-700">Enable Daily Notifications</span>
      </label>
    </div>
  );
}
