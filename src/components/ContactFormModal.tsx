import { useState, useEffect, useCallback } from "react";
import { IconEnvelope, IconSparkle, IconHeart } from "./HandDrawnIcons";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [phase, setPhase] = useState<"entering" | "visible" | "leaving" | "hidden">("hidden");

  useEffect(() => {
    if (isOpen) {
      setPhase("entering");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("visible"));
      });
    } else if (phase !== "hidden") {
      setPhase("leaving");
      const timer = setTimeout(() => setPhase("hidden"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, phase]);

  const handleClose = useCallback(() => {
    setPhase("leaving");
    setTimeout(() => {
      setPhase("hidden");
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setSending(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Contact form is not configured.");
      }

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name.trim().slice(0, 100),
          email: formData.email.trim().slice(0, 255),
          message: formData.message.trim().slice(0, 2000),
        },
      });

      if (error) throw error;

      setSent(true);
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent!");
      setTimeout(() => {
        setSent(false);
        handleClose();
      }, 2500);
    } catch {
      toast.error("Oops! Something went wrong. Try again?");
    } finally {
      setSending(false);
    }
  };

  if (phase === "hidden") return null;

  const isVisible = phase === "visible";

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center px-4 transition-all duration-300 ${
        isVisible ? "bg-foreground/30 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`relative w-full max-w-md transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-8"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-crayon-pink text-secondary-foreground rounded-full font-heading text-xl font-bold wiggle-hover flex items-center justify-center"
          style={{ boxShadow: "var(--shadow-sketchy)" }}
        >
          x
        </button>

        {/* Form card */}
        <div
          className="sketchy-border-pink bg-card p-6 md:p-8"
          style={{ boxShadow: "var(--shadow-sketchy-hover)" }}
        >
          {sent ? (
            <div className="text-center py-8 animate-bounce-in">
              <IconHeart className="text-crayon-pink mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-heading font-bold text-crayon-pink mb-2">
                Yay, sent!
              </h3>
              <p className="font-hand text-lg text-muted-foreground">
                I'll get back to you super soon
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <IconEnvelope className="text-crayon-yellow mx-auto mb-2" size={36} />
                <h3 className="text-3xl font-heading font-bold text-foreground">
                  Drop me a note!
                </h3>
                <p className="font-hand text-muted-foreground mt-1">
                  I'd love to hear from you <IconSparkle className="text-crayon-yellow inline-block" size={16} />
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-hand text-sm text-muted-foreground mb-1">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    maxLength={100}
                    className="w-full px-4 py-3 bg-background text-foreground font-hand text-lg sketchy-border focus:outline-none focus:border-crayon-pink transition-colors"
                    placeholder="Ada Lovelace"
                  />
                </div>

                <div>
                  <label className="block font-hand text-sm text-muted-foreground mb-1">
                    Your email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    maxLength={255}
                    className="w-full px-4 py-3 bg-background text-foreground font-hand text-lg sketchy-border focus:outline-none focus:border-crayon-pink transition-colors"
                    placeholder="ada@example.com"
                  />
                </div>

                <div>
                  <label className="block font-hand text-sm text-muted-foreground mb-1">
                    Your message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-4 py-3 bg-background text-foreground font-hand text-lg sketchy-border focus:outline-none focus:border-crayon-pink transition-colors resize-none"
                    placeholder="Hey! I love your work..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full crayon-btn-primary text-lg inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <span className="animate-spin">*</span> Sending...
                    </>
                  ) : (
                    <>
                      Send it! <IconSparkle className="text-crayon-yellow" size={20} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactFormModal;
