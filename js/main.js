"use strict";

// Pulling DOM ELements
//   Form Elements
const form = document.getElementById("mainForm");
const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("siteURL");
const submitBtn = document.getElementById("submitBtn");
//   Table
const tBody = document.getElementById("tableContent");
//   Modal
const modal = document.getElementById("modal");
const modalBtns = modal.querySelector(".btns");
const instructionsMssg = modal.querySelector(".instructions");
const deleteConfirmMssg = modal.querySelector(".delete-confirm");

// State Variable(s)
const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let delItem;

// Helper Function(s)
const displayBookmarks = function () {
  tBody.innerHTML = "";
  for (let [i, bookmark] of bookmarks.entries()) {
    tBody.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
          <td>${i + 1}</td>
          <td>${bookmark.bName}</td>
          <td>
            <a href="${bookmark.URL}" target="_blank" class="visit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2">
                  <circle cx="17" cy="15" r="1" />
                  <circle cx="16" cy="16" r="6" />
                  <path
                    d="M2 16S7 6 16 6s14 10 14 10s-5 10-14 10S2 16 2 16" />
                </g>
              </svg>
              Visit
            </a>
          </td>
          <td>
            <a href="#" class="delete" data-index = "${i}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M28 6H6l2 24h16l2-24H4m12 6v12m5-12l-1 12m-9-12l1 12m0-18l1-4h6l1 4" />
              </svg>
              Delete
            </a>
          </td>
        </tr> 
      `
    );
  }
};

// Event Handlers
//   Loading Screen
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.classList.add("loaded");

  // Remove From DOM Tree
  setTimeout(() => {
    loader.remove();
  }, 1100);
});

//   Crud - Create
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (form.checkValidity()) {
    const bookmark = {
      bName: siteName.value,
      URL: siteURL.value,
    };

    // Update, Store & Display
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setTimeout(() => {
      displayBookmarks();
    }, 200);

    // Clearing Input Fields
    siteName.blur();
    siteURL.blur();
    siteName.value = siteURL.value = "";
  }
  // Opening the Info Modal
  else {
    document.body.style.overflow = "hidden";
    modal.classList.add("appear");
    modal.querySelector(".instructions").classList.add("appear");
  }
});

//   cruD - Delete
tBody.addEventListener("click", (e) => {
  // Event Delegation
  const del = e.target.closest(".delete");

  // Guard Clause
  if (!del) return;

  // Show Delete-Confirmation Modal
  e.preventDefault();
  document.body.style.overflow = "hidden";
  modal.classList.add("appear");
  modal.querySelector(".delete-confirm").classList.add("appear");

  delItem = del;
});
modalBtns.lastElementChild.addEventListener("click", () => {
  // Update, Store & Display
  bookmarks.splice(delItem.dataset.index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  setTimeout(() => {
    displayBookmarks();
  }, 200);

  // Close the Modal
  deleteConfirmMssg.classList.remove("appear");
  modal.classList.remove("appear");
  document.body.style.overflow = "visible";
});

// Animation on Updating the Table
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes.length) return;

    tBody.style.opacity = 0;

    setTimeout(() => {
      tBody.style.opacity = 1;
    }, 400);
  });
});

// CLosing the Modal
//   Clicking the Dark Overlay
modal.addEventListener("click", (e) => {
  if (e.target.closest(".message")) return;

  instructionsMssg.classList.remove("appear");
  deleteConfirmMssg.classList.remove("appear");
  modal.classList.remove("appear");
  document.body.style.overflow = "visible";
});
//   X Button
modal.querySelector("#closeModalBtn").addEventListener("click", () => {
  instructionsMssg.classList.remove("appear");
  deleteConfirmMssg.classList.remove("appear");
  modal.classList.remove("appear");
  document.body.style.overflow = "visible";
});
//   Delete Confirmation "No" Button
modalBtns.firstElementChild.addEventListener("click", () => {
  deleteConfirmMssg.classList.remove("appear");
  modal.classList.remove("appear");
  document.body.style.overflow = "visible";
});

// Init
displayBookmarks();
observer.observe(tBody, { childList: true });
