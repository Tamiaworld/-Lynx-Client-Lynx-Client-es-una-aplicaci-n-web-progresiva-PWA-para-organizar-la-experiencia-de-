
import "./styles.css";
import { invoke, isTauri } from "@tauri-apps/api/core";

const sections = document.querySelectorAll<HTMLElement>(".page");
const navItems = document.querySelectorAll<HTMLButtonElement>(".nav-item");
const breadcrumb = document.querySelector<HTMLElement>("#breadcrumb");
const statusMessage = document.querySelector<HTMLElement>("#status-message");

function showSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target || !target.classList.contains("page")) return;

  sections.forEach(section =>
    section.classList.toggle("active-page", section.id === sectionId)
  );

  navItems.forEach(item => {
    const active = item.dataset.section === sectionId;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  if (breadcrumb) breadcrumb.textContent = `LYNX / ${sectionId.toUpperCase()}`;
  if (statusMessage) statusMessage.textContent = "";
}

navItems.forEach(item =>
  item.addEventListener("click", () => {
    if (item.dataset.section) showSection(item.dataset.section);
  })
);

document.querySelectorAll<HTMLButtonElement>("[data-goto]").forEach(button =>
  button.addEventListener("click", () => {
    if (button.dataset.goto) showSection(button.dataset.goto);
  })
);

const bedrock = document.querySelector<HTMLElement>("#bedrock");

if (bedrock) {
  let result = bedrock.querySelector<HTMLElement>("#bedrock-result");

  if (!result) {
    result = document.createElement("p");
    result.id = "bedrock-result";
    result.className = "status-message";
    bedrock.appendChild(result);
  }

  const detectButton = document.createElement("button");
  detectButton.className = "primary-button";
  detectButton.textContent = "Comprobar instalación";

  detectButton.addEventListener("click", async () => {
    if (!isTauri()) {
      result!.textContent =
        "La comprobación de Minecraft Bedrock requiere la aplicación de escritorio Lynx Client en Windows.";
      return;
    }

    result!.textContent = "Comprobando instalación...";

    try {
      result!.textContent = await invoke<string>("detect_minecraft_bedrock");
    } catch (error) {
      result!.textContent = `No se pudo comprobar la instalación: ${String(error)}`;
    }
  });

  const openButton = document.createElement("button");
  openButton.className = "primary-button";
  openButton.textContent = "▶ Abrir Minecraft Bedrock";

  openButton.addEventListener("click", async () => {
    if (!isTauri()) {
      result!.textContent =
        "Para abrir Minecraft Bedrock, ejecuta Lynx Client como aplicación de escritorio en Windows.";
      return;
    }

    result!.textContent = "Solicitando apertura de Minecraft...";

    try {
      result!.textContent = await invoke<string>("open_minecraft_bedrock");
    } catch (error) {
      result!.textContent = `No se pudo abrir Minecraft: ${String(error)}`;
    }
  });

  bedrock.append(detectButton, openButton);
}

document.querySelector<HTMLButtonElement>("#start-button")?.addEventListener("click", () => {
  if (statusMessage) {
    statusMessage.textContent = "Selecciona Java o Bedrock para continuar.";
  }
});

showSection("inicio");

