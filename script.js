// ─── Camada de dados (API + Neon) ───────────────────────────────────────────
const API_BASE = "/api";

function createId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

async function apiGet(resource) {
  const response = await fetch(`${API_BASE}/${resource}`);
  if (!response.ok) throw new Error(`Falha ao buscar ${resource}`);
  return response.json();
}

async function apiSave(resource, item) {
  const response = await fetch(`${API_BASE}/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error(`Falha ao salvar ${resource}`);
  return response.json();
}

async function apiDelete(resource, id) {
  const response = await fetch(`${API_BASE}/${resource}?id=${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) throw new Error(`Falha ao excluir ${resource}`);
}

let clientsCache = [];
let themesCache = [];
let quotesCache = [];

async function loadAllData() {
  const [clients, themes, quotes] = await Promise.all([
    apiGet("clients"),
    apiGet("themes"),
    apiGet("quotes"),
  ]);
  clientsCache = clients;
  themesCache = themes;
  quotesCache = quotes;
}

async function saveClient(client) {
  const saved = await apiSave("clients", client);
  const i = clientsCache.findIndex((c) => String(c.id) === String(saved.id));
  if (i >= 0) clientsCache[i] = saved;
  else clientsCache.push(saved);
  return saved;
}

async function removeClient(id) {
  await apiDelete("clients", id);
  clientsCache = clientsCache.filter((c) => String(c.id) !== String(id));
}

async function removeTheme(id) {
  await apiDelete("themes", id);
  themesCache = themesCache.filter((t) => String(t.id) !== String(id));
}

async function saveTheme(theme) {
  const saved = await apiSave("themes", theme);
  const i = themesCache.findIndex((t) => String(t.id) === String(saved.id));
  if (i >= 0) themesCache[i] = saved;
  else themesCache.push(saved);
  return saved;
}

async function saveQuote(quote) {
  const saved = await apiSave("quotes", quote);
  const i = quotesCache.findIndex((q) => String(q.id) === String(saved.id));
  if (i >= 0) quotesCache[i] = saved;
  else quotesCache.push(saved);
  return saved;
}

function getClients() {
  return clientsCache;
}

const icons = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5M9 21v-6h6v6"/>',
  file: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  box: '<path d="m21 8-9 5-9-5 9-5z"/><path d="m3 8 9 5v10l-9-5zM21 8l-9 5v10l9-5z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3h4v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.12.6.6 1.05 1.2 1.15H21v4h-.4A1.65 1.65 0 0 0 19.4 15z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  building: '<path d="M4 21V5l8-3 8 3v16M8 9h2M14 9h2M8 13h2M14 13h2M9 21v-4h6v4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  sparkle: '<path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  "arrow-left": '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m20 6-11 11-5-5"/>',
  wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v11H5a3 3 0 0 1-3-3V6"/><path d="M16 13h2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><rect x="3" y="3" width="12" height="12" rx="2"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 13h4"/>',
};

const companyInfo = {
  name: "Yupii Personalizados e Festas",
  cnpj: "54.674.665/0001-00",
  owner: "Priscila Carvalho Ribeiro",
  address: "Rua Vinícius Vespúcio, 435, Alvorada - Formiga-MG",
  phone: "(37) 99198-9691",
};

const ACCESS_PASSWORDS = {
  admin: "admin0910",
  user: "0112",
};
const loadingOverlay = document.querySelector("#loadingOverlay");
const accessScreen = document.querySelector("#accessScreen");
const accessForm = document.querySelector("#accessForm");
const accessPassword = document.querySelector("#accessPassword");
const accessMessage = document.querySelector("#accessMessage");
const appShell = document.querySelector("#appShell");
const logoutButton = document.querySelector("#logoutButton");
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
let inactivityTimer = null;

function resetInactivityTimer() {
  if (sessionStorage.getItem("yupiiAccess") !== "granted") return;
  window.clearTimeout(inactivityTimer);
  inactivityTimer = window.setTimeout(() => lockApp("Sessão expirada por inatividade. Digite a senha novamente."), INACTIVITY_LIMIT_MS);
}

function lockApp(message = "") {
  window.clearTimeout(inactivityTimer);
  inactivityTimer = null;
  sessionStorage.removeItem("yupiiAccess");
  sessionStorage.removeItem("yupiiRole");
  appShell.hidden = true;
  accessScreen.hidden = false;
  accessPassword.value = "";
  accessMessage.textContent = message;
  accessPassword.focus();
}

async function unlockApp() {
  sessionStorage.setItem("yupiiAccess", "granted");
  accessScreen.hidden = true;
  appShell.hidden = false;
  try {
    await loadAllData();
  } catch (error) {
    console.error(error);
    toast.textContent = "Não foi possível carregar os dados do servidor.";
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
  }
  renderHome();
  resetInactivityTimer();
}

async function bootApp() {
  try {
    await apiGet("clients");
  } catch (error) {
    console.error("Falha ao acordar o servidor:", error);
  }

  loadingOverlay.hidden = true;

  if (sessionStorage.getItem("yupiiAccess") === "granted") {
    await unlockApp();
  } else {
    accessScreen.hidden = false;
  }
}

bootApp();

accessForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const role = Object.entries(ACCESS_PASSWORDS).find(([, password]) => accessPassword.value === password)?.[0];
  if (role) {
    sessionStorage.setItem("yupiiRole", role);
    accessMessage.textContent = "";
    await unlockApp();
    return;
  }
  accessMessage.textContent = "Senha incorreta. Tente novamente.";
  accessPassword.select();
});

logoutButton.addEventListener("click", () => lockApp("Você saiu do sistema."));
["click", "keydown", "mousemove", "touchstart", "scroll"].forEach((eventName) => {
  document.addEventListener(eventName, resetInactivityTimer, { passive: true });
});

function addIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((element) => {
    const icon = icons[element.dataset.icon];
    if (!icon) return;
    element.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;
  });
}

addIcons();

const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector("#menuButton");
const newQuoteButton = document.querySelector("#newQuoteButton");
const toast = document.querySelector("#toast");
const homePage = document.querySelector("#homePage");
const clientsPage = document.querySelector("#clientsPage");
const quotesPage = document.querySelector("#quotesPage");
const catalogPage = document.querySelector("#catalogPage");
const agendaPage = document.querySelector("#agendaPage");
const pageLinks = document.querySelectorAll("[data-page-link]");
const backHomeButtons = document.querySelectorAll(".back-home");
const personTypeInputs = document.querySelectorAll('input[name="personType"]');
const companyOnlyFields = document.querySelectorAll(".company-only");
const documentInput = document.querySelector("#document");
const documentLabel = document.querySelector("#documentLabel");
const documentMessage = document.querySelector("#documentMessage");
const nameLabel = document.querySelector("#nameLabel");
const identificationHelp = document.querySelector("#identificationHelp");
const searchCnpjButton = document.querySelector("#searchCnpjButton");
const clientForm = document.querySelector("#clientForm");
const clientListView = document.querySelector("#clientListView");
const clientFormView = document.querySelector("#clientFormView");
const newClientButtons = document.querySelectorAll("#newClientButton, #emptyNewClientButton");
const backClientsButtons = document.querySelectorAll(".back-clients");
const clientSearch = document.querySelector("#clientSearch");
const clientsList = document.querySelector("#clientsList");
const emptyClients = document.querySelector("#emptyClients");
const clientCount = document.querySelector("#clientCount");
const quoteForm = document.querySelector("#quoteForm");
const quoteClient = document.querySelector("#quoteClient");
const quoteClientSearch = document.querySelector("#quoteClientSearch");
const quoteClientSuggestions = document.querySelector("#quoteClientSuggestions");
const quoteItems = document.querySelector("#quoteItems");
const addQuoteItemButton = document.querySelector("#addQuoteItem");
const addQuotePackageButton = document.querySelector("#addQuotePackageButton");
const packagePickerModal = document.querySelector("#packagePickerModal");
const packagePickerList = document.querySelector("#packagePickerList");
const emptyPackagePicker = document.querySelector("#emptyPackagePicker");
const closePackagePickerButton = document.querySelector("#closePackagePicker");
const quoteDiscount = document.querySelector("#quoteDiscount");
const quoteDiscountType = document.querySelector("#quoteDiscountType");
const quoteDelivery = document.querySelector("#quoteDelivery");
const quoteDepositPercent = document.querySelector("#quoteDepositPercent");
const quoteSubtotal = document.querySelector("#quoteSubtotal");
const quoteTotal = document.querySelector("#quoteTotal");
const quoteDeposit = document.querySelector("#quoteDeposit");
const cancelQuote = document.querySelector("#cancelQuote");
const quoteListView = document.querySelector("#quoteListView");
const quoteFormView = document.querySelector("#quoteFormView");
const newQuoteActions = document.querySelectorAll(".new-quote-action");
const quoteSearch = document.querySelector("#quoteSearch");
const quoteStatusFilter = document.querySelector("#quoteStatusFilter");
const quotesList = document.querySelector("#quotesList");
const emptyQuotes = document.querySelector("#emptyQuotes");
const quoteCount = document.querySelector("#quoteCount");
const quotePdfView = document.querySelector("#quotePdfView");
const pdfDocument = document.querySelector("#pdfDocument");
const backFromPdf = document.querySelector("#backFromPdf");
const addSignaturePdf = document.querySelector("#addSignaturePdf");
const shareQuotePdf = document.querySelector("#shareQuotePdf");
let activePdfQuote = null;
const catalogListView = document.querySelector("#catalogListView");
const catalogFormView = document.querySelector("#catalogFormView");
const newThemeButtons = document.querySelectorAll("#newThemeButton");
const newCatalogItemButton = document.querySelector("#newCatalogItemButton");
const emptyNewThemeButton = document.querySelector("#emptyNewThemeButton");
const backCatalogButtons = document.querySelectorAll(".back-catalog");
const themeSearch = document.querySelector("#themeSearch");
const themeCount = document.querySelector("#themeCount");
const themesList = document.querySelector("#themesList");
const emptyThemes = document.querySelector("#emptyThemes");
const catalogTabs = document.querySelectorAll("[data-catalog-tab]");
const themeForm = document.querySelector("#themeForm");
const themeFormEyebrow = document.querySelector("#themeFormEyebrow");
const themeFormTitle = document.querySelector("#themeFormTitle");
const themeFormDescription = document.querySelector("#themeFormDescription");
const themeItems = document.querySelector("#themeItems");
const addThemeItemButton = document.querySelector("#addThemeItem");
const catalogIdentityTitle = document.querySelector("#catalogIdentityTitle");
const catalogIdentityHelp = document.querySelector("#catalogIdentityHelp");
const themeNameLabel = document.querySelector("#themeNameLabel");
const packageNameField = document.querySelector("#packageNameField");
const packageDiscountField = document.querySelector("#packageDiscountField");
const packagePriceLabel = document.querySelector("#packagePriceLabel");
const catalogItemsTitle = document.querySelector("#catalogItemsTitle");
const catalogItemsHelp = document.querySelector("#catalogItemsHelp");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarMonth = document.querySelector("#calendarMonth");
const previousMonth = document.querySelector("#previousMonth");
const nextMonth = document.querySelector("#nextMonth");
const confirmModal = document.querySelector("#confirmModal");
const cancelConfirm = document.querySelector("#cancelConfirm");
const approveConfirm = document.querySelector("#approveConfirm");
const deleteClientModal = document.querySelector("#deleteClientModal");
const deleteClientTitle = document.querySelector("#deleteClientTitle");
const cancelDeleteClient = document.querySelector("#cancelDeleteClient");
const confirmDeleteClient = document.querySelector("#confirmDeleteClient");
const deleteClientMessage = document.querySelector("#deleteClientMessage");
const quoteActionModal = document.querySelector("#quoteActionModal");
const quoteActionTitle = document.querySelector("#quoteActionTitle");
const quoteActionMessage = document.querySelector("#quoteActionMessage");
const cancelQuoteAction = document.querySelector("#cancelQuoteAction");
const confirmQuoteAction = document.querySelector("#confirmQuoteAction");
const pdfChoiceModal = document.querySelector("#pdfChoiceModal");
const downloadQuotePdf = document.querySelector("#downloadQuotePdf");
const confirmShareQuotePdf = document.querySelector("#confirmShareQuotePdf");
const agendaDetailsModal = document.querySelector("#agendaDetailsModal");
const agendaDetailsContent = document.querySelector("#agendaDetailsContent");
const closeAgendaDetails = document.querySelector("#closeAgendaDetails");
let editingThemeId = null;
let catalogFormMode = "package";
let activeCatalogTab = "package";
let editingQuoteId = null;
let visibleCalendarDate = new Date();
let pendingSignalReversalId = null;
let pendingDeleteClientId = null;
let pendingDeleteThemeId = null;
let pendingQuoteAction = null;

