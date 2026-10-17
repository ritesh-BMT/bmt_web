// ===================== Landing website content =====================

const CATEGORIES = [
  { id: 1, name: "HD Cleaning", image: "assets/images/cat_hd.png" },
  { id: 4, name: "Plumbing", image: "assets/images/cat_plumbing.png" },
  { id: 3, name: "Electrical", image: "assets/images/cat_electrical.png" },
  { id: 5, name: "Carpentry", image: "assets/images/cat_carpentry.png" },
  { id: 2, name: "Gardening", image: "assets/images/cat_gardening.png" },
  { id: 9, name: "Car & Bike", image: "assets/images/cat_car.png" },
  { id: 13, name: "Vastu Consult", image: "assets/images/cat_vastu.png" },
  { id: 17, name: "Interior Design", image: "assets/images/cat_interior.png" },
  { id: 14, name: "Pest Control", image: "assets/images/cat_pest.png" },
  { id: 12, name: "Express Delivery", image: "assets/images/cat_delivery.png" },
  { id: 10, name: "Chef-a-Home", image: "assets/images/cat_chef.png" },
  { id: 0, name: "Store cleaning", image: "assets/images/cat_store.png" },
];

const SHORTCUTS = [
  { id: 1, name: "Book Deep Cleaning", prompt: "Home needs a proper reset?", icon: "assets/images/ic_mop.svg" },
  { id: 3, name: "Book an Electrician", prompt: "Fan stopped? Switch acting up?", icon: "assets/images/ic_bolt.svg" },
  { id: 4, name: "Book a Plumber", prompt: "Still hearing that drip?", icon: "assets/images/ic_plumbing.svg" },
  { id: 5, name: "Book a Carpenter", prompt: "Door scraping? Hinge loose?", icon: "assets/images/ic_construction.svg" },
  { id: 14, name: "Book Pest Control", prompt: "One uninvited guest too many?", icon: "assets/images/ic_pest.svg" },
  { id: 2, name: "Book a Gardener", prompt: "Plants looking a little neglected?", icon: "assets/images/ic_plant.svg" },
];

const ASSURANCE = [
  { icon: "assets/svg/event_available.svg", label: "30 days service warranty*" },
  { icon: "assets/svg/currency_rupee.svg", label: "Transparent pricing" },
  { icon: "assets/svg/lock_reset.svg", label: "Secure booking process" },
  { icon: "assets/svg/family_star.svg", label: "100% task satisfaction" },
  { icon: "assets/svg/local_police.svg", label: "Task insurance*", gap: 8 },
  { icon: "assets/svg/sensor_occupied.svg", label: "Verified by Securitas" },
];

const JOURNEY = [
  { icon: "assets/svg/whats_next_taskman_arrives.svg", title: "Taskman arrives", body: "Your assigned Taskman arrives within the confirmed service window." },
  { icon: "assets/svg/whats_next_issue_checked.svg", title: "Issue & scope are checked", body: "The Taskman reviews the requirement and confirms what can be addressed." },
  { icon: "assets/svg/whats_next_you_approve.svg", title: "You approve", body: "Any additional scope, time, material or charge is discussed before work continues." },
  { icon: "assets/svg/whats_next_service_begins.svg", title: "Your 1-hour service begins", body: "The Taskman carries out the approved eligible electrical work within the booked hour." },
  { icon: "assets/svg/whats_next_you_review.svg", title: "You review", body: "Check the completed work and raise any concern before closure." },
  { icon: "assets/svg/whats_next_task_closes.svg", title: "Task closes", body: "Confirm completion through the BMT closure process and receive your service record." },
];

