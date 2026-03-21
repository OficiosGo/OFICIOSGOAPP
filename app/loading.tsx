export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-yellow animate-pulse" />
        <p className="text-sm text-gray-400 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
