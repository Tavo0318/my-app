export function hace(fecha) {
	const d = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
	return d <= 0 ? 'Hoy' : d === 1 ? 'Ayer' : `Hace ${d} días`;
}
export const fechaHora = (iso) => new Date(iso).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
