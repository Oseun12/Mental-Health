"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      return res.json();
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    goal: "",
    theme: "light",
    notifications: false,
  });

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => toast.success("Profile updated successfully!"),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
      <Input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="mb-4"
      />
      <Textarea
        placeholder="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        className="mb-4"
      />
      <Input
        type="text"
        placeholder="Your Mental Health Goal"
        value={formData.goal}
        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
        className="mb-4"
      />
      <div className="flex items-center justify-between mb-4">
        <span>Dark Mode</span>
        <Switch
          checked={formData.theme === "dark"}
          onCheckedChange={(value) =>
            setFormData({ ...formData, theme: value ? "dark" : "light" })
          }
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <span>Enable Notifications</span>
        <Switch
          checked={formData.notifications}
          onCheckedChange={(value) =>
            setFormData({ ...formData, notifications: value })
          }
        />
      </div>
      <Button
        onClick={() => updateProfile.mutate(formData)}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Update Profile
      </Button>
    </div>
  );
}
