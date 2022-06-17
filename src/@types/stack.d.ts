declare namespace ReactNavigation {
  export interface RootParamList {
    Home: undefined;
    CarDetails: undefined;
    Scheduling: undefined;
    SchedulingDetails: undefined;
    SchedulingComplete: undefined;
    MyCars: undefined;
    SignUpFirstStep: undefined;
    SignUpSecondStep: { user: { name: string; email: string; driverLicense: string } };
  }
}