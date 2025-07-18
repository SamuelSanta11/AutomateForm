function hideLogin() { // Evento para ocultar el login y mostrar contenido principal
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) loginContainer.style.display = 'none';

    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.style.display = 'block';
}

// Evento para mostrar u ocultar el sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const toggleIcon = document.getElementById('toggleIcon');

    if (sidebar && mainContent && toggleButton && toggleIcon) {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('visible');
        mainContent.classList.toggle('expanded');
        toggleButton.classList.toggle('active');

        toggleIcon.classList.toggle('fa-bars');
        toggleIcon.classList.toggle('fa-times');
    }
}

// Evento para cambiar entre módulos de reportes y notificaciones
function showModule(module) {
    const reportesModule = document.getElementById('reportesModule');
    const notificacionesModule = document.getElementById('notificacionesModule');

    if (reportesModule) reportesModule.style.display = module === 'reportes' ? 'block' : 'none';
    if (notificacionesModule) notificacionesModule.style.display = module === 'notificaciones' ? 'block' : 'none';

    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(li => li.classList.remove('active'));
    const currentItem = document.querySelector(`.sidebar-menu li[data-module="${module}"]`);
    if (currentItem) currentItem.classList.add('active');

    if (module === 'notificaciones') cargarNotificaciones();
}

// Evento para cerrar sesión
function logout() {
    Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        localStorage.removeItem('rol');
        window.location.href = '/login.html';
    });
}


document.addEventListener('DOMContentLoaded', function () {

    // Evento para ocultar módulo de notificaciones si es operario
    const storedRol = localStorage.getItem('rol');
    if (storedRol === 'operario') {
        const notificacionesModule = document.getElementById('notificacionesModule');
        const notificacionesMenu = document.querySelector('li[data-module="notificaciones"]');
        if (notificacionesModule) notificacionesModule.style.display = 'none';
        if (notificacionesMenu) notificacionesMenu.style.display = 'none';
    }

    // Evento para el formulario login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            const rol = document.getElementById('rol')?.value;

            if (username && password && rol) {
                fetch('http://192.168.13.39:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                })

                    .then(response => {
                        if (!response.ok) throw new Error('Credenciales inválidas');
                        return response.json();
                    })
                    .then(data => {
                        if (data.user && data.user.rol === rol) {
                            localStorage.setItem('rol', data.user.rol);
                            localStorage.setItem('user', JSON.stringify(data.user));

                            Swal.fire({
                                icon: 'success',
                                title: '¡Bienvenido!',
                                text: `Has iniciado sesión como ${data.user.rol}`,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                window.location.href = '/index.html';
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Rol incorrecto',
                                text: 'El rol seleccionado no coincide con el usuario',
                            });
                        }
                    })
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de inicio de sesión',
                            text: err.message
                        });
                    });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, complete todos los campos.'
                });
            }
        });
    }


    const toggleButton = document.querySelector('.toggle-sidebar');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }

    // Evento para cambiar de modulos en el menu principal
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function () {
                const module = this.getAttribute('data-module');
                if (module) showModule(module);
            });
        });
    }

    // Evento de cierre de sesión
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});


// Evento para agregar maquina nueva
const addMachineBtn = document.getElementById('addMachineBtn');
const modalNuevaMaquina = document.getElementById('modalNuevaMaquina');
const cancelMachineBtn = document.getElementById('cancelMachineBtn');
const saveMachineBtn = document.getElementById('saveMachineBtn');
const newMachineName = document.getElementById('newMachineName');
const newMachineDesc = document.getElementById('newMachineDesc');
const machineSelect = document.getElementById('machineSelect');

// Mostrar modal
if (addMachineBtn) {
    addMachineBtn.addEventListener('click', () => {
        newMachineName.value = '';
        newMachineDesc.value = '';
        modalNuevaMaquina.style.display = 'flex';
    });
}

// Cancelar modal
if (cancelMachineBtn) {
    cancelMachineBtn.addEventListener('click', () => {
        modalNuevaMaquina.style.display = 'none';
    });
}

