export interface UserTrackingById {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  password: string;
  permission: string;
  userTrackingById: [
    {
      lat: string;
      lng: string;
    }
  ];
}
export interface UserByLocation {
  lat: string;
  lng: string;
  userByLocation: [
    {
      id: number;
      firstname: string;
      lastname: string;
      gender: string;
      email: string;
      password: string;
      permission: string;
    }
  ];
}
export interface ResponseType_RegisterUser {
  insert_user: {
    returning: [
      {
        id: string;
      }
    ];
  };
}
export interface ResponseType_LoginUser {
  user: [
    {
      id: string;
      password: string;
      permission: string;
    }
  ];
}

export interface ResponseType_InsertLocation {
  insert_user_tracking: {
    returning: [
      {
        id: number;
        lat: string;
        ing: string;
      }
    ];
  };
}
export interface ResponseType_UpdateLocation {
  update_user_tracking: {
    affected_rows: number;
    returning: [
      {
        id: number;
        lat: string;
        ing: string;
      }
    ];
  };
}

export interface LocationType {
  id: number;
  lat: string;
  ing: string;
}
