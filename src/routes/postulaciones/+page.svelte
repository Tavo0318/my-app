<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { puede } from '$lib/permisos.js';

	const miId = $derived(auth.usuario?.id);
	const puedeEditar = $derived(puede(auth.rol, 'postulaciones', 'actualizar'));
	const puedeBorrar = $derived(puede(auth.rol, 'postulaciones', 'eliminar'));

	const vac = (id) => datos.vacantes.find((v) => v.id === id);
	const eg = (id) => datos.egresados.find((e) => e.id === id);
	const colorEstado = { 'En revisión': 'bg-warning text-dark', Preseleccionado: 'bg-info text-dark', Contratado: 'bg-success', Rechazado: 'bg-danger' };

	// Egresado: las suyas
	let mias = $derived(datos.postulaciones.filter((p) => p.egresadoId === miId));

	// Coordinador / Admin: todas
	let filtroEstado = $state('todas');
	let q = $state('');
	let todas = $derived(
		datos.postulaciones
			.filter((p) => filtroEstado === 'todas' || p.estado === filtroEstado)
			.filter((p) => { const e = eg(p.egresadoId), v = vac(p.vacanteId); return !q || (e?.nombre + ' ' + v?.cargo + ' ' + v?.empresa).toLowerCase().includes(q.toLowerCase()); })
			.sort((a, b) => b.fecha.localeCompare(a.fecha))
	);
</script>

{#if auth.rol === 'egresado'}
	<h4 class="fw-bold mb-3"><i class="bi bi-send-check-fill me-2"></i>Mis postulaciones</h4>
	<div class="card shadow-sm">
		<div class="table-responsive">
			<table class="table align-middle mb-0">
				<thead class="table-light"><tr><th>Cargo</th><th>Empresa</th><th>Ciudad</th><th>Estado</th><th></th></tr></thead>
				<tbody>
					{#each mias as p (p.id)}
						{@const v = vac(p.vacanteId)}
						<tr>
							<td class="fw-semibold">{v?.cargo ?? '(vacante eliminada)'}</td><td>{v?.empresa}</td><td>{v?.ciudad}</td>
							<td><span class="badge {colorEstado[p.estado]}">{p.estado}</span></td>
							<td class="text-end">
								{#if p.estado === 'En revisión'}<button class="btn btn-sm btn-outline-danger" onclick={() => datos.retirarPostulacion(p.id)}>Retirar</button>{/if}
							</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="text-center text-muted py-5"><i class="bi bi-inbox fs-1"></i><div>Aún no te has postulado a ninguna vacante.</div><a href="/vacantes" class="btn btn-primary btn-sm mt-2">Ver vacantes</a></td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

{:else}
	<h4 class="fw-bold mb-3"><i class="bi bi-send-check-fill me-2"></i>Postulaciones</h4>
	<div class="row g-2 mb-3">
		<div class="col-md-5"><div class="input-group"><span class="input-group-text"><i class="bi bi-search"></i></span><input class="form-control" placeholder="Egresado, cargo o empresa..." bind:value={q} /></div></div>
		<div class="col-md-4">
			<select class="form-select" bind:value={filtroEstado}>
				<option value="todas">Todos los estados</option>
				<option>En revisión</option><option>Preseleccionado</option><option>Contratado</option><option>Rechazado</option>
			</select>
		</div>
	</div>
	<div class="card shadow-sm">
		<div class="table-responsive">
			<table class="table align-middle mb-0">
				<thead class="table-light"><tr><th>Egresado</th><th>Vacante</th><th>Empresa</th><th>Fecha</th><th>Estado</th><th class="text-end">Acciones</th></tr></thead>
				<tbody>
					{#each todas as p (p.id)}
						{@const v = vac(p.vacanteId)}{@const e = eg(p.egresadoId)}
						<tr>
							<td class="fw-semibold">{e?.nombre ?? '—'}</td><td>{v?.cargo ?? '(eliminada)'}</td><td>{v?.empresa}</td><td class="small text-muted">{p.fecha}</td>
							<td><span class="badge {colorEstado[p.estado]}">{p.estado}</span></td>
							<td class="text-end">
								{#if puedeEditar}
									<select class="form-select form-select-sm d-inline-block" style="width:auto" value={p.estado} onchange={(ev) => datos.cambiarEstadoPostulacion(p.id, ev.target.value)}>
										<option>En revisión</option><option>Preseleccionado</option><option>Contratado</option><option>Rechazado</option>
									</select>
								{/if}
								{#if puedeBorrar}<button class="btn btn-sm btn-outline-danger ms-1" onclick={() => datos.retirarPostulacion(p.id)}><i class="bi bi-trash"></i></button>{/if}
							</td>
						</tr>
					{:else}
						<tr><td colspan="6" class="text-center text-muted py-4">No hay postulaciones con ese filtro.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