// Evento para guardar nueva máquina
if (saveMachineBtn) {
    saveMachineBtn.addEventListener('click', async () => {
        const nombre = newMachineName.value.trim();
        const descripcion = newMachineDesc.value.trim();

        if (!nombre) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre requerido',
                text: 'Por favor ingrese el nombre de la máquina'
            });
            return;
        }

        try {
            const response = await fetch('http://192.168.13.39:3000/api/maquinas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion })
            });


            if (!response.ok) throw new Error('Error al crear la máquina');

            const data = await response.json();
            const nuevaMaquina = data.maquina;


            const option = document.createElement('option');
            option.value = nuevaMaquina.id;
            option.textContent = nuevaMaquina.nombre;
            machineSelect.appendChild(option);
            machineSelect.value = nuevaMaquina.id;


            const filtroMaquinaSelect = document.getElementById('filtroMaquina');
            if (filtroMaquinaSelect) {
                const filtroOption = document.createElement('option');
                filtroOption.value = nuevaMaquina.nombre;
                filtroOption.textContent = nuevaMaquina.nombre;
                filtroMaquinaSelect.appendChild(filtroOption);
            }

            Swal.fire({
                icon: 'success',
                title: 'Máquina agregada',
                text: 'La máquina se ha agregado correctamente'
            });

            modalNuevaMaquina.style.display = 'none';

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar la máquina'
            });
        }
    });
}

async function cargarMaquinasEnSelect() {
    try {
        const response = await fetch('http://192.168.13.39:3000/api/maquinas');
        const maquinas = await response.json();

        const machineSelect = document.getElementById('machineSelect');
        const filtroMaquinaSelect = document.getElementById('filtroMaquina');

        // Reiniciar ambos selects
        if (machineSelect) {
            machineSelect.innerHTML = '<option value="">Seleccione una máquina</option>';
        }
        if (filtroMaquinaSelect) {
            filtroMaquinaSelect.innerHTML = '<option value="">Todas las máquinas</option>';
        }

        maquinas.forEach(maquina => {
            const option1 = document.createElement('option');
            option1.value = maquina.id;
            option1.textContent = maquina.nombre;
            if (machineSelect) machineSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = maquina.nombre;
            option2.textContent = maquina.nombre;
            if (filtroMaquinaSelect) filtroMaquinaSelect.appendChild(option2);
        });
    } catch (error) {
        console.error('Error al cargar las máquinas:', error);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    cargarMaquinasEnSelect();
    initDragAndDrop();
});

//Evento para eliminar maquina
const deleteMachineBtn = document.getElementById('deleteMachineBtn');

if (deleteMachineBtn) {
    deleteMachineBtn.addEventListener('click', async () => {
        const selectedId = machineSelect.value;
        const selectedText = machineSelect.options[machineSelect.selectedIndex]?.textContent;

        if (!selectedId) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona una máquina',
                text: 'Debes seleccionar una máquina para eliminar'
            });
            return;
        }

        const confirm = await Swal.fire({
            title: `¿Eliminar "${selectedText}"?`,
            text: "Estas seguro que quieres eliminar esta maquina",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`http://192.168.13.39:3000/api/maquinas/${selectedId}`, {
                    method: 'DELETE'
                });


                if (!response.ok) throw new Error('Error al eliminar máquina');


                machineSelect.querySelector(`option[value="${selectedId}"]`)?.remove();

                Swal.fire({
                    icon: 'success',
                    title: 'Máquina eliminada',
                    text: `"${selectedText}" fue eliminada correctamente`
                });

                machineSelect.value = '';
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la máquina'
                });
            }
        }
    });
}

// Evento para verificar acciones de acuerdo al rol
document.addEventListener('DOMContentLoaded', () => {
    const rol = localStorage.getItem('rol')?.toLowerCase();

    const addMachineBtn = document.getElementById('addMachineBtn');
    const deleteMachineBtn = document.getElementById('deleteMachineBtn');

    if (rol !== 'admin') {
        if (addMachineBtn) addMachineBtn.style.display = 'none';
        if (deleteMachineBtn) deleteMachineBtn.style.display = 'none';
    }
});

