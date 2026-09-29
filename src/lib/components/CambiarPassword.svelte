<script>
	import InputPassword from './InputPassword.svelte';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { reglasPassword, passwordValida } from '$lib/validar.js';

	let actual = $state('');
	let nueva = $state('');
	let confirmar = $state('');
	let errores = $state({});
	let ok = $state(false);

	function guardar(e) {
		e.preventDefault();
		errores = {};
		ok = false;
		if (!actual) errores.actual = 'Ingresa tu contraseña actual.';
		if (!passwordValida(nueva)) errores.nueva = 'La nueva contraseña no cumple los requisitos.';
		if (nueva !== confirmar) errores.confirmar = 'Las contraseñas no coinciden.';
		if (Object.keys(errores).length) return;
		const r = datos.cambiarPassword(auth.usuario.id, actual, nueva);
		if (!r.ok) { errores.actual = r.error; return; }
		ok = true;
		actual = ''; nueva = ''; confirmar = '';
	}
</script>

<form class="card p-4 shadow-sm mt-4" style="max-width:640px;" onsubmit={guardar}>
	<h5 class="fw-bold mb-3"><i class="bi bi-shield-lock-fill me-2"></i>Cambiar contraseña</h5>
	<div class="mb-3"><InputPassword id="pw-actual" label="Contraseña actual" bind:value={actual} error={errores.actual} /></div>
	<div class="mb-2"><InputPassword id="pw-nueva" label="Nueva contraseña" bind:value={nueva} error={errores.nueva} autocomplete="new-password" /></div>
	<ul class="list-unstyled small mb-3">
		{#each reglasPassword(nueva) as r}
			<li class={r.ok ? 'text-success' : 'text-muted'}><i class="bi {r.ok ? 'bi-check-circle-fill' : 'bi-circle'}"></i> {r.texto}</li>
		{/each}
	</ul>
	<div class="mb-3"><InputPassword id="pw-conf" label="Confirmar nueva contraseña" bind:value={confirmar} error={errores.confirmar} autocomplete="new-password" /></div>
	<div class="d-flex align-items-center gap-3">
		<button class="btn btn-primary" type="submit">Actualizar contraseña</button>
		{#if ok}<span class="text-success small"><i class="bi bi-check-circle-fill"></i> Contraseña actualizada</span>{/if}
	</div>
</form>
