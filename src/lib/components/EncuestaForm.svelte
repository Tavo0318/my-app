<script>
	import { datos } from '$lib/stores/datos.svelte.js';

	let { encuesta, egresadoId } = $props();
	let f = $state({ laborando: '', empresa: '', cargo: '', relacion: 'Total' });
	let error = $state('');

	function enviar(e) {
		e.preventDefault();
		if (!f.laborando) { error = 'Indica si actualmente estás laborando.'; return; }
		if (f.laborando === 'Sí' && (!f.empresa.trim() || !f.cargo.trim())) { error = 'Indica la empresa y el cargo donde trabajas.'; return; }
		error = '';
		datos.responderEncuesta(encuesta.id, egresadoId, f.laborando === 'Sí' ? { ...f } : { laborando: 'No', empresa: '', cargo: '', relacion: '' });
	}
</script>

<form onsubmit={enviar}>
	<p class="fw-semibold mb-2">¿Actualmente te encuentras laborando?</p>
	<div class="mb-3">
		<div class="form-check form-check-inline"><input class="form-check-input" type="radio" id="l-si-{encuesta.id}" value="Sí" bind:group={f.laborando} /><label class="form-check-label" for="l-si-{encuesta.id}">Sí</label></div>
		<div class="form-check form-check-inline"><input class="form-check-input" type="radio" id="l-no-{encuesta.id}" value="No" bind:group={f.laborando} /><label class="form-check-label" for="l-no-{encuesta.id}">No</label></div>
	</div>
	{#if f.laborando === 'Sí'}
		<div class="row g-3 mb-3">
			<div class="col-md-4"><label class="form-label">Empresa</label><input class="form-control" bind:value={f.empresa} /></div>
			<div class="col-md-4"><label class="form-label">Cargo</label><input class="form-control" bind:value={f.cargo} /></div>
			<div class="col-md-4"><label class="form-label">¿Se relaciona con tu carrera?</label>
				<select class="form-select" bind:value={f.relacion}><option>Total</option><option>Parcial</option><option>Ninguna</option></select></div>
		</div>
	{/if}
	{#if error}<div class="alert alert-danger py-2 small">{error}</div>{/if}
	<button class="btn btn-primary" type="submit"><i class="bi bi-send-fill me-1"></i> Enviar respuesta</button>
</form>
