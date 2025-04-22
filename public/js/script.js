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
