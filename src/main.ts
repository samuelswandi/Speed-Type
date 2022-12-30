import "./style.css";
import axios from "axios";

var author = "";
var mistakes = 0;

// TODO
// var wpm = 0;
// var cpm = 0;
// var timer = 0;

const randomQuoteURL = "https://api.quotable.io/random?minLength=100&maxLength=140";
const quote = <HTMLElement>document.getElementById("quote");
const inputField = <HTMLInputElement>document.getElementById("input-field");
const tryAgainButton = <HTMLInputElement>(
	document.getElementById("try-again-button")
);

const getRandomQuote = async () => {
	quote.innerHTML = "";
	await axios.get(randomQuoteURL).then((response: any) => {
		var data = response.data.content;
		author = response.data.author;

		if (quote.innerHTML == "") {
			data.split("").forEach((span: any) => {
				let spanTag = `<span>${span}</span>`;
				quote.innerHTML += spanTag;
			});
		}
	});

	document.addEventListener("click", () => inputField.focus());
};

var charIndex = 0;
const initTyping = () => {
	var characters = quote.querySelectorAll("span");

	var typedCharacter = inputField.value.split("")[charIndex];

	if (typedCharacter == null) {
		if (charIndex != 0) {
			charIndex--;
		}
		characters[charIndex].style.color = "#646669";
	} else {
		if (charIndex == characters.length-1) {
			resetGame();
			return;
		}
		if (characters[charIndex].innerText === typedCharacter) {
			characters[charIndex].style.color = "#fff";
		} else {
			mistakes++;
			characters[charIndex].style.color = "#e06c75";
		}
		charIndex++;
	}
};

// TODO
// const initTimer = () => {};

const resetGame = () => {
	charIndex = 0;
	inputField.value = "";
	getRandomQuote();
};

inputField.addEventListener("input", initTyping);
tryAgainButton.addEventListener("click", resetGame);
tryAgainButton.addEventListener("keypress", resetGame);
getRandomQuote();
