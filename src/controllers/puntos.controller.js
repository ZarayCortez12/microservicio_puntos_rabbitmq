import amqp from "amqplib";
import Punto from "../models/puntos.model.js";

export async function consumeMessages() {
  try {
    // Establecer conexión con RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "logExchange"; // Nombre del exchange
    const queue = ""; // Deja la cola sin nombre para que RabbitMQ asigne una cola temporal única

    // Declara el exchange como tipo 'fanout'
    await channel.assertExchange(exchange, "fanout", { durable: true });

    // Crea una cola temporal y enlázala al exchange
    const q = await channel.assertQueue(queue, { exclusive: true });

    // Vincula la cola al exchange sin usar `routingKey`, ya que es un fanout exchange
    await channel.bindQueue(q.queue, exchange, "");

    console.log("Esperando mensajes en la cola para iniciar con los puntos...");

    // Consumir mensajes de la cola
    channel.consume(q.queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log("Datos recibidos:", data);

        const identificacion = data.user.identificacion;

        // Llamar a la función sendEmail con el correo del usuario
        try {
          await registerPointsUInitial(identificacion);
        } catch (error) {
          console.error("Error al inicializar puntos", error);
        }

        channel.ack(msg); // Confirmar que el mensaje fue procesado
      }
    });
  } catch (error) {
    console.error("Error al consumir los mensajes:", error);
  }
}

export const registerPointsUInitial = async (identificacion) => {
  try {
    // Crear un nuevo registro de puntos
    const newPuntos = new Punto({
      id_user: identificacion,
      cantidad: 0,
    });

    // Guardar el nuevo registro de puntos
    await newPuntos.save();

    // Registro de éxito en consola
    console.log(
      "Puntos registrados con éxito para el usuario:",
      identificacion
    );
  } catch (error) {
    // Registro de error en consola
    console.error(
      "Error al registrar los puntos para el usuario:",
      identificacion,
      error
    );
  }
};

export const getPuntosUser = async (req, res) => {
  const { identificacion } = req.params;
  try {
    // Buscar registros de puntos para el usuario
    const puntos = await Punto.find({ id_user: identificacion });

    // Registro de éxito en consola
    console.log("Puntos obtenidos con éxito para el usuario:", identificacion);

    res.json(puntos);
  } catch (error) {
    // Registro de error en consola
    console.error(
      "Error al obtener los puntos para el usuario:",
      identificacion,
      error
    );
  }
};
