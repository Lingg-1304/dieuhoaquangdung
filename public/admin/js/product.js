// change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");

      let changeStatus = statusCurrent == "active" ? "inactive" : "active";

      const id = button.getAttribute("data-id");
    });
  });
}
// end change status

// Notifications
document.addEventListener("DOMContentLoaded", () => {
  const alerts = document.querySelectorAll(".alert.alert-dismissible");
  alerts.forEach((alert) => {
    setTimeout(() => {
      // Trigger Bootstrap's alert close method
      $(alert).alert("close");
    }, 1000); // 2 seconds
  });
});