function clientInitials(name) {
  return (name || "?").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function renderClients(query = "") {
  const normalizedQuery = digits(query).length >= 3 ? digits(query) : query.toLocaleLowerCase("pt-BR").trim();
  const clients = getClients().filter((client) => {
    const searchable = [client.clientName, client.tradeName, client.document, client.phone, client.email].join(" ").toLocaleLowerCase("pt-BR");
    return !normalizedQuery || searchable.includes(normalizedQuery) || digits(searchable).includes(normalizedQuery);
  });

  clientCount.textContent = `${clients.length} ${clients.length === 1 ? "cliente" : "clientes"}`;
  emptyClients.hidden = clients.length > 0 || Boolean(query.trim());
  clientsList.innerHTML = clients.map((client) => {
    const isCompany = client.personType === "cnpj";
    const displayName = client.tradeName || client.clientName || "Cliente sem nome";
    const address = [
      [client.street, client.number].filter(Boolean).join(", "),
      client.district,
      [client.city, client.state].filter(Boolean).join(" - "),
      client.zipCode ? `CEP ${client.zipCode}` : "",
    ].filter(Boolean).join(" · ");
    return `
      <article class="client-list-row" data-client-id="${client.id}" tabindex="0" role="button" aria-expanded="false">
        <div class="client-main">
          <div class="client-avatar${isCompany ? " mint" : ""}">${escapeHtml(clientInitials(displayName))}</div>
          <div>
            <strong>${escapeHtml(displayName)}</strong>
            <span>${escapeHtml(client.clientName !== displayName ? client.clientName : client.document)}</span>
          </div>
        </div>
        <div class="client-list-detail">
          <span>${isCompany ? "CNPJ" : "CPF"}</span>
          <strong>${escapeHtml(client.document || "Não informado")}</strong>
        </div>
        <div class="client-list-detail">
          <span>Telefone / WhatsApp</span>
          <strong>${escapeHtml(client.phone || "Não informado")}</strong>
        </div>
        <span class="client-type-badge${isCompany ? " company" : ""}">${isCompany ? "Empresa" : "Pessoa física"}</span>
        <span class="client-expand-icon" data-icon="down"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons.down}</svg></span>
      </article>
      <div class="client-details-panel" data-client-details="${client.id}" hidden>
        <div class="client-detail-item">
          <span>${isCompany ? "Razão social" : "Nome completo"}</span>
          <strong>${escapeHtml(client.clientName || "Não informado")}</strong>
        </div>
        <div class="client-detail-item">
          <span>E-mail</span>
          <strong>${escapeHtml(client.email || "Não informado")}</strong>
        </div>
        ${isCompany ? `
          <div class="client-detail-item address">
            <span>Endereço</span>
            <strong>${escapeHtml(address || "Não informado")}</strong>
          </div>
        ` : ""}
        <div class="client-detail-actions">
          <button class="secondary-button danger-text-button delete-client-button" type="button" data-delete-client="${client.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons.trash}</svg> Excluir cliente
          </button>
        </div>
      </div>
    `;
  }).join("");

  if (!clients.length && query.trim()) {
    clientsList.innerHTML = `
      <div class="empty-clients">
        <span class="empty-icon"><span data-icon="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons.search}</svg></span></span>
        <strong>Nenhum cliente encontrado</strong>
        <p>Tente buscar por outro nome, documento ou telefone.</p>
      </div>
    `;
  }
}

function toggleClientDetails(row) {
  const details = clientsList.querySelector(`[data-client-details="${row.dataset.clientId}"]`);
  const shouldOpen = row.getAttribute("aria-expanded") !== "true";
  clientsList.querySelectorAll(".client-list-row.expanded").forEach((openRow) => {
    openRow.classList.remove("expanded");
    openRow.setAttribute("aria-expanded", "false");
    const openDetails = clientsList.querySelector(`[data-client-details="${openRow.dataset.clientId}"]`);
    if (openDetails) openDetails.hidden = true;
  });
  if (shouldOpen && details) {
    row.classList.add("expanded");
    row.setAttribute("aria-expanded", "true");
    details.hidden = false;
  }
}

function showClientList() {
  clientFormView.hidden = true;
  clientListView.hidden = false;
  renderClients(clientSearch.value);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showClientForm() {
  clientListView.hidden = true;
  clientFormView.hidden = false;
  clientForm.reset();
  updatePersonType();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showPage(page) {
  homePage.classList.toggle("active", page === "home");
  clientsPage.classList.toggle("active", page === "clients");
  quotesPage.classList.toggle("active", page === "quotes");
  catalogPage.classList.toggle("active", page === "catalog");
  agendaPage.classList.toggle("active", page === "agenda");
  pageLinks.forEach((link) => {
    const isActive = link.dataset.pageLink === page;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  sidebar.classList.remove("open");
  if (page === "clients") showClientList();
  if (page === "quotes") showQuoteList();
  if (page === "catalog") showCatalogList();
  if (page === "agenda") renderCalendar();
  if (page === "home") renderHome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

pageLinks.forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  showPage(link.dataset.pageLink);
}));

backHomeButtons.forEach((button) => button.addEventListener("click", () => showPage("home")));
newClientButtons.forEach((button) => button.addEventListener("click", showClientForm));
backClientsButtons.forEach((button) => button.addEventListener("click", showClientList));
newThemeButtons.forEach((button) => button.addEventListener("click", () => showThemeForm(null, "package")));
newCatalogItemButton.addEventListener("click", () => showThemeForm(null, "single"));
emptyNewThemeButton.addEventListener("click", () => showThemeForm(null, activeCatalogTab));
backCatalogButtons.forEach((button) => button.addEventListener("click", showCatalogList));
catalogTabs.forEach((button) => button.addEventListener("click", () => {
  activeCatalogTab = button.dataset.catalogTab;
  renderThemes(themeSearch.value);
}));
themeSearch.addEventListener("input", () => renderThemes(themeSearch.value));
themesList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-theme]");
  if (editButton) {
    showThemeForm(editButton.dataset.editTheme);
    return;
  }
  const cloneButton = event.target.closest("[data-clone-theme]");
  if (cloneButton) {
    cloneTheme(cloneButton.dataset.cloneTheme);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-theme]");
  if (deleteButton) {
    openDeleteThemeModal(deleteButton.dataset.deleteTheme);
    return;
  }
  const row = event.target.closest(".theme-row");
  if (!row) return;
  const details = themesList.querySelector(`[data-theme-details="${row.dataset.themeId}"]`);
  const open = details.hidden;
  themesList.querySelectorAll(".theme-details-panel").forEach((panel) => panel.hidden = true);
  themesList.querySelectorAll(".theme-row").forEach((item) => item.classList.remove("expanded"));
  if (open) {
    details.hidden = false;
    row.classList.add("expanded");
  }
});
addThemeItemButton.addEventListener("click", () => addThemeItem());
themeItems.addEventListener("input", updateThemePackageTotal);
themeItems.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-theme-item");
  if (button) {
    button.closest(".theme-item-row").remove();
    updateThemePackageTotal();
  }
});
document.querySelector("#packageDiscount").addEventListener("input", updateThemePackageTotal);
themeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  updateThemePackageTotal();
  const isSingle = catalogFormMode === "single";
  let items = [...themeItems.querySelectorAll(".theme-item-row")].map((row) => ({
    name: row.querySelector(".theme-item-name").value,
    type: row.querySelector(".theme-item-type").value,
    quantity: Number(row.querySelector(".theme-item-quantity").value) || 1,
    price: parseMoney(row.querySelector(".theme-item-price").value),
  }));
  if (isSingle && items[0]) {
    items = [{ ...items[0], name: document.querySelector("#themeName").value, quantity: 1 }];
  }
  const theme = {
    id: editingThemeId || createId(),
    catalogType: catalogFormMode,
    themeName: document.querySelector("#themeName").value,
    packageName: isSingle ? "Item avulso" : document.querySelector("#packageName").value,
    packageDiscount: isSingle ? 0 : parseMoney(document.querySelector("#packageDiscount").value),
    packagePrice: parseMoney(document.querySelector("#packagePrice").value),
    themeDescription: document.querySelector("#themeDescription").value,
    items,
  };
  await saveTheme(theme);
  editingThemeId = null;
  catalogFormMode = "package";
  toast.textContent = isSingle ? "Item avulso salvo com sucesso." : "Pacote salvo com sucesso.";
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
  showCatalogList();
});
previousMonth.addEventListener("click", () => {
  visibleCalendarDate = new Date(visibleCalendarDate.getFullYear(), visibleCalendarDate.getMonth() - 1, 1);
  renderCalendar();
});
nextMonth.addEventListener("click", () => {
  visibleCalendarDate = new Date(visibleCalendarDate.getFullYear(), visibleCalendarDate.getMonth() + 1, 1);
  renderCalendar();
});
clientSearch.addEventListener("input", () => renderClients(clientSearch.value));
clientsList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-client]");
  if (deleteButton) {
    const id = deleteButton.dataset.deleteClient;
    const client = getClients().find((item) => String(item.id) === String(id));
    pendingDeleteClientId = id;
    const name = client ? (client.tradeName || client.clientName || "este cliente") : "este cliente";
    deleteClientMessage.textContent = `Tem certeza que deseja excluir ${name}? Esta ação não pode ser desfeita.`;
    deleteClientModal.hidden = false;
    return;
  }
  const row = event.target.closest(".client-list-row");
  if (row) toggleClientDetails(row);
});
clientsList.addEventListener("keydown", (event) => {
  const row = event.target.closest(".client-list-row");
  if (row && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    toggleClientDetails(row);
  }
});

