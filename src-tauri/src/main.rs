// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::sync::Mutex;
use tauri_plugin_autostart::MacosLauncher;
//use reqwest::header::{HeaderMap, HeaderValue};
//use scraper::{Html, Selector};
//use tauri::async_runtime::block_on;
//use tauri_plugin_http::reqwest;

lazy_static! {
    static ref DISCORD_PRESENCE: Mutex<Option<DiscordPresence>> = Mutex::new(None);
}

//use window_shadows::set_shadow; // Used for devtools
fn main() {
    tauri::Builder::default()
        //.plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
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

// this function is a work in progress, it tries to login to lectio and return the cookies (does not work yet)
//#[tauri::command]
//fn send_fetch_request(
//    username: String,
//    password: String,
//    school: String,
//) -> Result<String, String> {
//    let mut base_headers = HeaderMap::new();
//    base_headers.insert("accept", HeaderValue::from_static("text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"));
//    base_headers.insert(
//        "accept-encoding",
//        HeaderValue::from_static("gzip, deflate, br"),
//    );
//    base_headers.insert(
//        "accept-language",
//        HeaderValue::from_static("en-DK,en;q=0.9"),
//    );
//    base_headers.insert(
//        "sec-ch-ua",
//        HeaderValue::from_static(
//            "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
//        ),
//    );
//    base_headers.insert("sec-ch-ua-mobile", HeaderValue::from_static("?0"));
//    base_headers.insert("sec-ch-ua-platform", HeaderValue::from_static("\"Linux\""));
//    base_headers.insert("sec-fetch-dest", HeaderValue::from_static("document"));
//    base_headers.insert("sec-fetch-mode", HeaderValue::from_static("navigate"));
//    base_headers.insert("sec-fetch-site", HeaderValue::from_static("none"));
//    base_headers.insert("sec-fetch-user", HeaderValue::from_static("?1"));
//    base_headers.insert("upgrade-insecure-requests", HeaderValue::from_static("1"));
//    base_headers.insert(
//        "user-agent",
//        HeaderValue::from_static(
//            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/",
//        ),
//    );
//
//    let post_headers = base_headers.clone();
//
//    if school.is_empty() || username.is_empty() || password.is_empty() {
//        return Err("Invalid school, username or password".to_string());
//    }
//
//    let client = reqwest::Client::new();
//    let response = block_on(
//        client
//            .get(&format!(
//                "https://www.lectio.dk/lectio/{}/login.aspx",
//                school
//            ))
//            .headers(base_headers)
//            .send(),
//    );
//
//    if !response.is_ok() {
//        return Err("Failed to fetch lectio login page (lectio may be down)".to_string());
//    }
//
//    let body = response.unwrap().text();
//    let document = Html::parse_document(&block_on(body).unwrap());
//    let inputs = Selector::parse("input[type=hidden]").unwrap();
//
//    let mut payload = std::collections::HashMap::new();
//    for input in document.select(&inputs) {
//        let name = input.value().attr("name").unwrap();
//        let value = input.value().attr("value").unwrap();
//        if name != "query" {
//            payload.insert(name.to_string(), value.to_string());
//        }
//    }
//
//    payload.insert(
//        "__EVENTTARGET".to_string(),
//        "m$Content$submitbtn2".to_string(),
//    );
//    payload.insert("m$Content$username".to_string(), username);
//    payload.insert("m$Content$password".to_string(), password);
//    payload.insert("m$Content$AutologinCbx".to_string(), "off".to_string()); // this is off because we don't want to autologin, we can just reauthenticate i think
//
//    let post_response = block_on(
//        client
//            .post(&format!(
//                "https://www.lectio.dk/lectio/{}/login.aspx",
//                school
//            ))
//            .headers(post_headers)
//            .form(&payload)
//            .send(),
//    );
//
//    if !post_response.is_ok() {
//        return Err("Failed to login to lectio (wrong credentials or school)".to_string());
//    }
//
//    let unwrapped_post_response = post_response.unwrap();
//    let cookies = unwrapped_post_response
//        .headers()
//        .get("set-cookie")
//        .unwrap()
//        .to_str()
//        .unwrap()
//        .to_string();
//
//    let body = block_on(unwrapped_post_response.text());
//    let document = Html::parse_document(&body.unwrap());
//
//    let mut logged_in = false;
//    let metas = {
//        let selector = Selector::parse("meta").unwrap();
//        println!("document: {:?}", document);
//        document.select(&selector).collect::<Vec<_>>()
//    };
//
//    println!("Metas: {:?}", metas);
//
//    for meta in metas {
//        let content = meta.value().attr("content").unwrap();
//        if content.contains(&format!("/lectio/{}/forside.aspx", school)) {
//            logged_in = true;
//        }
//    }
//    println!("Cookies: {}", cookies);
//
//    match logged_in {
//        true => Ok(cookies),
//        false => Err("Failed to login to lectio".to_string()),
//    }
//}
