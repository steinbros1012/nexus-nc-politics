"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const opinionSchema = z.object({
  type: z.enum(["EDITORIAL", "LETTER"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().default("NC"),
  organization: z.string().optional(),
  titleRole: z.string().optional(),
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  body: z.string().min(50, "Body must be at least 50 characters"),
  authorBio: z.string().optional(),
  supportingLinks: z.string().optional(),
  confirmOriginal: z.literal(true, {
    error: "You must confirm this is original work",
  }),
  confirmAccuracy: z.literal(true, {
    error: "You must confirm factual accuracy",
  }),
  confirmEditing: z.literal(true, {
    error: "You must agree to editorial review",
  }),
});

type OpinionFormData = z.infer<typeof opinionSchema>;

export default function SubmitOpinionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(opinionSchema) as any,
    defaultValues: {
      type: "EDITORIAL",
      state: "NC",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      organization: "",
      titleRole: "",
      headline: "",
      body: "",
      authorBio: "",
      supportingLinks: "",
      confirmOriginal: false,
      confirmAccuracy: false,
      confirmEditing: false,
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    const formData = data as unknown as OpinionFormData;
    setServerError("");
    try {
      const res = await fetch("/api/opinions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          supportingLinks: formData.supportingLinks
            ? String(formData.supportingLinks)
                .split("\n")
                .map((l: string) => l.trim())
                .filter(Boolean)
            : [],
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setServerError(err.error || "Something went wrong.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Submission Received</h1>
        <p className="text-muted mb-6">
          Thank you for your submission. Our editorial team will review it and
          get back to you via email.
        </p>
        <Link
          href="/"
          className="text-link hover:underline no-underline font-medium"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-link bg-white";
  const labelClass = "block text-sm font-medium text-foreground mb-1";
  const errorClass = "text-xs text-accent mt-1";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Submit an Opinion</h1>
      <p className="text-muted mb-8">
        Share your perspective on North Carolina politics and policy. We accept
        editorials (800-1200 words) and letters to the editor (200-400 words).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Type */}
        <div>
          <label className={labelClass}>Submission Type *</label>
          <select {...register("type")} className={inputClass}>
            <option value="EDITORIAL">Editorial / Op-Ed</option>
            <option value="LETTER">Letter to the Editor</option>
          </select>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input {...register("firstName")} className={inputClass} />
            {errors.firstName && (
              <p className={errorClass}>{String(errors.firstName.message)}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <input {...register("lastName")} className={inputClass} />
            {errors.lastName && (
              <p className={errorClass}>{String(errors.lastName.message)}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" {...register("email")} className={inputClass} />
            {errors.email && (
              <p className={errorClass}>{String(errors.email.message)}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" {...register("phone")} className={inputClass} />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input {...register("city")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input {...register("state")} className={inputClass} />
          </div>
        </div>

        {/* Organization */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Organization</label>
            <input {...register("organization")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Title / Role</label>
            <input {...register("titleRole")} className={inputClass} />
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className={labelClass}>Headline *</label>
          <input {...register("headline")} className={inputClass} />
          {errors.headline && (
            <p className={errorClass}>{String(errors.headline.message)}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label className={labelClass}>Body *</label>
          <textarea
            {...register("body")}
            rows={12}
            className={inputClass}
            placeholder="Write your editorial or letter here..."
          />
          {errors.body && (
            <p className={errorClass}>{String(errors.body.message)}</p>
          )}
        </div>

        {/* Author Bio */}
        <div>
          <label className={labelClass}>Author Bio (optional)</label>
          <textarea
            {...register("authorBio")}
            rows={3}
            className={inputClass}
            placeholder="Brief bio that will appear with the published piece..."
          />
        </div>

        {/* Supporting Links */}
        <div>
          <label className={labelClass}>
            Supporting Links (one per line, optional)
          </label>
          <textarea
            {...register("supportingLinks")}
            rows={3}
            className={inputClass}
            placeholder="https://example.com/source-1&#10;https://example.com/source-2"
          />
        </div>

        {/* Confirmations */}
        <div className="space-y-3 bg-section-bg p-4 rounded-lg">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("confirmOriginal")}
              className="mt-1"
            />
            <span>
              I confirm this is my original work and has not been published
              elsewhere. *
            </span>
          </label>
          {errors.confirmOriginal && (
            <p className={errorClass}>{String(errors.confirmOriginal.message)}</p>
          )}

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("confirmAccuracy")}
              className="mt-1"
            />
            <span>
              I confirm the facts presented are accurate to the best of my
              knowledge. *
            </span>
          </label>
          {errors.confirmAccuracy && (
            <p className={errorClass}>{String(errors.confirmAccuracy.message)}</p>
          )}

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("confirmEditing")}
              className="mt-1"
            />
            <span>
              I understand that submissions may be edited for length, clarity,
              and style. *
            </span>
          </label>
          {errors.confirmEditing && (
            <p className={errorClass}>{String(errors.confirmEditing.message)}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-header-bg text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}
