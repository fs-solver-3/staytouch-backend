import { Request, Response } from "express";
import { gql } from "graphql-request";
import { client } from "./client";
import { generateJWT } from "./jwt";
import {
  ResponseType_RegisterUser,
  ResponseType_LoginUser,
  ResponseType_InsertLocation,
  ResponseType_UpdateLocation,
  UserTrackingById,
} from "./type";

const bcrypt = require("bcrypt");

export async function authRegiser(req: Request, res: Response) {
  const { firstname, lastname, gender, email, password, permission, lat, lng } =
    req.body as Record<string, string>;
  console.log({
    firstname,
    lastname,
    gender,
    email,
    password,
    permission,
    lat,
    lng,
  });
  const data: ResponseType_RegisterUser = await client.request(
    gql`
      mutation registerUser($user: [user_insert_input!]!) {
        insert_user(objects: $user) {
          affected_rows
          returning {
            id
          }
        }
      }
    `,
    {
      user: [
        {
          firstname,
          lastname,
          gender,
          email,
          password: await bcrypt.hash(password, 10),
          permission,
        },
      ],
    }
  );
  console.log(JSON.stringify(data));
  const id = data.insert_user.returning[0].id;
  const latN = parseFloat(lat);
  const lngN = parseFloat(lng);
  console.log({ id });
  const location_data: ResponseType_InsertLocation = await client.request(
    gql`
      mutation insertLocation($user_tracking: [user_tracking_insert_input!]!) {
        insert_user_tracking(objects: $user_tracking) {
          returning {
            user_id
            lat
            lng
          }
        }
      }
    `,
    {
      user_tracking: [
        {
          user_id: id,
          lat: latN,
          lng: lngN,
        },
      ],
    }
  );
  res.send({
    token: generateJWT({
      defaultRole: permission,
      allowedRoles: ["admin", "user"],
      otherClaims: {
        "X-Hasura-User-Id": id.toString(),
      },
    }),
    location: location_data.insert_user_tracking.returning[0],
  });
}

export async function authLogin(req: Request, res: Response) {
  const { email, password } = req.body as Record<string, string>;

  const data: ResponseType_LoginUser = await client.request(
    gql`
      query getUserByEmail($email: String!) {
        user(where: { email: { _eq: $email } }) {
          id
          password
          permission
        }
      }
    `,
    {
      email,
    }
  );
  console.log({ data });
  // Since we filtered on a non-primary key we got an array back
  const user = data.user[0];

  if (!user) {
    res.sendStatus(401);
    return;
  }
  console.log({ user });
  // Check if password matches the hashed version
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const id = user.id.toString();
    res.send({
      token: generateJWT({
        defaultRole: user.permission,
        allowedRoles: ["admin", "user"],
        otherClaims: {
          "X-Hasura-User-Id": id,
        },
      }),
    });
  } else {
    res.sendStatus(401);
  }
}

export async function updateLocation(req: Request, res: Response) {
  const { user_id, lat, lng } = req.body as Record<string, string>;
  console.log({ user_id, lat, lng });
  const latN = parseFloat(lat);
  const lngN = parseFloat(lng);
  const location_data: ResponseType_UpdateLocation = await client.request(
    gql`
      mutation updateLocation($user_id: Int, $lat: numeric, $lng: numeric) {
        update_user_tracking(
          where: { user_id: { _eq: $user_id } }
          _set: { lat: $lat, lng: $lng }
        ) {
          affected_rows
          returning {
            user_id
            lat
            lng
          }
        }
      }
    `,
    {
      user_id,
      lat: latN,
      lng: lngN,
    }
  );
  console.log(location_data);
  if (location_data.update_user_tracking.affected_rows !== 0) {
    res.send({
      message: "Location updated successfully!",
      location: location_data.update_user_tracking.returning[0],
    });
  } else {
    res.send({
      message: "Unfortnately, update fails or non-exist user.",
    });
  }
}

export async function pagination(req: Request, res: Response) {
  const { rowsPerPage, page } = req.query as Record<string, string>;
  console.log({ rowsPerPage, page });
  const rowsPerPageN = parseInt(rowsPerPage);
  const pageN = parseInt(page);
  const offsetRows = pageN <= 1 ? 0 : (pageN - 1) * rowsPerPageN;
  const users: UserTrackingById = await client.request(
    gql`
      query users($rowsPerPageN: Int, $offsetRows: Int) {
        user(limit: $rowsPerPageN, offset: $offsetRows) {
          id
          firstname
          lastname
          userTrackingById {
            lat
            lng
          }
        }
      }
    `,
    {
      rowsPerPageN,
      offsetRows,
    }
  );
  res.send({
    data: users,
  });
}
export async function geoAreaUsers(req: Request, res: Response) {
  const { center_lat, center_lng, radius } = req.query as Record<
    string,
    string
  >;
  const center_latN = parseFloat(center_lat);
  const center_lngN = parseFloat(center_lng);
  const radiusN = parseFloat(radius);
  const low_lat = (center_latN - radiusN).toString();
  const high_lat = (center_latN + radiusN).toString();
  const low_lng = (center_lngN - radiusN).toString();
  const high_lng = (center_lngN + radiusN).toString();
  console.log({ low_lat, high_lat, low_lng, high_lng });
  const users: UserTrackingById = await client.request(
    gql`
      query users(
        $low_lat: numeric
        $high_lat: numeric
        $low_lng: numeric
        $high_lng: numeric
      ) {
        user_tracking(
          where: {
            _and: [
              { lat: { _gte: $low_lat } }
              { lat: { _lte: $high_lat } }
              { lng: { _gte: $low_lng } }
              { lng: { _lte: $high_lng } }
            ]
          }
        ) {
          lat
          lng
          userByLocation {
            id
            firstname
            lastname
            gender
            email
            password
            permission
          }
        }
      }
    `,
    {
      low_lat,
      high_lat,
      low_lng,
      high_lng,
    }
  );
  res.send({
    data: users,
  });
}
