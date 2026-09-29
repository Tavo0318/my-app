<script>
	import { datos } from '$lib/stores/datos.svelte.js';
	import { esCorreo } from '$lib/validar.js';
	import { fechaHora } from '$lib/fecha.js';
	import CambiarPassword from '$lib/components/CambiarPassword.svelte';

	const guardada = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('config') ?? 'null') : null;
	let nombreInstitucion = $state(guardada?.nombreInstitucion ?? 'Corporación Universitaria Latinoamericana');
	let correo = $state(guardada?.correo ?? 'coordinador@redegresados.edu.co');
	let error = $state('');
	let guardado = $state(false);

	function guardar(e) {
		e.preventDefault();
		guardado = false;
		if (nombreInstitucion.trim().length < 3) { error = 'Ingresa el nombre de la institución.'; return; }
		if (!esCorreo(correo)) { error = 'Ingresa un correo válido.'; return; }
		error = '';
		localStorage.setItem('config', JSON.stringify({ nombreInstitucion, correo }));
		guardado = true;
	}
</script>

<h4 class="fw-bold mb-3"><i class="bi bi-gear-fill me-2"></i>Configuración del sistema</h4>

<div class="row g-3">
	<div class="col-lg-6">
		<form class="card p-4 shadow-sm" onsubmit={guardar} novalidate>
			{#if error}<div class="alert alert-danger py-2 small">{error}</div>{/if}
			<div class="mb-3"><label class="form-label fw-semibold">Nombre de la institución</label><input class="form-control" bind:value={nombreInstitucion} /></div>
			<div class="mb-3"><label class="form-label fw-semibold">Correo de notificaciones</label><input class="form-control" bind:value={correo} /></div>
			<div class="d-flex align-items-center gap-3">
				<button class="btn btn-primary" type="submit"><i class="bi bi-save me-1"></i> Guardar cambios</button>
				{#if guardado}<span class="text-success small"><i class="bi bi-check-circle-fill"></i> Configuración guardada</span>{/if}
			</div>
		</form>
		<CambiarPassword />
	</div>
	<div class="col-lg-6">
		<div class="card p-4 shadow-sm">
			<h6 class="fw-bold mb-3"><i class="bi bi-clock-history me-2"></i>Registro de actividad</h6>
			<div class="log-list">
				{#each datos.actividad as a (a.id)}
					<div class="log-item">
						<div class="d-flex justify-content-between"><strong class="small">{a.usuario}</strong><span class="text-muted small">{fechaHora(a.fecha)}</span></div>
						<div class="small">{a.accion}{#if a.detalle} · <span class="text-muted">{a.detalle}</span>{/if}</div>
					</div>
				{:else}
					<p class="text-muted small mb-0">Sin actividad registrada todavía.</p>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.log-list { max-height: 420px; overflow-y: auto; }
	.log-item { padding: 8px 0; border-bottom: 1px solid #eee; }
	.log-item:last-child { border-bottom: 0; }
</style>