//Evento de mensaje de bienvenida
document.addEventListener('DOMContentLoaded', () => {
    const welcomeDiv = document.getElementById('sidebar-welcome');
    const rol = localStorage.getItem('rol');
    const user = JSON.parse(localStorage.getItem('user'));

    if (welcomeDiv && user?.username) {
        welcomeDiv.textContent = `Bienvenid@, ${user.username}`;
        welcomeDiv.style.marginTop = '20px';
        welcomeDiv.style.padding = '10px';
        welcomeDiv.style.color = '#fff';
        welcomeDiv.style.fontWeight = '500';
        welcomeDiv.style.textAlign = 'center';
    }
});

//Evento para enviar el reporte
document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.querySelector('.reportes-form');

    if (reportForm) {
        reportForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de usuario',
                    text: 'No se pudo obtener el ID del usuario.'
                });
                return;
            }

            const maquinaSelect = document.getElementById('machineSelect');
            const fechaHoraInput = document.getElementById('incidentDateTime');
            const causas = document.getElementById('failureCause').value.trim();
            const nivelPeligro = document.getElementById('dangerLevel').value;
            const descripcion = document.getElementById('incidentDescription').value.trim();
            const imagenInput = document.getElementById('imagen');
            const imagenFile = imagenInput.files[0];
            const nombreReportante = document.getElementById('reporterName').value.trim();

            const maquinaId = maquinaSelect.value;
            const nombreMaquina = maquinaSelect.selectedOptions[0]?.textContent || 'Sin nombre';
            const fechaHora = fechaHoraInput.value;

            if (!maquinaId || !fechaHora || !causas || !nivelPeligro || !descripcion || !nombreReportante) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos requeridos.'
                });
                return;
            }

            if (!fechaHora.includes('T')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Fecha y hora inválida',
                    text: 'Selecciona una fecha y hora válida.'
                });
                return;
            }

            let [fecha, hora] = fechaHora.split('T');
            if (hora.length === 5) hora += ':00';

            const formData = new FormData();
            formData.append('usuario_id', user.id);
            formData.append('maquina_id', parseInt(maquinaId));
            formData.append('nombre_maquina', nombreMaquina);
            formData.append('fecha_incidente', fecha);
            formData.append('hora_incidente', hora);
            formData.append('causas', causas);
            formData.append('nivel_peligro', nivelPeligro);
            formData.append('descripcion', descripcion);
            formData.append('nombre_reportante', nombreReportante);

            if (imagenFile) {
                formData.append('imagen', imagenFile);
            }

            try {
                const response = await fetch('http://192.168.13.39:3000/api/enviar-reporte', {
                    method: 'POST',
                    body: formData
                });


                if (!response.ok) throw new Error('Error al enviar el reporte.');

                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte enviado',
                    text: result.message || 'Se ha enviado correctamente el reporte.'
                });

                reportForm.reset();

                const imagenInput = document.getElementById('imagen');
                imagenInput.value = '';

                const previewImage = document.getElementById('previewImage');
                if (previewImage) {
                    previewImage.src = '';
                    previewImage.style.display = 'none';
                }

                const uploadedPreview = document.querySelector('.uploaded-image-preview');
                if (uploadedPreview) {
                    uploadedPreview.style.display = 'none';
                }

                const dragDropArea = document.querySelector('.drag-drop-area');
                if (dragDropArea) {
                    dragDropArea.classList.remove('success', 'has-file');
                    dragDropArea.classList.remove('highlight');
                }

                const dragTextSpan = document.querySelector('.drag-text span');
                if (dragTextSpan) {
                    dragTextSpan.innerHTML = `Arrastra y suelta la imagen aquí o 
                <span class="browse-button">selecciona un archivo</span>`;
                }

                const dragIcon = document.querySelector('.drag-text i');
                if (dragIcon) {
                    dragIcon.classList.remove('fa-check-circle');
                    dragIcon.classList.add('fa-cloud-upload-alt');
                    dragIcon.style.color = '';
                }



                imagenInput.value = '';
                document.getElementById('previewImage').src = '';
                document.getElementById('previewImage').style.display = 'none';
                document.querySelector('.uploaded-image-preview').style.display = 'none';

                // Opcional: quitar estilos de éxito si los tienes
                const dragArea = document.querySelector('.drag-drop-area');
                if (dragArea.classList.contains('success')) {
                    dragArea.classList.remove('success');
                }

            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo enviar el reporte.'
                });
            }
        });
    }
});




