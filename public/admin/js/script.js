const formStatus = document.querySelector("#form-status");

if (formStatus) {
  formStatus.addEventListener("click", function (e) {
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

const clearBtn = document.getElementById("clear-keyword");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    const url = new URL(window.location.href);

    // Xoá keyword khỏi URL và reload
    url.searchParams.delete("keyword");
    window.location.href = url.href;
  });
}
