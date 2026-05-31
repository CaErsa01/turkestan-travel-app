"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore } from "@/stores/use-user-store";
import { useAppStore } from "@/stores/use-app-store";
import type { UserProfile } from "@/domain/types";
import {
  Route,
  Calendar,
  QrCode,
  Bell,
  Database,
  type LucideIcon,
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export default function ProfilePage() {
  const { t } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const savedRouteIds = useUserStore((s) => s.savedRouteIds);
  const bookings = useUserStore((s) => s.bookings);
  const qrHistory = useUserStore((s) => s.qrHistory);
  const notificationsEnabled = useUserStore((s) => s.notificationsEnabled);
  const setNotifications = useUserStore((s) => s.setNotifications);
  const isOnline = useAppStore((s) => s.isOnline);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile?.name ?? "", email: profile?.email ?? "" },
  });

  const onLogin = (values: z.infer<typeof profileSchema>) => {
    const p: UserProfile = {
      id: profile?.id ?? `u-${Date.now()}`,
      name: values.name,
      email: values.email,
      mode: "registered",
    };
    setProfile(p);
    showToast("Profile saved");
  };

  const logout = () => {
    setProfile(null);
    showToast("Guest mode");
  };

  return (
    <div>
      <PageHeader title={t("profile.title")} backHref="/" />

      <div className="panel-light mb-6 p-4">
        {profile ? (
          <>
            <p className="font-semibold">{profile.name}</p>
            <p className="text-sm text-charcoal/60">{profile.email}</p>
            <button type="button" className="btn-secondary mt-3 text-xs" onClick={logout}>
              Switch to guest
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-charcoal/60">{t("profile.guest")}</p>
            <form onSubmit={form.handleSubmit(onLogin)} className="mt-3 space-y-2">
              <input {...form.register("name")} placeholder="Name" className="w-full rounded border px-3 py-2 text-sm" />
              <input {...form.register("email")} placeholder="Email" className="w-full rounded border px-3 py-2 text-sm" />
              <button type="submit" className="btn-primary w-full text-sm">
                Save profile (local)
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-charcoal/10 bg-white px-3 py-2 text-sm">
        <Database className="h-4 w-4 text-heritage" />
        <span>{isOnline ? t("common.online") : t("common.offline")}</span>
      </div>

      <nav className="grid gap-2 sm:grid-cols-2">
        <ProfileLink href="/routes" icon={Route} label={`Saved routes (${savedRouteIds.length})`} />
        <ProfileLink href="/booking" icon={Calendar} label={`Bookings (${bookings.length})`} />
        <ProfileLink href="/qr/yasawi" icon={QrCode} label={`QR history (${qrHistory.length})`} />
      </nav>

      <label className="mt-6 flex items-center gap-3 panel-light p-4">
        <Bell className="h-5 w-5 text-heritage" />
        <span className="flex-1 text-sm">Push notifications</span>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotifications(e.target.checked)}
        />
      </label>
    </div>
  );
}

function ProfileLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-charcoal/10 bg-white px-4 py-3 text-sm font-medium hover:border-heritage"
    >
      <Icon className="h-5 w-5 text-heritage" />
      {label}
    </Link>
  );
}
