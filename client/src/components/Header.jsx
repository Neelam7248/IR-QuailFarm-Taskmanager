import React from "react";

export default function Header({ user, onSignOut }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* App Title */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Task Management App
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="text-sm text-slate-600">
              <div className="font-semibold">{user.email}</div>
              <div className="text-xs">Signed in</div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="px-3 py-2 rounded-2xl bg-white shadow hover:shadow-md 
                         border border-slate-200 text-sm"
            >
              Sign out
            </button>
          </div>
        ) : (
          <span className="text-sm text-slate-500">Please sign in</span>
        )}
      </div>
    </div>
  );
}
