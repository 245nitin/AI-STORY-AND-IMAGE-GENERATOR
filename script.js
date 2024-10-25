import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyDE20pqSIvXL3B6t2S3j7vWiTMCLPRRUM0";
const UNSPLASH_ACCESS_KEY = "Ly6TFUHMNvO3NtqrbDTkdy8IflW9LM8Z5vKO2bEQ3pU";

const generateStoryBtn = document.getElementById("generate-story-btn");
const generatePhotoBtn = document.getElementById("generate-photo-btn"); // Corrected ID
const storyInput = document.getElementById("story-input");

generateStoryBtn.addEventListener("click", generateStory);
generatePhotoBtn.addEventListener("click", generatePhoto);

storyInput.addEventListener("focus", handleTextAreaFocus);
storyInput.addEventListener("blur", handleTextAreaBlur);

async function generateStory() {
  const storyInput = document.getElementById("story-input").value;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const spinner = document.getElementById("spinner");
  spinner.style.display = "flex";

  try {
    const result = await model.generateContent(storyInput);
    const response = await result.response; // Corrected variable name
    let story = await response.text();

    story = story.replace(/\*/g, "");
    story = story.replace(/\s(?=\w)/g, " ");
    story = story.replace(/(?:\r\n|\r|\n)/g, "<br>");

    displayStory(story);
  } catch (error) {
    console.log("Error generating story:", error);
    displayError("Sorry, I am having trouble generating the story");
  } finally {
    spinner.style.display = "none";
  }
}

function displayStory(story) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<p>${story}</p>`; // Corrected to use backticks
}

function displayError(message) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<p class="error">${message}</p>`; // Corrected to use backticks
}

async function generatePhoto() {
  const query = document.getElementById("story-input").value;
  const apiURL = `https://api.unsplash.com/photos/random?query=${query}&count=3&client_id=${UNSPLASH_ACCESS_KEY}`;

  const spinner = document.getElementById("spinner");
  spinner.style.display = "flex";

  try {
    const response = await fetch(apiURL); // Corrected 'respnse' to 'response'
    const data = await response.json(); // Corrected '.json' to '.json()'

    if (data && Array.isArray(data) && data.length > 0) {
      displayPhotos(data);
    } else {
      displayError("Failed to fetch photos");
    }
  } catch (error) {
    console.log("Error fetching photos:", error);
    displayError("Failed to fetch photos.");
  } finally {
    spinner.style.display = "none";
  }
}

function displayPhotos(photos) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = photos
    .map(
      (photo) =>
        `<img src="${photo.urls.regular}" alt="Generated Photo" class="generated-photo"/>`
    )
    .join(""); // Corrected to use backticks and join the array into a string
}

function handleTextAreaFocus() {
  const storyInput = document.getElementById("story-input");
  storyInput.style.backgroundColor = "white"; // Corrected to backgroundColor
  storyInput.style.height = "120px";
}

function handleTextAreaBlur() {
  const storyInput = document.getElementById("story-input");
  storyInput.style.backgroundColor = ""; // Corrected to backgroundColor
  storyInput.style.height = "";
}