function digits(value) {
  return value.replace(/\D/g, "");
}

function getThemes() {
  return themesCache;
}

function isCatalogSingle(theme) {
  return theme.catalogType === "single";
}

function catalogKindLabel(theme) {
  return isCatalogSingle(theme) ? "Item avulso" : "Pacote";
}

function renderThemes(query = "") {
  catalogTabs.forEach((button) => {
    const active = button.dataset.catalogTab === activeCatalogTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  const showingSingles = activeCatalogTab === "single";
  const normalized = query.toLocaleLowerCase("pt-BR").trim();
  const themes = getThemes().filter((theme) => {
    if (showingSingles !== isCatalogSingle(theme)) return false;
    const itemsText = (theme.items || []).map((item) => item.name).join(" ");
    return !normalized || [theme.themeName, theme.packageName, catalogKindLabel(theme), itemsText].join(" ").toLocaleLowerCase("pt-BR").includes(normalized);
  });
  const singular = showingSingles ? "item avulso" : "pacote";
  const plural = showingSingles ? "itens avulsos" : "pacotes";
  themeCount.textContent = `${themes.length} ${themes.length === 1 ? singular : plural}`;
  emptyThemes.querySelector("strong").textContent = showingSingles ? "Nenhum item avulso cadastrado" : "Nenhum pacote cadastrado";
  emptyThemes.querySelector("p").textContent = showingSingles ? "Cadastre itens como painel ornamentado, kit de balões e mobiliário." : "Cadastre os pacotes oferecidos pela Yupii.";
  emptyNewThemeButton.innerHTML = `<span data-icon="plus"></span> ${showingSingles ? "Cadastrar item avulso" : "Cadastrar pacote"}`;
  addIcons(emptyNewThemeButton);
  emptyThemes.hidden = themes.length > 0 || Boolean(query.trim());
  themesList.innerHTML = themes.map((theme) => {
    const items = theme.items || [];
    const isSingle = isCatalogSingle(theme);
    return `
    <article class="theme-row" data-theme-id="${theme.id}" tabindex="0">
      <div class="theme-main"><strong>${escapeHtml(theme.themeName)}</strong><span>${escapeHtml(isSingle ? "Item avulso" : theme.packageName)}</span></div>
      <div class="theme-detail"><span>Tipo</span><strong>${catalogKindLabel(theme)}</strong></div>
      <div class="theme-detail"><span>${isSingle ? "Quantidade" : "Itens inclusos"}</span><strong>${isSingle ? "1 item" : `${items.length} itens`}</strong></div>
      <strong class="theme-price">${currency(theme.packagePrice)}</strong>
      <span class="client-expand-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.down}</svg></span>
    </article>
    <div class="theme-details-panel" data-theme-details="${theme.id}" hidden>
      ${theme.themeDescription ? `<div class="client-detail-item"><span>Descrição</span><strong>${escapeHtml(theme.themeDescription)}</strong></div>` : ""}
      <div class="theme-included-list">${items.map((item) => `<span class="theme-included-item">${escapeHtml(item.name)} · ${item.quantity}x · ${currency(item.price)}</span>`).join("")}</div>
      <div class="theme-detail-actions">
        <button class="secondary-button theme-edit-button" type="button" data-edit-theme="${theme.id}"><span data-icon="edit"></span> Editar</button>
        <button class="secondary-button theme-edit-button" type="button" data-clone-theme="${theme.id}"><span data-icon="copy"></span> Clonar</button>
        <button class="secondary-button danger-text-button" type="button" data-delete-theme="${theme.id}"><span data-icon="trash"></span> Excluir</button>
      </div>
    </div>
  `;
  }).join("");
  addIcons(themesList);
}

function showCatalogList() {
  catalogFormView.hidden = true;
  catalogListView.hidden = false;
  renderThemes(themeSearch.value);
}

function addThemeItem(data = {}) {
  const row = document.createElement("div");
  row.className = "theme-item-row";
  row.innerHTML = `
    <input class="theme-item-name" placeholder="Nome do item ou serviço" value="${escapeHtml(data.name || "")}" required />
    <select class="theme-item-type"><option>Locação</option><option>Serviço</option><option>Personalizado</option></select>
    <input class="theme-item-quantity" type="number" min="1" value="${data.quantity || 1}" aria-label="Quantidade" />
    <input class="theme-item-price" inputmode="decimal" placeholder="Valor individual" value="${data.price ? String(data.price).replace(".", ",") : ""}" />
    <button class="remove-quote-item remove-theme-item" type="button" aria-label="Remover item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.trash}</svg></button>
  `;
  const nameInput = row.querySelector(".theme-item-name");
  if (catalogFormMode === "single") {
    row.classList.add("single-catalog-item-row");
    nameInput.required = false;
    nameInput.value = data.name || document.querySelector("#themeName").value || "";
    nameInput.hidden = true;
  }
  if (data.type) row.querySelector(".theme-item-type").value = data.type;
  themeItems.appendChild(row);
  updateThemePackageTotal();
}

function configureCatalogForm(mode) {
  const isSingle = mode === "single";
  catalogFormMode = mode;
  themeFormEyebrow.textContent = isSingle ? "Item avulso" : "Pacote de festa";
  themeFormTitle.textContent = isSingle ? (editingThemeId ? "Editar item avulso" : "Novo item avulso") : (editingThemeId ? "Editar pacote" : "Novo pacote");
  themeFormDescription.textContent = isSingle ? "Cadastre itens soltos como painel ornamentado, kit de balões ou mobiliário." : "Defina o pacote e os itens que poderão entrar no orçamento.";
  catalogIdentityTitle.textContent = isSingle ? "Identificação do item" : "Identificação do pacote";
  catalogIdentityHelp.textContent = isSingle ? "Ex.: Painel ornamentado, kit de balões, mesa cilíndrica." : "Ex.: Batismo · Completo ou Fazendinha · Simples.";
  themeNameLabel.textContent = isSingle ? "Nome do item" : "Tema da festa";
  document.querySelector("#themeName").placeholder = isSingle ? "Ex.: Painel ornamentado" : "Ex.: Batismo";
  packageNameField.hidden = isSingle;
  packageDiscountField.hidden = isSingle;
  document.querySelector("#packageName").required = !isSingle;
  packagePriceLabel.textContent = isSingle ? "Valor do item" : "Valor do pacote";
  catalogItemsTitle.textContent = isSingle ? "Dados do item" : "Itens e serviços inclusos";
  catalogItemsHelp.textContent = isSingle ? "Informe tipo, quantidade e valor para reutilizar nos orçamentos." : "Os valores individuais poderão ser ajustados no orçamento.";
  addThemeItemButton.hidden = isSingle;
}

function showThemeForm(themeId = null, mode = "package", cloneData = null) {
  editingThemeId = themeId;
  catalogListView.hidden = true;
  catalogFormView.hidden = false;
  themeForm.reset();
  themeItems.innerHTML = "";
  const sourceTheme = cloneData || (themeId ? getThemes().find((item) => String(item.id) === String(themeId)) : null);
  configureCatalogForm(sourceTheme ? (sourceTheme.catalogType || "package") : mode);
  if (sourceTheme) {
    if (!cloneData) editingThemeId = sourceTheme.id;
    if (cloneData) themeFormTitle.textContent = isCatalogSingle(sourceTheme) ? "Clonar item avulso" : "Clonar pacote";
    document.querySelector("#themeName").value = sourceTheme.themeName;
    document.querySelector("#packageName").value = cloneData && !isCatalogSingle(sourceTheme) ? `${sourceTheme.packageName || ""} - cópia` : sourceTheme.packageName || "";
    document.querySelector("#themeDescription").value = sourceTheme.themeDescription || "";
    (sourceTheme.items || []).forEach(addThemeItem);
    const itemsSum = themeItemsTotal();
    const legacyDiscount = Math.max(0, itemsSum - Number(sourceTheme.packagePrice || 0));
    document.querySelector("#packageDiscount").value = String(sourceTheme.packageDiscount ?? legacyDiscount).replace(".", ",");
    updateThemePackageTotal();
  } else {
    addThemeItem();
    document.querySelector("#packageDiscount").value = "0,00";
    updateThemePackageTotal();
  }
}

function cloneTheme(themeId) {
  const theme = getThemes().find((item) => String(item.id) === String(themeId));
  if (!theme) return;
  const clone = JSON.parse(JSON.stringify(theme));
  delete clone.id;
  showThemeForm(null, clone.catalogType || "package", clone);
}

function openDeleteThemeModal(themeId) {
  const theme = getThemes().find((item) => String(item.id) === String(themeId));
  if (!theme) return;
  pendingDeleteThemeId = themeId;
  pendingDeleteClientId = null;
  deleteClientTitle.textContent = `Excluir ${isCatalogSingle(theme) ? "item avulso" : "pacote"}?`;
  deleteClientMessage.textContent = `Tem certeza que deseja excluir ${theme.themeName}? Esta ação não pode ser desfeita.`;
  confirmDeleteClient.textContent = "Sim, excluir";
  deleteClientModal.hidden = false;
}

function renderCalendar() {
  const year = visibleCalendarDate.getFullYear();
  const month = visibleCalendarDate.getMonth();
  calendarMonth.textContent = visibleCalendarDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const events = getQuotes().filter((quote) => isDashboardQuote(quote) && quote.inAgenda && quote.eventDate);
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  calendarGrid.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const dayEvents = events.filter((quote) => quote.eventDate === iso);
    const dayLabel = date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).replace(".", "");
    return `<div class="calendar-day${date.getMonth() !== month ? " outside" : ""}${iso === todayIso ? " today" : ""}${dayEvents.length ? " has-event" : ""}" data-agenda-date="${iso}" data-event-count="${dayEvents.length}" role="button" tabindex="0"><div class="calendar-day-heading"><span class="calendar-day-number">${date.getDate()}</span><span class="calendar-day-label">${dayLabel}</span></div>${dayEvents.map((quote) => `<button class="calendar-event" type="button" data-agenda-quote="${quote.id}"><strong>${escapeHtml(quote.eventName || "Festa")}</strong><span>${escapeHtml(quoteClientName(quote))}${quote.eventTime ? ` · ${quote.eventTime}` : ""}</span></button>`).join("")}</div>`;
  }).join("");
}

