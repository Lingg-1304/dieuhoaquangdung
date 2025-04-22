// Status
const formStatus = document.querySelector("#form-status");
if (formStatus) {
  formStatus.addEventListener("click", function (e) {
    // console.log(formStatus);
    if (e.target.tagName === "BUTTON" && e.target.name === "status") {
      e.preventDefault();

      const statusValue = e.target.value;
      const url = new URL(window.location.href);

      // Giữ lại từ khóa tìm kiếm nếu đang có
      const keywordInput = document.querySelector(
        "#form-search input[name='keyword']"
      );
      if (keywordInput && keywordInput.value) {
        url.searchParams.set("keyword", keywordInput.value);
      }

      // Gán hoặc xóa status theo nút được bấm
      if (statusValue) {
        url.searchParams.set("status", statusValue);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    }
  });
}

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
