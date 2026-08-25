import { redirect } from "next/navigation";

export default function Home() {
  // Auth is the only screen so far — the dashboard will take over "/" later.
  redirect("/login");
}