const FAQS = [
  { q: "What kind of services can I book with BMT?", a: "You can book a wide range of home and office services, including cleaning, electrical, plumbing, carpentry, pest control, gardening, car care, delivery assistance and more." },
  { q: "How do I book a service?", a: "Simply choose the service you need, select a convenient slot, add your address and confirm your booking. We’ll take it from there." },
  { q: "Who will be coming to my home or office?", a: "Your service will be handled by a trained and background-verified BMT Taskman assigned to the service category you have booked." },
  { q: "Will I know the price before the service starts?", a: "Yes. BMT follows transparent service pricing. If your task requires additional work, materials or spare parts, these will be discussed with you before proceeding." },
  { q: "Can I book a service for my parents, office or another property?", a: "Certainly. You can book BMT for another person or location by providing the correct service address and contact details while booking." },
  { q: "What if I’m not sure which service to select?", a: "That’s absolutely fine. Tell us what needs fixing, cleaning or attending to, and our team will help guide you to the most suitable service." },
  { q: "What happens if I need help after the service is completed?", a: "You can reach out to BMT support if anything needs attention after the visit. Warranty coverage may also apply depending on the service booked and its applicable terms." },
  { q: "What makes BMT different from booking a local service provider directly?", a: "With BMT, you get a more structured service experience with trained and verified Taskmen, transparent pricing, real-time tracking, OTP-controlled service and BMT support throughout the journey." },
];

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"];

const HOMEPAGE_API_URL = "https://jpjifftizbzffttvvdlo.supabase.co/functions/v1/get_homepage_data";
const COMMUNITY_POSTER_PREFIX = "bmt-community-poster:";
const communityPosterJobs = [];
let isProcessingCommunityPosters = false;
let communityCardObserver = null;
const communityCardVisibility = new WeakMap();

const LEAD_API_URL = HOMEPAGE_API_URL.replace(/\/get_homepage_data$/, "/submit_landing_lead");

// ===================== Render static sections =====================

function showHomepageError(containerId, className, messageText, error) {
  console.error(`Unable to load ${containerId}:`, error);
  const container = document.getElementById(containerId);
  const message = document.createElement("p");
  message.className = className;
  message.setAttribute("role", "status");
  message.textContent = messageText;

  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = containerId === "hub-strip" ? "hub-retry" : "carousel-retry";
  retry.textContent = "Try again";
  retry.addEventListener("click", loadHomepageContent);
  container.replaceChildren(message, retry);
}

function showHomepageBannerError(error) {
  showHomepageError(
    "home-banner-carousel",
    "carousel-status",
    "Offers are temporarily unavailable.",
    error
  );
}

function showCommunityHubError(error) {
  showHomepageError(
    "hub-strip",
    "hub-status",
    "Community videos are temporarily unavailable.",
    error
  );
}

function isHomepageItemAvailable(item, now) {
  if (item.is_active === false || item.soft_delete === true) return false;
  const startsAt = item.start_date ? Date.parse(item.start_date) : NaN;
  const endsAt = item.end_date ? Date.parse(item.end_date) : NaN;
  return (!Number.isFinite(startsAt) || startsAt <= now) &&
    (!Number.isFinite(endsAt) || endsAt >= now);
}

function normalizeHomepageImageUrl(value) {
  const imageUrl = new URL(value, window.location.href);
  if (
    imageUrl.pathname.includes("/storage/v1/render/image/") &&
    imageUrl.searchParams.has("width") &&
    !imageUrl.searchParams.has("height") &&
    !imageUrl.searchParams.has("resize")
  ) {
    imageUrl.searchParams.set("resize", "contain");
  }
  return imageUrl;
}

function renderHomepageBanners(items) {
  const carousel = document.getElementById("home-banner-carousel");
  if (items.length === 0) {
    showHomepageBannerError(new Error("No active homepage banners were returned."));
    return;
  }

  const cards = items.flatMap((banner) => {
    let imageUrl;
    try {
      imageUrl = normalizeHomepageImageUrl(banner.image_url);
    } catch (_) {
      return [];
    }
    if (!["https:", "http:"].includes(imageUrl.protocol)) return [];

    const label = [banner.title, banner.subtitle, banner.cta_text]
      .filter((value) => typeof value === "string" && value.trim())
      .join(". ");
    const card = document.createElement("button");
    card.type = "button";
    card.className = "promo-card api-banner";
    card.setAttribute("aria-label", label || "View featured service");

    const image = document.createElement("img");
    image.className = "promo-img";
    image.src = imageUrl.href;
    image.alt = "";
    image.loading = "lazy";
    card.append(image);
    card.addEventListener("click", () => openBookingModal());
    return [card];
  });

  if (cards.length === 0) {
    showHomepageBannerError(new Error("The homepage banners did not contain valid image URLs."));
    return;
  }

  const desktop = window.matchMedia("(min-width: 900px)").matches;
  carousel.replaceChildren(...cards);

  if (desktop && cards.length > 1) {
    let showingEnd = false;
    window.setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (!carousel.isConnected || maxScroll <= 0) return;
      showingEnd = !showingEnd;
      carousel.scrollTo({
        left: showingEnd ? maxScroll : 0,
        behavior: "smooth",
      });
    }, 4000);
  } else if (!desktop && cards.length > 1) {
    let currentIndex = 0;
    window.setInterval(() => {
      if (!carousel.isConnected || carousel.clientWidth === 0) return;
      const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const cardsPerView = Math.max(
        1,
        Math.floor((carousel.clientWidth + gap) / (cardWidth + gap))
      );
      const lastStartIndex = Math.max(0, cards.length - cardsPerView);
      currentIndex =
        currentIndex >= lastStartIndex
          ? 0
          : Math.min(currentIndex + cardsPerView, lastStartIndex);
      carousel.scrollTo({
        left: cards[currentIndex].offsetLeft - cards[0].offsetLeft,
        behavior: "smooth",
      });
    }, 4000);
  }
}

