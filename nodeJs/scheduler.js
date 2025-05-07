import cron from 'node-cron';
import User from './models/user.model.js';

cron.schedule('0 23 * * *', async () => {
  console.log('Ejecutando la verificación diaria de suspensión de usuarios...');
  try {
    const result = await User.updateMany(
      {
        strikes: { $gte: 3 }, 
        isSuspended: false,   
      },
      {
        $set: { isSuspended: true },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} usuario(s) ha(n) sido suspendido(s).`);
    } else {
      console.log('No se encontraron usuarios para suspender en esta ejecución.');
    }
  } catch (error) {
    console.error('Error durante la tarea programada de suspensión de usuarios:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Caracas" 
});

console.log('Tarea de suspensión de usuarios programada para ejecutarse diariamente a las 11:00 PM.');
