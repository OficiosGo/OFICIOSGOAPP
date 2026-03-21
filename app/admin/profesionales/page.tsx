import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { Navbar } from "@/components/ui/navbar";
import { ApproveButton } from "./approve-button";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const [pending, approved] = await Promise.all([
    professionalRepository.getByStatus("PENDING", 1, 50),
    professionalRepository.getByStatus("APPROVED", 1, 50),
  ]);

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-6">
          <h1 className="text-3xl font-black text-brand-black mb-2">Panel Admin</h1>
          <p className="text-gray-500 text-sm mb-8">Gestión de profesionales</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200">
              <div className="text-2xl font-black text-yellow-700">{pending.total}</div>
              <div className="text-sm text-yellow-600">Pendientes</div>
            </div>
            <div className="p-5 rounded-2xl bg-green-50 border border-green-200">
              <div className="text-2xl font-black text-green-700">{approved.total}</div>
              <div className="text-sm text-green-600">Aprobados</div>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="text-2xl font-black text-blue-700">{pending.total + approved.total}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
          </div>

          {/* Pending */}
          {pending.data.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-extrabold text-brand-black mb-4">
                Pendientes de aprobación ({pending.total})
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                {pending.data.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-bold text-brand-black">{p.user.name}</div>
                      <div className="text-sm text-gray-500">{p.user.email} · {p.category.name} · {p.city}</div>
                    </div>
                    <ApproveButton profileId={p.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved */}
          <h2 className="text-lg font-extrabold text-brand-black mb-4">
            Profesionales aprobados ({approved.total})
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {approved.data.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-bold text-brand-black">{p.user.name}</div>
                  <div className="text-sm text-gray-500">{p.user.email} · {p.category.name} · {p.city}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">
                  Aprobado
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
