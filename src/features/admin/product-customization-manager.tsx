"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  saveCustomizationFieldAction,
  deleteCustomizationFieldAction,
} from "@/server/actions/admin-product.actions";
import type { ProductCustomizationField, CustomizationFieldType } from "@prisma/client";

const emptyForm = {
  label: "",
  fieldKey: "",
  type: "TEXT" as CustomizationFieldType,
  isRequired: true,
  optionsCsv: "",
  maxLength: "",
  sortOrder: "0",
};

export function ProductCustomizationManager({
  productId,
  fields,
}: {
  productId: string;
  fields: ProductCustomizationField[];
}) {
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdd() {
    startTransition(async () => {
      const result = await saveCustomizationFieldAction(productId, null, {
        ...form,
        maxLength: form.maxLength ? Number(form.maxLength) : "",
        sortOrder: Number(form.sortOrder),
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setForm(emptyForm);
      toast.success("Field added");
      router.refresh();
    });
  }

  function handleDelete(fieldId: string) {
    startTransition(async () => {
      await deleteCustomizationFieldAction(fieldId, productId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
              <div>
                <p className="font-medium">{field.label} <span className="text-muted-foreground">({field.fieldKey})</span></p>
                <p className="text-xs text-muted-foreground">
                  {field.type} · {field.isRequired ? "Required" : "Optional"}
                </p>
              </div>
              <button onClick={() => handleDelete(field.id)} aria-label="Delete field">
                <Trash2 className="size-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-3 rounded-lg border border-dashed border-border p-4 sm:grid-cols-3">
        <Input placeholder="Label (e.g. Customer Name)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <Input placeholder="Field key (e.g. customerName)" value={form.fieldKey} onChange={(e) => setForm({ ...form, fieldKey: e.target.value })} />
        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as CustomizationFieldType })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="TEXT">Text</SelectItem>
            <SelectItem value="TEXTAREA">Text area</SelectItem>
            <SelectItem value="DATE">Date</SelectItem>
            <SelectItem value="COLOR">Color choice</SelectItem>
            <SelectItem value="SELECT">Dropdown</SelectItem>
            <SelectItem value="IMAGE_UPLOAD">Image upload</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Options (comma separated, for dropdown/color)"
          value={form.optionsCsv}
          onChange={(e) => setForm({ ...form, optionsCsv: e.target.value })}
          className="sm:col-span-2"
        />
        <Input placeholder="Max length" type="number" value={form.maxLength} onChange={(e) => setForm({ ...form, maxLength: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.isRequired} onCheckedChange={(c) => setForm({ ...form, isRequired: !!c })} />
          Required
        </label>
        <Button type="button" onClick={handleAdd} disabled={isPending}>Add field</Button>
      </div>
    </div>
  );
}
