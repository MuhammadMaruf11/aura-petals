import type { Metadata } from "next";
import { getStoreSettings } from "@/server/services/admin-settings.service";
import { StoreSettingsForm } from "@/features/admin/store-settings-form";
import { serializeDecimals } from "@/lib/serialize";

export const metadata: Metadata = { title: "Store Settings · Admin" };

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl">Store settings</h1>
      <StoreSettingsForm settings={serializeDecimals(settings)} />
    </div>
  );
}
