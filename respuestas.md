# Respuestas

## Pregunta 0

********api-rastro (main)
$ git push

 ! [remote rejected] main -> main (push declined due to repository rule violations)
error: failed to push some refs to 'https://github.com/laumarva99/api-rastro.git'


GitHub no deja subir cambios a main sin una pull request y pasar los checks


## Pregunta 1

{"statusCode":500,"message":"Internal server error"}

Si PostgreSQL está apagado, el cliente recibe un error 500 genérico, mientras que el error completo aparece en la terminal de NestJS. Así no se muestran detalles internos del servidor al usuario



## Pregunta 2

Con la versión mala aparecen las 7 clases porque el texto puede modificar la consulta y mostrar todos los resultados. Sin embargo, con $1, PostgreSQL no encuentra ninguna clase porque utiliza el valor como texto


## Pregunta 3

Antes de guardar, comprobamos que el trainerId sea válido. Si no existe, devolvemos un error 400 porque el problema está en los datos que ha enviado el cliente, no en el servidor


## Pregunta 4

Porque la petición es correcta, pero no se puede eliminar la clase porque todavía tiene reservas; 400 es para peticiones incorrectas


## Pregunta 5

Tiene el ID de Ana y las fechas de creación y caducidad. No incluimos el rol porque puede cambiar, así que lo consultamos en la base de datos en cada petición para tenerlo actualizado

{
  "sub": 1,
  "iat": 1794843938,
  "exp": 1794847538
}


## Pregunta 6

Porque el token solo contiene el ID del usuario. Cada vez que hace una petición, se comprueba en la base de datos qué permisos tiene en ese momento y se actualiza automáticamente sin tener que iniciar sesión otra vez



## Pregunta 7

Porque usamos uno falso que imita las respuestas de la base de datos. Pero no comprueba si las consultas están bien escritas; para eso usamos los tests de integración


## Pregunta 8

Porque genera un número diferente cada vez, por eso el correo siempre es distinto. Si usamos uno fijo al repetir el test daría un error porque ese usuario ya existiría



## Pregunta 9

Porque lo que se pega en el ORDER BY nunca es el texto del cliente. El usuario solo puede ordenar las clases por tres opciones, si intenta utilizar otra opción el sistema rechaza la petición con un error 400 para evitar cambios


## Pregunta 10

Porque nos aseguramos las limitaciones de intentos en el login y así evitar que alguien pruebe muchas contraseñas seguidas(ciberataques). Trust proxy indentifica la IP real de cada usuario en Render y evita que todos compartan el mismo límite de peticiones


## Pregunta 11

Sin la transacción, Óscar se guardó junto con su especialidad 5, pero no se completó el registro porque la especialidad 99 no existe. La API devolvió un 400, pero sus datos se guardaron a medias. Din embargo, Nuria no recibe el ID 5 porque ya lo había utilizado en el intento anterior 



## Pregunta 12

La API responde, pero el navegador solo permite ver la respuesta a las webs autorizadas. Postman sí puede verla porque no tiene esa limitación. CORS sirve para controlar desde qué webs se puede acceder a la API



## Pregunta 13

Ahora aparece "database": "postgres" porque Supabase utiliza ese nombre para su base de datos. No he tenido que cambiar el código, solo la variable DATABASE_URL para conectarme a Supabase en lugar de Docker


## Pregunta 14

La foto ha desaparecido porque Render borra los archivos guardados al hacer un nuevo despliegue. Sin embargo, el photoUrl sigue guardado en Supabase, pero apunta a una imagen que ya no existe. Las fotos deberían guardarse en Supabase Storage para que no se pierdan