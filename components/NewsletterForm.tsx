"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

interface NewsletterFormProps {
  variant?: "sidebar" | "footer";
}

export default function NewsletterForm({ variant = "sidebar" }: NewsletterFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    const result = await subscribeToNewsletter(formData);
    
    if (result.success) {
      setStatus("success");
      setMessage("You're in! Check your inbox soon.");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="text-emerald-500 mb-2" size={24} />
        <p className="text-emerald-900 text-sm font-bold text-center">{message}</p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <form action={handleSubmit} className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Your email"
          className="bg-stone-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-500 text-white"
        />
        <button 
          disabled={status === "loading"}
          type="submit"
          className="bg-orange-600 p-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} className="text-white" />}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-stone-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-colors duration-500" />
      
      <h3 className="text-lg font-serif font-bold mb-3 relative z-10">
        Join the Club
      </h3>
      <p className="text-stone-400 text-xs leading-relaxed mb-6 relative z-10">
        Weekly gourmet techniques and exclusive recipes delivered to your inbox.
      </p>
      
      <form action={handleSubmit} className="space-y-3 relative z-10">
        <div className="relative">
          <input
            name="email"
            type="email"
            required
            placeholder="chef@example.com"
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-stone-500"
          />
        </div>
        <button 
          disabled={status === "loading"}
          type="submit"
          className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-950/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Subscribe Now"
          )}
        </button>
      </form>
      
      {status === "error" && (
        <p className="mt-3 text-[10px] text-red-400 font-medium text-center animate-in fade-in slide-in-from-top-1">
          {message}
        </p>
      )}
    </div>
  );
}
