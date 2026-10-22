INSERT INTO campus (nombre, direccion_sede)
VALUES ('Campus de Prueba', 'Dirección de Prueba');

INSERT INTO programa (nombre)
VALUES ('Programa de Prueba');

INSERT INTO dependencia (nombre)
VALUES ('Dependencia de Prueba');

INSERT INTO area (nombre)
VALUES ('Área de Prueba');

INSERT INTO grupo (nombre)
VALUES ('Grupo de Prueba');

INSERT INTO tipo_espacio (nombre)
VALUES ('Aula');

INSERT INTO espacio (nombre, id_campus, id_tipo_espacio, capacidad, ubicacion)
SELECT
    'Aula de Prueba',
    campus.id_campus,
    tipo_espacio.id_tipo_espacio,
    30,
    'Campus de Prueba'
FROM campus
JOIN tipo_espacio ON tipo_espacio.nombre = 'Aula'
WHERE campus.nombre = 'Campus de Prueba'
  AND NOT EXISTS (
      SELECT 1
      FROM espacio
      WHERE espacio.nombre = 'Aula de Prueba'
        AND espacio.id_campus = campus.id_campus
  );

INSERT INTO categoria_documento (nombre, descripcion)
VALUES ('Documento de Prueba', 'Categoría utilizada para pruebas');