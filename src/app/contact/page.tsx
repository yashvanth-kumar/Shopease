"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { isValidEmail, sanitizeInput } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimit";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const rate = checkRateLimit(`contact-${form.email}`, 3, 300_000);
    if (!rate.allowed) {
      toast.error("Too many submissions. Please wait a few minutes.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email),
        subject: sanitizeInput(form.subject) || "General Inquiry",
        message: sanitizeInput(form.message),
        status: "new",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-ink-600">
          Have a question about an order, a product, or anything else? We're here to help.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <div className="card flex items-start gap-3 p-4">
            <Mail size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Email</p>
              <p className="text-sm text-ink-500">support@shopease-demo.com</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-4">
            <Phone size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Phone</p>
              <p className="text-sm text-ink-500">+1 (800) 555-0199</p>
              <p className="text-xs text-ink-400">Mon–Fri, 9am–6pm EST</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-4">
            <MapPin size={18} className="mt-0.5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Office</p>
              <p className="text-sm text-ink-500">500 Market Street, Suite 200<br />San Francisco, CA 94105</p>
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-3">
          {submitted ? (
            <div className="rounded-lg bg-brand-50 p-4 text-sm text-brand-800">
              Thanks for reaching out! We've received your message and will respond within 1
              business day.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700">
                    Name *
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Subject
                </label>
                <input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="input-field min-h-[120px]"
                  required
                  maxLength={2000}
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
