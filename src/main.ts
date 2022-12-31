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
const tryAgainButton = <HTMLInputElement>(
	document.getElementById("try-again-button")
);

const timerTag = <HTMLElement>document.getElementById("timer");

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
	return (totalKeyPressed - mistakes )/ 5
}

const countRawWpm = () => {
	var totalKeyPressed = charIndex;
	return totalKeyPressed / 5;
}

const countAccuracy = () => {
	var totalKeyPressed = charIndex;
	var correctKeyPressed = totalKeyPressed - mistakes;
	return (correctKeyPressed/totalKeyPressed) * 100;
}

const gameFinished = () => {
	getRandomQuote();
	charIndex = 0;
	clearInterval(timer);

	inputField.value = "";
	isTyping = false;
	timerLeft = maxTimer;
	timerTag.innerText = String(timerLeft);
};

const restartGame = () => {
	getRandomQuote();
	charIndex = 0;
	clearInterval(timer);

	inputField.value = "";
	isTyping = false;
	timerLeft = maxTimer;
	timerTag.innerText = String(timerLeft);
}

timerTag.innerText = String(timerLeft);
inputField.addEventListener("input", initTyping);
tryAgainButton.addEventListener("click", restartGame);
tryAgainButton.addEventListener("keypress", restartGame);
getRandomQuote();