// Evento para cargar notificaciones
let contadorNoLeidas = 0;

async function cargarNotificaciones() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return;

    try {
        const response = await fetch(`http://192.168.13.39:3000/api/notificaciones/${user.id}`);
        const notificaciones = await response.json();

        const contenedor = document.getElementById('contenedor-notificaciones');
        const contadorSpan = document.getElementById('contador-notificaciones');

        contenedor.innerHTML = '';

        if (notificaciones.length === 0) {
            contenedor.innerHTML = '<p>No tienes notificaciones.</p>';
            contadorSpan.style.display = 'none';
            return;
        }


        const noLeidas = notificaciones.filter(n => !n.leida);
        contadorNoLeidas = noLeidas.length;

        if (contadorNoLeidas > 0) {
            contadorSpan.textContent = contadorNoLeidas;
            contadorSpan.style.display = 'inline-block';
        } else {
            contadorSpan.style.display = 'none';
        }


        notificaciones.forEach(noti => {
            const fechaFormateada = new Date(noti.creada_en).toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                hour12: true,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const card = document.createElement('div');
            card.classList.add('notification-card');
            if (!noti.leida) {
                card.classList.add('no-leida');
            }

            card.innerHTML = `
                <h3>Notificación</h3>
                <p>${noti.mensaje}</p>
                <small>${fechaFormateada}</small>
            `;

            card.addEventListener('click', async () => {
                if (!noti.id || isNaN(noti.id)) return;


                if (!noti.leida) {
                    try {
                        await fetch(`http://192.168.13.39:3000/api/marcar-leida/${noti.id}`, {
                            method: 'PUT'
                        });


                        contadorNoLeidas--;
                        if (contadorNoLeidas <= 0) {
                            contadorSpan.style.display = 'none';
                        } else {
                            contadorSpan.textContent = contadorNoLeidas;
                        }

                        card.classList.remove('no-leida');
                        noti.leida = true;
                    } catch (err) {
                        console.error('Error al marcar como leída:', err);
                    }
                }


                mostrarDetalleNotificacion(noti.id);
            });

            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    }
}




async function mostrarDetalleNotificacion(idNotificacion) {
    try {
        const response = await fetch(`http://192.168.13.39:3000/api/detalle-reporte/${idNotificacion}`);
        if (!response.ok) throw new Error('No se pudo obtener el detalle del reporte');

        const data = await response.json();

        document.getElementById('detalle-reportante').textContent = data.nombre_reportante || 'Desconocido';
        document.getElementById('detalle-maquina').textContent = data.nombre_maquina || '';
        document.getElementById('detalle-fecha').textContent = data.fecha_incidente?.split('T')[0] || '';
        document.getElementById('detalle-hora').textContent = data.hora_incidente ? data.hora_incidente.substring(0, 5) : '';
        document.getElementById('detalle-peligro').textContent = data.nivel_peligro || '';
        document.getElementById('detalle-causa').textContent = data.causas || '';
        document.getElementById('detalle-descripcion').textContent = data.descripcion || '';

        const imagen = document.getElementById('detalle-imagen');
        const detailImageArea = document.querySelector('.detail-image-area');
        const dragIcon = detailImageArea.querySelector('i');
        const dragText = detailImageArea.querySelector('span');

        if (data.imagen_path) {
            imagen.src = `http://192.168.13.39:3000/${data.imagen_path}`;
            imagen.style.display = 'block';
            detailImageArea.classList.add('has-file');
            dragIcon.classList.remove('fa-cloud-upload-alt');
            dragIcon.classList.add('fa-check-circle');
            dragIcon.style.color = 'var(--accent-green)';
            dragText.textContent = 'Evidencia fotográfica cargada';
        } else {
            imagen.style.display = 'none';
            imagen.src = '';
            detailImageArea.classList.remove('has-file');
            dragIcon.classList.remove('fa-check-circle');
            dragIcon.classList.add('fa-camera');
            dragIcon.style.color = 'var(--primary-blue)';
            dragText.textContent = 'Evidencia fotográfica';
        }

        document.getElementById('modalDetalleNotificacion').style.display = 'flex';

    } catch (error) {
        console.error('Error al mostrar detalle:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el detalle del reporte.'
        });
    }
}

