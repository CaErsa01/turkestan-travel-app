"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";
import { QrPlacesList } from "@/components/qr/qr-places-list";

export function QrFeature() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("qr.title")}</DialogTitle>
        </DialogHeader>
        <QrPlacesList compact />
        <Link href="/qr" className="block text-center text-sm font-semibold text-heritage hover:underline">
          {t("qr.viewAll")} →
        </Link>
      </DialogContent>
    </Dialog>
  );
}
