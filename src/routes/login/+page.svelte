<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { HOME } from '$lib/permisos.js';
	import { esCorreo } from '$lib/validar.js';
	import InputPassword from '$lib/components/InputPassword.svelte';

	const correoGuardado = typeof localStorage !== 'undefined' ? (localStorage.getItem('correo_recordado') ?? '') : '';
	let correo = $state(correoGuardado);
	let password = $state('');
	let recordar = $state(correoGuardado !== '');
	let errores = $state({});
	let errorGeneral = $state('');
	let intentos = $state(0);
	let bloqueadoHasta = $state(0);

	// Recuperar contraseña
	let mostrarReset = $state(false);
	let correoReset = $state('');
	let msgReset = $state({ tipo: '', texto: '' });

	function entrar(e) {
		e.preventDefault();
		errores = {}; errorGeneral = '';
		if (Date.now() < bloqueadoHasta) {
			errorGeneral = 'Demasiados intentos fallidos. Espera 30 segundos e inténtalo de nuevo.';
			return;
		}
		if (!esCorreo(correo)) errores.correo = 'Ingresa un correo válido.';
		if (!password) errores.password = 'Ingresa tu contraseña.';
		if (Object.keys(errores).length) return;

		const r = auth.login(correo, password);
		if (!r.ok) {
			intentos += 1;
			if (intentos >= 5) { bloqueadoHasta = Date.now() + 30000; intentos = 0; }
			errorGeneral = r.error;
			return;
		}
		if (recordar) localStorage.setItem('correo_recordado', correo.trim());
		else localStorage.removeItem('correo_recordado');
		goto(HOME[auth.rol] ?? '/panel');
	}

	function enviarReset(e) {
		e.preventDefault();
		if (!esCorreo(correoReset)) { msgReset = { tipo: 'danger', texto: 'Ingresa un correo válido.' }; return; }
		msgReset = { tipo: 'success', texto: 'Si el correo está registrado, te enviaremos las instrucciones para restablecer tu contraseña.' };
	}
</script>

<div class="login-wrap">
	<div class="panel-bienvenida">
		<span class="circulo c1"></span><span class="circulo c2"></span><span class="circulo c3"></span>
		<div class="contenido">
			<a href="/" class="volver"><i class="bi bi-arrow-left"></i> Volver al inicio</a>
			<div class="logo"><i class="bi bi-mortarboard-fill"></i></div>
			<h1>¡Bienvenido!</h1>
			<p class="lead">Bolsa de empleo institucional que conecta a egresados, empresas aliadas y la universidad.</p>
			<ul class="beneficios">
				<li><i class="bi bi-briefcase-fill"></i> Vacantes verificadas</li>
				<li><i class="bi bi-people-fill"></i> Red de egresados</li>
				<li><i class="bi bi-graph-up-arrow"></i> Seguimiento de empleabilidad</li>
			</ul>
		</div>
	</div>

	<div class="panel-form">
		<div class="w-100" style="max-width:420px;">
			{#if !mostrarReset}
				<form onsubmit={entrar} novalidate>
					<h2 class="fw-bold mb-1">Iniciar sesión</h2>
					<p class="text-muted mb-4">Ingresa con tu correo y contraseña</p>

					{#if errorGeneral}
						<div class="alert alert-danger d-flex align-items-start gap-2 py-2"><i class="bi bi-exclamation-triangle-fill mt-1"></i><div>{errorGeneral}</div></div>
					{/if}

					<div class="mb-3">
						<label class="form-label fw-semibold" for="correo">Correo electrónico</label>
						<div class="input-group has-validation">
							<span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
							<input id="correo" type="email" class="form-control" class:is-invalid={errores.correo} placeholder="tucorreo@ejemplo.com" autocomplete="email" bind:value={correo} />
							{#if errores.correo}<div class="invalid-feedback">{errores.correo}</div>{/if}
						</div>
					</div>
					<div class="mb-3"><InputPassword id="password" label="Contraseña" bind:value={password} error={errores.password} placeholder="Tu contraseña" /></div>

					<div class="d-flex justify-content-between align-items-center mb-4">
						<div class="form-check"><input class="form-check-input" type="checkbox" id="rec" bind:checked={recordar} /><label class="form-check-label small" for="rec">Recordar mi correo</label></div>
						<button type="button" class="btn btn-link btn-sm p-0" onclick={() => (mostrarReset = true)}>¿Olvidaste tu contraseña?</button>
					</div>

					<button class="btn btn-lg btn-primary w-100 fw-bold" type="submit">Entrar <i class="bi bi-arrow-right-circle-fill ms-1"></i></button>
					<p class="text-center mt-4 mb-0">¿No tienes cuenta? <a href="/registro" class="fw-semibold">Regístrate aquí</a></p>
				</form>
			{:else}
				<form onsubmit={enviarReset} novalidate>
					<h2 class="fw-bold mb-1">Recuperar contraseña</h2>
					<p class="text-muted mb-4">Ingresa el correo de tu cuenta.</p>
					{#if msgReset.texto}<div class="alert alert-{msgReset.tipo} py-2">{msgReset.texto}</div>{/if}
					<div class="mb-3"><input type="email" class="form-control form-control-lg" placeholder="tucorreo@ejemplo.com" bind:value={correoReset} /></div>
					<button class="btn btn-primary w-100 mb-2" type="submit">Enviar instrucciones</button>
					<button class="btn btn-link w-100" type="button" onclick={() => { mostrarReset = false; msgReset = { tipo: '', texto: '' }; }}>Volver a iniciar sesión</button>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	.login-wrap { display: flex; min-height: 100vh; }
	.panel-bienvenida { flex: 1.1; position: relative; overflow: hidden; color: #fff; display: flex; align-items: center; padding: 60px; background: linear-gradient(135deg, #0c1638 0%, #2540a8 55%, #14c2ac 120%); }
	.circulo { position: absolute; border-radius: 50%; background: rgba(255,255,255,.09); }
	.c1 { width: 380px; height: 380px; top: -120px; right: -100px; }
	.c2 { width: 220px; height: 220px; bottom: -70px; left: 8%; }
	.c3 { width: 120px; height: 120px; top: 55%; right: 12%; background: rgba(232,148,12,.35); }
	.contenido { position: relative; z-index: 1; max-width: 460px; }
	.volver { color: #fff; text-decoration: none; opacity: .85; display: inline-block; margin-bottom: 24px; }
	.logo { width: 72px; height: 72px; border-radius: 20px; background: #e8940c; color: #241a00; display: flex; align-items: center; justify-content: center; font-size: 38px; margin-bottom: 22px; box-shadow: 0 10px 24px rgba(0,0,0,.25); }
	h1 { font-size: 3rem; font-weight: 800; }
	.lead { font-size: 1.1rem; opacity: .9; margin-bottom: 26px; }
	.beneficios { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
	.beneficios li { background: rgba(255,255,255,.14); padding: 12px 16px; border-radius: 12px; font-weight: 600; }
	.beneficios i { margin-right: 10px; color: #ffd27a; }
	.panel-form { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #fff; }
	@media (max-width: 800px) { .login-wrap { flex-direction: column; } .panel-bienvenida { padding: 36px 24px; } h1 { font-size: 2.2rem; } }
</style>
