<script>
	import { auth } from '$lib/stores/auth.svelte.js';

	let { subtitulo = '' } = $props();

	const info = {
		egresado: { icono: 'bi-mortarboard-fill', texto: 'Encuentra tu próxima oportunidad profesional.' },
		coordinador: { icono: 'bi-diagram-3-fill', texto: 'Conecta a los egresados con las empresas aliadas y haz seguimiento a su empleabilidad.' },
		admin: { icono: 'bi-shield-check', texto: 'Administra usuarios, roles y permisos, y supervisa la actividad del sistema.' }
	};
</script>

<div class="hero-bienvenida mb-4">
	<div style="position:relative; z-index:1;">
		<span class="hero-chip"><i class="bi bi-stars"></i> Bienvenido</span>
		<h2>¡Hola, {auth.usuario?.nombre}!</h2>
		<p>{subtitulo || info[auth.rol]?.texto}</p>
	</div>
	<i class="bi {info[auth.rol]?.icono} hero-icono"></i>
</div>