function openSignalReversal(quoteId) {
  pendingSignalReversalId = quoteId;
  confirmModal.hidden = false;
}

function closeSignalReversal() {
  pendingSignalReversalId = null;
  confirmModal.hidden = true;
}

function showAgendaQuoteDetails(quoteId) {
  const quote = getQuotes().find((item) => String(item.id) === String(quoteId));
  if (!quote) return;
  const client = getClients().find((item) => String(item.id) === String(quote.quoteClient)) || {};
  const clientName = client.tradeName || client.clientName || "Cliente não encontrado";
  agendaDetailsContent.innerHTML = `
    <div class="agenda-detail-header">
      <span class="eyebrow">Festa confirmada</span>
      <h2 id="agendaDetailsTitle">${escapeHtml(quote.eventName || "Detalhes da festa")}</h2>
      <span>${escapeHtml(clientName)}</span>
    </div>
    <div class="agenda-detail-grid">
      <div><span>Montagem</span><strong>${formatScheduleDateTime(quote.setupDate, quote.setupTime, quote.setupDateTime)}</strong></div>
      <div><span>Data e horário do evento</span><strong>${formatEventDate(quote.eventDate)}${quote.eventTime ? ` às ${quote.eventTime}` : ""}</strong></div>
      <div><span>Desmontagem</span><strong>${formatScheduleDateTime(quote.pickupDate, quote.pickupTime, quote.pickupDateTime)}</strong></div>
      <div><span>Local</span><strong>${escapeHtml(quote.eventLocation || "Não informado")}</strong></div>
      <div><span>Tema</span><strong>${escapeHtml(quote.eventTheme || "Não informado")}</strong></div>
      <div><span>Telefone / WhatsApp</span><strong>${escapeHtml(client.phone || "Não informado")}</strong></div>
    </div>
    <div class="agenda-detail-items">
      <span>Peças e serviços</span>
      ${(quote.items || []).map((item) => `<div class="agenda-detail-item"><strong>${escapeHtml(item.description)}</strong><span>${item.quantity}x · ${currency(item.price)}</span></div>`).join("")}
      <div class="agenda-detail-item"><strong>Total do orçamento</strong><strong>${currency(quote.total)}</strong></div>
    </div>
    ${quote.notes ? `
    <div class="agenda-detail-items">
      <span>Observações</span>
      <div class="agenda-detail-note">${escapeHtml(quote.notes)}</div>
    </div>
    ` : ""}
  `;
  agendaDetailsModal.hidden = false;
}

function showAgendaDateDetails(dateIso) {
  const dayEvents = getQuotes()
    .filter((quote) => isDashboardQuote(quote) && quote.inAgenda && quote.eventDate === dateIso)
    .sort((a, b) => String(a.eventTime || "").localeCompare(String(b.eventTime || "")));

  if (dayEvents.length === 1) {
    showAgendaQuoteDetails(dayEvents[0].id);
    return;
  }

  const dateLabel = formatEventDate(dateIso);
  agendaDetailsContent.innerHTML = `
    <div class="agenda-detail-header">
      <span class="eyebrow">Eventos da data</span>
      <h2 id="agendaDetailsTitle">${dateLabel}</h2>
      <span>${dayEvents.length ? `${dayEvents.length} eventos confirmados` : "Nenhum evento confirmado"}</span>
    </div>
    <div class="agenda-date-list">
      ${dayEvents.length ? dayEvents.map((quote) => `
        <button class="agenda-date-event" type="button" data-agenda-quote="${quote.id}">
          <strong>${escapeHtml(quote.eventName || "Festa")}</strong>
          <span>${escapeHtml(quoteClientName(quote))}${quote.eventTime ? ` · ${quote.eventTime}` : ""}</span>
          <small>Montagem: ${formatScheduleDateTime(quote.setupDate, quote.setupTime, quote.setupDateTime)}</small>
        </button>
      `).join("") : '<div class="agenda-detail-note">Nao ha eventos nessa data.</div>'}
    </div>
  `;
  agendaDetailsModal.hidden = false;
}

function currency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getQuotes() {
  return quotesCache;
}

function quoteClientName(quote) {
  const client = getClients().find((item) => String(item.id) === String(quote.quoteClient));
  return client ? client.tradeName || client.clientName || "Cliente sem nome" : "Cliente não encontrado";
}

function hasQuoteClient(quote) {
  return getClients().some((item) => String(item.id) === String(quote.quoteClient));
}

function isDashboardQuote(quote) {
  return hasQuoteClient(quote) && !quote.archived && quote.status !== "cancelled";
}

function quoteNumber(quote, index) {
  return `#${String(index + 1).padStart(5, "0")}`;
}

function formatEventDate(value) {
  if (!value) return "Data não informada";
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}