function renderCategories() {
  const grid = document.getElementById("cat-grid");
  const viewMoreButton = document.getElementById("view-more-btn");
  const viewMoreLabel = document.getElementById("view-more-label");
  const viewMoreArrow = document.getElementById("view-more-arrow");
  let expanded = false;

  grid.innerHTML = CATEGORIES
    .map(
      (c) => `
      <button class="cat-tile" data-cat-id="${c.id}" data-cat-name="${c.name}">
        <img src="${c.image}" alt="${c.name}" />
        <span>${c.name}</span>
      </button>`
    )
    .join("");

  grid.querySelectorAll(".cat-tile").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.catId);
      if (id === 0) openSpecialModal();
      else openBookingModal(id, btn.dataset.catName);
    });
  });

  viewMoreButton.addEventListener("click", () => {
    expanded = !expanded;
    grid.classList.toggle("is-expanded", expanded);
    viewMoreButton.setAttribute("aria-expanded", String(expanded));
    viewMoreLabel.textContent = expanded ? "View less" : "View more";
    viewMoreArrow.innerHTML = expanded ? "&#9652;" : "&#9662;";
  });
}

function renderShortcuts() {
  const grid = document.getElementById("shortcut-grid");
  grid.innerHTML = SHORTCUTS.map(
    (s) => `
    <button class="shortcut-tile" data-cat-id="${s.id}" data-cat-name="${s.name.replace(/^Book an? /, "")}">
      <div class="shortcut-top">
        <img src="${s.icon}" alt="" />
        <span>${s.prompt}</span>
      </div>
      <div class="shortcut-bottom">${s.name}</div>
    </button>`
  ).join("");
  grid.querySelectorAll(".shortcut-tile").forEach((btn) => {
    btn.addEventListener("click", () => openSpecialModal());
  });
}

function renderAssurance() {
  const item = (a) =>
    `<div class="assurance-item${a.gap === 8 ? " wide-gap" : ""}"><img src="${a.icon}" alt="" /><span>${a.label}</span></div>`;
  const left = ASSURANCE.filter((_, i) => i % 2 === 0).map(item).join("");
  const right = ASSURANCE.filter((_, i) => i % 2 === 1).map(item).join("");
  document.getElementById("assurance-box").innerHTML =
    `<div class="assurance-col">${left}</div><div class="assurance-col">${right}</div>`;
}

function renderJourney() {
  document.getElementById("journey-list").innerHTML = JOURNEY.map(
    (j) => `
    <div class="journey-step">
      <img src="${j.icon}" alt="" />
      <div><h4>${j.title}</h4><p>${j.body}</p></div>
    </div>`
  ).join("");
}

