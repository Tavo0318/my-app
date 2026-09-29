<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { puede } from '$lib/permisos.js';
	import { hace } from '$lib/fecha.js';

	const AREAS = ['Tecnología', 'Administración', 'Finanzas', 'Logística', 'Ingeniería', 'Salud', 'Marketing', 'Educación'];
	const COLORES = { Tecnología: '#3a5fb8', Administración: '#7c4fc9', Finanzas: '#2f9e5f', Logística: '#c98a2f', Ingeniería: '#c0554f', Salud: '#128f83', Marketing: '#c94f80', Educación: '#2f8ab0' };
	const color = (a) => COLORES[a] ?? '#3a5fb8';
	const miId = $derived(auth.usuario?.id);

	const puedeCrear = $derived(puede(auth.rol, 'vacantes', 'crear'));
	const puedeEditar = $derived(puede(auth.rol, 'vacantes', 'actualizar'));
	const puedeBorrar = $derived(puede(auth.rol, 'vacantes', 'eliminar'));

	// ---------- EGRESADO ----------
	let q = $state('');
	let fArea = $state('Todas');
	let fMod = $state('Todas');
	let misPost = $derived(new Set(datos.postulaciones.filter((p) => p.egresadoId === miId).map((p) => p.vacanteId)));
	let abiertas = $derived(datos.vacantes.filter((v) => v.estado === 'abierta'));
	let filtradas = $derived(
		abiertas
			.filter((v) => fArea === 'Todas' || v.area === fArea)
			.filter((v) => fMod === 'Todas' || v.modalidad === fMod)
			.filter((v) => (v.cargo + ' ' + v.empresa + ' ' + v.descripcion).toLowerCase().includes(q.toLowerCase()))
			.sort((a, b) => b.fecha.localeCompare(a.fecha))
	);
	let msgPost = $state('');
	function postularme(id) {
		const r = datos.postularse(id, miId);
		if (!r.ok) { msgPost = r.error; setTimeout(() => (msgPost = ''), 3000); }
	}

	// ---------- COORDINADOR / ADMIN ----------
	const vacio = () => ({ id: null, cargo: '', empresaId: datos.empresas[0]?.id ?? '', area: 'Tecnología', modalidad: 'Remoto', tipo: 'Tiempo completo', ciudad: 'Barranquilla', salario: '', descripcion: '' });
	let form = $state(vacio());
	let mostrarForm = $state(false);
	let filtro = $state('todas');
	let fEmpresa = $state('todas');
	let listaGestion = $derived(
		datos.vacantes
			.filter((v) => filtro === 'todas' || v.estado === filtro)
			.filter((v) => fEmpresa === 'todas' || v.empresaId === Number(fEmpresa))
			.sort((a, b) => b.fecha.localeCompare(a.fecha))
	);
	const postuladosDe = (id) => datos.postulaciones.filter((p) => p.vacanteId === id).length;

	function nueva() { form = vacio(); mostrarForm = true; }
	function editar(v) { form = { ...v }; mostrarForm = true; }
	function guardar(e) {
		e.preventDefault();
		const d = { ...form, empresaId: Number(form.empresaId) };
		if (d.id) datos.actualizarVacante(d.id, d);
		else datos.crearVacante(d);
		mostrarForm = false;
	}
</script>

<h4 class="fw-bold mb-3"><i class="bi bi-briefcase-fill me-2"></i>Vacantes</h4>

