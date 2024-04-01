// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::sync::Mutex;
use tauri_plugin_autostart::MacosLauncher;

lazy_static! {
    static ref DISCORD_PRESENCE: Mutex<Option<DiscordPresence>> = Mutex::new(None);
}

//use window_shadows::set_shadow; // Used for devtools
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .setup(|app| {
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;
            let discord_presence = set_discord_presence();
            match discord_presence {
                Ok(presence) => {
                    let mut global_presence = DISCORD_PRESENCE.lock().unwrap();
                    *global_presence = Some(presence);
                    println!("Discord presence set successfully!");
                }
                Err(err) => {
                    eprintln!("Failed to set Discord presence: {}", err);
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .plugin(tauri_plugin_updater::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

struct DiscordPresence {
    client: DiscordIpcClient,
}

impl Drop for DiscordPresence {
    fn drop(&mut self) {
        self.client.clear_activity().unwrap();
    }
}

fn set_discord_presence() -> Result<DiscordPresence, Box<dyn std::error::Error>> {
    let mut client = DiscordIpcClient::new("1104355646536695928")?;

    if let Err(e) = client.connect() {
        println!("Failed to connect: {}", e);
        return Err(e.into());
    }

    let payload = activity::Activity::new()
        .state("Den Ultimative Lectio Forbedring")
        .buttons(vec![activity::Button::new(
            "Prøv BetterLectio ",
            "https://betterlectio.dk/",
        )])
        // change ActivityType Enum to set the activity type to "custom" and change the prefix to "using"
        .assets(
            activity::Assets::new()
                .large_image("icon")
                .large_text("BetterLectio"),
        );
    client.set_activity(payload)?;

    Ok(DiscordPresence { client })
}