function loadVideoEvent(video, eventName, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Video ${eventName} timed out.`));
    }, timeoutMs);
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener(eventName, onSuccess);
      video.removeEventListener("error", onError);
    };
    const onSuccess = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Unable to load community video (${video.error?.code ?? "unknown"}).`));
    };
    video.addEventListener(eventName, onSuccess, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

async function extractCommunityPoster(videoUrl) {
  const source = document.createElement("video");
  source.crossOrigin = "anonymous";
  source.preload = "auto";
  source.muted = true;
  source.src = videoUrl;
  try {
    const metadata = loadVideoEvent(source, "loadedmetadata");
    source.load();
    await metadata;
    source.currentTime = Math.min(0.2, Math.max(0, source.duration / 10));
    await loadVideoEvent(source, "seeked");

    const width = Math.min(280, source.videoWidth);
    const height = Math.max(1, Math.round(width * source.videoHeight / source.videoWidth));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create community video poster.");
    context.drawImage(source, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.55);
  } finally {
    source.pause();
    source.removeAttribute("src");
    source.load();
  }
}

function queueCommunityPoster(videoUrl, video, thumbnailUrl) {
  if (thumbnailUrl) {
    video.poster = thumbnailUrl;
    return;
  }

  const cacheKey = `${COMMUNITY_POSTER_PREFIX}${videoUrl}`;
  try {
    const cachedPoster = localStorage.getItem(cacheKey);
    if (cachedPoster) {
      video.poster = cachedPoster;
      return;
    }
  } catch (error) {
    console.warn("Community poster cache is unavailable:", error);
  }

  communityPosterJobs.push(async () => {
    try {
      const poster = await extractCommunityPoster(videoUrl);
      try {
        localStorage.setItem(cacheKey, poster);
      } catch (error) {
        console.warn("Unable to cache community video poster:", error);
      }
      if (video.isConnected) video.poster = poster;
    } catch (error) {
      console.warn("Unable to create community video poster:", error);
    }
  });

  if (!isProcessingCommunityPosters) {
    void processCommunityPosterQueue();
  }
}

async function processCommunityPosterQueue() {
  isProcessingCommunityPosters = true;
  try {
    while (communityPosterJobs.length > 0) {
      await communityPosterJobs.shift()();
    }
  } finally {
    isProcessingCommunityPosters = false;
    if (communityPosterJobs.length > 0) {
      void processCommunityPosterQueue();
    }
  }
}

function openCommunityVideoPreview(videoUrl, title, posterUrl) {
  const dialog = document.getElementById("hub-preview-dialog");
  const video = document.getElementById("hub-preview-video");
  const error = document.getElementById("hub-preview-error");
  document.getElementById("hub-preview-title").textContent = title || "Community video";
  error.textContent = "";
  document.querySelectorAll("#hub-strip video").forEach((cardVideo) => cardVideo.pause());
  video.poster = posterUrl || "";
  video.src = videoUrl;
  dialog.showModal();
  video.play().catch((playError) => {
    console.warn("Community video autoplay was blocked:", playError);
    error.textContent = "Tap play to start the video.";
  });
}

function closeCommunityVideoPreview() {
  const dialog = document.getElementById("hub-preview-dialog");
  const video = document.getElementById("hub-preview-video");
  if (!dialog.open) return;
  video.pause();
  video.removeAttribute("src");
  video.load();
  dialog.close();
}

function observeCommunityCardPlayback(strip, cards) {
  communityCardObserver?.disconnect();
  if (!("IntersectionObserver" in window)) {
    console.warn("This browser does not support automatic Community Hub previews.");
    return;
  }

  communityCardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector("video");
      if (!video) return;

      const visible = entry.isIntersecting && entry.intersectionRatio > 0.6;
      communityCardVisibility.set(entry.target, visible);
      if (visible && !document.getElementById("hub-preview-dialog").open) {
        if (!video.getAttribute("src")) {
          video.preload = "auto";
          video.src = video.dataset.videoUrl;
        }
        video.play().catch((error) => {
          console.warn("Unable to autoplay community video:", error);
        });
        return;
      }

      if (!visible && video.getAttribute("src")) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.preload = "none";
      }
    });
  }, { threshold: [0, 0.6] });
  cards.forEach((card) => communityCardObserver.observe(card));
}

function resumeVisibleCommunityCards() {
  document.querySelectorAll("#hub-strip .hub-item").forEach((card) => {
    if (!communityCardVisibility.get(card)) return;
    const video = card.querySelector("video");
    if (!video) return;
    if (!video.getAttribute("src")) {
      video.preload = "auto";
      video.src = video.dataset.videoUrl;
    }
    video.play().catch((error) => {
      console.warn("Unable to resume community video:", error);
    });
  });
}

