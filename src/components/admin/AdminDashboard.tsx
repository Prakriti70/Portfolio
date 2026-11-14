"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArtworkRow } from "@/types/artwork";
import { getBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchArtwork } from "@/lib/supabase/artwork";
import { deleteArtwork, saveOrder, updateArtwork } from "@/lib/supabase/admin";
import { moveItem } from "@/lib/artwork";
import { parseValues, type FormValues } from "./ArtworkFields";
import { ArtworkEditor } from "./ArtworkEditor";
import { LoginForm } from "./LoginForm";
import { UploadForm } from "./UploadForm";

type Phase = "loading" | "signedOut" | "notAdmin" | "ready";

/** Checks that the signed-in user is listed in the `admins` table (RLS lets them read only their own row). */
async function checkAdmin(client: SupabaseClient): Promise<boolean> {
  const { data } = await client.from("admins").select("user_id").maybeSingle();
  return Boolean(data);
}

export function AdminDashboard() {
  const client = getBrowserClient();
  const [phase, setPhase] = useState<Phase>("loading");
  const [rows, setRows] = useState<ArtworkRow[]>([]);
  const [notice, setNotice] = useState("");

  const reload = useCallback(async () => {
    if (!client) return;
    const result = await fetchArtwork(client);
    if (result.error) setNotice(`Couldn't load the gallery: ${result.error}`);
    else setRows(result.rows);
  }, [client]);

  // Follow the login session. All state changes happen inside async callbacks.
  useEffect(() => {
    if (!client) return;
    async function sync(signedIn: boolean) {
      if (!signedIn) return setPhase("signedOut");
      if (await checkAdmin(client!)) {
        setPhase("ready");
        reload();
      } else setPhase("notAdmin");
    }
    client.auth.getSession().then(({ data }) => sync(Boolean(data.session)));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => { sync(Boolean(session)); });
    return () => sub.subscription.unsubscribe();
  }, [client, reload]);

  if (!isSupabaseConfigured || !client) {
    return (
      <div className="rounded-lg border-2 border-rose bg-cream p-6">
        <h1 className="text-3xl">Admin isn&apos;t set up yet</h1>
        <p className="mt-3">Add your Supabase URL and anon key to <code>.env.local</code> and restart the dev server. See the README, “Supabase setup”.</p>
        <p className="mt-3"><Link href="/" className="underline">← Back to the site</Link></p>
      </div>
    );
  }

  const signOut = () => client.auth.signOut();

  async function handleSave(id: string, values: FormValues) {
    const { data } = parseValues(values);
    if (!data) throw new Error("Some fields need fixing.");
    await updateArtwork(client!, id, data);
    await reload();
  }
  async function handleDelete(row: ArtworkRow) {
    await deleteArtwork(client!, row);
    setRows((r) => r.filter((x) => x.id !== row.id));
  }
  async function handleMove(index: number, direction: -1 | 1) {
    const next = moveItem(rows, index, index + direction);
    setRows(next); // optimistic
    try {
      await saveOrder(client!, next.map((r) => r.id));
      setNotice("");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Couldn't save the new order.");
      reload();
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl">Art Journal admin</h1>
        <div className="flex gap-4">
          <Link href="/#art" className="inline-flex min-h-11 items-center underline">View site</Link>
          {phase !== "signedOut" && phase !== "loading" && (
            <button type="button" onClick={signOut} className="min-h-11 underline">Sign out</button>
          )}
        </div>
      </header>

      {phase === "loading" && <p role="status">Checking your session…</p>}
      {phase === "signedOut" && <LoginForm client={client} />}
      {phase === "notAdmin" && (
        <p role="alert" className="rounded-lg border-2 border-rose bg-cream p-6">
          You&apos;re signed in, but this account isn&apos;t an admin, so you can&apos;t edit the gallery. See supabase/README.md, step 5.
        </p>
      )}
      {notice && <p role="alert" className="rounded bg-cream p-3 text-midnight">{notice}</p>}

      {phase === "ready" && (
        <>
          <UploadForm client={client} onCreated={(row) => setRows((r) => [row, ...r])} />
          <section aria-labelledby="existing">
            <h2 id="existing" className="mb-4 text-2xl">Your gallery ({rows.length})</h2>
            {rows.length === 0 ? (
              <p className="font-serif italic">Nothing yet. Upload your first piece above.</p>
            ) : (
              <ul className="space-y-3">
                {rows.map((row, i) => (
                  <ArtworkEditor key={row.id} row={row} index={i} count={rows.length} onMove={(d) => handleMove(i, d)} onSave={handleSave} onDelete={handleDelete} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
