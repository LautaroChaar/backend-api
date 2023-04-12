class UserDTO {
  constructor(data, info) {
    this.fullName = data.name + " " + data.lastname;
    this.adress = data.adress;
    this.phone = data.phone;
    this.email = data.username;
    this.image = data.avatar;

    for (const [key, value] of Object.entries(info)) {
      this[key] = value;
    }
  }
}

export default UserDTO;