function renderHub(items) {
  const strip = document.getElementById("hub-strip");
  const cards = items.flatMap((item) => {
    const data = item.data;
    let videoUrl;
    try {
      videoUrl = new URL(data?.video_url, window.location.href);
    } catch (_) {
      return [];
    }
    if (!["https:", "http:"].includes(videoUrl.protocol)) return [];

    const card = document.createElement("div");
    card.className = "hub-item";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Play ${data.title || "community video"}`);

    const video = document.createElement("video");
    video.dataset.videoUrl = videoUrl.href;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "none";

    if (typeof data.thumbnail_url === "string" && data.thumbnail_url.trim()) {
      try {
        const thumbnailUrl = new URL(data.thumbnail_url, window.location.href);
        if (["https:", "http:"].includes(thumbnailUrl.protocol)) {
          queueCommunityPoster(videoUrl.href, video, thumbnailUrl.href);
        }
      } catch (_) {
        // An invalid optional poster does not prevent the video from loading.
      }
    }
    if (!video.poster) queueCommunityPoster(videoUrl.href, video, null);

    const playButton = document.createElement("span");
    playButton.className = "hub-play";
    playButton.setAttribute("aria-hidden", "true");
    const playIcon = document.createElement("img");
    playIcon.src = "assets/images/play.svg";
    playIcon.alt = "";
    playButton.append(playIcon);
    const openPreview = () => {
      openCommunityVideoPreview(videoUrl.href, data.title, video.poster);
    };
    card.addEventListener("click", openPreview);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview();
      }
    });

    card.append(video, playButton);
    if (typeof data.title === "string" && data.title.trim()) {
      const title = document.createElement("span");
      title.className = "hub-title";
      title.textContent = data.title;
      card.append(title);
    }
    return [card];
  });

  if (cards.length === 0) {
    showHomepageError(
      "hub-strip",
      "hub-status",
      "Community videos are temporarily unavailable.",
      new Error("No active community videos were returned.")
    );
    return;
  }
  strip.replaceChildren(...cards);
  observeCommunityCardPlayback(strip, cards);
}

document.getElementById("hub-preview-close").addEventListener(
  "click",
  closeCommunityVideoPreview
);
document.getElementById("hub-preview-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeCommunityVideoPreview();
});
document.getElementById("hub-preview-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCommunityVideoPreview();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCommunityVideoPreview();
});
document.getElementById("hub-preview-dialog").addEventListener("close", () => {
  const video = document.getElementById("hub-preview-video");
  video.pause();
  video.removeAttribute("src");
  video.load();
  resumeVisibleCommunityCards();
});

async function loadHomepageContent() {
  const carousel = document.getElementById("home-banner-carousel");
  const strip = document.getElementById("hub-strip");
  for (const [container, text] of [[carousel, "Loading offers…"], [strip, "Loading community videos…"]]) {
    const status = document.createElement("p");
    status.className = container === carousel ? "carousel-status" : "hub-status";
    status.setAttribute("role", "status");
    status.textContent = text;
    container.replaceChildren(status);
  }

  try {
    const response = await fetch(HOMEPAGE_API_URL, {
      headers: { Accept: "application/json" },
      credentials: "omit",
    });
    if (!response.ok) {
      throw new Error(`Homepage API returned HTTP ${response.status}.`);
    }

    const data = await response.json();
    if (!Array.isArray(data.sections)) {
      throw new Error("Homepage API response did not contain sections.");
    }

    const now = Date.now();
    const hero = data.sections.find(
      (section) => section.type === "HERO_CAROUSEL" && isHomepageItemAvailable(section, now)
    );
    const banners = Array.isArray(hero?.items)
      ? hero.items
          .filter((item) => isHomepageItemAvailable(item, now) &&
            typeof item.image_url === "string" && item.image_url.trim())
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      : [];
    renderHomepageBanners(banners);

    const community = data.sections.find(
      (section) => section.type === "COMMUNITY_HUB" && isHomepageItemAvailable(section, now)
    );
    const videos = Array.isArray(community?.items)
      ? community.items
          .filter((item) => isHomepageItemAvailable(item, now) &&
            typeof item.data?.video_url === "string" && item.data.video_url.trim())
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      : [];
    renderHub(videos);
  } catch (error) {
    showHomepageBannerError(error);
    showCommunityHubError(error);
  }
}

function renderFaq() {
  const list = document.getElementById("faq-list");
  list.innerHTML = FAQS.map(
    (f, i) => `
    <div class="faq-item" data-index="${i}">
      <button class="faq-q"><span>${f.q}</span><span class="icon">+</span></button>
      <div class="faq-a">${f.a}</div>
    </div>`
  ).join("");
  list.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".icon").textContent = "+";
      });
      if (!isOpen) {
        item.classList.add("open");
        item.querySelector(".icon").textContent = "−";
      }
    });
  });
}

// ===================== Booking modal =====================

const bookingState = { categoryId: null, categoryName: null, day: null, time: null };

function nextSixDays() {
  const today = getIndiaDateParts();
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  return Array.from({ length: 6 }, (_, index) => new Date(todayUtc + index * 86400000));
}

function getIndiaDateParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map(({ type, value }) => [type, Number(value)]));
}

function getIndiaToday() {
  const { year, month, day } = getIndiaDateParts();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function fmtDate(d) {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isFutureIndiaSlot(date, time, now = Date.now()) {
  const [year, month, day] = date.split("-").map(Number);
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) return false;

  let hour = Number(match[1]) % 12;
  if (match[3] === "PM") hour += 12;
  const minute = Number(match[2]);
  const slotUtc = Date.UTC(year, month - 1, day, hour - 5, minute - 30);
  return slotUtc > now;
}

function showModalStep(modalId, stepIndex) {
  document.querySelectorAll(`#${modalId} .modal-step`).forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.step) === stepIndex);
  });
}