{#if auth.rol === 'egresado'}
	<div class="card p-3 mb-3 shadow-sm">
		<div class="row g-2 align-items-center">
			<div class="col-lg-6"><div class="input-group"><span class="input-group-text"><i class="bi bi-funnel"></i></span><input class="form-control" placeholder="Cargo, empresa o tecnología..." bind:value={q} /></div></div>
			<div class="col-6 col-lg-3"><select class="form-select" bind:value={fArea}><option value="Todas">Todas las áreas</option>{#each AREAS as a}<option>{a}</option>{/each}</select></div>
			<div class="col-6 col-lg-3"><select class="form-select" bind:value={fMod}><option value="Todas">Toda modalidad</option><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></div>
		</div>
	</div>
	{#if msgPost}<div class="alert alert-warning py-2">{msgPost}</div>{/if}
	<p class="text-muted small mb-2">{filtradas.length} vacante(s) disponibles</p>
	<div class="row g-3">
		{#each filtradas as v (v.id)}
			<div class="col-md-6 col-xl-4">
				<div class="card h-100 shadow-sm vacante-card" style="border-top:4px solid {color(v.area)}">
					<div class="card-body">
						<div class="d-flex align-items-center gap-2 mb-2">
							<div class="avatar" style="background:{color(v.area)}">{v.empresa[0]}</div>
							<div><div class="fw-bold lh-sm">{v.cargo}</div><div class="text-muted small">{v.empresa}</div></div>
						</div>
						<div class="d-flex flex-wrap gap-1 mb-2">
							<span class="badge" style="background:{color(v.area)}">{v.area}</span>
							<span class="badge bg-light text-dark border">{v.modalidad}</span>
							<span class="badge bg-light text-dark border">{v.tipo}</span>
						</div>
						<p class="small text-secondary mb-2">{v.descripcion}</p>
						<div class="small"><i class="bi bi-geo-alt-fill text-danger"></i> {v.ciudad} &nbsp; <i class="bi bi-cash-coin text-success"></i> {v.salario}</div>
					</div>
					<div class="card-footer bg-white d-flex justify-content-between align-items-center">
						<small class="text-muted"><i class="bi bi-clock"></i> {hace(v.fecha)}</small>
						{#if misPost.has(v.id)}
							<button class="btn btn-sm btn-success" disabled><i class="bi bi-check-circle-fill"></i> Postulado</button>
						{:else}
							<button class="btn btn-sm btn-primary" onclick={() => postularme(v.id)}>Postularme <i class="bi bi-send"></i></button>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div class="col-12"><div class="card p-5 text-center text-muted"><i class="bi bi-emoji-frown fs-1"></i><p class="mb-0 mt-2">No hay vacantes con esos filtros.</p></div></div>
		{/each}
	</div>

{:else}
	<div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
		<div class="btn-group">
			<button class="btn {filtro === 'todas' ? 'btn-primary' : 'btn-outline-primary'}" onclick={() => (filtro = 'todas')}>Todas ({datos.vacantes.length})</button>
			<button class="btn {filtro === 'abierta' ? 'btn-success' : 'btn-outline-success'}" onclick={() => (filtro = 'abierta')}>Abiertas ({datos.vacantes.filter((v) => v.estado === 'abierta').length})</button>
			<button class="btn {filtro === 'cerrada' ? 'btn-secondary' : 'btn-outline-secondary'}" onclick={() => (filtro = 'cerrada')}>Cerradas ({datos.vacantes.filter((v) => v.estado === 'cerrada').length})</button>
		</div>
		<div class="d-flex gap-2">
			<select class="form-select" bind:value={fEmpresa}><option value="todas">Todas las empresas</option>{#each datos.empresas as e}<option value={e.id}>{e.nombre}</option>{/each}</select>
			{#if puedeCrear}<button class="btn btn-primary text-nowrap" onclick={nueva}><i class="bi bi-plus-lg"></i> Nueva vacante</button>{/if}
		</div>
	</div>

	{#if mostrarForm}
		<form class="card p-4 mb-3 shadow-sm" onsubmit={guardar}>
			<h6 class="fw-bold mb-3">{form.id ? 'Editar vacante' : 'Nueva vacante'}</h6>
			<div class="row g-3">
				<div class="col-md-6"><label class="form-label fw-semibold">Cargo</label><input class="form-control" bind:value={form.cargo} required /></div>
				<div class="col-md-6"><label class="form-label fw-semibold">Empresa aliada</label><select class="form-select" bind:value={form.empresaId} required>{#each datos.empresas.filter((e) => e.estado === 'activa') as e}<option value={e.id}>{e.nombre}</option>{/each}</select></div>
				<div class="col-md-3"><label class="form-label fw-semibold">Área</label><select class="form-select" bind:value={form.area}>{#each AREAS as a}<option>{a}</option>{/each}</select></div>
				<div class="col-md-3"><label class="form-label fw-semibold">Ciudad</label><input class="form-control" bind:value={form.ciudad} required /></div>
				<div class="col-md-3"><label class="form-label fw-semibold">Modalidad</label><select class="form-select" bind:value={form.modalidad}><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></div>
				<div class="col-md-3"><label class="form-label fw-semibold">Tipo</label><select class="form-select" bind:value={form.tipo}><option>Tiempo completo</option><option>Medio tiempo</option><option>Prácticas</option></select></div>
				<div class="col-md-4"><label class="form-label fw-semibold">Salario</label><input class="form-control" placeholder="$ 3.000.000" bind:value={form.salario} required /></div>
				<div class="col-12"><label class="form-label fw-semibold">Descripción y requisitos</label><textarea class="form-control" rows="3" bind:value={form.descripcion} required></textarea></div>
			</div>
			<div class="mt-3 text-end"><button type="button" class="btn btn-light me-2" onclick={() => (mostrarForm = false)}>Cancelar</button><button class="btn btn-primary" type="submit">{form.id ? 'Guardar cambios' : 'Publicar vacante'}</button></div>
		</form>
	{/if}

	<div class="card shadow-sm">
		<div class="table-responsive">
			<table class="table align-middle mb-0">
				<thead class="table-light"><tr><th>Cargo</th><th>Empresa</th><th>Área</th><th>Ciudad</th><th>Estado</th><th>Postulados</th><th class="text-end">Acciones</th></tr></thead>
				<tbody>
					{#each listaGestion as v (v.id)}
						<tr>
							<td class="fw-semibold">{v.cargo}</td><td>{v.empresa}</td>
							<td><span class="badge" style="background:{color(v.area)}">{v.area}</span></td>
							<td>{v.ciudad}</td>
							<td><span class="badge {v.estado === 'abierta' ? 'bg-success' : 'bg-secondary'}">{v.estado}</span></td>
							<td>{postuladosDe(v.id)}</td>
							<td class="text-end">
								{#if puedeEditar}
									<button class="btn btn-sm btn-outline-primary me-1" onclick={() => editar(v)}><i class="bi bi-pencil"></i></button>
									<button class="btn btn-sm btn-outline-secondary me-1" onclick={() => datos.alternarVacante(v.id)}>{v.estado === 'abierta' ? 'Cerrar' : 'Reabrir'}</button>
								{/if}
								{#if puedeBorrar}<button class="btn btn-sm btn-outline-danger" onclick={() => datos.eliminarVacante(v.id)}><i class="bi bi-trash"></i></button>{/if}
							</td>
						</tr>
					{:else}
						<tr><td colspan="7" class="text-center text-muted py-4">No hay vacantes en esta categoría.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style>
	.avatar { width: 40px; height: 40px; border-radius: 12px; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none; }
	.vacante-card { transition: transform .15s ease, box-shadow .15s ease; }
	.vacante-card:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(20,30,80,.12) !important; }
</style>
