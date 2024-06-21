function toggleForm(formId) {
    document.querySelectorAll('form').forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById(formId).style.display = 'block';
}
async function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:58985/AuthService.svc/rest/IniciarSesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CorreoElectronico: email,
            ClaveHash: password
        })
    });

    const data = await response.json();
    if (data.UsuarioId > 0) {
        alert(`Inicio de sesión exitoso. Bienvenido, ${data.Nombre} ${data.Apellido}!`);
        // Aquí podrías redirigir al usuario a la página principal o realizar otras acciones necesarias
        // Por ejemplo, mostrar las reservas del usuario después del inicio de sesión exitoso
        listarReservas();
    } else {
        alert('Inicio de sesión fallido. Verifica tus credenciales.');
    }
}

async function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('registerNombre').value;
    const apellido = document.getElementById('registerApellido').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:58985/UsuarioService.svc/rest/RegistrarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Nombre: nombre,
            Apellido: apellido,
            CorreoElectronico: email,
            ClaveHash: password
        })
    });

    const data = await response.json();
    if (data.UsuarioId > 0) {
        alert(`Usuario registrado exitosamente. Bienvenido, ${nombre} ${apellido}!`);
        // Aquí podrías redirigir al usuario a la página principal o realizar otras acciones necesarias
    } else {
        alert('Error al registrar usuario. Por favor, inténtalo nuevamente.');
    }
}

async function buscarVuelos(event) {
    event.preventDefault();
    const origen = document.getElementById('searchOrigen').value;
    const destino = document.getElementById('searchDestino').value;

    const response = await fetch('http://localhost:58985/VueloService.svc/rest/BuscarVuelos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Origen: origen,
            Destino: destino
        })
    });

    const data = await response.json();
    const table = document.getElementById('vuelosTable');
    table.innerHTML = '<tr><th>Vuelo ID</th><th>Origen</th><th>Destino</th><th>Fecha Salida</th><th>Fecha Llegada</th><th>Precio</th></tr>';
    data.forEach(vuelo => {
        const row = table.insertRow();
        row.insertCell(0).innerText = vuelo.VueloId;
        row.insertCell(1).innerText = vuelo.Origen;
        row.insertCell(2).innerText = vuelo.Destino;
        row.insertCell(3).innerText = new Date(parseInt(vuelo.FechaSalida.substr(6))).toLocaleString();
        row.insertCell(4).innerText = new Date(parseInt(vuelo.FechaLlegada.substr(6))).toLocaleString();
        row.insertCell(5).innerText = vuelo.Precio;
    });
}

async function listarReservas() {
    const response = await fetch('http://localhost:58985/ReservaService.svc/rest/ListarReservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([])
    });

    const data = await response.json();
    const table = document.getElementById('reservasTable');
    table.innerHTML = '<tr><th>Reserva ID</th><th>Usuario ID</th><th>Vuelo ID</th><th>Estado</th><th>Fecha Reserva</th></tr>';
    data.forEach(reserva => {
        const row = table.insertRow();
        row.insertCell(0).innerText = reserva.ReservaID;
        row.insertCell(1).innerText = reserva.UsuarioId;
        row.insertCell(2).innerText = reserva.VueloID;
        row.insertCell(3).innerText = reserva.Estado;
        row.insertCell(4).innerText = new Date(parseInt(reserva.FechaReserva.substr(6))).toLocaleString();
    });
}

async function registrarReserva(event) {
    event.preventDefault();
    const usuarioId = parseInt(document.getElementById('reservaUsuarioId').value);
    const vueloId = parseInt(document.getElementById('reservaVueloId').value);

    const response = await fetch('http://localhost:58985/ReservaService.svc/rest/RegistrarReserva', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            UsuarioId: usuarioId,
            VueloID: vueloId
        })
    });

    const data = await response.json();
    if (data.ReservaID > 0) {
        alert(`Reserva realizada correctamente. Reserva ID: ${data.ReservaID}`);
        // Actualizar la lista de reservas después de realizar la reserva
        listarReservas();
    } else {
        alert('Error al realizar la reserva. Por favor, inténtalo nuevamente.');
    }
}

async function actualizarReserva(event) {
    event.preventDefault();
    const reservaId = parseInt(document.getElementById('updateReservaId').value);
    const estado = document.getElementById('updateEstado').value;

    const response = await fetch('http://localhost:58985/ReservaService.svc/rest/ActualizarReserva', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ReservaID: reservaId,
            Estado: estado
        })
    });

    const data = await response.json();
    if (data.ReservaID > 0) {
        alert(`Reserva actualizada correctamente. Nuevo estado: ${data.Estado}`);
        // Actualizar la lista de reservas después de actualizar la reserva
        listarReservas();
    } else {
        alert('Error al actualizar la reserva. Por favor, inténtalo nuevamente.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Cargar la lista de vuelos y reservas al cargar la página
    buscarVuelos();
    listarReservas();
});
