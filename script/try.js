// Helper Functions
const createElements = (arr) => {
    if (!arr || arr.length === 0) return "<span>No synonyms available</span>";
    const htmlElements = arr.map((el) => `<span class="btn btn-xs btn-outline mr-1">${el}</span>`);
    return htmlElements.join(" ");
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    const wordContainer = document.getElementById("word-container");

    if (status === true) {
        if (spinner) spinner.classList.remove("hidden");
        if (wordContainer) wordContainer.classList.add("hidden");
    } else {
        if (wordContainer) wordContainer.classList.remove("hidden");
        if (spinner) spinner.classList.add("hidden");
    }
};

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

// API Fetching Functions
const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((json) => displayLesson(json.data));
};

const loadLevelWord = (id) => {
    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            if (clickBtn) {
                clickBtn.classList.add("active");
            }
            displayLevelWord(data.data);
        });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

// UI Display Functions
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("level-conttainer") || document.getElementById("level-container");
    if (!levelContainer) return;

    levelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
      </button>
    `;
        levelContainer.append(btnDiv);
    }
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    if (!wordContainer) return;

    wordContainer.innerHTML = "";

    if (!words || words.length === 0) {
        wordContainer.innerHTML = `
      <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
        <img class="mx-auto" src="./assets/alert-error.png" alt="Error"/>
        <p class="text-xl font-medium text-gray-400">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
      </div>
    `;
        manageSpinner(false);
        return;
    }
    //     
    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
        
      <div class="bg-white shadow-sm text-center rounded-xl  px-5 py-10 space-y-4">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"
            }</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
            } / ${word.pronunciation ? word.pronunciation : "Pronounciation পাওয়া  যায়নি"}"</div> 

        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id
            })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick="pronounceWord('${word.word
            }')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
     `;
        wordContainer.append(card);
    });
    manageSpinner(false);
};

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container");
    if (!detailsBox) return;

    detailsBox.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold">
        ${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})
      </h2>
    </div>
    <div>
      <h2 class="font-bold">Meaning</h2>
      <p>${word.meaning}</p>
    </div>
    <div>
      <h2 class="font-bold">Example</h2>
      <p>${word.sentence}</p>
    </div>
    <div>
      <h2 class="font-bold">Synonym</h2>
      <div>${createElements(word.synonyms)}</div>
    </div>
  `;

    const modal = document.getElementById("word_modal");
    if (modal) modal.showModal();
};

// Initial Call
loadLessons();

// Search Event Listener Check
const searchBtn = document.getElementById("btn-search");
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        removeActive();
        const input = document.getElementById("input-search");
        if (!input) return;

        const searchValue = input.value.trim().toLowerCase();

        fetch("https://openapi.programming-hero.com/api/words/all")
            .then((res) => res.json())
            .then((data) => {
                const allWords = data.data;
                const filterWords = allWords.filter((word) =>
                    word.word.toLowerCase().includes(searchValue)
                );

                displayLevelWord(filterWords);
            });
    });
}