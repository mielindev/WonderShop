export class RegisterDTO {
  fullname: string;
  phone_number: string;
  password: string;
  retype_password: string;
  facebook_account_id: number;
  google_account_id: number;
  constructor(data: any) {
    this.fullname = data.fullname;
    this.phone_number = data.phone_number;
    this.password = data.password;
    this.retype_password = data.retype_password;
    this.facebook_account_id = data.facebook_account_id || 0;
    this.google_account_id = data.google_account_id || 0;
  }
}
