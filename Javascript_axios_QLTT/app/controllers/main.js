getUsers();
// function getUsers request API để lấy danh sách sản phẩm
function getUsers(searchTerm) {
  apiGetUser(searchTerm)
    .then((response) => {
      console.log("API Users:", response.data);
      let users = response.data.map((user) => {
        return new User(
          user.id,
          user.account,
          user.name,
          user.password,
          user.email,
          user.image,
          user.type,
          user.language,
          user.description
        );
      });

      display(users);
    })
    // Duyệt qua danh sách sản phẩm và tạo  các đối tượng user

    .catch((error) => {
      console.log(error);
    });
}
// addUser request API để thêm sản phẩm
function addUser(user) {
  // Dùng object user để request API thêm sản phẩm
  apiAddUser(user)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}
function deleteUser(userId) {
  apiDeleteUser(userId)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}
function updateUser(userId, user) {
  apiUpdateUser(userId, user)
    .then(() => {
      getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}
function display(users) {
  let output = users.reduce((result, user, index) => {
    return (
      result +
      `
      <tr>
      <td>${index + 1}</td>
      <td>${user.account}</td>
      <td>${user.password}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.language}</td>
      <td>${user.type}</td>    
      <td>
      <button class="btn btn-success" data-id="${
        user.id
      }" data-type="edit" data-toggle="modal" data-target="#myModal">Sửa</button>
      <button class="btn btn-danger" data-id="${
        user.id
      }" data-type="delete">Xóa</button>
      </td>
      </tr>  `
    );
  }, "");
  dom("#tblDanhSachNguoiDung").innerHTML = output;
}
function dom(selector) {
  return document.querySelector(selector);
}
function resetForm() {
  dom("#TaiKhoan").value = "";
  dom("#HoTen").value = "";
  dom("#MatKhau").value = "";
  dom("#Email").value = "";
  dom("#HinhAnh").value = "";
  dom("#loaiNguoiDung").value = "";
  dom("#loaiNgonNgu").value = "";
  dom("#MoTa").value = "";
}
//=====================DOM =====================

dom("#btnThemNguoiDung").addEventListener("click", () => {
  dom(".modal-title").innerHTML = "Thêm Sản Phẩm";
  dom(".modal-footer").innerHTML = `
  <button class = "btn btn-secondary" data-dismiss="modal">Hủy</button>
  <button class = "btn btn-primary" data-type ="add">Thêm</button>
  `;
  resetForm();
});
dom(".modal-footer").addEventListener("click", (evt) => {
  console.log(evt.target.innerHTML === "Thêm");
  let elementType = evt.target.getAttribute("data-type");

  // Dom các inputs để lấy dữ liệu data
  let id = dom("#maUser").value;
  let account = dom("#TaiKhoan").value;
  let name = dom("#HoTen").value;
  let password = dom("#MatKhau").value;
  let email = dom("#Email").value;
  let image = dom("#HinhAnh").value;
  let type = dom("#loaiNguoiDung").value;
  let language = dom("#loaiNgonNgu").value;
  let description = dom("#MoTa").value;
  let isValid = validateForm();
  if (!isValid) {
    return;
  }
  // Tạo object từ lớp đối tượng user
  let user = new User(
    null,
    account,
    name,
    password,
    email,
    image,
    type,
    language,
    description
  );
  if (elementType === "add") {
    addUser(user);
  } else if (elementType === "update") {
    updateUser(id, user);
    let isValid = validateForm();
    if (!isValid) {
      return;
    }
  }
});
dom("#tblDanhSachNguoiDung").addEventListener("click", (evt) => {
  let id = evt.target.getAttribute("data-id");
  let elType = evt.target.getAttribute("data-type");
  if (elType === "delete") {
    deleteUser(id);
  } else if (elType === "edit") {
    dom(".modal-title").innerHTML = "Cập nhật sản phẩm";
    dom(".modal-footer").innerHTML = `
    <button class = "btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class = "btn btn-primary" data-type ="update">Cập Nhật</button>
    `;
    apiGetUserById(id)
      .then((response) => {
        let user = response.data;
        dom("#maUser").value = user.id; // hidden input
        dom("#TaiKhoan").value = user.account;
        dom("#HoTen").value = user.name;
        dom("#MatKhau").value = user.password;
        dom("#Email").value = user.email;
        dom("#HinhAnh").value = user.image;
        dom("#loaiNguoiDung").value = user.type;
        dom("#loaiNgonNgu").value = user.language;
        dom("#MoTa").value = user.description;
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

//Search Keydown
dom("#search").addEventListener("keydown", (evt) => {
  console.log(evt.key);
  if (evt.key === "Enter") return;
  getUsers(evt.target.value);
});
// ==================Validation=============
function validateTK() {
  let account = dom("#TaiKhoan").value;
  let spanEl = dom("#spanTK");
  apiGetUser()
    .then((response) => {
      let duplicateTK = response.data.filter((user) => {
        return user.account === account;
      });
      if (duplicateTK.length > 0) {
        spanEl.innerHTML = "Tài khoản này đã tồn tại";
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (!account) {
    spanEl.innerHTML = "Tài Khoản không được để trống";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validateName() {
  let name = dom("#HoTen").value;
  let spanEl = dom("#spanName");
  apiGetUser();
  if (!name) {
    spanEl.innerHTML = "Họ Tên không được để trống";
    return false;
  }

  let regex = /^[A-Za-z]+$/;
  if (!regex.test(name)) {
    spanEl.innerHTML = "Tên không chứa số và ký tự đặc biệt";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validatePass() {
  let password = dom("#MatKhau").value;
  let spanEl = dom("#spanPass");
  if (!password) {
    spanEl.innerHTML = "Mật Khẩu không được để trống";
    return false;
  }
  let regex = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{6,8}$/;
  if (!regex.test(password)) {
    spanEl.innerHTML =
      "Mật khẩu có ít nhất 1 ký tự hoa, 1 ký tự đặc biệt, 1 ký tự số, độ dài 6-8";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validateEmail() {
  let email = dom("#Email").value;
  let spanEl = dom("#spanEmail");
  if (!email) {
    spanEl.innerHTML = "Email không được để trống";
    return false;
  }
  let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!regex.test(email)) {
    spanEl.innerHTML = "Email không đúng định dạng";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validateImage() {
  let image = dom("#HinhAnh").value;
  let spanEl = dom("#spanImage");
  if (!image) {
    spanEl.innerHTML = "Hình ảnh không được để trống";
    return false;
  }
}

function validateType() {
  let type = dom("#loaiNguoiDung").value;
  let spanEl = dom("#spanType");
  if (!type) {
    spanEl.innerHTML = "Loại người dùng không được để trống";
    return false;
  } else if (type === "0") {
    spanEl.innerHTML = "Hãy chọn loại người dùng";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validateLanguage() {
  let language = dom("#loaiNgonNgu").value;
  let spanEl = dom("#spanLanguage");
  if (!language) {
    spanEl.innerHTML = "Loại ngôn ngữ không được để trống";
    return false;
  } else if (language === "0") {
    spanEl.innerHTML = "Hãy chọn ngôn ngữ";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validateMoTa() {
  let description = dom("#MoTa").value;
  let spanEl = dom("#spanMoTa");
  if (!description) {
    spanEl.innerHTML = "Mô Tả không được để trống";
    return false;
  } else if (description.length > 60) {
    spanEl.innerHTML = "Mô Tả không được quá 60 ký tự";
    return false;
  } else {
    spanEl.innerHTML = "";
    return true;
  }
}
function validateForm() {
  let isValid = true;
  isValid =
    validateTK() &
    validateName() &
    validatePass() &
    validateEmail() &
    validateImage() &
    validateType() &
    validateLanguage() &
    validateMoTa();
  if (!isValid) {
    alert("Form không hợp lý");
    return false;
  }
  return true;
}
