db = db.getSiblingDB('biblioflow_logs');

db.createUser({
  user: 'app_logger',
  pwd: 'logger_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'biblioflow_logs'
    }
  ]
});

db.createCollection('application_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'level', 'message'],
      properties: {
        timestamp: {
          bsonType: 'date',
          description: 'Date et heure du log'
        },
        level: {
          bsonType: 'string',
          enum: ['error', 'warn', 'info', 'debug'],
          description: 'Niveau de log'
        },
        message: {
          bsonType: 'string',
          description: 'Message du log'
        },
        source: {
          bsonType: 'string',
          description: 'Source du log (frontend/backend)'
        },
        user_id: {
          bsonType: 'int',
          description: 'ID de l\'utilisateur concerné'
        }
      }
    }
  }
});

db.createCollection('error_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'error_message', 'stack_trace'],
      properties: {
        timestamp: { bsonType: 'date' },
        error_message: { bsonType: 'string' },
        stack_trace: { bsonType: 'string' },
        user_id: { bsonType: 'int' },
        endpoint: { bsonType: 'string' }
      }
    }
  }
});

db.application_logs.insertMany([
  {
    timestamp: new Date(),
    level: 'info',
    message: 'Application started successfully',
    source: 'backend'
  },
  {
    timestamp: new Date(),
    level: 'warn',
    message: 'User attempted invalid login',
    source: 'backend',
    user_id: 1
  },
  {
    timestamp: new Date(),
    level: 'error',
    message: 'Database connection timeout',
    source: 'backend'
  }
]);

db.error_logs.insertMany([
  {
    timestamp: new Date(),
    error_message: 'TypeError: Cannot read property of undefined',
    stack_trace: 'at Controller.getUsers (/app/src/users.controller.ts:25)',
    endpoint: '/api/users',
    user_id: 2
  }
]);

print('MongoDB initialization completed successfully!');