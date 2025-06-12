console.log("Script injected!");

let isRunning = true;

function getCurrentVideoElement() {
  const current = document.querySelector('.sidebar_item__khyNp.active');
  console.log("[DEBUG] Current active video element:", current);
  return current;
}

function getAllVideoElements() {
  const allVideos = Array.from(document.querySelectorAll('.sidebar_item__khyNp'));
  console.log("[DEBUG] Total video elements found:", allVideos.length);
  return allVideos;
}

function hasTickMark(anchor) {
  const img = anchor.querySelector('img');
  const greenCheckUrl = "https://media.geeksforgeeks.org/img-practice/Group11(1)-1667280599.svg";
  const matched = img && img.src === greenCheckUrl;
  console.log(`[DEBUG] Checking tick for anchor:`, anchor, "Has green tick?", matched);
  return matched;
}

function getNextVideo(currentAnchor) {
  const all = getAllVideoElements();
  const index = all.findIndex(el => el === currentAnchor);
  const next = all[index + 1] || null;
  console.log(`[DEBUG] Current index: ${index}, Next video:`, next);
  return next;
}

function sleep(ms) {
  console.log(`[DEBUG] Sleeping for ${ms}ms...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitorAndPlayNext() {
  console.log("[DEBUG] monitorAndPlayNext called");
  let current = getCurrentVideoElement();

  while (!current) {
    console.log("[WARN] No active video found.");
    await sleep(2000);
    console.log("[DEBUG] Trying to find active video again.")
    current = getCurrentVideoElement();
  }
  
  console.log("[DEBUG] Active video found!")

  console.log("[DEBUG] Starting to monitor current video for completion...");

  while (isRunning) {
    if (hasTickMark(current)) {
      const next = getNextVideo(current);
      if (next) {
        console.log("[INFO] Video completed. Proceeding to click on next video...");
        next.click();
        current = next;
        continue;
      } else {
        console.log("[INFO] All videos completed. Sending notification...");
        new Notification("GFG Auto Player", {
          body: "All videos completed!",
        });
        isRunning = false;
        return;
      }
    } else {
      console.log("[DEBUG] Current video not completed yet. Retrying...");
    }
    await sleep(10000);
  }
}

console.log("[GFG Auto Player] Autostarting...");
monitorAndPlayNext();