function formatDateTime(value) {
  if (!value) return "A combinar";
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function splitDateTime(value) {
  if (!value) return { date: "", time: "" };
  const [date = "", time = ""] = String(value).split("T");
  return { date, time: time.slice(0, 5) };
}

function combineDateTime(date, time) {
  if (!date) return "";
  return `${date}T${time || "00:00"}`;
}

function formatScheduleDateTime(date, time, legacyDateTime) {
  if (date) {
    const formattedDate = formatEventDate(date);
    return time ? `${formattedDate} às ${time}` : formattedDate;
  }
  return formatDateTime(legacyDateTime);
}

function renderQuotes(query = "") {
  const allQuotes = getQuotes();
  const normalized = query.toLocaleLowerCase("pt-BR").trim();
  const statusFilter = quoteStatusFilter ? quoteStatusFilter.value : "active";

  const quotes = allQuotes.map((quote, index) => ({ quote, index })).filter(({ quote, index }) => {
    const searchable = [quoteClientName(quote), quote.eventName, quoteNumber(quote, index)].join(" ").toLocaleLowerCase("pt-BR");
    const matchesSearch = !normalized || searchable.includes(normalized);
    if (!matchesSearch) return false;

    switch (statusFilter) {
      case "all":
        return true;
      case "scheduled":
        return Boolean(quote.inAgenda) && !quote.archived && quote.status !== "cancelled";
      case "archived":
        return Boolean(quote.archived);
      case "cancelled":
        return quote.status === "cancelled";
      case "active":
      default:
        return !quote.archived && quote.status !== "cancelled";
    }
  });

  quoteCount.textContent = `${quotes.length} ${quotes.length === 1 ? "orçamento" : "orçamentos"}`;
  emptyQuotes.hidden = quotes.length > 0 || Boolean(query.trim());
  quotesList.innerHTML = quotes.map(({ quote, index }) => {
    const clientName = quoteClientName(quote);
    const isApproved = quote.status === "approved" && quote.depositPaid;
    const isCancelled = quote.status === "cancelled";
    const isArchived = Boolean(quote.archived);
    const inAgenda = Boolean(quote.inAgenda);

    let extraTag = "";
    if (isCancelled) extraTag = `<span class="status cancelled">Cancelado</span>`;
    else if (isArchived) extraTag = `<span class="status archived">Arquivado</span>`;
    else if (inAgenda) extraTag = `<span class="status scheduled">Na agenda</span>`;

    return `
      <article class="quote-management-row">
        <div class="quote-management-main">
          <div class="client-avatar">${escapeHtml(clientInitials(clientName))}</div>
          <div>
            <strong>${escapeHtml(clientName)}</strong>
            <span>${quoteNumber(quote, index)} · ${escapeHtml(quote.eventName || "Festa sem nome")}</span>
          </div>
        </div>
        <div class="quote-management-detail">
          <span>Evento</span>
          <strong>${escapeHtml(quote.eventName || "Não informado")}</strong>
        </div>
        <div class="quote-management-detail">
          <span>Data</span>
          <strong>${formatEventDate(quote.eventDate)}</strong>
        </div>
        <strong class="quote-management-value">${currency(quote.total)}</strong>
        <div class="quote-management-states">
          <button class="quote-status-action ${isApproved ? "is-received" : "is-pending"}" type="button" data-confirm-quote="${quote.id}" title="${isApproved ? "Orçamento aprovado" : "Aprovar orçamento"}">
            <span class="quote-status-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${isApproved ? icons.check : icons.clock}</svg></span>
            <span>${isApproved ? "Aprovado" : "Aprovar orçamento"}</span>
          </button>
          ${extraTag}
        </div>
        <div class="quote-management-actions">
          <button class="quote-edit-action" type="button" data-quote-edit="${quote.id}" aria-label="Editar orçamento" title="Editar orçamento"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.edit}</svg></button>
          <button class="quote-pdf-action" type="button" data-quote-pdf="${quote.id}" aria-label="Visualizar PDF" title="Visualizar PDF"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.file}</svg></button>
          <button class="quote-cancel-action" type="button" data-quote-cancel="${quote.id}" aria-label="${isCancelled ? "Reativar orçamento" : "Cancelar orçamento"}" title="${isCancelled ? "Reativar orçamento" : "Cancelar orçamento"}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${isCancelled ? icons.check : icons.x}</svg></button>
          <button class="quote-archive-action" type="button" data-quote-archive="${quote.id}" aria-label="${isArchived ? "Desarquivar orçamento" : "Arquivar orçamento"}" title="${isArchived ? "Desarquivar orçamento" : "Arquivar orçamento"}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.archive}</svg></button>
        </div>
      </article>
    `;
  }).join("");

  if (!quotes.length && query.trim()) {
    quotesList.innerHTML = `
      <div class="empty-clients">
        <span class="empty-icon"><span data-icon="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons.search}</svg></span></span>
        <strong>Nenhum orçamento encontrado</strong>
        <p>Tente buscar por outro cliente, festa ou número.</p>
      </div>
    `;
  }
}

function showQuoteList() {
  quoteFormView.hidden = true;
  quotePdfView.hidden = true;
  quoteListView.hidden = false;
  renderQuotes(quoteSearch.value);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showQuoteForm(quoteId = null) {
  editingQuoteId = quoteId;
  quoteListView.hidden = true;
  quotePdfView.hidden = true;
  quoteFormView.hidden = false;
  quoteForm.reset();
  quoteItems.innerHTML = "";
  quoteDiscount.value = "0,00";
  quoteDiscountType.value = "amount";
  quoteDiscountType.dataset.previous = "amount";
  quoteDelivery.value = "0,00";
  quoteDepositPercent.value = "50";

  if (quoteId) {
    const quote = getQuotes().find((item) => String(item.id) === String(quoteId));
    if (quote) {
      prepareQuotePage();
      // fill header fields
      const fields = ["quoteClient", "eventName", "eventDate", "eventTime", "setupDate", "setupTime", "pickupDate", "pickupTime", "eventLocation", "eventTheme", "validity", "paymentMethod", "notes"];
      fields.forEach((name) => {
        const el = quoteForm.elements[name];
        if (el && quote[name] !== undefined) el.value = quote[name];
      });
      setQuoteClient(quote.quoteClient);
      if (!quote.setupDate && quote.setupDateTime) {
        const setup = splitDateTime(quote.setupDateTime);
        if (quoteForm.elements.setupDate) quoteForm.elements.setupDate.value = setup.date;
        if (quoteForm.elements.setupTime) quoteForm.elements.setupTime.value = setup.time;
      }
      if (!quote.pickupDate && quote.pickupDateTime) {
        const pickup = splitDateTime(quote.pickupDateTime);
        if (quoteForm.elements.pickupDate) quoteForm.elements.pickupDate.value = pickup.date;
        if (quoteForm.elements.pickupTime) quoteForm.elements.pickupTime.value = pickup.time;
      }
      quoteDiscount.value = quote.discount ? String(quote.discount).replace(".", ",") : "0,00";
      quoteDiscountType.value = quote.discountType || "amount";
      quoteDiscountType.dataset.previous = quoteDiscountType.value;
      quoteDelivery.value = quote.delivery ? String(quote.delivery).replace(".", ",") : "0,00";
      quoteDepositPercent.value = quote.depositPercent || 50;
      (quote.items || []).forEach((item) => addQuoteItem(item));
      updateQuoteTotals();
      // update form title
      const heading = quoteFormView.querySelector("h1, h2");
      if (heading) heading.textContent = "Editar orçamento";
      const submitBtn = quoteForm.querySelector("[type=submit]");
      if (submitBtn) submitBtn.textContent = "Salvar alterações";
    }
  } else {
    const heading = quoteFormView.querySelector("h1, h2");
    if (heading) heading.textContent = "Novo orçamento";
    const submitBtn = quoteForm.querySelector("[type=submit]");
    if (submitBtn) submitBtn.textContent = "Salvar orçamento";
    prepareQuotePage();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuotePdf(quote) {
  const allQuotes = getQuotes();
  const index = allQuotes.findIndex((item) => String(item.id) === String(quote.id));
  const client = getClients().find((item) => String(item.id) === String(quote.quoteClient)) || {};
  const clientName = client.tradeName || client.clientName || "Cliente não encontrado";
  const itemsSubtotal = (quote.items || []).reduce((total, item) => total + Number(item.quantity || 0) * Number(item.price || 0), 0);
  const discountValue = quoteDiscountAmount(itemsSubtotal, quote.discount, quote.discountType || "amount");
  const discountLabel = quote.discountType === "percent" ? `${Number(quote.discount || 0)}%` : currency(discountValue);
  const total = Number(quote.total || 0);
  const depositPercent = Number(quote.depositPercent || 50);
  const deposit = total * depositPercent / 100;
  const clientAddress = [client.street, client.number, client.district, client.city, client.state].filter(Boolean).join(", ");
  const createdAt = new Date(Number(quote.id)).toLocaleDateString("pt-BR");

  pdfDocument.innerHTML = `
    <header class="pdf-header">
      <div class="pdf-brand">
        <img src="assets/yupii-wordmark.png" alt="Yupii" />
        <div class="pdf-brand-copy">
          <strong>${companyInfo.name}</strong>
          <span>CNPJ ${companyInfo.cnpj}</span>
          <span>${companyInfo.owner}</span>
          <span>${companyInfo.address} · ${companyInfo.phone}</span>
        </div>
      </div>
      <div class="pdf-number">
        <span>ORÇAMENTO</span>
        <strong>${quoteNumber(quote, Math.max(index, 0))}</strong>
        <span>Emitido em ${createdAt}</span>
      </div>
    </header>

    <section class="pdf-intro">
      <h2>${escapeHtml(quote.eventName || "Orçamento para evento")}</h2>
      <p>Proposta de locação de materiais, personalizados e serviços para o seu evento.</p>
    </section>

    <section class="pdf-meta-grid">
      <div class="pdf-meta-item"><span>Cliente</span><strong>${escapeHtml(clientName)}</strong></div>
      <div class="pdf-meta-item"><span>${client.personType === "cnpj" ? "CNPJ" : "CPF"}</span><strong>${escapeHtml(client.document || "Não informado")}</strong></div>
      <div class="pdf-meta-item"><span>Telefone / WhatsApp</span><strong>${escapeHtml(client.phone || "Não informado")}</strong></div>
      <div class="pdf-meta-item"><span>Data e horário do evento</span><strong>${formatEventDate(quote.eventDate)}${quote.eventTime ? ` às ${escapeHtml(quote.eventTime)}` : ""}</strong></div>
      <div class="pdf-meta-item"><span>Local do evento</span><strong>${escapeHtml(quote.eventLocation || clientAddress || "Não informado")}</strong></div>
      <div class="pdf-meta-item"><span>Tema</span><strong>${escapeHtml(quote.eventTheme || "Não informado")}</strong></div>
    </section>

    <section class="pdf-section">
      <h3 class="pdf-section-title">Informações do evento</h3>
      <div class="pdf-meta-grid">
        <div class="pdf-meta-item"><span>Data do evento</span><strong>${formatEventDate(quote.eventDate)}</strong></div>
        <div class="pdf-meta-item"><span>Horário</span><strong>${escapeHtml(quote.eventTime || "A combinar")}</strong></div>
        <div class="pdf-meta-item"><span>Montagem</span><strong>${formatScheduleDateTime(quote.setupDate, quote.setupTime, quote.setupDateTime)}</strong></div>
        <div class="pdf-meta-item"><span>Desmontagem</span><strong>${formatScheduleDateTime(quote.pickupDate, quote.pickupTime, quote.pickupDateTime)}</strong></div>
        <div class="pdf-meta-item"><span>Local</span><strong>${escapeHtml(quote.eventLocation || "Não informado")}</strong></div>
      </div>
    </section>

    <section class="pdf-section">
      <span class="pdf-section-title">Peças e serviços incluídos</span>
      <table class="pdf-items-table">
        <thead><tr><th>Descrição</th><th>Tipo</th><th>Qtd.</th><th>Valor unitário</th><th>Total</th></tr></thead>
        <tbody>${(quote.items || []).map((item) => `
          <tr><td>${escapeHtml(item.description)}</td><td>${escapeHtml(item.type)}</td><td>${item.quantity}</td><td>${currency(item.price)}</td><td>${currency(Number(item.quantity) * Number(item.price))}</td></tr>
        `).join("")}</tbody>
      </table>
    </section>

    <section class="pdf-financial">
      <div class="pdf-conditions">
        <span class="pdf-section-title">Condições da proposta</span>
        <p>Validade deste orçamento: ${escapeHtml(quote.validity || "15")} dias.</p>
        <p>Forma de pagamento: ${escapeHtml(quote.paymentMethod || "Pix")}.</p>
        <p>A reserva da data será confirmada após o pagamento do sinal.</p>
        ${quote.notes ? `<p><strong>Observações:</strong> ${escapeHtml(quote.notes)}</p>` : ""}
      </div>
      <div>
        <div class="pdf-totals">
          <div><span>Itens e serviços</span><strong>${currency(itemsSubtotal)}</strong></div>
          <div><span>Desconto${quote.discountType === "percent" ? ` (${discountLabel})` : ""}</span><strong>- ${currency(discountValue)}</strong></div>
          <div><span>Frete / entrega</span><strong>${currency(quote.delivery)}</strong></div>
          <div class="pdf-grand-total"><span>Total</span><strong>${currency(total)}</strong></div>
        </div>
        <div class="pdf-payment-box">
          <span>Sinal para reservar a data</span>
          <strong>${depositPercent}% · ${currency(deposit)}</strong>
        </div>
      </div>
    </section>

    <footer class="pdf-footer">
      <div class="pdf-signature">${quote.priscilaSignature ? '<img class="pdf-signature-image" src="assets/priscila-signature.png" alt="Assinatura de Priscila Carvalho Ribeiro" />' : ""}<strong>${companyInfo.owner}</strong><span>Yupii Personalizados e Festas</span></div>
      <div class="pdf-signature"><strong>${escapeHtml(clientName)}</strong><span>Aceite do cliente</span></div>
    </footer>
  `;
}

function showQuotePdf(quoteId) {
  const quote = getQuotes().find((item) => String(item.id) === String(quoteId));
  if (!quote) return;
  activePdfQuote = quote;
  quoteListView.hidden = true;
  quoteFormView.hidden = true;
  quotePdfView.hidden = false;
  renderQuotePdf(quote);
  addSignaturePdf.innerHTML = quote.priscilaSignature
    ? '<span data-icon="x"></span> Remover assinatura'
    : '<span data-icon="edit"></span> Adicionar assinatura';
  addIcons(addSignaturePdf);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function parseMoney(value) {
  const normalized = String(value || "0").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return Number(normalized) || 0;
}

function themeItemsTotal() {
  return [...themeItems.querySelectorAll(".theme-item-row")].reduce((total, row) => {
    const quantity = Number(row.querySelector(".theme-item-quantity").value) || 0;
    const price = parseMoney(row.querySelector(".theme-item-price").value);
    return total + quantity * price;
  }, 0);
}

function updateThemePackageTotal() {
  const packagePrice = Math.max(0, themeItemsTotal() - parseMoney(document.querySelector("#packageDiscount").value));
  document.querySelector("#packagePrice").value = currency(packagePrice).replace("R$", "").trim();
}

function quoteDiscountAmount(subtotal, value = quoteDiscount.value, type = quoteDiscountType.value) {
  const parsed = parseMoney(value);
  if (type === "percent") return subtotal * Math.min(100, Math.max(0, parsed)) / 100;
  return Math.min(subtotal, Math.max(0, parsed));
}

function quoteItemsSubtotal() {
  return [...quoteItems.querySelectorAll(".quote-item-row")].reduce((total, row) => {
    return total + (Number(row.querySelector(".item-quantity").value) || 0) * parseMoney(row.querySelector(".item-price").value);
  }, 0);
}

function formatDiscountInput(value, type) {
  const safeValue = Math.max(0, Number(value) || 0);
  if (type === "percent") {
    return String(Math.round(safeValue * 100) / 100).replace(".", ",");
  }
  return currency(safeValue).replace("R$", "").trim();
}

function convertQuoteDiscountType() {
  const newType = quoteDiscountType.value;
  const previousType = quoteDiscountType.dataset.previous || "amount";
  if (newType === previousType) {
    updateQuoteTotals();
    return;
  }
  const subtotal = quoteItemsSubtotal();
  const currentDiscountAmount = quoteDiscountAmount(subtotal, quoteDiscount.value, previousType);
  const convertedValue = newType === "percent" && subtotal > 0
    ? currentDiscountAmount / subtotal * 100
    : currentDiscountAmount;
  quoteDiscount.value = formatDiscountInput(convertedValue, newType);
  quoteDiscountType.dataset.previous = newType;
  updateQuoteTotals();
}

function applyPackageDiscountToQuote(amount) {
  if (!amount || amount <= 0) return;
  const currentSubtotal = quoteItemsSubtotal();
  const currentDiscount = quoteDiscountAmount(currentSubtotal);
  quoteDiscountType.value = "amount";
  quoteDiscountType.dataset.previous = "amount";
  quoteDiscount.value = String(currentDiscount + amount).replace(".", ",");
}

function removePackageDiscountFromQuote(amount) {
  if (!amount || amount <= 0) return;
  const currentDiscount = quoteDiscountAmount(quoteItemsSubtotal());
  quoteDiscountType.value = "amount";
  quoteDiscountType.dataset.previous = "amount";
  quoteDiscount.value = String(Math.max(0, currentDiscount - amount)).replace(".", ",");
}

function addQuoteItem(data = {}, container = quoteItems) {
  const row = document.createElement("div");
  row.className = "quote-item-row";
  if (data.extraClass) row.classList.add(data.extraClass);
  row.innerHTML = `
    <input class="item-description" aria-label="Descrição do item" placeholder="Ex.: Painel redondo" value="${escapeHtml(data.description || "")}" required />
    <select class="item-type" aria-label="Tipo do item"><option>Locação</option><option>Serviço</option><option>Personalizado</option><option>Desconto</option></select>
    <input class="item-quantity" aria-label="Quantidade" type="number" min="1" value="${data.quantity || 1}" />
    <input class="item-price" aria-label="Valor unitário" inputmode="decimal" placeholder="0,00" value="${data.price !== undefined && data.price !== "" ? String(data.price).replace(".", ",") : ""}" />
    <strong class="quote-item-total">R$ 0,00</strong>
    <button class="remove-quote-item" type="button" aria-label="Remover item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.trash}</svg></button>
  `;
  if (data.type) row.querySelector(".item-type").value = data.type;
  container.appendChild(row);
  updateQuoteTotals();
  return row;
}

function updateQuoteTotals() {
  let subtotal = 0;
  quoteItems.querySelectorAll(".quote-item-row").forEach((row) => {
    const quantity = Number(row.querySelector(".item-quantity").value) || 0;
    const price = parseMoney(row.querySelector(".item-price").value);
    const itemTotal = quantity * price;
    row.querySelector(".quote-item-total").textContent = currency(itemTotal);
    subtotal += itemTotal;
  });
  const total = Math.max(0, subtotal - quoteDiscountAmount(subtotal) + parseMoney(quoteDelivery.value));
  const deposit = total * Math.min(100, Math.max(0, Number(quoteDepositPercent.value) || 0)) / 100;
  quoteSubtotal.textContent = currency(subtotal);
  quoteTotal.textContent = currency(total);
  quoteDeposit.textContent = currency(deposit);
}

function renderPackagePicker() {
  const themes = getThemes();
  emptyPackagePicker.hidden = themes.length > 0;
  packagePickerList.innerHTML = themes.map((theme) => {
    const items = theme.items || [];
    const isSingle = isCatalogSingle(theme);
    const itemsSum = items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.price || 0), 0);
    const savings = itemsSum - Number(theme.packagePrice || 0);
    return `
      <div class="package-picker-item" data-package-item="${theme.id}">
        <div class="package-picker-row" data-package-toggle="${theme.id}">
          <div class="package-picker-main">
            <strong>${escapeHtml(theme.themeName)}</strong>
            <span>${escapeHtml(isSingle ? "Item avulso" : theme.packageName)}</span>
          </div>
          <div class="package-picker-count">${isSingle ? "Item avulso" : `${items.length} ${items.length === 1 ? "item incluso" : "itens inclusos"}`}</div>
          <strong class="package-picker-price">${currency(theme.packagePrice)}</strong>
          <span class="client-expand-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.down}</svg></span>
        </div>
        <div class="package-picker-details">
          ${theme.themeDescription ? `<div class="client-detail-item"><span>Descrição</span><strong>${escapeHtml(theme.themeDescription)}</strong></div>` : ""}
          <div class="theme-included-list">${items.map((item) => `<span class="theme-included-item">${escapeHtml(item.name)} · ${item.quantity}x · ${currency(item.price)}</span>`).join("")}</div>
          ${!isSingle && savings > 0 ? `<span class="package-picker-savings">Economia de ${currency(savings)} em relação à soma dos itens (${currency(itemsSum)}).</span>` : ""}
          <button class="primary-button package-picker-add" type="button" data-package-add="${theme.id}"><span data-icon="plus"></span> ${isSingle ? "Adicionar item" : "Adicionar ao orçamento"}</button>
        </div>
      </div>
    `;
  }).join("");
  packagePickerList.querySelectorAll("[data-icon]").forEach((element) => {
    const icon = icons[element.dataset.icon];
    if (!icon || element.closest(".package-picker-row")) return;
    element.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;
  });
}

function openPackagePicker() {
  renderPackagePicker();
  packagePickerModal.hidden = false;
}

function closePackagePicker() {
  packagePickerModal.hidden = true;
}

function addPackageToQuote(themeId) {
  const theme = getThemes().find((item) => String(item.id) === String(themeId));
  if (!theme) return;

  if (isCatalogSingle(theme)) {
    const item = (theme.items || [])[0] || {};
    addQuoteItem({
      description: item.name || theme.themeName,
      type: item.type || "Locação",
      quantity: item.quantity || 1,
      price: item.price ?? theme.packagePrice,
    });
    toast.textContent = "Item avulso adicionado ao orçamento.";
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
    return;
  }

  const group = document.createElement("div");
  group.className = "quote-package-group";
  group.dataset.packageGroup = theme.id;
  const packageItemsSum = (theme.items || []).reduce((total, item) => total + Number(item.quantity || 0) * Number(item.price || 0), 0);
  const packageDiscount = Math.max(0, packageItemsSum - Number(theme.packagePrice || 0));
  group.dataset.packageDiscount = String(packageDiscount);
  group.innerHTML = `
    <div class="quote-package-header">
      <div class="quote-package-title">
        <strong><span data-icon="box"></span> ${escapeHtml(theme.themeName)} · ${escapeHtml(theme.packageName)}</strong>
        <span>Pacote do catálogo · ${currency(theme.packagePrice)}</span>
      </div>
      <button class="remove-quote-package" type="button" aria-label="Remover pacote inteiro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons.trash}</svg></button>
    </div>
  `;
  group.querySelector("[data-icon]").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons.box}</svg>`;
  quoteItems.appendChild(group);

  let itemsSum = 0;
  (theme.items || []).forEach((item) => {
    addQuoteItem({ description: item.name, type: item.type, quantity: item.quantity, price: item.price }, group);
    itemsSum += Number(item.quantity || 0) * Number(item.price || 0);
  });

  applyPackageDiscountToQuote(packageDiscount);

  updateQuoteTotals();
  toast.textContent = "Pacote adicionado ao orçamento.";
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

addQuotePackageButton.addEventListener("click", openPackagePicker);
closePackagePickerButton.addEventListener("click", closePackagePicker);
packagePickerModal.addEventListener("click", (event) => {
  if (event.target === packagePickerModal) closePackagePicker();
});
packagePickerList.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-package-add]");
  if (addButton) {
    addPackageToQuote(addButton.dataset.packageAdd);
    closePackagePicker();
    return;
  }
  const toggle = event.target.closest("[data-package-toggle]");
  if (toggle) {
    const item = toggle.closest(".package-picker-item");
    item.classList.toggle("expanded");
  }
});

function prepareQuotePage() {
  const selected = quoteClient.value;
  setQuoteClient(selected);
  renderQuoteClientSuggestions(quoteClientSearch.value);
}

function quoteClientDisplayName(client) {
  return client.tradeName || client.clientName || "Cliente sem nome";
}

function setQuoteClient(clientId) {
  const client = getClients().find((item) => String(item.id) === String(clientId));
  quoteClient.value = client ? client.id : "";
  quoteClientSearch.value = client ? `${quoteClientDisplayName(client)} · ${client.document || "sem documento"}` : "";
}

function renderQuoteClientSuggestions(query = "") {
  const normalized = query.toLocaleLowerCase("pt-BR").trim();
  const normalizedDigits = digits(query);
  const clients = getClients()
    .filter((client) => {
      const searchable = [client.clientName, client.tradeName, client.document, client.phone].join(" ").toLocaleLowerCase("pt-BR");
      return !normalized || searchable.includes(normalized) || digits(searchable).includes(normalizedDigits);
    })
    .slice(0, 8);

  quoteClientSuggestions.innerHTML = clients.length
    ? clients.map((client) => `
      <button class="client-combobox-option" type="button" data-quote-client-option="${client.id}">
        <strong>${escapeHtml(quoteClientDisplayName(client))}</strong>
        <span>${escapeHtml(client.document || client.phone || "Sem documento")}</span>
      </button>
    `).join("")
    : '<div class="client-combobox-empty">Nenhum cliente encontrado</div>';
  quoteClientSuggestions.hidden = false;
}
addQuoteItemButton.addEventListener("click", () => addQuoteItem());
newQuoteActions.forEach((button) => button.addEventListener("click", () => showQuoteForm()));
quoteClientSearch.addEventListener("input", () => {
  quoteClient.value = "";
  renderQuoteClientSuggestions(quoteClientSearch.value);
});
quoteClientSearch.addEventListener("focus", () => renderQuoteClientSuggestions(quoteClientSearch.value));
quoteClientSuggestions.addEventListener("click", (event) => {
  const option = event.target.closest("[data-quote-client-option]");
  if (!option) return;
  setQuoteClient(option.dataset.quoteClientOption);
  quoteClientSuggestions.hidden = true;
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("#quoteClientCombobox")) quoteClientSuggestions.hidden = true;
});
quoteSearch.addEventListener("input", () => renderQuotes(quoteSearch.value));
if (quoteStatusFilter) {
  quoteStatusFilter.addEventListener("change", () => renderQuotes(quoteSearch.value));
}
quotesList.addEventListener("click", async (event) => {
  const confirmButton = event.target.closest("[data-confirm-quote]");
  if (confirmButton) {
    const quotes = getQuotes();
    const quote = quotes.find((item) => String(item.id) === String(confirmButton.dataset.confirmQuote));
    if (quote) {
      if (quote.status === "approved" && quote.depositPaid) {
        openSignalReversal(quote.id);
      } else {
        quote.status = "approved";
        quote.depositPaid = true;
        quote.inAgenda = true;
        await saveQuote(quote);
        renderQuotes(quoteSearch.value);
        renderCalendar();
        renderHome();
        toast.textContent = "Orçamento aprovado e enviado para a agenda.";
        toast.classList.add("visible");
        window.setTimeout(() => toast.classList.remove("visible"), 2800);
      }
    }
    return;
  }
  const editButton = event.target.closest("[data-quote-edit]");
  if (editButton) {
    showPage("quotes");
    showQuoteForm(editButton.dataset.quoteEdit);
    return;
  }
  const button = event.target.closest("[data-quote-pdf]");
  if (button) {
    showQuotePdf(button.dataset.quotePdf);
    return;
  }

  const cancelButton = event.target.closest("[data-quote-cancel]");
  if (cancelButton) {
    openQuoteActionModal("cancel", cancelButton.dataset.quoteCancel);
    return;
  }

  const archiveButton = event.target.closest("[data-quote-archive]");
  if (archiveButton) {
    openQuoteActionModal("archive", archiveButton.dataset.quoteArchive);
    return;
  }
});

// ─── Home page dynamic render ───────────────────────────────────────────────
function openQuoteActionModal(action, quoteId) {
  const quote = getQuotes().find((item) => String(item.id) === String(quoteId));
  if (!quote) return;
  pendingQuoteAction = { action, quoteId };
  const isUndo = action === "cancel" ? quote.status === "cancelled" : Boolean(quote.archived);
  quoteActionTitle.textContent = action === "cancel"
    ? (isUndo ? "Reativar orçamento?" : "Cancelar orçamento?")
    : (isUndo ? "Desarquivar orçamento?" : "Arquivar orçamento?");
  quoteActionMessage.textContent = action === "cancel"
    ? (isUndo ? "O orçamento voltará para a lista ativa." : "O orçamento sairá da agenda e da lista ativa.")
    : (isUndo ? "O orçamento voltará para a lista ativa." : "O orçamento será removido da lista ativa, mas ficará em Arquivados.");
  confirmQuoteAction.textContent = isUndo ? "Sim, reativar" : "Sim, confirmar";
  quoteActionModal.hidden = false;
}

function closeQuoteActionModal() {
  pendingQuoteAction = null;
  quoteActionModal.hidden = true;
}

async function applyPendingQuoteAction() {
  if (!pendingQuoteAction) return;
  const { action, quoteId } = pendingQuoteAction;
  const quote = getQuotes().find((item) => String(item.id) === String(quoteId));
  if (!quote) {
    closeQuoteActionModal();
    return;
  }

  if (action === "cancel") {
    if (quote.status === "cancelled") {
      quote.status = "draft";
      delete quote.cancelledAt;
      toast.textContent = "Orçamento reativado.";
    } else {
      quote.status = "cancelled";
      quote.cancelledAt = new Date().toISOString();
      quote.inAgenda = false;
      toast.textContent = "Orçamento cancelado.";
    }
  } else {
    if (quote.archived) {
      quote.archived = false;
      delete quote.archivedAt;
      toast.textContent = "Orçamento desarquivado.";
    } else {
      quote.archived = true;
      quote.archivedAt = new Date().toISOString();
      toast.textContent = "Orçamento arquivado.";
    }
  }

  await saveQuote(quote);
  renderQuotes(quoteSearch.value);
  renderCalendar();
  renderHome();
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
  closeQuoteActionModal();
}

cancelQuoteAction.addEventListener("click", closeQuoteActionModal);
confirmQuoteAction.addEventListener("click", applyPendingQuoteAction);
quoteActionModal.addEventListener("click", (event) => {
  if (event.target === quoteActionModal) closeQuoteActionModal();
});

const homeQuoteList = document.querySelector("#homeQuoteList");
const homeEmptyQuotes = document.querySelector("#homeEmptyQuotes");
const homeEventList = document.querySelector("#homeEventList");
const homeEmptyEvents = document.querySelector("#homeEmptyEvents");
const homeViewAllQuotes = document.querySelector("#homeViewAllQuotes");
const homeViewAgenda = document.querySelector("#homeViewAgenda");

const monthNames = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
const monthAccentColors = ["mint","peach","mint","","peach","","mint","peach","","mint","peach",""];

function renderHome() {
  const allQuotes = getQuotes();
  // ── Orçamentos recentes: últimos 4 ──────────────────────────────────────
  const dashboardQuotes = allQuotes.filter(isDashboardQuote);
  const recentQuotes = [...dashboardQuotes].reverse().slice(0, 4);
  homeEmptyQuotes.hidden = recentQuotes.length > 0;
  const quoteRows = recentQuotes.map((quote, i) => {
    const globalIndex = allQuotes.findIndex((q) => String(q.id) === String(quote.id));
    const clientName = quoteClientName(quote);
    const initials = clientInitials(clientName);
    const isApproved = quote.status === "approved" && quote.depositPaid;
    const statusLabel = isApproved ? "Aprovado" : "Rascunho";
    const statusClass = isApproved ? "approved" : "draft";
    let dateLabel = "";
    if (quote.eventDate) {
      const d = new Date(`${quote.eventDate}T12:00:00`);
      dateLabel = `${String(d.getDate()).padStart(2, "0")} ${monthNames[d.getMonth()]}`;
    }
    return `
      <article class="quote-row" style="cursor:pointer" data-home-open-quote="${quote.id}">
        <div class="quote-client">
          <div class="client-avatar">${escapeHtml(initials)}</div>
          <div>
            <strong>${escapeHtml(clientName)}</strong>
            <span>${quoteNumber(quote, globalIndex)} · ${escapeHtml(quote.eventName || "Festa")}</span>
          </div>
        </div>
        ${dateLabel ? `<div class="quote-date"><span>Data do evento</span><strong>${dateLabel}</strong></div>` : ""}
        <strong class="quote-value">${currency(quote.total)}</strong>
        <span class="status ${statusClass}">${statusLabel}</span>
      </article>
    `;
  }).join("");
  homeQuoteList.querySelectorAll(".quote-row").forEach((el) => el.remove());
  homeEmptyQuotes.insertAdjacentHTML("beforebegin", quoteRows);

  // ── Próximos eventos: aprovados com data >= hoje ─────────────────────────
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = allQuotes
    .filter((q) => isDashboardQuote(q) && q.inAgenda && q.eventDate)
    .map((q) => ({ q, d: new Date(`${q.eventDate}T12:00:00`) }))
    .filter(({ d }) => d >= today)
    .sort((a, b) => a.d - b.d)
    .slice(0, 4);
  homeEmptyEvents.hidden = upcoming.length > 0;
  const eventCards = upcoming.map(({ q, d }, i) => {
    const accentClass = monthAccentColors[d.getMonth()] ? `class="event-date ${monthAccentColors[d.getMonth()]}"` : `class="event-date"`;
    const clientName = quoteClientName(q);
    const timeLabel = q.eventTime ? `${q.eventTime} · ` : "";
    return `
      <article class="event-card">
        <div ${accentClass}><strong>${d.getDate()}</strong><span>${monthNames[d.getMonth()]}</span></div>
        <div>
          <strong>${escapeHtml(q.eventName || "Evento")}</strong>
          <span>${timeLabel}${escapeHtml(clientName)}</span>
        </div>
      </article>
    `;
  }).join("");
  homeEventList.querySelectorAll(".event-card").forEach((el) => el.remove());
  homeEmptyEvents.insertAdjacentHTML("beforebegin", eventCards);
}

homeQuoteList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-home-open-quote]");
  if (row) {
    showPage("quotes");
    showQuoteForm(row.dataset.homeOpenQuote);
  }
});

homeViewAllQuotes.addEventListener("click", () => showPage("quotes"));
homeViewAgenda.addEventListener("click", () => showPage("agenda"));
cancelConfirm.addEventListener("click", closeSignalReversal);
approveConfirm.addEventListener("click", async () => {
  const quotes = getQuotes();
  const quote = quotes.find((item) => String(item.id) === String(pendingSignalReversalId));
  if (quote) {
    quote.status = "draft";
    quote.depositPaid = false;
    quote.inAgenda = false;
    await saveQuote(quote);
    renderQuotes(quoteSearch.value);
    renderCalendar();
    renderHome();
    toast.textContent = "Aprovação revertida. Evento removido da agenda.";
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
  }
  closeSignalReversal();
});
confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) closeSignalReversal();
});

function closeDeleteClientModal() {
  pendingDeleteClientId = null;
  pendingDeleteThemeId = null;
  deleteClientTitle.textContent = "Excluir cliente?";
  confirmDeleteClient.textContent = "Sim, excluir";
  deleteClientModal.hidden = true;
}

cancelDeleteClient.addEventListener("click", closeDeleteClientModal);
deleteClientModal.addEventListener("click", (event) => {
  if (event.target === deleteClientModal) closeDeleteClientModal();
});
confirmDeleteClient.addEventListener("click", async () => {
  if (!pendingDeleteClientId && !pendingDeleteThemeId) return;
  try {
    if (pendingDeleteThemeId) {
      await removeTheme(pendingDeleteThemeId);
      renderThemes(themeSearch.value);
      toast.textContent = "Cadastro excluído com sucesso.";
    } else {
      await removeClient(pendingDeleteClientId);
      renderClients(clientSearch.value);
      renderQuotes(quoteSearch.value);
      renderHome();
      renderCalendar();
      toast.textContent = "Cliente excluído com sucesso.";
    }
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
  } catch (error) {
    console.error(error);
    toast.textContent = pendingDeleteThemeId ? "Não foi possível excluir este cadastro." : "Não foi possível excluir o cliente.";
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
  }
  closeDeleteClientModal();
});
calendarGrid.addEventListener("click", (event) => {
  const eventButton = event.target.closest("[data-agenda-quote]");
  if (eventButton) {
    showAgendaQuoteDetails(eventButton.dataset.agendaQuote);
    return;
  }
  const day = event.target.closest("[data-agenda-date]");
  if (day) showAgendaDateDetails(day.dataset.agendaDate);
});
calendarGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const day = event.target.closest("[data-agenda-date]");
  if (!day) return;
  event.preventDefault();
  showAgendaDateDetails(day.dataset.agendaDate);
});
closeAgendaDetails.addEventListener("click", () => agendaDetailsModal.hidden = true);
agendaDetailsModal.addEventListener("click", (event) => {
  if (event.target === agendaDetailsModal) agendaDetailsModal.hidden = true;
  const eventButton = event.target.closest("[data-agenda-quote]");
  if (eventButton) showAgendaQuoteDetails(eventButton.dataset.agendaQuote);
});
backFromPdf.addEventListener("click", showQuoteList);

addSignaturePdf.addEventListener("click", async () => {
  if (!activePdfQuote) return;
  activePdfQuote.priscilaSignature = !activePdfQuote.priscilaSignature;
  const saved = await saveQuote(activePdfQuote);
  activePdfQuote = saved;
  renderQuotePdf(activePdfQuote);
  addSignaturePdf.innerHTML = activePdfQuote.priscilaSignature
    ? '<span data-icon="x"></span> Remover assinatura'
    : '<span data-icon="edit"></span> Adicionar assinatura';
  addIcons();
  toast.textContent = activePdfQuote.priscilaSignature ? "Assinatura adicionada ao orçamento." : "Assinatura removida do orçamento.";
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
});

function showPdfError(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

async function generateQuotePdfBlob() {
  if (!activePdfQuote || typeof html2pdf === "undefined") {
    throw new Error("PDF indisponivel");
  }
  const quoteIndex = Math.max(0, getQuotes().findIndex((quote) => String(quote.id) === String(activePdfQuote.id)));
  const fileName = `orcamento-yupii-${quoteNumber(activePdfQuote, quoteIndex).replace("#", "")}.pdf`;
  const options = {
    margin: 0,
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"], avoid: [".pdf-section", ".pdf-financial", ".pdf-footer", ".pdf-signature"] },
  };
  const blob = await html2pdf().set(options).from(pdfDocument).outputPdf("blob");
  return { blob, fileName, quoteIndex };
}

async function handleQuotePdfAction(action) {
  const originalText = shareQuotePdf.innerHTML;
  shareQuotePdf.disabled = true;
  downloadQuotePdf.disabled = true;
  confirmShareQuotePdf.disabled = true;
  shareQuotePdf.textContent = "Gerando PDF...";

  try {
    const { blob, fileName, quoteIndex } = await generateQuotePdfBlob();
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (action === "share") {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Orçamento Yupii",
          text: `Orçamento ${quoteNumber(activePdfQuote, quoteIndex)} - Yupii Personalizados e Festas`,
        });
      } else {
        showPdfError("Compartilhamento indisponível neste aparelho. Baixei o PDF para você.");
        downloadPdfBlob(blob, fileName);
      }
    } else {
      downloadPdfBlob(blob, fileName);
      showPdfError("PDF salvo no aparelho.");
    }
  } catch (error) {
    if (error.name !== "AbortError") showPdfError("Não foi possível gerar o PDF.");
  } finally {
    pdfChoiceModal.hidden = true;
    shareQuotePdf.disabled = false;
    downloadQuotePdf.disabled = false;
    confirmShareQuotePdf.disabled = false;
    shareQuotePdf.innerHTML = originalText;
  }
}

function downloadPdfBlob(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

shareQuotePdf.addEventListener("click", () => {
  if (!activePdfQuote || typeof html2pdf === "undefined") {
    showPdfError("Não foi possível gerar o PDF. Verifique sua conexão.");
    return;
  }
  pdfChoiceModal.hidden = false;
});

downloadQuotePdf.addEventListener("click", () => handleQuotePdfAction("download"));
confirmShareQuotePdf.addEventListener("click", () => handleQuotePdfAction("share"));
pdfChoiceModal.addEventListener("click", (event) => {
  if (event.target === pdfChoiceModal) pdfChoiceModal.hidden = true;
});
quoteItems.addEventListener("input", updateQuoteTotals);
quoteItems.addEventListener("click", (event) => {
  const packageButton = event.target.closest(".remove-quote-package");
  if (packageButton) {
    const group = packageButton.closest(".quote-package-group");
    removePackageDiscountFromQuote(parseMoney(group.dataset.packageDiscount));
    group.remove();
    updateQuoteTotals();
    return;
  }
  const removeButton = event.target.closest(".remove-quote-item");
  if (removeButton) {
    removeButton.closest(".quote-item-row").remove();
    updateQuoteTotals();
  }
});
[quoteDiscount, quoteDelivery, quoteDepositPercent].forEach((input) => input.addEventListener("input", updateQuoteTotals));
quoteDiscountType.addEventListener("change", convertQuoteDiscountType);
cancelQuote.addEventListener("click", showQuoteList);

quoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!quoteClient.value) {
    quoteClientSearch.focus();
    quoteClientSuggestions.hidden = false;
    renderQuoteClientSuggestions(quoteClientSearch.value);
    toast.textContent = "Selecione um cliente da lista.";
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
    return;
  }
  const quotes = getQuotes();
  const data = Object.fromEntries(new FormData(quoteForm).entries());
  data.company = companyInfo;
  data.items = [...quoteItems.querySelectorAll(".quote-item-row")].map((row) => ({
    description: row.querySelector(".item-description").value,
    type: row.querySelector(".item-type").value,
    quantity: Number(row.querySelector(".item-quantity").value),
    price: parseMoney(row.querySelector(".item-price").value),
  }));
  data.discount = parseMoney(quoteDiscount.value);
  data.discountType = quoteDiscountType.value;
  data.delivery = parseMoney(quoteDelivery.value);
  data.depositPercent = Number(quoteDepositPercent.value) || 0;
  data.total = parseMoney(quoteTotal.textContent);
  data.setupDateTime = combineDateTime(data.setupDate, data.setupTime);
  data.pickupDateTime = combineDateTime(data.pickupDate, data.pickupTime);

  if (editingQuoteId) {
    const index = quotes.findIndex((q) => String(q.id) === String(editingQuoteId));
    if (index !== -1) {
      const existingQuote = quotes[index];
      data.id = existingQuote.id;
      data.status = existingQuote.status;
      data.depositPaid = Boolean(existingQuote.depositPaid);
      data.inAgenda = Boolean(existingQuote.inAgenda);
      data.archived = Boolean(existingQuote.archived);
      if (existingQuote.archivedAt) data.archivedAt = existingQuote.archivedAt;
      if (existingQuote.cancelledAt) data.cancelledAt = existingQuote.cancelledAt;
    }
    toast.textContent = "Orçamento atualizado com sucesso.";
  } else {
    data.id = createId();
    data.status = "draft";
    toast.textContent = "Orçamento salvo como rascunho.";
  }

  editingQuoteId = null;
  await saveQuote(data);
  renderHome();
  renderCalendar();
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
  showQuoteList();
});

function formatCpf(value) {
  return digits(value).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCnpj(value) {
  return digits(value).slice(0, 14).replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
}

function currentPersonType() {
  return document.querySelector('input[name="personType"]:checked').value;
}

function clearCompanyFields() {
  [
    "clientName",
    "tradeName",
    "phone",
    "email",
    "zipCode",
    "street",
    "number",
    "district",
    "city",
    "state",
  ].forEach((id) => {
    document.querySelector(`#${id}`).value = "";
  });
}

