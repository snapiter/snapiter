export type Trackable = {
    name: string;
    websiteTitle: string;
    website: string;
    hostName: string;
    // icon: string; //@TODO
  };

//   createdAt: new Date(raw.createdAt),
//   lastReportedAt: new Date(raw.lastReportedAt),

  export type Device = {
    trackableId: string;
    deviceId: string;
    createdAt: Date;
    lastReportedAt: Date;
  };
  