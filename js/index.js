/* =========================================================
   SCRIPT.JS
   JavaScript del portafolio. Aquí viven las 5 funcionalidades
   interactivas del sitio:

   1. Menú responsive (hamburguesa) en pantallas pequeñas.
   2. Cambio entre tema claro y oscuro, con persistencia
      mediante localStorage.
   3. Modal para ver la información completa de un proyecto.
   4. Validación del formulario de contacto.
   5. Botón para volver al inicio de la página.

   Todo el código espera a que el HTML esté completamente
   cargado antes de ejecutarse.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* =======================================================
     1. MENÚ RESPONSIVE (HAMBURGUESA)
     Al hacer clic en el botón ☰, se muestra u oculta el
     menú de navegación en pantallas pequeñas.
     ======================================================= */
  const navToggle = document.getElementById('nav-toggle');
  const menuPrincipal = document.getElementById('menu-principal');

  if (navToggle && menuPrincipal) {
    navToggle.addEventListener('click', function () {
      const estaAbierto = menuPrincipal.classList.toggle('nav--abierto');
      navToggle.setAttribute('aria-expanded', estaAbierto);
      navToggle.textContent = estaAbierto ? '✕' : '☰';
    });

    // Al hacer clic en un enlace del menú, se cierra automáticamente
    // (mejora la experiencia en móvil, donde el menú ocupa espacio).
    menuPrincipal.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        menuPrincipal.classList.remove('nav--abierto');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  /* =======================================================
     2. TEMA CLARO / OSCURO CON PERSISTENCIA (localStorage)
     Guarda la preferencia del usuario para que se mantenga
     la próxima vez que visite el sitio.
     ======================================================= */
  const themeToggle = document.getElementById('theme-toggle');
  const raiz = document.documentElement; // la etiqueta <html>

  function aplicarTema(tema) {
    if (tema === 'dark') {
      raiz.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.textContent = '☀️ Modo claro';
    } else {
      raiz.removeAttribute('data-theme');
      if (themeToggle) themeToggle.textContent = '🌙 Modo oscuro';
    }
  }

  // Al cargar la página, se revisa si ya había una preferencia guardada.
  const temaGuardado = localStorage.getItem('tema');
  if (temaGuardado) {
    aplicarTema(temaGuardado);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const temaActual = raiz.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
      aplicarTema(nuevoTema);
      localStorage.setItem('tema', nuevoTema);
    });
  }

  /* =======================================================
     3. MODAL PARA VER LA INFORMACIÓN DE UN PROYECTO
     Cada botón "Ver más detalles" trae la información del
     proyecto en sus atributos data-*. Al hacer clic, esos
     datos se insertan dentro del <dialog> y se muestra.
     ======================================================= */
  const modal = document.getElementById('modal-proyecto');
  const modalContenido = document.getElementById('modal-contenido');
  const modalCerrar = document.getElementById('modal-cerrar');
  const botonesDetalle = document.querySelectorAll('.boton-detalle');

  botonesDetalle.forEach(function (boton) {
    boton.addEventListener('click', function () {
      const datos = boton.dataset;

      modalContenido.innerHTML = `
        <img src="${datos.imagen}" alt="Captura de pantalla de ${datos.nombre}">
        <h3>${datos.nombre}</h3>
        <p>${datos.descripcion}</p>
        <p><strong>Problema que resuelve:</strong> ${datos.problema}</p>
        <p><strong>Tecnologías utilizadas:</strong> ${datos.tecnologias}</p>
        <div class="card__enlaces">
          <a href="${datos.repo}" target="_blank" rel="noopener">Repositorio en GitHub</a>
          <a href="${datos.demo}" target="_blank" rel="noopener">Ver proyecto en línea</a>
        </div>
      `;

      modal.showModal();
    });
  });

  if (modalCerrar && modal) {
    modalCerrar.addEventListener('click', function () {
      modal.close();
    });

    // Cierra el modal si el usuario hace clic fuera de la tarjeta (en el fondo oscuro)
    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) {
        modal.close();
      }
    });
  }

  /* =======================================================
     4. VALIDACIÓN DEL FORMULARIO DE CONTACTO
     Revisa que los campos no estén vacíos y que el correo
     tenga un formato válido antes de "enviar" el mensaje.
     Como no hay backend, solo se simula el envío.
     ======================================================= */
  const formContacto = document.getElementById('form-contacto');

  if (formContacto) {
    const campoNombre = document.getElementById('nombre');
    const campoCorreo = document.getElementById('correo');
    const campoMensaje = document.getElementById('mensaje');

    const errorNombre = document.getElementById('error-nombre');
    const errorCorreo = document.getElementById('error-correo');
    const errorMensaje = document.getElementById('error-mensaje');
    const mensajeExito = document.getElementById('mensaje-exito');

    // Expresión regular simple para validar el formato de un correo
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function marcarError(campo, span, texto) {
      campo.classList.add('input--error');
      span.textContent = texto;
    }

    function limpiarError(campo, span) {
      campo.classList.remove('input--error');
      span.textContent = '';
    }

    formContacto.addEventListener('submit', function (evento) {
      evento.preventDefault();
      let formularioValido = true;

      // Validar nombre
      if (campoNombre.value.trim() === '') {
        marcarError(campoNombre, errorNombre, 'Por favor escribe tu nombre.');
        formularioValido = false;
      } else {
        limpiarError(campoNombre, errorNombre);
      }

      // Validar correo
      if (!patronCorreo.test(campoCorreo.value.trim())) {
        marcarError(campoCorreo, errorCorreo, 'Escribe un correo válido (ejemplo@dominio.com).');
        formularioValido = false;
      } else {
        limpiarError(campoCorreo, errorCorreo);
      }

      // Validar mensaje
      if (campoMensaje.value.trim() === '') {
        marcarError(campoMensaje, errorMensaje, 'Escribe un mensaje antes de enviar.');
        formularioValido = false;
      } else {
        limpiarError(campoMensaje, errorMensaje);
      }

      if (formularioValido) {
        mensajeExito.hidden = false;
        formContacto.reset();

        // El mensaje de éxito se oculta solo después de unos segundos
        setTimeout(function () {
          mensajeExito.hidden = true;
        }, 4000);
      } else {
        mensajeExito.hidden = true;
      }
    });
  }

  /* =======================================================
     5. BOTÓN "VOLVER AL INICIO"
     Aparece solo cuando el usuario ha bajado un poco en la
     página, y lo regresa suavemente hasta arriba.
     ======================================================= */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.hidden = false;
      } else {
        backToTop.hidden = true;
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});