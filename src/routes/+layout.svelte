<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { menuDe, accesoRuta, HOME, PUBLICAS, ROLES } from '$lib/permisos.js';

	let { children } = $props();

	// Guard único: páginas públicas libres; las privadas exigen sesión y que el rol tenga
	// permiso "ver" sobre el módulo (según la tabla de permisos).
	$effect(() => {
		const ruta = $page.url.pathname;
		if (PUBLICAS.includes(ruta)) {
			if (auth.autenticado && ruta !== '/') goto(HOME[auth.rol]);
			return;
		}
		if (!auth.autenticado) { goto('/login'); return; }
		if (!accesoRuta(auth.rol, ruta)) goto('/panel');
	});

	function salir() {
		auth.logout();
		goto('/');
	}
</script>

{#if PUBLICAS.includes($page.url.pathname) || !auth.autenticado}
	{@render children()}
{:else}
	<div class="rol-{auth.rol}">
		<nav class="navbar navbar-dark navbar-rol px-3 shadow-sm">
			<a href="/" class="navbar-brand fs-6 mb-0 d-flex align-items-center gap-2 text-decoration-none">
				<i class="bi bi-mortarboard-fill"></i> Empleabilidad y Red de Egresados
			</a>
			<div class="d-flex align-items-center gap-3">
				<span class="chip-rol text-white"><i class="bi {ROLES[auth.rol].icono}"></i> {ROLES[auth.rol].nombre}</span>
				<span class="text-white-50 small d-none d-md-inline">{auth.usuario.nombre}</span>
				<button class="btn btn-outline-light btn-sm" onclick={salir}><i class="bi bi-box-arrow-right"></i> Salir</button>
			</div>
		</nav>

		<div class="d-flex">
			<nav class="p-3 border-end bg-white" style="width:250px; min-height:calc(100vh - 56px);">
				{#each menuDe(auth.rol) as item}
					<a class="sidebar-link d-flex align-items-center gap-2 py-2 px-2 rounded text-decoration-none mb-1"
						class:active={$page.url.pathname === item.href} href={item.href}>
						<i class="bi {item.icon}"></i> {item.label}
					</a>
				{/each}
			</nav>
			<main class="p-4 flex-grow-1" style="min-width:0;">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
