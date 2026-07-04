import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/dictionaries";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
