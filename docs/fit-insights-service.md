# Fit Insights Service - Explicación

## ¿Qué es este servicio?

Fit Insights Service es un microservicio que se encarga de **generar reportes en formato HTML** para una aplicación de fitness. Es como una "fábrica de reportes" que recibe pedidos, consulta información de otros servicios y entrega reportes terminados.

Este servicio no funciona solo: se comunica con otros microservicios (Workspace Service y User Service) para obtener los datos que necesita.

---

## Estructura del Proyecto

```
fit-insights-service/
├── src/
│   ├── main.ts              # Punto de entrada
│   ├── app.module.ts         # Configuración del módulo
│   ├── app.controller.ts     # Recepciones de mensajes
│   ├── app.service.ts        # Lógica de negocio
│   └── templates/            # Plantillas HTML
│       ├── trainer-report.hbs
│       └── client-plan-report.hbs
├── dist/                     # Código compilado
├── package.json              # Dependencias
└── nest-cli.json             # Configuración de NestJS
```

---

## Explicación Archivo por Archivo

### main.ts - El punto de entrada

Este archivo es donde todo comienza. Piensa en él como el "botón de encendido" del servicio.

```typescript
async function bootstrap() {
  // Crea un microservicio que escucha por TCP
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3003,
    },
  });
  await app.listen();
}
```

Lo que hace:
- Crea el microservicio usando el protocolo TCP (es como hablar por teléfono entre computadoras)
- Lo configura para escuchar en el puerto 3003
- Queda esperando mensajes para procesar

---

### app.module.ts - La configuración central

Es como el "índice" o "tabla de contenidos" del servicio. Acá se define qué piezas existen y cómo están conectadas.

```typescript
@Module({
  imports: [
    ClientsModule.register([
      { name: 'WORKSPACE_SERVICE', ... },
      { name: 'USER_SERVICE', ... },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Lo que hace:
- **ClientsModule**: Registra las conexiones a otros microservicios (WorkSpace y User Service)
- **AppController**: Define qué "endpoints de mensaje" existen
- **AppService**: Contiene la lógica para generar los reportes

---

### app.controller.ts - El receptionist

Imagina un receptionist de hotel que recibe solicitudes y las deriva al departamento correcto.

```typescript
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'generate_trainer_report' })
  async generateTrainerReport(payload: { trainerId: string }) {
    return this.appService.generateTrainerReport(payload.trainerId);
  }

  @MessagePattern({ cmd: 'generate_client_plan_report' })
  async generateClientPlanReport(payload: { clientId: string }) {
    return this.appService.generateClientPlanReport(payload.clientId);
  }
}
```

Lo que hace:
- Escucha mensajes con comandos específicos
- `generate_trainer_report`: Cuando alguien pide un reporte de entrenador
- `generate_client_plan_report`: Cuando alguien pide un reporte de plan de cliente
- Delega el trabajo pesado a AppService

---

### app.service.ts - El corazón del servicio

Aquí está toda la inteligencia. Es donde se consultan datos, se procesan y se generan los reportes HTML.

**generateTrainerReport (Reporte de Entrenador):**

1. Pide el nombre del entrenador al User Service
2. Pide la lista de clientes al Workspace Service
3. Prepara los datos en un formato especial (viewModel)
4. Usa una plantilla HTML para convertir esos datos en una página web

**generateClientPlanReport (Reporte de Cliente):**

1. Pide los datos completos de un cliente al Workspace Service
2. Extrae información de训练的 (entrenamientos) y nutrición
3. Prepara los datos
4. Genera un reporte HTML personalizado

**renderTemplate (Función auxiliar):**

Toma una plantilla HTML (archivo .hbs) y la llena con los datos proporcionados. Es como llenar los espacios en blanco de un formulario.

---

### templates/*.hbs - Las plantillas HTML

Son archivos HTML especiales que usan Handlebars. Tienen "huecos" que se llenan con datos dinámicos.

**trainer-report.hbs**: Plantilla para el reporte de entrenador (muestra lista de clientes)
**client-plan-report.hbs**: Plantilla para el reporte de cliente (muestra entrenamientos y nutrición)

---

## ¿Cómo funciona todo junto?

1. **Otro servicio** envía un mensaje TCP al Fit Insights Service con el comando `generate_trainer_report` o `generate_client_plan_report`
2. **AppController** recibe el mensaje y lo pasa a **AppService**
3. **AppService** consulta a **Workspace Service** y **User Service** para obtener datos
4. **AppService** toma esos datos y los combina con una **plantilla HTML**
5. El **HTML final** se devuelve como respuesta

---

## Comandos Disponibles (Message Patterns)

| Comando | Entrada | Descripción |
|---------|---------|-------------|
| `generate_trainer_report` | `{ trainerId: string }` | Genera un reporte con todos los clientes de un entrenador |
| `generate_client_plan_report` | `{ clientId: string }` | Genera un reporte detallado de un cliente (entrenamientos + nutrición) |

---

## Tecnologías Utilizadas

- **NestJS**: Framework para construir el microservicio
- **@nestjs/microservices**: Para comunicación TCP entre servicios
- **Handlebars**: Motor de plantillas para generar HTML dinámico
- **RxJS**: Para manejar operaciones asíncronas (como "primero obtén esto, luego aquello")
