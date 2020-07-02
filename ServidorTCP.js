// Servidor TCP
const net = require('net');
// variables servidor
const puerto = 15000;
var respuesta_jugador1 = "";
var respuesta_jugador2 = "";
var puerto1 = 0;
var j = 0;
// iniciamos servidor
iniciarServidor();

function iniciarServidor() {
	// Creamos el servidor TCP
	const server = net.createServer();
	// creamos la variable de lectura
    var lectura = process.openStdin();
	// Emite cuando el socket está listo y escuchando mensajes de datagramas
	server.listen(puerto, 'localhost', () => {
		const address = server.address();
		const port = address.port;
		const ipaddr = address.address;
		console.log("------ Perez Uria Nain Adalid Paralelo: 'B'------");
		console.log("-------------------------------------------------");
		console.log(" - SERVIDOR TCP INICIADO - ");
		console.log("   El servidor esta escuchando : " + ipaddr + ":" + port);
		console.log(" - Esperando peticion del Cliente - ");
	});
	// Array de sockets
	const sockets = [];
	server.on('connection', (sock) => {
		if(sockets.length > 1){
			sock.destroy();
		}else{
		   // Agregamos sock al Array de sockets
		   sockets.push(sock);
		}
		lectura.on('data', function(d) {
			const datoEnviar = d.toString().trim();
			const dataBuffer = Buffer.from(datoEnviar);
	        sock.write(dataBuffer)
		});
		// Recibimos el dato y enviamos
		sock.on('data', data => {
			// almacemos la cadena del cliente en datoRecibido
			var datoRecibido = data.toString();
			// Mostramos el dato recibido del cliente
			console.log('CLIENTE : '+ datoRecibido);
			if(sock.remotePort == sockets[0].remotePort){
				console.log(sock.remotePort +" "+sockets[0].remotePort);
				respuesta_jugador1 = datoRecibido;
				console.log("Respuesta Jugador 1 : "+respuesta_jugador1);
			}
			if(sock.remotePort == sockets[1].remotePort){
				console.log(sock.remotePort +" "+sockets[1].remotePort);
				respuesta_jugador2 = datoRecibido;
				console.log("Respuesta Jugador 2 : "+respuesta_jugador2);
			}
			d = -1;
			switch(respuesta_jugador1){
				case "piedra":
				    switch(respuesta_jugador2){
					  case "piedra":
					  d = 0;
					  break;
					  case "papel":
					  d = 2;
					  break;
					  case "tijera":
					  d = 1;
					  break;
				  }
				break;
				case "papel":
				    switch(respuesta_jugador2){
					  case "piedra":
					  d = 1;
					  break;
					  case "papel":
					  d = 0;
					  break;
					  case "tijera":
					  d = 2;
					  break;
				  }
				break;
				case "tijera":
				    switch(respuesta_jugador2){
					  case "piedra":
					  d = 2;
					  break;
					  case "papel":
					  d = 1;
					  break;
					  case "tijera":
					  d = 0;
					  break;
				    }
				break;
			}
			if(d == 0){
				var mensaje0 = "empate volver a elegir";
				const datoEnviar0 = mensaje0.toString().trim();
			    const dataBuffer0 = Buffer.from(datoEnviar0);
			    sockets.forEach((socket)=>{
			    	socket.write(dataBuffer0);
			    });
			}else{
				var mensaje1 = ""
			    var mensaje2 = ""
			    if(d == 1){
				  mensaje1 = "Ganador";
				    const datoEnviar1 = mensaje1.toString().trim();
			        const dataBuffer1 = Buffer.from(datoEnviar1);
			        sockets[0].write(dataBuffer1);
			        sockets[0].destroy();
				  mensaje2 = "Perdedor";
				    const datoEnviar2 = mensaje2.toString().trim();
			        const dataBuffer2 = Buffer.from(datoEnviar2);
			        sockets[1].write(dataBuffer2);
			        sockets[1].destroy();
			    }else{
			    	if(d == 2){
				      mensaje2 = "Ganador";
				      const datoEnviar2 = mensaje2.toString().trim();
			          const dataBuffer2 = Buffer.from(datoEnviar2);
			          sockets[1].write(dataBuffer2);
			          sockets[1].destroy();
				      mensaje1 = "Perdedor";
				      const datoEnviar1 = mensaje1.toString().trim();
			          const dataBuffer1 = Buffer.from(datoEnviar1);
			          sockets[0].write(dataBuffer1);
			          sockets[0].destroy();
			        }
			    }
			}
			if(respuesta_jugador1 != "" && respuesta_jugador2 != ""){
				respuesta_jugador1 = "";
				respuesta_jugador2 = "";
			}
			d = -1;
		});

		// Cerramos la conexion del socket
		sock.on('close', data => {
			let index = sockets.findIndex( o => {
				return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
			});
			if (index !== -1) {
				sockets.splice(index, 1);
			}
		});
	});

	// Emite cuando existe algun error
	server.on('error', (error) => {
		console.log("error", error);
		server.close();
	});
}