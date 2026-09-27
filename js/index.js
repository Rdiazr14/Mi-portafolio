/* =========================================================
  SCRIPT.JS
  JavaScript del portafolio. Aquí viven las 4 funcionalidades
  interactivas del sitio:

  1. Menú responsive (hamburguesa) en pantallas pequeñas.
  2. Modal para ver la información completa de un proyecto.
  3. Validación del formulario de contacto.
  4. Botón para volver al inicio de la página.

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
    2. MODAL PARA VER LA INFORMACIÓN DE UN PROYECTO
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
      const imagenes = (datos.imagenes || datos.imagen || '')
        .split('|')
        .map(function (imagen) { return imagen.trim(); })
        .filter(Boolean);
      let indiceImagen = 0;

      modal.classList.toggle('modal--galeria', imagenes.length > 0);
      const galeria = imagenes.length
        ? `
          <div class="galeria-proyecto">
            <img class="galeria-proyecto__imagen" src="${imagenes[0]}" alt="Imagen 1 de ${datos.nombre}">
            ${imagenes.length > 1 ? `
              <div class="galeria-proyecto__controles">
                <button type="button" class="galeria-proyecto__boton" data-paso="-1" aria-label="Imagen anterior">&#8592;</button>
                <span class="galeria-proyecto__contador" aria-live="polite">1 / ${imagenes.length}</span>
                <button type="button" class="galeria-proyecto__boton" data-paso="1" aria-label="Imagen siguiente">&#8594;</button>
              </div>
            ` : ''}
          </div>
        `
        : '';

      modalContenido.innerHTML = `
        <h3>${datos.nombre}</h3>
        ${galeria}
        <p>${datos.descripcion}</p>
        <p><strong>Problema que resuelve:</strong> ${datos.problema}</p>
        <p><strong>Tecnologías utilizadas:</strong> ${datos.tecnologias}</p>
        <div class="card__enlaces">
          <a href="${datos.repo}" target="_blank" rel="noopener">Repositorio en GitHub</a>
          <a href="${datos.demo}" target="_blank" rel="noopener">Ver proyecto en línea</a>
        </div>
      `;

      if (imagenes.length > 1) {
        const imagenGaleria = modalContenido.querySelector('.galeria-proyecto__imagen');
        const contadorGaleria = modalContenido.querySelector('.galeria-proyecto__contador');

        modalContenido.querySelectorAll('.galeria-proyecto__boton').forEach(function (control) {
          control.addEventListener('click', function () {
            indiceImagen = (indiceImagen + Number(control.dataset.paso) + imagenes.length) % imagenes.length;
            imagenGaleria.src = imagenes[indiceImagen];
            imagenGaleria.alt = `Imagen ${indiceImagen + 1} de ${datos.nombre}`;
            contadorGaleria.textContent = `${indiceImagen + 1} / ${imagenes.length}`;
          });
        });
      }

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