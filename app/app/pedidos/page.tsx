
export default function PedidosPage() {
  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[28px]">
        <h1 className="text-xl font-black text-[#F8C927]">Mis Pedidos</h1>
      </div>
      <div className="px-5 py-16 text-center">
        <div className="text-5xl mb-3">📋</div>
        <h3 className="text-lg font-extrabold text-[#1A1D2E] mb-1">Sin pedidos aún</h3>
        <p className="text-sm text-gray-400 leading-relaxed max-w-[260px] mx-auto">
          Contactá a un profesional y tu historial aparecerá acá.
        </p>
      </div>
    </>
  );
}
