
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, Lock, Mail, User } from "lucide-react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await register(fullName, email, password);

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Registration failed. Please check your information."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] px-5 py-10 text-white">
      <div className="w-full max-w-md">

        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3">
              <Cloud size={28} />
            </div>

            <span className="text-2xl font-bold">
              TaskFlow
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111a2e] p-8 shadow-2xl">

          <h1 className="text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-gray-400">
            Start organizing your projects with TaskFlow.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1120] px-4">
                <User size={18} className="text-gray-500" />

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                  minLength={2}
                  maxLength={100}
                  required
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1120] px-4">
                <Mail size={18} className="text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1120] px-4">
                <Lock size={18} className="text-gray-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  maxLength={128}
                  required
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}
