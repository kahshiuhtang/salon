# Salon Spring Boot Backend

### Dependencies

1. Java 22
2. Docker
3. Maven

### To Run:

```bash
cd scripts

docker compose up
```

Enter the shell of the MongoDB container that was created and run the following commands:

```bash
mongosh

use salondb
```

This will create the DB used by the Spring Boot project.

To enter a docker container, enter a similar command to:

```bash
docker exec -it CONTAINER_NAME sh
```

To see the name to use instead of CONTAINER_NAME, do the following command in the terminal and look for the name field:

```bash
docker ps
```
