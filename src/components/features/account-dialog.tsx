"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";

export function AccountDialog() {
  const { lang, t, user, setUser, bookings, toast } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const save = () => {
    if (!name.trim()) return;
    setUser({ name, email });
    toast(lang === "kk" ? "Кіру сәтті!" : lang === "ru" ? "Вход выполнен!" : "Logged in!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 border-white/20 text-surface">
          <User className="h-4 w-4" />
          {t("account.title")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("account.title")}</DialogTitle>
        </DialogHeader>
        {user ? (
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-navy/60">{user.email}</p>
            <p className="mt-4 text-sm">
              {lang === "kk" ? "Брондаулар" : lang === "ru" ? "Бронирования" : "Bookings"}:{" "}
              {bookings.length}
            </p>
          </div>
        ) : (
          <>
            <Input
              placeholder={lang === "kk" ? "Аты-жөні" : "Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={save}>{lang === "kk" ? "Кіру" : lang === "ru" ? "Войти" : "Login"}</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