function updatePersonType() {
  const isCompany = currentPersonType() === "cnpj";
  clearCompanyFields();
  companyOnlyFields.forEach((field) => field.hidden = !isCompany);
  searchCnpjButton.hidden = !isCompany;
  documentLabel.textContent = isCompany ? "CNPJ" : "CPF";
  nameLabel.textContent = isCompany ? "Razão social" : "Nome completo";
  document.querySelector("#clientName").placeholder = isCompany ? "Preenchida pela busca ou digitada manualmente" : "Ex.: Maria da Silva";
  identificationHelp.textContent = isCompany ? "Digite o CNPJ para preencher os dados automaticamente." : "Informe o CPF e o nome do cliente.";
  documentInput.placeholder = isCompany ? "00.000.000/0000-00" : "000.000.000-00";
  documentInput.value = "";
  documentMessage.textContent = isCompany ? "Digite o CNPJ e clique em buscar." : "Somente números ou CPF formatado.";
  documentMessage.className = "";
  document.querySelectorAll(".type-option").forEach((option) => option.classList.toggle("active", option.querySelector("input").checked));
}

personTypeInputs.forEach((input) => input.addEventListener("change", updatePersonType));
documentInput.addEventListener("input", () => {
  documentInput.value = currentPersonType() === "cnpj" ? formatCnpj(documentInput.value) : formatCpf(documentInput.value);
  if (currentPersonType() === "cnpj" && digits(documentInput.value).length === 0) {
    clearCompanyFields();
    documentMessage.textContent = "Digite o CNPJ e clique em buscar.";
    documentMessage.className = "";
  }
});

