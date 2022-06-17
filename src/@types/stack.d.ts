declare namespace ReactNavigation {
  export interface RootParamList {
    Home: undefined;
    CarDetails: undefined;
    Scheduling: undefined;
    SchedulingDetails: undefined;
    Confirmation: {
      title: string;
      message: string;
      nextScreenRoute: string;
    };
    MyCars: undefined;
    SignUpFirstStep: undefined;
    SignUpSecondStep: {
      user: {
        name: string;
        email: string;
        driverLicense: string
      }
    };
  }
}