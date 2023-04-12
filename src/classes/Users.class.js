class Users {
  getAge(date) {
    const userDate = date.slice(0, 10).split("-");
    const year = Number(userDate[0]);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    return age;
  }

  getBirthday(date) {
    const userDate = date.slice(0, 10).split("-");
    const birthday = `${userDate[2]}/${userDate[1]}`;
    return birthday;
  }
}

export default Users;