function openBookingModal(categoryId, categoryName) {
  bookingState.categoryId = categoryId ?? null;
  bookingState.categoryName = categoryName ?? null;
  bookingState.day = null;
  bookingState.time = null;

  renderBookingCategoryTiles();
  renderBookingDayTiles();
  renderBookingTimeTiles();
  document.getElementById("booking-error").style.display = "none";
  document.getElementById("booking-step0-next").disabled = !bookingState.categoryId;

  const modal = document.getElementById("booking-modal");
  modal.classList.add("show");
  showModalStep("booking-modal", categoryId ? 1 : 0);
}

function closeBookingModal() {
  document.getElementById("booking-modal").classList.remove("show");
}

function renderBookingCategoryTiles() {
  const wrap = document.getElementById("booking-category-tiles");
  wrap.innerHTML = CATEGORIES.map(
    (c) => `<button class="select-tile ${c.id === bookingState.categoryId ? "selected" : ""}" data-id="${c.id}" data-name="${c.name}">${c.name}</button>`
  ).join("");
  wrap.querySelectorAll(".select-tile").forEach((btn) => {
    btn.addEventListener("click", () => {
      bookingState.categoryId = Number(btn.dataset.id);
      bookingState.categoryName = btn.dataset.name;
      renderBookingCategoryTiles();
      document.getElementById("booking-step0-next").disabled = false;
    });
  });
}

function renderBookingDayTiles() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const wrap = document.getElementById("booking-day-tiles");
  wrap.innerHTML = nextSixDays()
    .map((d) => {
      const date = fmtDate(d);
      const selected = bookingState.day === date;
      return `<button class="select-tile day ${selected ? "selected" : ""}" data-date="${date}">
        <span class="d">${d.getUTCDate()}</span><span class="w">${weekdays[d.getUTCDay()]}</span>
      </button>`;
    })
    .join("");
  wrap.querySelectorAll(".select-tile").forEach((btn) => {
    btn.addEventListener("click", () => {
      bookingState.day = btn.dataset.date;
      renderBookingDayTiles();
      renderBookingTimeTiles();
      updateBookingStep1Next();
    });
  });
}

function renderBookingTimeTiles() {
  const wrap = document.getElementById("booking-time-tiles");
  const availableSlots = bookingState.day === getIndiaToday()
    ? TIME_SLOTS.filter((time) => isFutureIndiaSlot(bookingState.day, time))
    : TIME_SLOTS;
  if (bookingState.time && !availableSlots.includes(bookingState.time)) {
    bookingState.time = null;
  }
  if (bookingState.day && availableSlots.length === 0) {
    wrap.innerHTML = '<p class="time-slots-empty">No times remain today. Please choose another day.</p>';
    return;
  }
  wrap.innerHTML = availableSlots.map(
    (t) => `<button class="select-tile time ${bookingState.time === t ? "selected" : ""}" data-time="${t}">${t}</button>`
  ).join("");
  wrap.querySelectorAll(".select-tile").forEach((btn) => {
    btn.addEventListener("click", () => {
      bookingState.time = btn.dataset.time;
      renderBookingTimeTiles();
      updateBookingStep1Next();
    });
  });
}

