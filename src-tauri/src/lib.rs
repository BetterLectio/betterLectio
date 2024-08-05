// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::sync::Mutex;

#[cfg(desktop)]
use tauri_plugin_autostart::MacosLauncher;
//use reqwest::header::{HeaderMap, HeaderValue};
//use scraper::{Html, Selector};
//use tauri::async_runtime::block_on;
//use tauri_plugin_http::reqwest;

lazy_static! {
    static ref DISCORD_PRESENCE: Mutex<Option<DiscordPresence>> = Mutex::new(None);
}

//use window_shadows::set_shadow; // Used for devtools
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;
            #[cfg(desktop)]
            app.handle().plugin(tauri_plugin_autostart::init(
                MacosLauncher::LaunchAgent,
                Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
            ))?;
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
