export enum USER_ROLE {
    ADMIN = "admin",
    USER = "user",
}
export enum USER_PROVIDER {
    SYSTEM = "system",
    GOOGLE = "google",
}
export enum USER_GENDER {
    MALE = "male",
    FEMALE = "female",
}
export enum SEND_TYPE {
    CONFIRMEMAIL = "confirmEmail",
    RESETPASSWORD = "resetPassword",
}
export enum typeOtp {
    confirmEmail = 'confirmEmail',
    forgetPassword = 'forgetPassword'
}
export enum typeToken {
    access = 'access',
    refresh = "refresh"
}

//jobOpportunity
export  enum JOBLOCATION{
    ONSITE = "onsite",
    REMOTELY = "remotely",
    HYBRID = "hybrid",
}
export enum WORKINGTIME{
    PARTTIME = "part-time",
    FULLTIME = "full-time",
}
export enum SENIORITYLEVEL{
    FRESH = "fresh",
    JUNIOR = "junior",
    MIDLEVEL = "mid-level",
    SENIOR = "senior",
    TEAMLEAD = "team-lead",
    CTO = "cto",
}
//Application
export enum ApplicationStatus{
    PENDING = "pending",
    ACCEPTED = "accepted",
    VIEWED = "viewed",
    IN_CONSIDERATION = "in consideration",
    REJECTED = "rejected",
}