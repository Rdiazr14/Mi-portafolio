document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const menuPrincipal = document.getElementById('menu-principal');

  if (navToggle && menuPrincipal) {
    navToggle.addEventListener('click', function () {
      const estaAbierto = menuPrincipal.classList.toggle('nav--abierto');
      navToggle.setAttribute('aria-expanded', estaAbierto);
      navToggle.textContent = estaAbierto ? '✕' : '☰';
    });

    menuPrincipal.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        menuPrincipal.classList.remove('nav--abierto');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

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

    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) {
        modal.close();
      }
    });
  }

  const formContacto = document.getElementById('form-contacto');

  if (formContacto) {
    const campoNombre = document.getElementById('nombre');
    const campoCorreo = document.getElementById('correo');
    const campoMensaje = document.getElementById('mensaje');

    const errorNombre = document.getElementById('error-nombre');
    const errorCorreo = document.getElementById('error-correo');
    const errorMensaje = document.getElementById('error-mensaje');
    const mensajeExito = document.getElementById('mensaje-exito');

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

      if (campoNombre.value.trim() === '') {
        marcarError(campoNombre, errorNombre, 'Por favor escribe tu nombre.');
        formularioValido = false;
      } else {
        limpiarError(campoNombre, errorNombre);
      }

      if (!patronCorreo.test(campoCorreo.value.trim())) {
        marcarError(campoCorreo, errorCorreo, 'Escribe un correo válido (ejemplo@dominio.com).');
        formularioValido = false;
      } else {
        limpiarError(campoCorreo, errorCorreo);
      }

      if (campoMensaje.value.trim() === '') {
        marcarError(campoMensaje, errorMensaje, 'Escribe un mensaje antes de enviar.');
        formularioValido = false;
      } else {
        limpiarError(campoMensaje, errorMensaje);
      }

      if (formularioValido) {
        mensajeExito.hidden = false;
        formContacto.reset();

        setTimeout(function () {
          mensajeExito.hidden = true;
        }, 4000);
      } else {
        mensajeExito.hidden = true;
      }
    });
  }

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