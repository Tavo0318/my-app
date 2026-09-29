<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { puede } from '$lib/permisos.js';
	import EncuestaForm from '$lib/components/EncuestaForm.svelte';

	const miId = $derived(auth.usuario?.id);
	const puedeCrear = $derived(puede(auth.rol, 'encuestas', 'crear'));
	const puedeBorrar = $derived(puede(auth.rol, 'encuestas', 'eliminar'));

	let titulo = $state('');
	let descripcion = $state('');
	let error = $state('');

	let visibles = $derived(datos.encuestas.filter((e) => e.activa || e.respuestas.some((r) => r.egresadoId === miId)));
	const respondida = (enc) => enc.respuestas.find((r) => r.egresadoId === miId);
	const stats = (enc) => {
		const t = enc.respuestas.length;
		const l = enc.respuestas.filter((r) => r.laborando === 'Sí').length;
		return { t, l, pct: t ? Math.round((l / t) * 100) : 0 };
	};

	function crear(e) {
		e.preventDefault();
		if (titulo.trim().length < 5) { error = 'El título debe tener mínimo 5 caracteres.'; return; }
		if (descripcion.trim().length < 10) { error = 'Agrega una descripción (mínimo 10 caracteres).'; return; }
		error = '';
		datos.crearEncuesta(titulo.trim(), descripcion.trim());
		titulo = ''; descripcion = '';
	}
</script>

{#if auth.rol === 'egresado'}
	<h4 class="fw-bold mb-3"><i class="bi bi-clipboard-check-fill me-2"></i>Mis encuestas</h4>
	{#each visibles as enc (enc.id)}
		<div class="card p-4 shadow-sm mb-3">
			<div class="d-flex justify-content-between align-items-start">
				<div><h5 class="fw-bold">{enc.titulo}</h5><p class="text-muted">{enc.descripcion}</p></div>
				{#if respondida(enc)}<span class="badge bg-success"><i class="bi bi-check-circle-fill"></i> Respondida</span>{:else}<span class="badge bg-warning text-dark">Pendiente</span>{/if}
			</div>
			{#if respondida(enc)}
				{@const r = respondida(enc)}
				<div class="alert alert-success mb-0 py-2 small">Gracias por responder el {r.fecha}. {r.laborando === 'Sí' ? `Registramos que trabajas en ${r.empresa} como ${r.cargo}.` : 'Registramos que actualmente estás buscando empleo.'}</div>
			{:else}
				<EncuestaForm encuesta={enc} egresadoId={miId} />
			{/if}
		</div>
	{:else}
		<div class="card p-5 text-center text-muted"><i class="bi bi-clipboard-check fs-1"></i><div>No tienes encuestas pendientes.</div></div>
	{/each}

{:else}
	<h4 class="fw-bold mb-3"><i class="bi bi-clipboard-data-fill me-2"></i>Encuestas de seguimiento laboral</h4>

	{#if puedeCrear}
		<form class="card p-4 shadow-sm mb-4" onsubmit={crear} novalidate>
			<h6 class="fw-bold mb-3">Crear nueva encuesta</h6>
			{#if error}<div class="alert alert-danger py-2 small">{error}</div>{/if}
			<div class="row g-3">
				<div class="col-md-5"><input class="form-control" placeholder="Título (ej: Seguimiento laboral 2027-1)" bind:value={titulo} /></div>
				<div class="col-md-5"><input class="form-control" placeholder="Descripción para los egresados" bind:value={descripcion} /></div>
				<div class="col-md-2"><button class="btn btn-primary w-100" type="submit"><i class="bi bi-plus-lg"></i> Crear</button></div>
			</div>
		</form>
	{/if}

	<div class="row g-3">
		{#each datos.encuestas as enc (enc.id)}
			{@const s = stats(enc)}
			<div class="col-lg-6">
				<div class="card p-4 shadow-sm h-100">
					<div class="d-flex justify-content-between">
						<h6 class="fw-bold">{enc.titulo}</h6>
						<span class="badge {enc.activa ? 'bg-success' : 'bg-secondary'}">{enc.activa ? 'Activa' : 'Cerrada'}</span>
					</div>
					<p class="text-muted small">{enc.descripcion}</p>
					<div class="d-flex justify-content-between small"><span>Respuestas: <strong>{s.t}</strong> de {datos.egresados.length} egresados</span><span>Laborando: <strong>{s.pct}%</strong></span></div>
					<div class="progress mb-3" style="height:10px;"><div class="progress-bar bg-success" style="width:{s.pct}%"></div></div>
					{#if puedeCrear}
						<div class="mt-auto d-flex gap-2">
							<button class="btn btn-sm btn-outline-secondary" onclick={() => datos.alternarEncuesta(enc.id)}>{enc.activa ? 'Cerrar encuesta' : 'Reabrir'}</button>
							{#if puedeBorrar}<button class="btn btn-sm btn-outline-danger" onclick={() => datos.eliminarEncuesta(enc.id)}><i class="bi bi-trash"></i></button>{/if}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
