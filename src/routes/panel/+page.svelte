<script>
	import Bienvenida from '$lib/components/Bienvenida.svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { menuDe } from '$lib/permisos.js';
	import { fechaHora, hace } from '$lib/fecha.js';

	const GRADS = ['bg-g-blue', 'bg-g-green', 'bg-g-amber', 'bg-g-purple', 'bg-g-teal', 'bg-g-red'];
	const miId = $derived(auth.usuario?.id);

	let abiertas = $derived(datos.vacantes.filter((v) => v.estado === 'abierta'));
	let porRevisar = $derived(datos.postulaciones.filter((p) => p.estado === 'En revisión').length);
	let contratados = $derived(datos.postulaciones.filter((p) => p.estado === 'Contratado').length);
	let empleados = $derived(datos.egresados.filter((e) => e.estadoLaboral === 'Empleado').length);
	let tasa = $derived(datos.egresados.length ? Math.round((empleados / datos.egresados.length) * 100) : 0);
	let accesos = $derived(menuDe(auth.rol).filter((m) => m.href !== '/panel' && m.href !== '/cuenta'));

	// Egresado
	let perfil = $derived(datos.egresados.find((e) => e.id === miId));
	let completitud = $derived(perfil ? Math.round((['celular', 'ciudad', 'programa', 'anio', 'cargoDeseado', 'resumen', 'cv'].filter((c) => String(perfil[c] ?? '').trim()).length / 7) * 100) : 0);
	let misPost = $derived(datos.postulaciones.filter((p) => p.egresadoId === miId));
	let pendientes = $derived(datos.encuestas.filter((e) => e.activa && !e.respuestas.some((r) => r.egresadoId === miId)).length);
	let recientes = $derived([...abiertas].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3));
</script>

<Bienvenida />

{#if auth.rol === 'egresado'}
	{#if pendientes > 0}
		<div class="alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2">
			<div><i class="bi bi-clipboard-check-fill me-2"></i> Tienes {pendientes} encuesta(s) de seguimiento laboral pendiente(s).</div>
			<a href="/encuestas" class="btn btn-sm btn-warning">Responder ahora</a>
		</div>
	{/if}
	<div class="row g-3 mb-4">
		<div class="col-md-4"><a href="/perfil" class="acceso-card bg-g-teal"><i class="bi bi-person-check-fill"></i><div class="n">{completitud}%</div><div>Perfil completo</div></a></div>
		<div class="col-md-4"><a href="/postulaciones" class="acceso-card bg-g-blue"><i class="bi bi-send-fill"></i><div class="n">{misPost.length}</div><div>Mis postulaciones</div></a></div>
		<div class="col-md-4"><a href="/vacantes" class="acceso-card bg-g-amber"><i class="bi bi-briefcase-fill"></i><div class="n">{abiertas.length}</div><div>Vacantes disponibles</div></a></div>
	</div>
	<h5 class="fw-bold mb-3">Vacantes recientes</h5>
	<div class="row g-3">
		{#each recientes as v (v.id)}
			<div class="col-md-4"><div class="card p-3 shadow-sm h-100"><div class="fw-bold">{v.cargo}</div><div class="text-muted small mb-2">{v.empresa} · {v.ciudad}</div><div class="small text-muted mb-2">{hace(v.fecha)}</div><a href="/vacantes" class="btn btn-sm btn-outline-primary mt-auto">Ver vacantes</a></div></div>
		{/each}
	</div>

{:else}
	<div class="row g-3 mb-4">
		<div class="col-6 col-lg-3"><div class="acceso-card bg-g-blue"><i class="bi bi-briefcase-fill"></i><div class="n">{abiertas.length}</div><div>Vacantes abiertas</div></div></div>
		<div class="col-6 col-lg-3"><div class="acceso-card bg-g-amber"><i class="bi bi-hourglass-split"></i><div class="n">{porRevisar}</div><div>Postulaciones por revisar</div></div></div>
		<div class="col-6 col-lg-3"><div class="acceso-card bg-g-green"><i class="bi bi-person-check-fill"></i><div class="n">{contratados}</div><div>Egresados contratados</div></div></div>
		<div class="col-6 col-lg-3"><div class="acceso-card bg-g-purple"><i class="bi bi-graph-up-arrow"></i><div class="n">{tasa}%</div><div>Tasa de empleabilidad</div></div></div>
	</div>

	<h5 class="fw-bold mb-3">Tus módulos</h5>
	<div class="row g-3 mb-4">
		{#each accesos as m, i}
			<div class="col-md-6 col-xl-4"><a href={m.href} class="acceso-card {GRADS[i % GRADS.length]}"><i class="bi {m.icon}"></i><div class="fw-bold mt-1">{m.label}</div><div class="small opacity-75">{m.desc}</div></a></div>
		{/each}
	</div>

	{#if auth.rol === 'admin'}
		<h5 class="fw-bold mb-3">Actividad reciente</h5>
		<div class="card shadow-sm"><div class="table-responsive"><table class="table align-middle mb-0">
			<thead class="table-light"><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
			<tbody>
				{#each datos.actividad.slice(0, 6) as a (a.id)}
					<tr><td class="small text-muted">{fechaHora(a.fecha)}</td><td>{a.usuario}</td><td><span class="badge bg-light text-dark border">{a.accion}</span></td><td class="small">{a.detalle}</td></tr>
				{:else}
					<tr><td colspan="4" class="text-center text-muted py-3">Aún no hay actividad registrada.</td></tr>
				{/each}
			</tbody></table></div></div>
	{/if}
{/if}
