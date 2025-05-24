// Thanh search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  console.log(url);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }
    window.location.href = url.href;
  });
}

// Clear search
const clearBtn = document.getElementById("clear-keyword");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    const url = new URL(window.location.href);

    // Xoá keyword khỏi URL và reload
    url.searchParams.delete("keyword");
    window.location.href = url.href;
  });
}

// Thanh sắp xếp sản phẩm
document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.querySelector("#sort");

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortValue = this.value;
      const url = new URL(window.location.href);

      // Nếu là "-- Chọn hãng điều hòa --" (giá trị rỗng), thì xóa truy vấn brand
      if (!sortValue) {
        url.searchParams.delete("sort");
      } else {
        url.searchParams.set("sort", sortValue);
      }

      // Reset phân trang nếu có
      if (url.searchParams.has("page")) {
        url.searchParams.set("page", "1");
      }

      // Chuyển trang
      window.location.href = url.toString();
    });
  }
});

// Thanh chọn thương hiệu
document.addEventListener("DOMContentLoaded", function () {
  // Tìm phần tử select cho thương hiệu
  const brandSelect = document.querySelector("#brand");

  if (brandSelect) {
    brandSelect.addEventListener("change", function () {
      const brandValue = this.value;
      const url = new URL(window.location.href);

      // Cập nhật hoặc xóa tham số "brand"
      if (brandValue) {
        url.searchParams.set("brand", brandValue);
      } else {
        url.searchParams.delete("brand");
      }

      // Reset phân trang về trang 1 khi thay đổi thương hiệu
      url.searchParams.set("page", "1");

      // Chuyển hướng tới URL mới
      window.location.href = url.toString();
    });
  }
});

// Thanh phân trang #form-page
document.addEventListener("DOMContentLoaded", function () {
  // Tìm tất cả nút phân trang
  const pageLinks = document.querySelectorAll("[data-page]");

  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Lấy trang từ data-page
      const targetPage = this.getAttribute("data-page");
      const url = new URL(window.location.href);

      // Lấy các tham số truy vấn hiện tại và cập nhật page
      if (targetPage) {
        url.searchParams.set("page", targetPage);
      }

      // Chuyển trang với URL đã cập nhật
      window.location.href = url.toString();
    });
  });
});

function addToCart(slug) {
  fetch(`/products/${slug}?action=add-to-cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Đã thêm vào giỏ hàng",
          text: "Sản phẩm đã được thêm vào giỏ hàng của bạn.",
          showCancelButton: true,
          confirmButtonText: "Xem giỏ hàng",
          cancelButtonText: "Tiếp tục mua sắm",
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.href = "/cart";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Không thêm được vào giỏ",
          text: result.message || "Vui lòng thử lại sau.",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.",
      });
    });
}

function generateOrderCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "DH";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
//button.btn.btn-primary.btn-lg.flex-fill(type="button", data-slug=product.slug, onclick="addToCart(this)") Thêm vào giỏ hàng

function deleteOrder(orderId, status) {
  if (status === "active") {
    Swal.fire({
      icon: "error",
      title: "Không thể xoá đơn hàng",
      text: "Đơn hàng đã được xác nhận, không thể xoá.",
    });
    return;
  }
  Swal.fire({
    title: "Xác nhận",
    text: "Bạn có chắc chắn muốn xóa đơn hàng không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/cart/order/remove`, {
        method: "POST",
        body: JSON.stringify({ orderId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire(
              "Đã xoá!",
              data.message || "Đơn hàng đã được xoá.",
              "success"
            ).then(() => {
              window.location.reload(); // hoặc window.location.href = '/don-hang'
            });
          } else {
            Swal.fire(
              "Lỗi",
              data.message || "Không thể xoá đơn hàng.",
              "error"
            );
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối đến máy chủ.", "error");
        });
    }
  });
}

function editOrder(orderId, name, email, address, phone, note) {
  Swal.fire({
    title: "Chỉnh sửa đơn hàng",
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
        <label for="name">👤 Họ và tên</label>
        <input type="text" id="name" class="swal2-input" placeholder="Họ và tên" value="${
          name || ""
        }" style="margin: 0">

        <label for="email">📧 Email</label>
        <input type="email" id="email" class="swal2-input" placeholder="Email" value="${
          email || ""
        }" style="margin: 0">

        <label for="address">🏠 Địa chỉ</label>
        <input type="text" id="address" class="swal2-input" placeholder="Địa chỉ" value="${
          address || ""
        }" style="margin: 0">

        <label for="phone">📞 Số điện thoại</label>
        <input type="text" id="phone" class="swal2-input" placeholder="Số điện thoại" value="${
          phone || ""
        }" style="margin: 0">

        <label for="note">📝 Ghi chú</label>
        <textarea id="note" class="swal2-textarea" placeholder="Ghi chú (nếu có)" rows="3" style="margin: 0">${
          note || ""
        }</textarea>
      </div>
    `,

    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const address = document.getElementById("address").value;
      const phone = document.getElementById("phone").value;
      const note = document.getElementById("note").value;

      return { name, email, address, phone, note };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/cart/order/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, ...result.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire(
              "Thành công",
              data.message || "Đơn hàng đã được cập nhật.",
              "success"
            ).then(() => window.location.reload());
          } else {
            Swal.fire(
              "Lỗi",
              data.message || "Không thể cập nhật đơn hàng.",
              "error"
            );
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối đến máy chủ.", "error");
        });
    }
  });
}

// Định dạng tiền tệ VNĐ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Xóa sản phẩm
function removeFromCart(slug) {
  // Gửi yêu cầu xóa đến server
  Swal.fire({
    title: "Xác nhận",
    text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/cart/remove/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire(
              "Đã xóa!",
              data.message || "Sản phẩm đã được xóa.",
              "success"
            ).then(() => window.location.reload());
          } else {
            Swal.fire(
              "Lỗi",
              data.message || "Không thể xóa sản phẩm.",
              "error"
            );
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối đến máy chủ.", "error");
        });
    }
  });
}

// function getSelectedItems() {
//   const checkboxes = document.querySelectorAll(".form-selectedItems:checked");
//   const items = [];

//   checkboxes.forEach((checkbox, index) => {
//     const productRow = checkbox.closest(".row");
//     const title = productRow.querySelector("h5").innerText;
//     const priceText = productRow
//       .querySelector("small")
//       .innerText.replace(/[^\d]/g, "");
//     const quantity = productRow.querySelector(".form-quantityItems").value;
//     const price = parseInt(priceText) || 0;

//     items.push({
//       title,
//       price,
//       quantity,
//       total: price * quantity,
//     });
//   });

//   return items;
// }