function updateBookingStep1Next() {
  const hasFutureSelection = bookingState.day &&
    bookingState.time &&
    isFutureIndiaSlot(bookingState.day, bookingState.time);
  document.getElementById("booking-step1-next").disabled = !hasFutureSelection;
}

async function submitLead(payload) {
  try {
    const response = await fetch(LEAD_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    let data = {};
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        data = parsed && typeof parsed === "object"
          ? parsed
          : { error: typeof parsed === "string" ? parsed : "" };
      } catch {
        data = { error: responseText };
      }
    }
    if (!response.ok || data.success !== true) {
      const rawMessage = data.message || data.error;
      const message = typeof rawMessage === "string"
        ? rawMessage
        : rawMessage && typeof rawMessage === "object"
          ? rawMessage.message || JSON.stringify(rawMessage)
          : "Could not send your request. Please try again.";
      const errorCode = data.error_code || data.code;
      console.error("Landing lead API rejected the request:", {
        status: response.status,
        errorCode,
      });
      return {
        ok: false,
        message: `${message} (HTTP ${response.status}${errorCode ? `, ${errorCode}` : ""})`,
      };
    }
    return { ok: true, data };
  } catch (error) {
    console.error("Unable to submit landing lead:", error);
    return {
      ok: false,
      message: "Unable to send your request right now. Please try again.",
    };
  }
}

async function sendLeadFromForm(payload, errorElement, submitButton) {
  submitButton.disabled = true;
  errorElement.style.display = "none";

  const result = await submitLead(payload);
  submitButton.disabled = false;

  if (!result.ok) {
    errorElement.textContent = result.message;
    errorElement.style.display = "block";
    return false;
  }

  return true;
}

function receivedCardHtml() {
  return `
    <h4>Request received!</h4>
    <div class="received-copy">
      <p class="big">Our team will call you shortly to confirm your task details</p>
      <p class="desc">Once we know exactly what you need, we&rsquo;ll guide you on the most suitable service and share the estimated cost and next steps with you.</p>
    </div>
    <hr class="modal-divider" />
    <div class="received-offers">
      <p class="explore">Explore more on our app &amp; app exclusive offers</p>
      <div class="store-badge-row">
        <a class="store-badge" href="https://apps.apple.com/in/app/bmt-book-my-task/id6746551804" target="_blank">
          <img src="assets/svg/apple_store_icon.svg" alt="" />
          <div><div class="cap">Download on the</div><div class="ttl">App Store</div></div>
        </a>
        <a class="store-badge" href="https://play.google.com/store/apps/details?id=com.bookmytask.com&pcampaignid=web_share" target="_blank">
          <img src="assets/svg/play_store_icon.svg" alt="" />
          <div><div class="cap">Download on</div><div class="ttl">Google Play</div></div>
        </a>
      </div>
    </div>`;
}

// Dynamic appearance: the BookMyTask header shows up whenever the user scrolls up, anywhere on the page.
(function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y <= 8 || y < lastY) header.classList.remove("is-hidden");
    else if (y > lastY + 4) header.classList.add("is-hidden");
    lastY = y;
  }, { passive: true });
})();