searchCnpjButton.addEventListener("click", async () => {
  const cnpj = digits(documentInput.value);
  if (cnpj.length !== 14) {
    documentMessage.textContent = "Informe os 14 números do CNPJ.";
    documentMessage.className = "error";
    return;
  }

  searchCnpjButton.disabled = true;
  searchCnpjButton.textContent = "Buscando...";
  documentMessage.textContent = "Consultando dados públicos da empresa...";
  documentMessage.className = "";

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    if (!response.ok) throw new Error("CNPJ não encontrado");
    const company = await response.json();
    document.querySelector("#clientName").value = company.razao_social || "";
    document.querySelector("#tradeName").value = company.nome_fantasia || "";
    document.querySelector("#phone").value = company.ddd_telefone_1 || "";
    document.querySelector("#email").value = company.email || "";
    document.querySelector("#zipCode").value = company.cep || "";
    document.querySelector("#street").value = company.logradouro || "";
    document.querySelector("#number").value = company.numero || "";
    document.querySelector("#district").value = company.bairro || "";
    document.querySelector("#city").value = company.municipio || "";
    document.querySelector("#state").value = company.uf || "";
    documentMessage.textContent = "Dados encontrados e preenchidos.";
    documentMessage.className = "success";
  } catch {
    documentMessage.textContent = "Não foi possível localizar esse CNPJ. Você pode preencher os campos manualmente.";
    documentMessage.className = "error";
  } finally {
    searchCnpjButton.disabled = false;
    searchCnpjButton.innerHTML = `${icons.search ? `<span data-icon="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons.search}</svg></span>` : ""} Buscar`;
  }
});

clientForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(clientForm).entries());
  data.id = createId();
  await saveClient(data);
  clientForm.reset();
  updatePersonType();
  toast.textContent = "Cliente salvo com sucesso.";
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
  showClientList();
});

menuButton.addEventListener("click", () => sidebar.classList.toggle("open"));

document.addEventListener("click", (event) => {
  if (
    window.innerWidth <= 760 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

newQuoteButton.addEventListener("click", () => {
  showPage("quotes");
  showQuoteForm();
});
