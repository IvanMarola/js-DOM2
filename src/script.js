const gallery = document.getElementById("gallery");
const statusText = document.getElementById("status-text");

const loadBtn = document.getElementById("load-btn");
const reverseBtn = document.getElementById("reverse-btn");
const deleteBtn = document.getElementById("delete-btn");
const clearBtn = document.getElementById("clear-btn");

let page = 1;
const countPerRequest = 4;

function showMessage(msg) {
  statusText.textContent = msg;
}

function buildCard(photo) {
  const card = document.createElement("div");
  card.className = "card";

  const photoUrl = `https://picsum.photos/id/${photo.id}/450/300`;

  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${photoUrl}" alt="${photo.author}" loading="lazy">
    </div>
    <div class="card-body">
      <span class="card-author" title="${photo.author}">${photo.author}</span>
      <span class="card-tag">#${photo.id}</span>
    </div>
  `;

  return card;
}

async function loadImages() {
  loadBtn.disabled = true;
  showMessage("Завантаження картинок...");

  try {
    const url = `https://picsum.photos/v2/list?page=${page}&limit=${countPerRequest}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Помилка: ${response.status}`);
    }

    const photos = await response.json();

    if (photos.length === 0) {
      showMessage("Більше фотографій немає.");
      return;
    }

    photos.forEach(photo => {
      const cardElement = buildCard(photo);
      gallery.appendChild(cardElement);
    });

    showMessage(`Додано 4 фото (сторінка ${page}). Разом у галереї: ${gallery.children.length}`);
  } catch (err) {
    console.error("Не вдалося виконати запит:", err);
    showMessage("Виникла помилка під час завантаження. Спробуйте ще раз.");
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", () => {
  page++;
  loadImages();
});

reverseBtn.addEventListener("click", () => {
  const cards = Array.from(gallery.children);

  if (cards.length < 2) {
    showMessage("Потрібно хоча б 2 картинки для перевертання.");
    return;
  }

  cards.reverse().forEach(card => {
    gallery.appendChild(card);
  });

  showMessage("Галерею перевернуто навпаки.");
});

deleteBtn.addEventListener("click", () => {
  const lastCard = gallery.lastElementChild;

  if (lastCard) {
    lastCard.remove();
    showMessage(`Останнє фото видалено. Залишилось: ${gallery.children.length}`);
  } else {
    showMessage("У галереї немає картинок для видалення.");
  }
});

clearBtn.addEventListener("click", () => {
  if (gallery.children.length === 0) {
    showMessage("Галерея вже порожня.");
    return;
  }

  gallery.innerHTML = "";
  showMessage("Галерею повністю очищено.");
});

document.addEventListener("DOMContentLoaded", () => {
  loadImages();
});