function initBookingModal() {
  document.getElementById("booking-close").addEventListener("click", closeBookingModal);
  document.getElementById("booking-modal").addEventListener("click", (e) => {
    if (e.target.id === "booking-modal") closeBookingModal();
  });

  document.getElementById("booking-step0-next").addEventListener("click", () => {
    if (!bookingState.categoryId) return;
    showModalStep("booking-modal", 1);
  });

  document.getElementById("booking-step1-next").addEventListener("click", () => {
    if (!bookingState.day || !bookingState.time || !isFutureIndiaSlot(bookingState.day, bookingState.time)) {
      bookingState.time = null;
      renderBookingDayTiles();
      renderBookingTimeTiles();
      updateBookingStep1Next();
      return;
    }
    showModalStep("booking-modal", 2);
  });

  document.getElementById("booking-submit").addEventListener("click", async () => {
    const name = document.getElementById("booking-name").value.trim();
    const phone = document.getElementById("booking-phone").value.trim();
    const address = document.getElementById("booking-address").value.trim();
    const errorEl = document.getElementById("booking-error");

    if (!bookingState.categoryId || !bookingState.day || !bookingState.time) {
      errorEl.textContent = "Select a service, preferred day, and preferred time.";
      errorEl.style.display = "block";
      return;
    }
    if (!isFutureIndiaSlot(bookingState.day, bookingState.time)) {
      bookingState.day = null;
      bookingState.time = null;
      renderBookingDayTiles();
      renderBookingTimeTiles();
      updateBookingStep1Next();
      errorEl.textContent = "That time has passed. Please choose a future day and time.";
      errorEl.style.display = "block";
      return;
    }
    if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone) || address.length < 5) {
      errorEl.textContent = "Enter your name, a valid 10-digit Indian mobile number, and address.";
      errorEl.style.display = "block";
      return;
    }

    const payload = {
      request_type: "booking",
      category_id: bookingState.categoryId,
      category_name: bookingState.categoryName,
      preferred_day: bookingState.day,
      preferred_time: bookingState.time,
      full_name: name,
      phone,
      address,
    };

    const submitButton = document.getElementById("booking-submit");
    if (!(await sendLeadFromForm(payload, errorEl, submitButton))) return;
    document.getElementById("booking-received").innerHTML = receivedCardHtml();
    showModalStep("booking-modal", 3);
  });
}

// ===================== Special task modal =====================

function openSpecialModal() {
  document.getElementById("special-task-desc").value = "";
  document.getElementById("special-name").value = "";
  document.getElementById("special-phone").value = "";
  document.getElementById("special-address").value = "";
  document.getElementById("special-step0-error").style.display = "none";
  document.getElementById("special-step1-error").style.display = "none";
  document.getElementById("special-modal").classList.add("show");
  showModalStep("special-modal", 0);
}

function closeSpecialModal() {
  document.getElementById("special-modal").classList.remove("show");
}

function initSpecialModal() {
  document.getElementById("special-close").addEventListener("click", closeSpecialModal);
  document.getElementById("special-modal").addEventListener("click", (e) => {
    if (e.target.id === "special-modal") closeSpecialModal();
  });

  document.getElementById("special-step0-next").addEventListener("click", () => {
    const desc = document.getElementById("special-task-desc").value.trim();
    const errorEl = document.getElementById("special-step0-error");
    if (desc.length < 10) {
      errorEl.textContent = "Tell us a little more about the task.";
      errorEl.style.display = "block";
      return;
    }
    errorEl.style.display = "none";
    showModalStep("special-modal", 1);
  });

  document.getElementById("special-submit").addEventListener("click", async () => {
    const desc = document.getElementById("special-task-desc").value.trim();
    const name = document.getElementById("special-name").value.trim();
    const phone = document.getElementById("special-phone").value.trim();
    const address = document.getElementById("special-address").value.trim();
    const errorEl = document.getElementById("special-step1-error");

    if (desc.length < 10 || desc.length > 1000) {
      errorEl.textContent = "Tell us about your task in 10 to 1,000 characters.";
      errorEl.style.display = "block";
      return;
    }
    if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone) || address.length < 5) {
      errorEl.textContent = "Enter your name, a valid 10-digit Indian mobile number, and address.";
      errorEl.style.display = "block";
      return;
    }

    const payload = {
      request_type: "special_task",
      task_description: desc,
      full_name: name,
      phone,
      address,
    };

    const submitButton = document.getElementById("special-submit");
    if (!(await sendLeadFromForm(payload, errorEl, submitButton))) return;
    document.getElementById("special-received").innerHTML = receivedCardHtml();
    showModalStep("special-modal", 2);
  });
}

// ===================== Wiring =====================

document.querySelectorAll("[data-open-booking]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const catId = Number(btn.dataset.category);
    const cat = CATEGORIES.find((c) => c.id === catId);
    openBookingModal(cat ? cat.id : null, cat ? cat.name : null);
  });
});
document.querySelectorAll("[data-open-special]").forEach((btn) => {
  btn.addEventListener("click", openSpecialModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeBookingModal();
    closeSpecialModal();
  }
});

renderCategories();
renderShortcuts();
renderAssurance();
renderJourney();
loadHomepageContent();
renderFaq();
initBookingModal();
initSpecialModal();