// Cerrar modal
document.addEventListener("DOMContentLoaded", () => {
    const cerrarBtn = document.getElementById("cerrarModalDetalle");
    if (cerrarBtn) {
        cerrarBtn.addEventListener("click", () => {
            document.getElementById("modalDetalleNotificacion").style.display = "none";
        });
    }
});


//Evento para arrastrar y soltar archivos
function initDragAndDrop() {
    const dragDropArea = document.querySelector('.drag-drop-area');
    const fileInput = document.getElementById('imagen');
    const dragTextSpan = document.querySelector('.drag-text span');
    const dragIcon = document.querySelector('.drag-text i');
    const browseButton = document.querySelector('.browse-button');

    if (!dragDropArea || !fileInput || !dragTextSpan || !dragIcon || !browseButton) {
        console.warn("Drag and drop elements not found. Skipping initialization.");
        return;
    }

    // Prevenir comportamientos predeterminados de arrastre
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Efectos visuales al arrastrar
    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, () => dragDropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, () => dragDropArea.classList.remove('highlight'), false);
    });

    // Evento al soltar archivo
    dragDropArea.addEventListener('drop', handleDrop, false);

    // Click en el botón de "seleccionar archivo"
    browseButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Evento cuando se selecciona un archivo desde el input
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            updateDragDropArea(event.target.files[0]);
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files; // Asignar archivos soltados
            updateDragDropArea(files[0]);
        }
    }

    function updateDragDropArea(file) {
        if (file) {
            dragTextSpan.innerHTML = `<strong>Archivo seleccionado:</strong> ${file.name}`;
            dragIcon.classList.remove('fa-cloud-upload-alt');
            dragIcon.classList.add('fa-check-circle');
            dragIcon.style.color = 'var(--accent-green)';
            dragDropArea.classList.add('has-file');
        } else {
            dragTextSpan.innerHTML = 'Arrastra y suelta la imagen aquí o <span class="browse-button">selecciona un archivo</span>';
            dragIcon.classList.remove('fa-check-circle');
            dragIcon.classList.add('fa-cloud-upload-alt');
            dragIcon.style.color = '';
            dragDropArea.classList.remove('has-file');
        }
    }
}


