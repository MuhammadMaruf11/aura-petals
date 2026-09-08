import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/current-user";
import { getAddressesForCurrentUser } from "@/server/services/address.service";
import { ProfileForm } from "@/features/account/profile-form";
import { ChangePasswordForm } from "@/features/account/change-password-form";
import { AddressFormDialog } from "@/features/account/address-form-dialog";
import { AddressCard } from "@/features/account/address-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Account Settings" };

export default async function AccountSettingsPage() {
  const [user, addresses] = await Promise.all([requireUser(), getAddressesForCurrentUser()]);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl">Account Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses ({addresses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 max-w-md space-y-8">
          <div>
            <h2 className="mb-4 font-heading text-lg">Your details</h2>
            <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone }} />
          </div>
          <Separator />
          <div>
            <h2 className="mb-4 font-heading text-lg">Change password</h2>
            <ChangePasswordForm />
          </div>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <div className="mb-4 flex justify-end">
            <AddressFormDialog />
          </div>
          {addresses.length === 0 ? (
            <EmptyState title="No saved addresses" description="Add an address to check out faster next time." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
