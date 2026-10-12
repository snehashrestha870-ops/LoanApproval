import React from "react";
import Link from "next/link";
import { useAuth } from "../../components/context/AuthProvider";

const ProfilePage = () => {
  const { user } = useAuth();

  const fullName =
    user?.firstname && user?.lastname && user.firstname !== "Admin" && user.lastname !== "Admin"
      ? `${user.firstname} ${user.lastname}`
      : "Sneha Shrestha";

  const email = "admin@gmail.com";
  const role = user?.role || "ADMIN";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
        <div className="border-b border-slate-200 bg-gradient-to-r from-purple-900 to-indigo-700 px-6 py-8 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-100">
                Admin Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold">{fullName}</h1>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-2xl font-bold shadow-inner">
              {fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Full Name
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-800">{fullName}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Role
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-800">{role}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Email Address
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-800">{email}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Account Status
            </p>
            <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              Active
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-5">
          <Link
            href="/admin/dashboard"
            className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
};

ProfilePage.requiredAuth = true;

export default ProfilePage;
