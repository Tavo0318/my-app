<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { ROLES } from '$lib/permisos.js';
	import { esCelular } from '$lib/validar.js';
	import CambiarPassword from '$lib/components/CambiarPassword.svelte';

	const u = datos.usuarios.find((x) => x.id === auth.usuario?.id);
	let celular = $state(u?.celular ?? '');
	let error = $state('');
	let guardado = $state(false);

	function guardar(e) {
		e.preventDefault();
		error = ''; guardado = false;
		if (!esCelular(celular)) { error = 'Celular de 10 dígitos que empiece por 3.'; return; }
		const r = datos.actualizarCuenta(auth.usuario.id, { celular });
		if (!r.ok) { error = r.error; return; }
		guardado = true;
		setTimeout(() => (guardado = false), 3000);
	}
</script>

<h4 class="fw-bold mb-3"><i class="bi bi-person-gear me-2"></i>Mi cuenta</h4>

<form class="card p-4 shadow-sm" style="max-width:640px;" onsubmit={guardar} novalidate>
	<div class="row g-3">
		<div class="col-md-6"><label class="form-label fw-semibold">Nombre</label><input class="form-control" value={auth.usuario?.nombre} disabled /></div>
		<div class="col-md-6"><label class="form-label fw-semibold">Rol</label><input class="form-control" value={ROLES[auth.rol].nombre} disabled /></div>
		<div class="col-md-6"><label class="form-label fw-semibold">Correo (no editable)</label><input class="form-control" value={auth.usuario?.correo} disabled /></div>
		<div class="col-md-6"><label class="form-label fw-semibold" for="cel">Celular</label>
			<div class="input-group has-validation"><span class="input-group-text">+57</span><input id="cel" class="form-control" class:is-invalid={error} maxlength="10" value={celular} oninput={(e) => (celular = e.target.value.replace(/\D/g, ''))} /><div class="invalid-feedback">{error}</div></div></div>
	</div>
	<div class="mt-3 d-flex align-items-center gap-3">
		<button class="btn btn-primary" type="submit"><i class="bi bi-save me-1"></i> Guardar</button>
		{#if guardado}<span class="text-success small"><i class="bi bi-check-circle-fill"></i> Datos actualizados</span>{/if}
	</div>
</form>

<CambiarPassword />
