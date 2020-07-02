// Cliente TCP
const net = require('net');
// variables servidor
const direccion = '127.0.0.1';
const puerto = 15000;

iniciarCliente();

function iniciarCliente() {
    // creamos el socker cliente
    const client = new net.Socket();
    // creamos la variable de lectura
    var lectura = process.openStdin();
    // conectamos con el servidor
    client.connect(puerto, direccion, ()=> {
        // variables para obtener puerto y direccion del cliente
        const address = client.address();
        const port = address.port;
        const ipaddr = address.address;
        console.log("------ Perez Uria Nain Adalid Paralelo: 'B'------");
        console.log("-------------------------------------------------");
        console.log(" - Cliente TCP INICIADO - ");
        console.log("   El cliente esta escuchando : " + ipaddr + ":" + port);
        console.log("*******************************************************************************");
        console.log("Este juego solo admite las palabras: 'piedra' , 'papel' o 'tijera' en minuscula");
        console.log("*******************************************************************************");
        console.log("CLIENTE : ");
    });

    lectura.on('data', function(d) {
        const datoEnviar = d.toString().trim();
        // enviamos el dato
        client.write(datoEnviar);
    });

    // recibimos dato del servidor
    client.on('data', data => {
        console.log('CHAT : ' + data);
        console.log("CLIENTE : ");
    });

    // cerramos la conexion con el servidor
    client.on('close', () => {
        console.log('Conexión cerrada');
        process.exit();
    });
}