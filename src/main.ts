import "./style.css";
import axios from "axios";

var author = "";
var mistakes = 0;

// TODO
var timer = 0;
var maxTimer = 60;
var timerLeft = maxTimer;

const randomQuoteURL =
	"https://api.quotable.io/random?minLength=100&maxLength=140";
const quote = <HTMLElement>document.getElementById("quote");
const inputField = <HTMLInputElement>document.getElementById("input-field");

const timerTag = <HTMLElement>document.getElementById("timer");
const wpmTag = <HTMLElement>document.getElementById("wpm");
const rawWpmTag = <HTMLElement>document.getElementById("raw-wpm");
const accuracyTag = <HTMLElement>document.getElementById("accuracy");

const tryAgainButton = <HTMLInputElement>(
	document.getElementById("try-again-button")
);
const nextTestButton = <HTMLInputElement>(
	document.getElementById("next-button")
)

const getRandomQuote = async () => {
	quote.innerHTML = "";
	await axios.get(randomQuoteURL).then((response: any) => {
		var data = response.data.content;
		author = response.data.author;

		var id = 0;
		if (quote.innerHTML == "") {
			data.split("").forEach((span: any) => {
				let spanTag = `<span id="${id}">${span}</span>`;
				quote.innerHTML += spanTag;
				id++;
			});
		}
	});

	document.getElementById("0")?.classList.add("active");
	document.addEventListener("click", () => inputField.focus());
};

var charIndex = 0;
var isTyping = false;
const initTyping = () => {
	var characters = quote.querySelectorAll("span");
	var typedCharacter = inputField.value.split("")[charIndex];

	if (!isTyping) {
		timer = setInterval(initTimer, 1000);
		isTyping = true;
	}
	document.getElementById(String(charIndex))?.classList.add("active");

	if (typedCharacter == null) {
		if (charIndex != 0) {
			charIndex--;
		}
		characters[charIndex].style.color = "#646669";
		document.getElementById(String(charIndex))?.classList.add("active");
		document
			.getElementById(String(charIndex + 1))
			?.classList.remove("active");
	} else {
		if (charIndex == characters.length - 1) {
			gameFinished();
			return;
		}

		if (characters[charIndex].innerText === typedCharacter) {
			characters[charIndex].style.color = "#fff";
		} else {
			mistakes++;
			characters[charIndex].style.color = "#e06c75";
		}
		document.getElementById(String(charIndex + 1))?.classList.add("active");
		document.getElementById(String(charIndex))?.classList.remove("active");

		charIndex++;
	}
};

const initTimer = () => {
	if (timerLeft > 0) {
		timerLeft--;
		timerTag.innerText = String(timerLeft);
	} else {
		gameFinished();
	}
};

const countWpm = () => {
	var totalKeyPressed = charIndex;
	var actualTime = (maxTimer - timerLeft)/60

	return Math.round(((totalKeyPressed - mistakes)/ 5) / actualTime)
}

const countRawWpm = () => {
	var totalKeyPressed = charIndex;
	var actualTime = (maxTimer - timerLeft)/60
	console.log(totalKeyPressed/5)
	console.log(actualTime)
	return Math.round((totalKeyPressed / 5) / actualTime);
}

const countAccuracy = () => {
	var totalKeyPressed = charIndex;
	var correctKeyPressed = totalKeyPressed - mistakes;
	return Math.round((correctKeyPressed/totalKeyPressed) * 100);
}

const gameFinished = () => {
	document.getElementById("typing")!.style.display = "none";
	document.getElementById("report")!.style.display = "flex";

	wpmTag!.innerText = String(countWpm());
	rawWpmTag!.innerText = String(countRawWpm());
	accuracyTag!.innerText = String(countAccuracy()) + "%";

	// getRandomQuote();
	// charIndex = 0;
	// clearInterval(timer);

	// inputField.value = "";
	// isTyping = false;
	// timerLeft = maxTimer;
	// timerTag.innerText = String(timerLeft);
};

const restartGame = () => {
	document.getElementById("typing")!.style.display = "flex";
	document.getElementById("report")!.style.display = "none";

	getRandomQuote();
	charIndex = 0;
	clearInterval(timer);

	mistakes = 0;
	inputField.value = "";
	isTyping = false;
	timerLeft = maxTimer;
	timerTag.innerText = String(timerLeft);
}

// document.getElementById("typing")!.style.display = "none";
document.getElementById("report")!.style.display = "none";
timerTag.innerText = String(timerLeft);
inputField.addEventListener("input", initTyping);
nextTestButton.addEventListener("click", restartGame);
nextTestButton.addEventListener("keypress", restartGame);
tryAgainButton.addEventListener("click", restartGame);
tryAgainButton.addEventListener("keypress", restartGame);
getRandomQuote();
