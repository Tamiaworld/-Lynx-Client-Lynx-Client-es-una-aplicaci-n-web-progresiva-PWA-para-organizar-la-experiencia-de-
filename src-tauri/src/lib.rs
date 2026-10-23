// Detecta Minecraft Bedrock en Windows.
#[tauri::command]
fn detect_minecraft_bedrock() -> String {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;

        match Command::new("powershell")
            .args([
                "-NoProfile",
                "-Command",
                "Get-AppxPackage Microsoft.MinecraftUWP | Select-Object -ExpandProperty PackageFamilyName",
            ])
            .output()
        {
            Ok(result) if result.status.success() => {
                let package = String::from_utf8_lossy(&result.stdout).trim().to_string();
                if package.is_empty() {
                    "Minecraft Bedrock no aparece instalado para este usuario.".to_string()
                } else {
                    format!("Minecraft Bedrock está instalado: {package}")
                }
            }
            _ => "No se pudo comprobar la instalación de Minecraft Bedrock.".to_string(),
        }
    }

    #[cfg(target_os = "android")]
    {
        "La detección de Bedrock en Android aún requiere integración nativa.".to_string()
    }

    #[cfg(not(any(target_os = "windows", target_os = "android")))]
    {
        "Esta plataforma todavía no está soportada.".to_string()
    }
}

#[tauri::command]
fn open_minecraft_bedrock() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;

        Command::new("cmd")
            .args(["/C", "start", "", "minecraft://"])
            .spawn()
            .map_err(|error| format!("No se pudo abrir Minecraft: {error}"))?;

        return Ok("Se solicitó abrir Minecraft Bedrock.".to_string());
    }

    #[cfg(target_os = "android")]
    {
        return Err("La apertura de Bedrock en Android aún no está integrada.".to_string());
    }

    #[cfg(not(any(target_os = "windows", target_os = "android")))]
    {
        Err("Esta plataforma todavía no está soportada.".to_string())
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            detect_minecraft_bedrock,
            open_minecraft_bedrock
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
