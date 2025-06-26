function hideLogin() {
    document.getElementById('loginContainer').style.display = 'none';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const toggleIcon = document.getElementById('toggleIcon');

    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('visible');
    mainContent.classList.toggle('expanded');
    toggleButton.classList.toggle('active');

    if (toggleButton.classList.contains('active')) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-times');
    } else {
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
    }
}

function showModule(module) {
    document.getElementById('reportesModule').style.display = module === 'reportes' ? 'block' : 'none';
    document.getElementById('notificacionesModule').style.display = module === 'notificaciones' ? 'block' : 'none';

    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
}

function submitReport(event) {
    event.preventDefault();
    const formData = {
        machineName: document.getElementById('machineName').value,
        incidentDateTime: document.getElementById('incidentDateTime').value,
        failureCause: document.getElementById('failureCause').value,
        dangerLevel: document.getElementById('dangerLevel').value,
        incidentDescription: document.getElementById('incidentDescription').value,
        evidence: document.getElementById('evidence').files[0]
    };
    alert('Reporte enviado (funcionalidad simulada)');
    console.log(formData);
    event.target.reset();
}

function logout() {
    alert('Cerrar sesión (funcionalidad simulada)');
    document.getElementById('loginContainer').style.display = 'flex';
}