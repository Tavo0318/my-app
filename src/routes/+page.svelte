<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { HOME } from '$lib/permisos.js';
	import { esCorreo, esCelular } from '$lib/validar.js';

	let q = $state('');
	const COLORES = { Tecnología: '#2540a8', Administración: '#6a2fc4', Finanzas: '#1c8a4c', Logística: '#c97a00', Ingeniería: '#c23b3b', Salud: '#0e8c7f', Marketing: '#d6336c', Educación: '#0b7fab' };

	let destacadas = $derived(
		datos.vacantes
			.filter((v) => v.estado === 'abierta')
			.filter((v) => (v.cargo + ' ' + v.empresa + ' ' + v.area).toLowerCase().includes(q.toLowerCase()))
			.sort((a, b) => b.fecha.localeCompare(a.fecha))
			.slice(0, 6)
	);
	let empleados = $derived(datos.egresados.filter((e) => e.estadoLaboral === 'Empleado').length);
	let tasa = $derived(datos.egresados.length ? Math.round((empleados / datos.egresados.length) * 100) : 0);

	const ir = () => goto(auth.autenticado ? HOME[auth.rol] : '/login');
	const irAVacantes = () => document.getElementById('vacantes')?.scrollIntoView({ behavior: 'smooth' });

	// ---- Formulario de contacto ----
	let c = $state({ nombre: '', correo: '', celular: '', mensaje: '' });
	let ce = $state({});
	let enviado = $state(false);
	function enviar(e) {
		e.preventDefault();
		ce = {};
		if (c.nombre.trim().length < 3) ce.nombre = 'Ingresa tu nombre.';
		if (!esCorreo(c.correo)) ce.correo = 'Ingresa un correo válido.';
		if (!esCelular(c.celular)) ce.celular = 'Celular de 10 dígitos que empiece por 3.';
		if (c.mensaje.trim().length < 10) ce.mensaje = 'Escribe un mensaje (mínimo 10 caracteres).';
		if (Object.keys(ce).length) return;
		enviado = true;
		c = { nombre: '', correo: '', celular: '', mensaje: '' };
	}
</script>

<nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top px-3 px-lg-5">
	<a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
		<span class="logo-mini"><i class="bi bi-mortarboard-fill"></i></span> Red de Egresados
	</a>
	<div class="ms-auto d-flex align-items-center gap-3">
		<a href="#vacantes" class="nav-l d-none d-md-inline">Vacantes</a>
		<a href="#como-funciona" class="nav-l d-none d-md-inline">Cómo funciona</a>
		<a href="#contacto" class="nav-l d-none d-md-inline">Contacto</a>
		{#if auth.autenticado}
			<button class="btn btn-primary" onclick={ir}><i class="bi bi-speedometer2"></i> Ir a mi panel</button>
		{:else}
			<a href="/login" class="btn btn-outline-primary">Iniciar sesión</a>
			<a href="/registro" class="btn btn-primary">Registrarme</a>
		{/if}
	</div>
</nav>

<header class="hero">
	<span class="c c1"></span><span class="c c2"></span>
	<div class="container position-relative">
		<span class="chip"><i class="bi bi-stars"></i> Bolsa de empleo institucional</span>
		<h1>Encuentra tu próxima<br />oportunidad profesional</h1>
		<p class="lead">Conectamos el talento graduado de la universidad con las mejores empresas de la región.</p>
		<div class="buscador">
			<i class="bi bi-search"></i>
			<input placeholder="Cargo, empresa o área que te interesa..." bind:value={q} onkeydown={(e) => e.key === 'Enter' && irAVacantes()} />
			<button class="btn btn-dark px-4" onclick={irAVacantes}>Ver ofertas</button>
		</div>
		<div class="mt-4 d-flex gap-2 flex-wrap">
			<a href="/registro" class="btn btn-warning fw-bold"><i class="bi bi-person-plus-fill"></i> Crear mi cuenta</a>
			<a href="/login" class="btn btn-outline-light">Ya tengo cuenta</a>
		</div>
	</div>
</header>

<section class="container stats">
	<div class="row g-3">
		<div class="col-6 col-md-3"><div class="stat-box"><i class="bi bi-people-fill text-primary"></i><div class="n">{datos.egresados.length}</div><div>Egresados registrados</div></div></div>
		<div class="col-6 col-md-3"><div class="stat-box"><i class="bi bi-building-fill text-success"></i><div class="n">{datos.empresas.filter((e) => e.estado === 'activa').length}</div><div>Empresas aliadas</div></div></div>
		<div class="col-6 col-md-3"><div class="stat-box"><i class="bi bi-briefcase-fill text-warning"></i><div class="n">{datos.vacantes.filter((v) => v.estado === 'abierta').length}</div><div>Vacantes activas</div></div></div>
		<div class="col-6 col-md-3"><div class="stat-box"><i class="bi bi-graph-up-arrow text-danger"></i><div class="n">{tasa}%</div><div>Tasa de empleabilidad</div></div></div>
	</div>
</section>

<section id="vacantes" class="container py-5">
	<div class="d-flex justify-content-between align-items-end mb-3">
		<div><h2 class="fw-bold m-0">Vacantes destacadas</h2><p class="text-muted m-0">Ofertas verificadas por la Oficina de Egresados</p></div>
		<button class="btn btn-outline-primary" onclick={ir}>Ver todas <i class="bi bi-arrow-right"></i></button>
	</div>
	<div class="row g-3">
		{#each destacadas as v (v.id)}
			<div class="col-md-6 col-lg-4">
				<div class="card h-100 shadow-sm vc" style="border-top:4px solid {COLORES[v.area] ?? '#2540a8'}">
					<div class="card-body">
						<div class="fw-bold">{v.cargo}</div>
						<div class="text-muted small mb-2">{v.empresa}</div>
						<div class="d-flex flex-wrap gap-1 mb-2">
							<span class="badge" style="background:{COLORES[v.area] ?? '#2540a8'}">{v.area}</span>
							<span class="badge bg-light text-dark border">{v.modalidad}</span>
							<span class="badge bg-light text-dark border">{v.tipo}</span>
						</div>
						<div class="small"><i class="bi bi-geo-alt-fill text-danger"></i> {v.ciudad} &nbsp; <i class="bi bi-cash-coin text-success"></i> {v.salario}</div>
					</div>
					<div class="card-footer bg-white"><button class="btn btn-sm btn-primary w-100" onclick={ir}>Postularme</button></div>
				</div>
			</div>
		{:else}
			<div class="col-12"><div class="card p-5 text-center text-muted">No encontramos vacantes con "{q}".</div></div>
		{/each}
	</div>
</section>

<section id="como-funciona" class="bg-white py-5">
	<div class="container">
		<h2 class="fw-bold text-center mb-4">¿Cómo funciona?</h2>
		<div class="row g-4 text-center">
			<div class="col-md-4"><div class="paso p1"><i class="bi bi-person-plus-fill"></i></div><h5 class="fw-bold mt-3">1. Crea tu cuenta</h5><p class="text-muted">Regístrate como egresado con tu correo y celular y completa tu perfil profesional.</p></div>
			<div class="col-md-4"><div class="paso p2"><i class="bi bi-search"></i></div><h5 class="fw-bold mt-3">2. Explora y postula</h5><p class="text-muted">Busca vacantes de empresas aliadas y postúlate con un clic. Sigue el estado de cada proceso.</p></div>
			<div class="col-md-4"><div class="paso p3"><i class="bi bi-graph-up-arrow"></i></div><h5 class="fw-bold mt-3">3. Seguimiento laboral</h5><p class="text-muted">La universidad mide la empleabilidad con encuestas y reportes.</p></div>
		</div>
	</div>
</section>

<section class="container py-5">
	<h2 class="fw-bold text-center mb-4">Una plataforma, tres roles</h2>
	<div class="row g-3">
		<div class="col-md-4"><div class="rol-box" style="--c:#0e8c7f"><i class="bi bi-mortarboard-fill"></i><h5>Egresado</h5><ul><li>Perfil profesional y hoja de vida</li><li>Búsqueda y postulación a vacantes</li><li>Encuestas de seguimiento laboral</li></ul></div></div>
		<div class="col-md-4"><div class="rol-box" style="--c:#e8940c"><i class="bi bi-diagram-3-fill"></i><h5>Coordinador de Egresados</h5><ul><li>Registra empresas aliadas</li><li>Publica vacantes y gestiona postulaciones</li><li>Crea encuestas y consulta reportes</li></ul></div></div>
		<div class="col-md-4"><div class="rol-box" style="--c:#16255c"><i class="bi bi-shield-lock-fill"></i><h5>Administrador</h5><ul><li>Usuarios, roles y permisos</li><li>Configuración del sistema</li><li>Registro de actividad</li></ul></div></div>
	</div>
	<p class="text-center text-muted mt-4 mb-0"><i class="bi bi-building"></i> ¿Eres una empresa y quieres publicar vacantes? Contacta a la Oficina de Egresados para convertirte en empresa aliada.</p>
</section>

<section id="contacto" class="bg-white py-5">
	<div class="container">
		<div class="row g-4">
			<div class="col-lg-5">
				<h2 class="fw-bold">Contáctanos</h2>
				<p class="text-muted">¿Dudas sobre la plataforma? Escríbenos y te respondemos en horario de oficina.</p>
				<div class="mb-2"><i class="bi bi-envelope-fill text-primary me-2"></i> egresados@universidad.edu.co</div>
				<div class="mb-2"><i class="bi bi-telephone-fill text-success me-2"></i> +57 320 000 0002</div>
				<div class="mb-2"><i class="bi bi-geo-alt-fill text-danger me-2"></i> Barranquilla, Atlántico</div>
				<div class="mb-2"><i class="bi bi-clock-fill text-warning me-2"></i> Lunes a viernes, 8:00 a.m. - 5:00 p.m.</div>
			</div>
			<div class="col-lg-7">
				<form class="card p-4 shadow-sm" onsubmit={enviar} novalidate>
					{#if enviado}<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ¡Mensaje enviado! Te contactaremos pronto.</div>{/if}
					<div class="row g-3">
						<div class="col-md-6"><label class="form-label fw-semibold" for="c-n">Nombre</label><input id="c-n" class="form-control" class:is-invalid={ce.nombre} bind:value={c.nombre} /><div class="invalid-feedback">{ce.nombre}</div></div>
						<div class="col-md-6"><label class="form-label fw-semibold" for="c-c">Correo</label><input id="c-c" type="email" class="form-control" class:is-invalid={ce.correo} bind:value={c.correo} /><div class="invalid-feedback">{ce.correo}</div></div>
						<div class="col-md-6"><label class="form-label fw-semibold" for="c-t">Celular</label><input id="c-t" class="form-control" maxlength="10" inputmode="numeric" class:is-invalid={ce.celular} value={c.celular} oninput={(e) => (c.celular = e.target.value.replace(/\D/g, ''))} /><div class="invalid-feedback">{ce.celular}</div></div>
						<div class="col-12"><label class="form-label fw-semibold" for="c-m">Mensaje</label><textarea id="c-m" rows="3" class="form-control" class:is-invalid={ce.mensaje} bind:value={c.mensaje}></textarea><div class="invalid-feedback">{ce.mensaje}</div></div>
					</div>
					<button class="btn btn-primary mt-3 align-self-start" type="submit"><i class="bi bi-send-fill"></i> Enviar mensaje</button>
				</form>
			</div>
		</div>
	</div>
</section>

<footer class="pie text-center py-4">
	<div class="fw-bold mb-1"><i class="bi bi-mortarboard-fill"></i> Empleabilidad y Red de Egresados</div>
	<small>© 2026 Oficina de Egresados · Corporación Universitaria Latinoamericana</small>
</footer>

<style>
	:global(html) { scroll-behavior: smooth; }
	.logo-mini { width: 34px; height: 34px; border-radius: 10px; background: #e8940c; color: #241a00; display: inline-flex; align-items: center; justify-content: center; }
	.nav-l { color: #444; text-decoration: none; font-weight: 500; }
	.nav-l:hover { color: #2540a8; }
	.hero { position: relative; overflow: hidden; color: #fff; padding: 90px 0 110px; background: linear-gradient(135deg, #0c1638 0%, #2540a8 55%, #14c2ac 130%); }
	.c { position: absolute; border-radius: 50%; background: rgba(255,255,255,.08); }
	.c1 { width: 420px; height: 420px; right: -120px; top: -140px; }
	.c2 { width: 240px; height: 240px; left: 5%; bottom: -110px; background: rgba(232,148,12,.3); }
	.chip { background: rgba(255,255,255,.18); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
	.hero h1 { font-size: 3.2rem; font-weight: 800; margin: 18px 0 12px; }
	.lead { max-width: 560px; opacity: .92; }
	.buscador { background: #fff; border-radius: 14px; padding: 8px 8px 8px 18px; display: flex; align-items: center; gap: 10px; max-width: 620px; margin-top: 24px; box-shadow: 0 12px 30px rgba(0,0,0,.25); }
	.buscador i { color: #777; }
	.buscador input { flex: 1; border: 0; outline: 0; font-size: 1rem; padding: 8px 0; }
	.stats { margin-top: -50px; position: relative; z-index: 2; }
	.stat-box { background: #fff; border-radius: 16px; padding: 18px; text-align: center; box-shadow: 0 8px 22px rgba(20,30,80,.12); }
	.stat-box i { font-size: 26px; }
	.stat-box .n { font-size: 30px; font-weight: 800; }
	.vc { transition: transform .15s ease, box-shadow .15s ease; }
	.vc:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(20,30,80,.15) !important; }
	.paso { width: 76px; height: 76px; border-radius: 22px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 34px; color: #fff; }
	.p1 { background: linear-gradient(135deg, #2540a8, #4f7bff); } .p2 { background: linear-gradient(135deg, #14804a, #35c47a); } .p3 { background: linear-gradient(135deg, #d98200, #ffc247); }
	.rol-box { background: #fff; border-radius: 18px; padding: 26px; height: 100%; border-top: 5px solid var(--c); box-shadow: 0 6px 18px rgba(20,30,80,.08); }
	.rol-box > i { font-size: 34px; color: var(--c); }
	.rol-box h5 { font-weight: 700; margin: 10px 0; }
	.rol-box ul { padding-left: 18px; color: #555; margin: 0; }
	.pie { background: #0c1638; color: #cfd6f5; }
	@media (max-width: 768px) { .hero h1 { font-size: 2.2rem; } }
</style>
