# StayTouch-Backend

## Install Dependencies

- Build the image for backend

```bash
    docker build -t staytouch-backend:v1 .
```

- Run the container with env file
  Create env file and change it like sample file

```bash
    docker-compose --env-file src/.env  up -d
```

## APIs test

Test the APIs with postman or curl

### 1. Auth/Register(POST)

`http://localhost:3000/auth/register`

```json
Header: {
"Content-Type":"application/json"
}

Body: {
"firstname": "ssfdfd15",
"lastname": "hfgasfsd15",
"gender": "male",
"email":"gfhgf15@outlook.com",
"password": "dagfdgafd15",
"permission":"admin",
"lat":"12.5",
"lng": "35.5"
}
```

- Return with jwt token

### 2. Auth/Login(POST)

`http://localhost:3000/auth/login`

```json
Header: {
"Content-Type":"application/json"
}

Body: {
"email":"gfhgf15@outlook.com",
"password": "dagfdgafd15"
}
```

- Return with jwt token

### 3. Update Location(POST)

`http://localhost:3000/update-location`

```json
Header: {
"Content-Type":"application/json"
}

Body: {
"user_id": 30,
"lat":"12.345",
"lng": "34.567"
}
```

- Return with message and location

### 4. Pagination(GET)

`http://localhost:3000/pagination?rowsPerPage=5&page=3`

```json
Header: {
"Content-Type":"application/json"
}

Params: {
"rowsPerPage": 5,
"page": 3
}
```

- Return with user list

### 5. Geo Area User(GET)

`http://localhost:3000/geo-area-users?center_lat=11&center_lng=34&radius=0.5`

```json
Header: {
"Content-Type":"application/json"
}

Params: {
"center_lat": 11,
"center_lng": 34,
"radius": 0.5
}
```

- Return with user list
- I chaged the user structure that is returned. <br />
  Like `UserByLocation` type in `type.ts` file <br />
  Use the relationshipe feature in Hasura so it needs to filter the users in `user_tracking` table to detect the geo area users