// Evento para aplicar filtros en notificaciones
document.getElementById('aplicarFiltros').addEventListener('click', async () => {
    const nivel = document.getElementById('filtroNivel').value;
    const fecha = document.getElementById('filtroFecha').value;
    const maquina = document.getElementById('filtroMaquina').value;
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return;

    try {
        const response = await fetch(`http://192.168.13.39:3000/api/notificaciones/${user.id}`);
        const notificaciones = await response.json();


        const filtradas = notificaciones.filter(noti => {
            const notiFecha = new Date(noti.creada_en).toISOString().split('T')[0];

            const coincideNivel = !nivel || noti.mensaje.toLowerCase().includes(`nivel: ${nivel}`);
            const coincideFecha = !fecha || notiFecha === fecha;
            const coincideMaquina = !maquina || noti.mensaje.toLowerCase().includes(maquina.toLowerCase());

            return coincideNivel && coincideFecha && coincideMaquina;
        });

        const contenedor = document.getElementById('contenedor-notificaciones');
        contenedor.innerHTML = '';

        if (filtradas.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron notificaciones de este tipo</p>';
            return;
        }

        filtradas.forEach(noti => {
            const fechaFormateada = new Date(noti.creada_en).toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                hour12: true,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const card = document.createElement('div');
            card.classList.add('notification-card');


            if (!noti.leida) {
                card.classList.add('no-leida');
            }

            card.innerHTML = `
                <h3>Notificación</h3>
                <p>${noti.mensaje}</p>
                <small>${fechaFormateada}</small>
            `;

            card.addEventListener('click', async () => {
                if (!noti.id || isNaN(noti.id)) return;

                if (!noti.leida) {
                    try {
                        await fetch(`http://192.168.13.39:3000/api/marcar-leida/${noti.id}`, {
                            method: 'PUT'
                        });



                        const contadorSpan = document.getElementById('contador-notificaciones');
                        if (contadorSpan && contadorSpan.textContent > 0) {
                            let nuevo = parseInt(contadorSpan.textContent) - 1;
                            if (nuevo <= 0) {
                                contadorSpan.style.display = 'none';
                            } else {
                                contadorSpan.textContent = nuevo;
                            }
                        }

                        card.classList.remove('no-leida');
                        noti.leida = true;
                    } catch (err) {
                        console.error('Error al marcar como leída:', err);
                    }
                }

                mostrarDetalleNotificacion(noti.id);
            });

            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error al aplicar filtros:', error);
    }
});

//Evento para limpiar filtros
document.getElementById('limpiarFiltros').addEventListener('click', () => {
    document.getElementById('filtroNivel').value = '';
    document.getElementById('filtroFecha').value = '';
    document.getElementById('filtroMaquina').value = '';
    cargarNotificaciones();
});

document.getElementById('filtrarNoLeidas').addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return;

    try {
        const response = await fetch(`http://192.168.13.39:3000/api/notificaciones/${user.id}`);
        const notificaciones = await response.json();

        const noLeidas = notificaciones.filter(n => !n.leida);

        const contenedor = document.getElementById('contenedor-notificaciones');
        contenedor.innerHTML = '';

        if (noLeidas.length === 0) {
            contenedor.innerHTML = '<p>No tienes notificaciones pendientes.</p>';
            return;
        }

        noLeidas.forEach(noti => {
            const fechaFormateada = new Date(noti.creada_en).toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                hour12: true,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const card = document.createElement('div');
            card.classList.add('notification-card', 'no-leida');

            card.innerHTML = `
                <h3>Notificación</h3>
                <p>${noti.mensaje}</p>
                <small>${fechaFormateada}</small>
            `;

            card.addEventListener('click', async () => {
                if (!noti.id || isNaN(noti.id)) return;

                try {
                    await fetch(`http://192.168.13.39:3000/api/marcar-leida/${noti.id}`, {
                        method: 'PUT'
                    });


                    const contadorSpan = document.getElementById('contador-notificaciones');
                    if (contadorSpan && contadorSpan.textContent > 0) {
                        let nuevo = parseInt(contadorSpan.textContent) - 1;
                        if (nuevo <= 0) {
                            contadorSpan.style.display = 'none';
                        } else {
                            contadorSpan.textContent = nuevo;
                        }
                    }

                    card.classList.remove('no-leida');
                    noti.leida = true;
                } catch (err) {
                    console.error('Error al marcar como leída:', err);
                }

                mostrarDetalleNotificacion(noti.id);
            });

            contenedor.appendChild(card);
        });

    } catch (err) {
        console.error('Error al cargar no leídas:', err);
    }
});

// Resetear formulario completo
document.querySelector('.reportes-form').reset();

// Limpiar previsualización de imagen
document.getElementById('previewImage').src = '';
document.querySelector('.uploaded-image-preview').style.display = 'none';

// Restaurar zona de arrastrar y soltar
document.querySelector('.drag-text').style.display = 'block';
document.getElementById('imagen').value = ''; // Limpia el input file

